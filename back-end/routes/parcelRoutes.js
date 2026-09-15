import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import DocumentRecord from '../models/DocumentRecord.js';
import Parcel from '../models/Parcel.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parcelsPath = path.join(__dirname, '../data/parcels.json');
const usersPath = path.join(__dirname, '../data/users.json');

// Helper to read users database
const getUsersData = () => {
  try {
    if (!fs.existsSync(usersPath)) return [];
    const rawData = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading users.json:', err);
    return [];
  }
};

// Helper to save users database
const saveUsersData = (data) => {
  fs.writeFileSync(usersPath, JSON.stringify(data, null, 2), 'utf8');
};

// SSE Connected Clients list
let sseClients = [];

// Helper to read database
const getParcelsData = () => {
  try {
    const rawData = fs.readFileSync(parcelsPath, 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading parcels.json:', err);
    return [];
  }
};

// Helper to save database & broadcast SSE event
const saveParcelsData = (data, eventType = 'PARCEL_UPDATED', payload = {}) => {
  fs.writeFileSync(parcelsPath, JSON.stringify(data, null, 2), 'utf8');
  broadcastSSE(eventType, payload);
};

// Helper to broadcast SSE to all connected clients
export const broadcastSSE = (event, data) => {
  sseClients.forEach((client) => {
    client.res.write(`event: ${event}\n`);
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

// Helper: Haversine distance in meters
const calculateHaversineDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ==========================================
// USER AUTHENTICATION REST API ENDPOINTS
// ==========================================

// POST /api/auth/register - Create New Account
router.post('/auth/register', (req, res) => {
  const { name, email, password, role, mobile, organization, district, state } = req.body;
  const users = getUsersData();

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, Email, and Password are required fields.'
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email address already exists. Please login instead.'
    });
  }

  if (role === 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Administrator accounts must be provisioned by an existing administrator.'
    });
  }

  const newUser = {
    id: `USER-${Date.now().toString().substring(6)}`,
    name: name.trim(),
    email: normalizedEmail,
    password: password, // In production, hash with bcrypt
    role: role === 'OFFICIAL' ? 'OFFICIAL' : 'CITIZEN',
    mobile: mobile || '',
    organization: organization || 'Registered User',
    district: district || 'Bengaluru Urban',
    state: state || 'Karnataka',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsersData(users);

  // Return sanitized user profile (without password) + auth token
  const { password: _, ...userProfile } = newUser;
  res.status(201).json({
    success: true,
    message: 'Account created successfully! Welcome to GeoLand Stack DPI.',
    token: `GEOLAND-TOKEN-${Date.now()}`,
    user: userProfile
  });
});

// POST /api/auth/login - User Login
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = getUsersData();

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both Email and Password to login.'
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail || (u.mobile && u.mobile.includes(email.trim()))
  );

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please check your credentials.'
    });
  }

  const { password: _, ...userProfile } = user;
  res.json({
    success: true,
    message: `Welcome back, ${user.name}! Authenticated as ${user.role}.`,
    token: `GEOLAND-TOKEN-${Date.now()}`,
    user: userProfile
  });
});

// GET /api/auth/me - Fetch Active User Profile
router.get('/auth/me', (req, res) => {
  const users = getUsersData();
  const sampleUser = users[0] || {
    id: 'USER-GUEST',
    name: 'Guest User',
    email: 'guest@geoland.gov.in',
    role: 'CITIZEN',
    organization: 'Public Visitor'
  };

  const { password: _, ...userProfile } = sampleUser;
  res.json({
    success: true,
    user: userProfile
  });
});

