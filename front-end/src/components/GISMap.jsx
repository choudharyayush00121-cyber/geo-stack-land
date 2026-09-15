import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip, Polyline, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  ShieldCheck,
  Lock,
  Building,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Radio,
  Ruler,
  Compass,
  Navigation,
  Activity,
  Satellite,
  Eye,
  Key,
  Globe,
  MapPin,
  Target,
  Radar
} from 'lucide-react';
import axios from 'axios';
import SurroundingAreaModal from './SurroundingAreaModal';

// Animated Drone Icon
const createDroneIcon = (heading = 0) => {
  return L.divIcon({
    className: 'custom-drone-icon',
    html: `
      <div style="transform: rotate(${heading}deg); transition: transform 0.5s ease;" class="relative flex items-center justify-center w-10 h-10">
        <div class="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping"></div>
        <div class="relative w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 text-cyan-300 shadow-xl flex items-center justify-center font-bold text-xs">
          🛸
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

// Custom User GPS Location Marker Icon
const createUserGpsIcon = () => {
  return L.divIcon({
    className: 'custom-user-gps-icon',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute inset-0 rounded-full bg-blue-500/40 animate-ping"></div>
        <div class="relative w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center font-bold text-[10px] text-white">
          📍
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// Map Events Handler
function MapEventsHandler({ onMouseMove, onClickMap, isMeasuring, measurePoints }) {
  useMapEvents({
    mousemove(e) {
      if (onMouseMove) {
        onMouseMove({ lat: e.latlng.lat.toFixed(5), lng: e.latlng.lng.toFixed(5) });
      }
    },
    click(e) {
      if (isMeasuring && onClickMap) {
        onClickMap([e.latlng.lat, e.latlng.lng]);
      }
    }
  });
  return null;
}

// Map Bounds / FlyTo Updater
function MapBoundsUpdater({ parcels, userGpsPos }) {
  const map = useMap();

  useEffect(() => {
    if (userGpsPos) {
      map.flyTo([userGpsPos.lat, userGpsPos.lng], 16, { duration: 1.5 });
    } else if (parcels && parcels.length > 0) {
      const allCoords = parcels.flatMap((p) => p.coordinates);
      if (allCoords.length > 0) {
        const bounds = allCoords.map((c) => [c[1], c[0]]);
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [parcels, userGpsPos, map]);

  return null;
}

export default function GISMap({
  parcels,
  selectedParcel,
  setSelectedParcel,
  onGenerateEC,
  onToggleLien,
  onRunAIScan,
  droneTelemetry,
  liveSseEvent,
  satelliteApiKey
}) {
  const [activeLayer, setActiveLayer] = useState('ownership');
  const [satelliteBandMode, setSatelliteBandMode] = useState('esri_hd');
  const [cursorCoords, setCursorCoords] = useState({ lat: '31.1048', lng: '77.1734' });

  // Real-time GPS Location & Scan state
  const [userGpsPos, setUserGpsPos] = useState(null);
  const [scanningGps, setScanningGps] = useState(false);
  const [surroundingScanData, setSurroundingScanData] = useState(null);
  const [showSurroundingModal, setShowSurroundingModal] = useState(false);

  // Measurement tool state
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);

  // Satellite Telemetry State
  const [satelliteMeta, setSatelliteMeta] = useState(null);

  const defaultCenter = [31.1048, 77.1734];

  // Fetch real-time Satellite Metadata from backend API
  useEffect(() => {
    const fetchSatelliteMeta = async () => {
      try {
        const res = await axios.get('/api/satellite/live-metadata', {
          params: { apiKey: satelliteApiKey }
        });
        if (res.data.success) {
          setSatelliteMeta(res.data);
        }
      } catch (err) {
        console.error('Error fetching satellite metadata:', err);
      }
    };
    fetchSatelliteMeta();
  }, [satelliteApiKey]);

  

  // Real-Time GPS Location Scan Handler
  const handleScanMyLocation = () => {
    setScanningGps(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserGpsPos({ lat, lng, accuracy: position.coords.accuracy });

          // Perform surrounding spatial scan API request
          try {
            const res = await axios.post('/api/gis/scan-surrounding', {
              userLat: lat,
              userLng: lng,
              radiusMeters: 5
            });
            if (res.data.success) {
              setSurroundingScanData(res.data);
              setShowSurroundingModal(true);
            }
          } catch (err) {
            console.error('Error performing spatial scan:', err);
          } finally {
            setScanningGps(false);
          }
        },
        async (error) => {
          console.warn('Browser GPS permission unavailable or fallback applied:', error);
          // Fallback to sample metropolitan GIS center
          const fallbackLat = 31.10480;
          const fallbackLng = 77.17340;
          setUserGpsPos({ lat: fallbackLat, lng: fallbackLng, accuracy: 25 });

          try {
            const res = await axios.post('/api/gis/scan-surrounding', {
              userLat: fallbackLat,
              userLng: fallbackLng,
              radiusMeters: 5
            });
            if (res.data.success) {
              setSurroundingScanData(res.data);
              setShowSurroundingModal(true);
            }
          } catch (err) {
            console.error('Error performing fallback spatial scan:', err);
          } finally {
            setScanningGps(false);
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setScanningGps(false);
    }
  };

  const calculateDistanceMeters = (pts) => {
    if (pts.length < 2) return 0;
    let dist = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = L.latLng(pts[i][0], pts[i][1]);
      const p2 = L.latLng(pts[i + 1][0], pts[i + 1][1]);
      dist += p1.distanceTo(p2);
    }
    return dist;
  };

  const totalDistanceMeters = calculateDistanceMeters(measurePoints);

  const handleMapClick = (latlngArr) => {
    setMeasurePoints((prev) => [...prev, latlngArr]);
  };

  const getPolygonStyle = (parcel) => {
    const isSelected = selectedParcel && selectedParcel.id === parcel.id;

    if (activeLayer === 'ownership') {
      if (parcel.owner.mutationStatus === 'MUTATED_CLEAR') {
        return {
          fillColor: '#10b981',
          fillOpacity: isSelected ? 0.7 : 0.45,
          color: isSelected ? '#ffffff' : '#059669',
          weight: isSelected ? 4 : 2
        };
      } else if (parcel.owner.mutationStatus === 'DISPUTE_PENDING') {
        return {
          fillColor: '#f59e0b',
          fillOpacity: isSelected ? 0.7 : 0.45,
          color: isSelected ? '#ffffff' : '#d97706',
          weight: isSelected ? 4 : 2
        };
      } else {
        return {
          fillColor: '#8b5cf6',
          fillOpacity: isSelected ? 0.7 : 0.45,
          color: isSelected ? '#ffffff' : '#7c3aed',
          weight: isSelected ? 4 : 2
        };
      }
    }

    if (activeLayer === 'encumbrance') {
      if (parcel.financial.lienLockActive || parcel.financial.isEncumbered) {
        return {
          fillColor: '#ef4444',
          fillOpacity: isSelected ? 0.8 : 0.5,
          color: isSelected ? '#ffffff' : '#dc2626',
          weight: isSelected ? 4 : 2
        };
      } else {
        return {
          fillColor: '#10b981',
          fillOpacity: isSelected ? 0.7 : 0.4,
          color: isSelected ? '#ffffff' : '#059669',
          weight: isSelected ? 3 : 2
        };
      }
    }

    if (activeLayer === 'zoning') {
      const zColors = {
        Commercial: '#f97316',
        Residential: '#0284c7',
        Agricultural: '#eab308',
        Industrial: '#64748b',
        'Eco-Sensitive / Buffer': '#10b981'
      };
      const color = zColors[parcel.zoning] || '#3b82f6';
      return {
        fillColor: color,
        fillOpacity: isSelected ? 0.8 : 0.5,
        color: isSelected ? '#ffffff' : color,
        weight: isSelected ? 4 : 2
      };
    }

    return { fillColor: '#0284c7', fillOpacity: 0.4, color: '#38bdf8', weight: 2 };
  };

  const getTileLayerUrl = () => {
    if (satelliteBandMode === 'sentinel_ndvi') {
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
    if (satelliteBandMode === 'sentinel_falsecolor') {
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
    if (satelliteBandMode === 'dark') {
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  };

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row overflow-hidden bg-slate-950">
      {/* Top Toolbar */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2">
        {/* Real-time Location Scan Button */}
        <button
          onClick={handleScanMyLocation}
          disabled={scanningGps}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs shadow-xl flex items-center space-x-1.5 transition-all border border-blue-400/40"
        >
          <Target className={`w-4 h-4 ${scanningGps ? 'animate-spin' : 'animate-pulse'}`} />
          <span>{scanningGps ? 'Scanning Location...' : '📍 Scan My GPS Location'}</span>
        </button>

        {surroundingScanData && (
          <button
            onClick={() => setShowSurroundingModal(true)}
            className="bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-semibold py-2 px-3 rounded-xl text-xs shadow-xl flex items-center space-x-1.5 transition-all border border-cyan-500/40"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Surrounding Area Audit ({surroundingScanData.scanSummary.totalParcelsFound} Plots)</span>
          </button>
        )}

        {/* GIS Layer Selector */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-1.5 flex items-center space-x-1 shadow-xl text-xs">
          <span className="text-slate-400 font-semibold px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Layer:
          </span>
          <button
            onClick={() => setActiveLayer('ownership')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
              activeLayer === 'ownership'
                ? 'bg-cyan-500 text-white font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Ownership Title
          </button>
          <button
            onClick={() => setActiveLayer('encumbrance')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
              activeLayer === 'encumbrance'
                ? 'bg-rose-600 text-white font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Financial Lien Lock
          </button>
          <button
            onClick={() => setActiveLayer('zoning')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
              activeLayer === 'zoning'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Zoning & Masterplan
          </button>
        </div>

        {/* Satellite Band Selector */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-1.5 flex items-center space-x-1 shadow-xl text-xs">
          <span className="text-slate-400 font-semibold px-2 flex items-center gap-1">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            Satellite Sensor:
          </span>
          <button
            onClick={() => setSatelliteBandMode('esri_hd')}
            className={`px-2 py-1 rounded-lg transition-all ${
              satelliteBandMode === 'esri_hd' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            High-Res Optical
          </button>
          <button
            onClick={() => setSatelliteBandMode('sentinel_ndvi')}
            className={`px-2 py-1 rounded-lg transition-all ${
              satelliteBandMode === 'sentinel_ndvi' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            NDVI Agri Band
          </button>
        </div>
      </div>

      {/* Real-time Satellite Telemetry HUD */}
      {satelliteMeta && (
        <div className="absolute top-16 right-4 z-[400] bg-slate-900/95 border border-cyan-500/40 backdrop-blur rounded-xl p-3 shadow-2xl text-xs space-y-1 max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-bold text-white">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Satellite className="w-4 h-4 animate-pulse" />
              <span>Satellite Live HUD</span>
            </span>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
              API ACTIVE
            </span>
          </div>
          <div className="text-slate-300 font-mono text-[11px] space-y-0.5">
            <div className="flex justify-between"><span className="text-slate-400">Sensor:</span> <span>{satelliteMeta.satelliteProvider.split('/')[0]}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Cloud Cover:</span> <span className="text-emerald-400 font-bold">{satelliteMeta.cloudCoverPct}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Resolution:</span> <span className="text-cyan-300">{satelliteMeta.spatialResolutionMeters}m / pixel</span></div>
          </div>
        </div>
      )}

      {/* Main Leaflet Map Canvas */}
      <div className="flex-1 w-full h-[60vh] md:h-full relative">
        <MapContainer center={defaultCenter} zoom={15} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://copernicus.eu/">Copernicus Sentinel-2</a> &copy; Esri World Satellite'
            url={getTileLayerUrl()}
          />
          <MapBoundsUpdater parcels={parcels} userGpsPos={userGpsPos} />
          <MapEventsHandler
            onMouseMove={setCursorCoords}
            onClickMap={handleMapClick}
            isMeasuring={isMeasuring}
            measurePoints={measurePoints}
          />

          {/* Render GeoJSON Parcel Polygons (Disabled by user request to remove boxes) */}
          {/*
          {parcels.map((parcel) => {
            const polygonCoords = parcel.coordinates.map((c) => [c[1], c[0]]);
            const style = getPolygonStyle(parcel);

            return (
              <Polygon
                key={parcel.id}
                positions={polygonCoords}
                pathOptions={style}
                eventHandlers={{
                  click: () => setSelectedParcel(parcel)
                }}
              >
                <Tooltip sticky direction="top" opacity={0.95}>
                  <div className="text-xs p-1">
                    <div className="font-bold text-cyan-300 font-mono">ULPIN: {parcel.ulpin}</div>
                    <div className="text-slate-200">{parcel.surveyNo} • {parcel.village}</div>
                    <div className="text-slate-400">Owner: {parcel.owner.name}</div>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
          */}

          {/* Render User Physical GPS Location Marker & Circle */}
          {userGpsPos && (
            <>
              <Marker position={[userGpsPos.lat, userGpsPos.lng]} icon={createUserGpsIcon()}>
                <Popup>
                  <div className="text-xs font-bold text-blue-400 p-1">
                    📍 Your Physical GPS Location
                    <div className="text-[10px] text-slate-300 font-mono">Lat: {userGpsPos.lat.toFixed(5)}, Lng: {userGpsPos.lng.toFixed(5)}</div>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[userGpsPos.lat, userGpsPos.lng]}
                radius={userGpsPos.accuracy || 200}
                pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.15, color: '#60a5fa', weight: 1.5, dashArray: '4, 4' }}
              />
            </>
          )}

          {/* Render Moving Drone Marker */}
          {droneTelemetry && (
            <Marker
              position={[droneTelemetry.lat, droneTelemetry.lng]}
              icon={createDroneIcon(droneTelemetry.headingDeg)}
            />
          )}

          {/* Measurement Line */}
          {measurePoints.length > 1 && (
            <Polyline positions={measurePoints} pathOptions={{ color: '#f59e0b', weight: 4, dashArray: '6, 6' }} />
          )}
        </MapContainer>

        {/* Real-time Telemetry & Coordinates Bar */}
        <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-2">
          {/* Surrounding Area Scan Summary Card */}
          {surroundingScanData && (
            <div className="bg-slate-900/95 border border-cyan-500/50 backdrop-blur p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 max-w-sm">
              <div className="flex items-center justify-between font-bold text-cyan-300 border-b border-slate-800 pb-1">
                <span className="flex items-center gap-1.5 truncate max-w-[200px]" title={surroundingScanData.userLocation?.areaName || 'Surrounding Spatial Scan Results'}>
                  <Radar className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                  <span className="truncate">{surroundingScanData.userLocation?.areaName ? `${surroundingScanData.userLocation.areaName} Scan` : 'Surrounding Spatial Scan Results'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Radius: 1000m</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
                <div>Nearby Parcels: <span className="font-bold text-white">{surroundingScanData.scanSummary.totalParcelsFound}</span></div>
                <div>Avg Circle Rate: <span className="font-bold text-amber-300">₹{surroundingScanData.scanSummary.avgCircleRatePerSqFt}/sq.ft</span></div>
                <div>Lien Encumbered: <span className="font-bold text-rose-400">{surroundingScanData.scanSummary.encumberedRatioPct}%</span></div>
                <div>Nearest Parcel: <span className="font-bold text-cyan-300">{surroundingScanData.scanSummary.nearestDistanceMeters}m</span></div>
              </div>
            </div>
          )}

          {/* Coordinate Box */}
          <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1 max-w-xs">
            <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
              <span className="flex items-center gap-1 text-cyan-400">
                <Compass className="w-3.5 h-3.5" />
                WGS84 Lat/Lng
              </span>
              <span>{cursorCoords.lat}, {cursorCoords.lng}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parcel Inspector Side Drawer Panel */}
      <div className="w-full md:w-96 bg-slate-900 border-l border-slate-800 p-5 overflow-y-auto flex flex-col justify-between">
        {selectedParcel ? (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {selectedParcel.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedParcel.surveyNo}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                <span>ULPIN: {selectedParcel.ulpin}</span>
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span>{selectedParcel.village}, {selectedParcel.taluk}, {selectedParcel.district}</span>
              </p>
            </div>

            {/* Title Deed & Owner Info */}
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300 border-b border-slate-700/60 pb-2">
                <span className="text-slate-400 font-medium">Registered Owner</span>
                <span className="font-bold text-white">{selectedParcel.owner.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Aadhaar Hash</span>
                <span className="font-mono text-cyan-300">{selectedParcel.owner.aadhaarMasked}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Title Deed No</span>
                <span className="font-mono text-slate-200">{selectedParcel.owner.deedNo}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Land Area</span>
                <span className="font-semibold text-slate-200">{selectedParcel.areaSqFt.toLocaleString()} sq.ft ({selectedParcel.areaAcres} Acres)</span>
              </div>
            </div>

            {/* Financial & Encumbrance Status Card */}
            <div className={`rounded-xl p-4 border text-xs space-y-3 ${
              selectedParcel.financial.isEncumbered
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-1.5">
                  {selectedParcel.financial.isEncumbered ? (
                    <>
                      <Lock className="w-4 h-4 text-rose-400" />
                      <span>Encumbered / Lien Locked</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Nil Encumbrance (Clear Title)</span>
                    </>
                  )}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedParcel.financial.isEncumbered ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {selectedParcel.financial.isEncumbered ? 'LOCKED' : 'CLEAR'}
                </span>
              </div>

              {selectedParcel.financial.isEncumbered && (
                <div className="space-y-1.5 text-slate-300 pt-2 border-t border-rose-800/40">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lien Holding Institution:</span>
                    <span className="font-semibold">{selectedParcel.financial.bankLien}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mortgage Loan Amount:</span>
                    <span className="font-bold text-amber-300">₹{selectedParcel.financial.loanAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Toggle Lien Lock Action Button */}
              <button
                onClick={() => onToggleLien(selectedParcel)}
                className={`w-full mt-2 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                  selectedParcel.financial.isEncumbered
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{selectedParcel.financial.isEncumbered ? 'Release Lien Lock' : 'Apply Bank Lien Lock'}</span>
              </button>
            </div>

            {/* AI Surveillance Overview */}
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className={`w-4 h-4 ${selectedParcel.aiSurveillance.encroachmentDetected ? 'text-amber-400' : 'text-emerald-400'}`} />
                  AI Satellite Surveillance
                </span>
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  selectedParcel.aiSurveillance.encroachmentDetected ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  Risk Index: {selectedParcel.aiSurveillance.riskScore}%
                </span>
              </div>
              <p className="text-slate-400 leading-tight">
                {selectedParcel.aiSurveillance.detectedViolation}
              </p>
              <button
                onClick={() => onRunAIScan(selectedParcel)}
                className="w-full mt-1 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/50 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1"
              >
                <span>Inspect AI Change Detection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Instant Encumbrance Certificate Generator Trigger */}
            <button
              onClick={() => onGenerateEC(selectedParcel)}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-950/60 flex items-center justify-center space-x-2 transition-all"
            >
              <FileText className="w-5 h-5" />
              <span>Generate Instant Encumbrance Certificate</span>
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-300 font-semibold text-sm">Select a Land Parcel</h3>
              <p className="text-xs text-slate-500 mt-1">
                Click any polygon on the interactive GIS map or search by 14-digit ULPIN to view complete records.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Surrounding Area Live GPS Audit Modal */}
      <SurroundingAreaModal
        isOpen={showSurroundingModal}
        onClose={() => setShowSurroundingModal(false)}
        userGpsPos={userGpsPos}
        surroundingScanData={surroundingScanData}
        onSelectParcel={(p) => {
          setSelectedParcel(p);
        }}
      />
    </div>
  );
}