// Real-time SSE Stream Endpoint
router.get('/realtime/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  res.write(`event: CONNECTED\n`);
  res.write(`data: ${JSON.stringify({ clientId, timestamp: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// Periodic Drone Telemetry Simulation
let droneIndex = 0;
const droneWaypoints = [
  { lat: 31.10480, lng: 77.17340, alt: 120, battery: 94, targetUlpin: '14829304812901', status: 'SCANNING_PARCEL' },
  { lat: 31.10480, lng: 77.17640, alt: 125, battery: 91, targetUlpin: '14829304812902', status: 'BOUNDARY_VERIFICATION' },
  { lat: 31.10180, lng: 77.17340, alt: 118, battery: 88, targetUlpin: '14829304812903', status: 'ENCROACHMENT_DETECTED' },
  { lat: 31.10180, lng: 77.17640, alt: 130, battery: 85, targetUlpin: '14829304812904', status: 'CADASTRAL_OVERLAY' },
  { lat: 31.10480, lng: 77.17940, alt: 122, battery: 82, targetUlpin: '14829304812905', status: 'BUFFER_ZONE_SURVEILLANCE' }
];

setInterval(() => {
  if (sseClients.length > 0) {
    const currentWaypoint = droneWaypoints[droneIndex % droneWaypoints.length];
    droneIndex++;
    broadcastSSE('DRONE_TELEMETRY', {
      droneId: 'DRONE-ISRO-VTOL-04',
      speedKmh: 24.5,
      headingDeg: (droneIndex * 45) % 360,
      timestamp: new Date().toISOString(),
      ...currentWaypoint
    });
  }
}, 3000);

// POST /api/ocr/verify-document - AI & OCR Verification Engine
router.post('/ocr/verify-document', async (req, res) => {
  const { documentType, rawOcrText, targetUlpin } = req.body;
  const parcels = getParcelsData();

  const parcel = parcels.find((p) => p.ulpin === targetUlpin) || parcels[0];

  // Simulating OCR extraction from document image/pdf
  const extractedOwner = req.body.ownerName || parcel.owner.name;
  const extractedSurvey = req.body.surveyNo || parcel.surveyNo;
  const extractedArea = Number(req.body.areaSqFt) || parcel.areaSqFt;

  const isNameMatch = extractedOwner.toLowerCase().includes(parcel.owner.name.toLowerCase().split(' ')[0]);
  const isSurveyMatch = extractedSurvey.toLowerCase().replaceAll(' ', '') === parcel.surveyNo.toLowerCase().replaceAll(' ', '');
  const isAreaMatch = Math.abs(extractedArea - parcel.areaSqFt) < 50;

  const mismatchFields = [];
  if (!isNameMatch) mismatchFields.push('Owner Name Discrepancy');
  if (!isSurveyMatch) mismatchFields.push('Survey Number Mismatch');
  if (!isAreaMatch) mismatchFields.push('Land Area Variance (>50 sq.ft)');

  const isFullyVerified = mismatchFields.length === 0;
  const status = isFullyVerified
    ? 'VERIFIED_MATCH'
    : mismatchFields.length > 1
    ? 'CONFLICT_SUSPECTED'
    : 'MISMATCH_FLAGGED';

  const verificationResult = {
    documentId: `DOC-OCR-${Date.now()}`,
    documentType: documentType || 'SALE_DEED',
    targetUlpin: parcel.ulpin,
    ocrExtractedData: {
      ownerNameExtracted: extractedOwner,
      surveyNoExtracted: extractedSurvey,
      deedNoExtracted: `KA-REG-${Math.floor(100000 + Math.random() * 900000)}`,
      areaSqFtExtracted: extractedArea
    },
    aiVerificationResult: {
      status,
      isFullyVerified,
      mismatchFields,
      confidenceScorePct: isFullyVerified ? 99.4 : 64.2,
      conflictDetails: isFullyVerified
        ? 'All extracted deed fields match 100% with central PostGIS & Revenue records.'
        : `Discrepancy detected in: ${mismatchFields.join(', ')}.`
    },
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    verification: verificationResult
  });
});

// POST /api/gis/scan-surrounding
router.post('/gis/scan-surrounding', (req, res) => {
  const { userLat, userLng, radiusMeters } = req.body;
  const parcels = getParcelsData();

  const lat = Number(userLat) || 31.10480;
  const lng = Number(userLng) || 77.17340;
  const radius = Number(radiusMeters) || 1000;

  const nearbyParcels = parcels
    .map((p) => {
      const distanceMeters = calculateHaversineDistanceMeters(lat, lng, p.center[0], p.center[1]);
      return {
        ...p,
        distanceMeters: Math.round(distanceMeters)
      };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  const totalNearby = nearbyParcels.length;
  const avgCircleRate = Math.round(
    nearbyParcels.reduce((sum, p) => sum + p.circleRatePerSqFt, 0) / (totalNearby || 1)
  );
  const encumberedCount = nearbyParcels.filter((p) => p.financial.isEncumbered).length;
  const flaggedCount = nearbyParcels.filter((p) => p.aiSurveillance.encroachmentDetected).length;

  const nearestParcel = nearbyParcels[0];
  const areaName = nearestParcel ? `${nearestParcel.village}, ${nearestParcel.taluk}, ${nearestParcel.district}` : 'Unknown Area';

  res.json({
    success: true,
    userLocation: { 
      lat, 
      lng, 
      scannedRadiusMeters: radius,
      areaName,
      informations: nearestParcel ? `Zoning: ${nearestParcel.zoning} | Market Value Avg: ₹${nearestParcel.marketValue.toLocaleString()}` : 'No information available'
    },
    scanSummary: {
      totalParcelsFound: totalNearby,
      avgCircleRatePerSqFt: avgCircleRate,
      encumberedRatioPct: Math.round((encumberedCount / (totalNearby || 1)) * 100),
      flaggedEncroachmentsCount: flaggedCount,
      nearestUlpin: nearestParcel?.ulpin,
      nearestDistanceMeters: nearestParcel?.distanceMeters
    },
    nearbyParcels
  });
});

// GET /api/satellite/live-metadata
router.get('/satellite/live-metadata', (req, res) => {
  const apiKey = req.query.apiKey || process.env.SENTINEL_HUB_API_KEY || 'sh-live-7fa9812903bc184a20f92b';

  res.json({
    success: true,
    satelliteProvider: 'Sentinel-2B / Copernicus & Esri World Satellite',
    activeApiKeyMasked: apiKey ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}` : 'DEFAULT_API_KEY',
    connectionStatus: 'CONNECTED_LIVE',
    lastSatellitePass: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    cloudCoverPct: 0.14,
    orbitNumber: 38921,
    spatialResolutionMeters: 10.0,
    activeSensors: ['MSI-B02(Blue)', 'MSI-B03(Green)', 'MSI-B04(Red)', 'MSI-B08(NIR)'],
    availableTileLayers: [
      { id: 'sentinel_truecolor', name: 'Sentinel-2 True Color (Optical)', urlPattern: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
      { id: 'sentinel_ndvi', name: 'Sentinel-2 NDVI (Vegetation & Agri)', urlPattern: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
      { id: 'sentinel_falsecolor', name: 'Sentinel-2 Urban False Color (Structure Density)', urlPattern: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' },
      { id: 'esri_hd', name: 'Esri World Imagery HD (Sub-Meter Resolution)', urlPattern: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' }
    ]
  });
});

// POST /api/satellite/verify-key
router.post('/satellite/verify-key', (req, res) => {
  const { apiKey, provider } = req.body;

  if (!apiKey || apiKey.trim().length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Satellite API Key format. Key must be at least 6 characters.'
    });
  }

  res.json({
    success: true,
    message: `Satellite API Key for '${provider || 'Sentinel Hub'}' verified & active. Live telemetry stream connected.`,
    apiKeyMasked: `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`,
    verifiedTimestamp: new Date().toISOString()
  });
});

// GET /api/parcels
router.get('/parcels', (req, res) => {
  const parcels = getParcelsData();
  const { search, zoning, encumbered, severity } = req.query;

  let filtered = [...parcels];

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.ulpin.toLowerCase().includes(q) ||
        p.surveyNo.toLowerCase().includes(q) ||
        p.owner.name.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q)
    );
  }

  if (zoning && zoning !== 'ALL') {
    filtered = filtered.filter((p) => p.zoning === zoning);
  }

  if (encumbered === 'true') {
    filtered = filtered.filter((p) => p.financial.isEncumbered);
  } else if (encumbered === 'false') {
    filtered = filtered.filter((p) => !p.financial.isEncumbered);
  }

  if (severity && severity !== 'ALL') {
    filtered = filtered.filter((p) => p.aiSurveillance.severity === severity);
  }

  res.json({
    success: true,
    total: filtered.length,
    parcels: filtered
  });
});

// GET /api/parcels/:ulpin
router.get('/parcels/:ulpin', (req, res) => {
  const parcels = getParcelsData();
  const { ulpin } = req.params;

  const parcel = parcels.find(
    (p) => p.ulpin === ulpin || p.id === ulpin
  );

  if (!parcel) {
    return res.status(404).json({
      success: false,
      message: `Parcel with ULPIN/ID '${ulpin}' not found.`
    });
  }

  res.json({
    success: true,
    parcel
  });
});

// GET /api/verify/ec/:ulpin
router.get('/verify/ec/:ulpin', (req, res) => {
  const parcels = getParcelsData();
  const { ulpin } = req.params;

  const parcel = parcels.find((p) => p.ulpin === ulpin || p.id === ulpin);
  if (!parcel) {
    return res.status(404).json({
      success: false,
      message: 'Parcel not found for Encumbrance Certificate generation.'
    });
  }

  const certificateNo = `EC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const isClear = !parcel.financial.isEncumbered && !parcel.financial.courtDispute && parcel.financial.taxPendingDues === 0;

  const certificate = {
    certificateNumber: certificateNo,
    issuedDate: new Date().toISOString(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    ulpin: parcel.ulpin,
    surveyNo: parcel.surveyNo,
    ownerName: parcel.owner.name,
    deedNo: parcel.owner.deedNo,
    district: parcel.district,
    village: parcel.village,
    areaSqFt: parcel.areaSqFt,
    encumbranceStatus: isClear ? 'NIL (CLEAR TITLE)' : 'ENCUMBERED / LIEN ACTIVE',
    isClearTitle: isClear,
    financialSummary: {
      bankLien: parcel.financial.bankLien,
      loanAmount: parcel.financial.loanAmount,
      courtDispute: parcel.financial.courtDispute,
      lienId: parcel.financial.lienId,
      taxDues: parcel.financial.taxPendingDues
    },
    verificationHash: `SHA256-${Buffer.from(parcel.ulpin + certificateNo).toString('hex').substring(0, 32).toUpperCase()}`,
    digitalSignature: 'Verified by GeoLand DPI Gateway (Stamper Protocol)'
  };

  res.json({
    success: true,
    certificate
  });
});

// POST /api/parcels/toggle-lien
router.post('/parcels/toggle-lien', (req, res) => {
  const parcels = getParcelsData();
  const { ulpin, bankName, loanAmount, action } = req.body;

  if (!['LOCK', 'UNLOCK'].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Action must be either 'LOCK' or 'UNLOCK'."
    });
  }

  const index = parcels.findIndex((p) => p.ulpin === ulpin || p.id === ulpin);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Parcel not found' });
  }

  const parcel = parcels[index];

  if (action === 'LOCK') {
    const parsedLoanAmount = Number(loanAmount);
    if (loanAmount !== undefined && (!Number.isFinite(parsedLoanAmount) || parsedLoanAmount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'A lien lock requires a positive loan amount.'
      });
    }

    parcel.financial.isEncumbered = true;
    parcel.financial.lienLockActive = true;
    parcel.financial.bankLien = bankName || 'Partner Bank (DPI Automated Lock)';
    parcel.financial.loanAmount = loanAmount === undefined ? 5000000 : parsedLoanAmount;
    parcel.financial.lienId = `LIEN-DPI-${Date.now().toString().substring(6)}`;
  } else if (action === 'UNLOCK') {
    parcel.financial.isEncumbered = false;
    parcel.financial.lienLockActive = false;
    parcel.financial.bankLien = 'None';
    parcel.financial.loanAmount = 0;
    parcel.financial.lienId = null;
  }

  parcels[index] = parcel;
  saveParcelsData(parcels, 'LIEN_STATUS_CHANGED', {
    ulpin: parcel.ulpin,
    action,
    isEncumbered: parcel.financial.isEncumbered,
    bankLien: parcel.financial.bankLien
  });

  res.json({
    success: true,
    message: `Multi-agency Lien lock ${action === 'LOCK' ? 'applied' : 'released'} successfully for ULPIN ${parcel.ulpin}`,
    parcel
  });
});

// POST /api/parcels/calculate-tax
router.post('/parcels/calculate-tax', (req, res) => {
  const { areaSqFt, circleRatePerSqFt, zoning, considerationValue } = req.body;

  const area = Number(areaSqFt) || 1000;
  const circleRate = Number(circleRatePerSqFt) || 5000;

  const guidelineValuation = area * circleRate;
  const transactionValuation = Math.max(guidelineValuation, Number(considerationValue) || guidelineValuation);

  let stampDutyPct = 5.6;
  let registrationFeePct = 1.0;
  let surchargePct = 0.5;

  if (zoning === 'Commercial' || zoning === 'Industrial') {
    stampDutyPct = 6.0;
    surchargePct = 1.0;
  } else if (zoning === 'Agricultural') {
    stampDutyPct = 4.0;
    surchargePct = 0.2;
  }

  const stampDutyAmount = (transactionValuation * stampDutyPct) / 100;
  const registrationFeeAmount = (transactionValuation * registrationFeePct) / 100;
  const surchargeAmount = (transactionValuation * surchargePct) / 100;
  const totalGovernmentFee = stampDutyAmount + registrationFeeAmount + surchargeAmount;

  res.json({
    success: true,
    calculation: {
      areaSqFt: area,
      circleRatePerSqFt: circleRate,
      guidelineValuation,
      transactionValuation,
      stampDutyPct,
      stampDutyAmount,
      registrationFeePct,
      registrationFeeAmount,
      surchargePct,
      surchargeAmount,
      totalGovernmentFee,
      savingsVsManual: Math.round(totalGovernmentFee * 0.08)
    }
  });
});

// POST /api/parcels/ai-encroachment
router.post('/parcels/ai-encroachment', (req, res) => {
  const parcels = getParcelsData();
  const { ulpin } = req.body;

  const parcel = parcels.find((p) => p.ulpin === ulpin || p.id === ulpin);
  if (!parcel) {
    return res.status(404).json({ success: false, message: 'Parcel not found' });
  }

  res.json({
    success: true,
    aiAnalysis: {
      ulpin: parcel.ulpin,
      surveyNo: parcel.surveyNo,
      owner: parcel.owner.name,
      historicalScanYear: '2021 (ISRO Cartosat-2 Visual)',
      currentScanYear: '2026 (High-Res Sentinel-2 / Drone)',
      historicalBuildingAreaPct: parcel.aiSurveillance.historicalBuildingAreaPct,
      currentBuildingAreaPct: parcel.aiSurveillance.currentBuildingAreaPct,
      changeDeltaPct: parcel.aiSurveillance.currentBuildingAreaPct - parcel.aiSurveillance.historicalBuildingAreaPct,
      encroachmentDetected: parcel.aiSurveillance.encroachmentDetected,
      severity: parcel.aiSurveillance.severity,
      detectedViolation: parcel.aiSurveillance.detectedViolation,
      riskScore: parcel.aiSurveillance.riskScore,
      aiBoundingBox: parcel.aiSurveillance.aiBoundingBox,
      aiConfidenceScore: '99.4%',
      postgisSpatialOverlayCheck: 'COMPLETED - Cadastral Buffer Match Failed by 1.8m'
    }
  });
});

// POST /api/gis/spatial-query
router.post('/gis/spatial-query', (req, res) => {
  const parcels = getParcelsData();
  const { spatialOperation, bufferMeters, targetUlpin } = req.body;

  const parcel = parcels.find((p) => p.ulpin === targetUlpin) || parcels[0];

  res.json({
    success: true,
    spatialQuery: {
      postgisFunction: spatialOperation || 'ST_Buffer(geom, 5.0)',
      targetUlpin: parcel.ulpin,
      inputGeometry: `POLYGON((${parcel.coordinates.map((c) => `${c[0]} ${c[1]}`).join(', ')}))`,
      srid: 4326,
      bufferMeters: Number(bufferMeters) || 5.0,
      spatialIntersectsCount: 2,
      overlappingParcels: parcels.filter((p) => p.ulpin !== parcel.ulpin).map((p) => p.ulpin),
      postgisExecutionTimeMs: 4.2
    }
  });
});

// GET /api/dpi/gateway-status
router.get('/dpi/gateway-status', (req, res) => {
  const parcels = getParcelsData();
  const totalParcels = parcels.length;
  const lienLockedCount = parcels.filter((p) => p.financial.lienLockActive).length;
  const encumberedCount = parcels.filter((p) => p.financial.isEncumbered).length;
  const encroachmentAlerts = parcels.filter((p) => p.aiSurveillance.encroachmentDetected).length;

  res.json({
    success: true,
    dpiGateway: {
      status: 'OPERATIONAL',
      protocolVersion: 'ULPIN-DPI-v2.6',
      mongoUriStatus: 'CONNECTED_CLOUD_ATLAS',
      totalDigitizedParcels: totalParcels,
      activeLienLocks: lienLockedCount,
      encumberedParcels: encumberedCount,
      aiEncroachmentAlerts: encroachmentAlerts,
      connectedClientsCount: sseClients.length,
      connectedNodeStatus: {
        landRevenueDept: { status: 'ONLINE', latencyMs: 14, lastSync: new Date().toISOString() },
        subRegistrarOffice: { status: 'ONLINE', latencyMs: 22, lastSync: new Date().toISOString() },
        bankingLienGateway: { status: 'ONLINE', latencyMs: 18, lastSync: new Date().toISOString() },
        municipalTaxEngine: { status: 'ONLINE', latencyMs: 12, lastSync: new Date().toISOString() },
        postgisSpatialServer: { status: 'ONLINE', latencyMs: 9, lastSync: new Date().toISOString() }
      }
    }
  });
});

// POST /api/dpi/simulate-fraud - Core SIH Demonstration Endpoint
router.post('/dpi/simulate-fraud', (req, res) => {
  const { ulpin, attemptType = 'ILLEGAL_SALE_REGISTRATION' } = req.body;
  const parcels = getParcelsData();
  const parcel = parcels.find((p) => p.ulpin === ulpin) || parcels[0];

  const hasLien = parcel.financial.isEncumbered || parcel.financial.lienLockActive;
  const isProtected = parcel.zoningCode?.includes('PROT') || parcel.zoningCode?.includes('ENV');

  if (hasLien) {
    const fraudRecord = {
      incidentId: `DPI-ALERT-${Date.now().toString().substring(6)}`,
      timestamp: new Date().toISOString(),
      ulpin: parcel.ulpin,
      surveyNo: parcel.surveyNo,
      owner: parcel.owner.name,
      outcome: 'FRAUD_PREVENTED',
      preventedAt: 'Sub-Registrar Office Gateway (Stamper Interceptor)',
      blockReason: `Active Mortgage Lien Lock placed by ${parcel.financial.bankLien}`,
      loanAmountEncumbered: parcel.financial.loanAmount,
      lienId: parcel.financial.lienId,
      legalStatute: 'Section 17 & 48, Registration Act 1908 + DPI Multi-Agency Protocol v2.6',
      auditSignature: `SHA256-${Buffer.from(parcel.ulpin + Date.now()).toString('hex').substring(0, 32).toUpperCase()}`,
      alertBroadcast: 'Broadcasted to Sub-Registrar, Banking Gateway & Land Revenue Dept'
    };

    broadcastSSE('FRAUD_PREVENTED_EVENT', fraudRecord);

    return res.json({
      success: true,
      allowed: false,
      fraudPrevented: true,
      data: fraudRecord
    });
  }

  if (isProtected) {
    const fraudRecord = {
      incidentId: `DPI-ALERT-${Date.now().toString().substring(6)}`,
      timestamp: new Date().toISOString(),
      ulpin: parcel.ulpin,
      surveyNo: parcel.surveyNo,
      owner: parcel.owner.name,
      outcome: 'GOVT_PROTECTED_BLOCK',
      preventedAt: 'Sub-Registrar Office Gateway',
      blockReason: `Land is classified as Sovereign / Eco-Sensitive Protected Zone (${parcel.zoning})`,
      legalStatute: 'Public Trust Doctrine & Forest Conservation Act',
      auditSignature: `SHA256-${Buffer.from(parcel.ulpin + Date.now()).toString('hex').substring(0, 32).toUpperCase()}`,
      alertBroadcast: 'Alert sent to District Collector & Revenue Inspector'
    };

    broadcastSSE('FRAUD_PREVENTED_EVENT', fraudRecord);

    return res.json({
      success: true,
      allowed: false,
      fraudPrevented: true,
      data: fraudRecord
    });
  }

  return res.json({
    success: true,
    allowed: true,
    fraudPrevented: false,
    message: 'Title is unencumbered and clear. Registration approved under DPI Conclusive Title Protocol.',
    clearanceToken: `CLEAR-${Date.now().toString(36).toUpperCase()}`
  });
});

export default router;
