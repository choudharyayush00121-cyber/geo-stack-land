import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Tooltip,
  Polyline,
  Circle,
  useMap,
  useMapEvents
} from 'react-leaflet';
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
  Radar,
  Camera,
  Maximize2,
  Sparkles,
  Zap,
  Crosshair,
  Sliders,
  Plane,
  X
} from 'lucide-react';
import axios from 'axios';
import SurroundingAreaModal from './SurroundingAreaModal';
import {
  playClickSound,
  playRadarPing,
  playSuccessChime,
  playAlertBuzzer,
  playLockSound
} from '../utils/audioEffects';

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

// Custom Cadastral Plot Center Badge Icon
const createPlotBadgeIcon = (surveyNo, isSelected, isEncumbered) => {
  return L.divIcon({
    className: 'custom-plot-badge-icon',
    html: `
      <div class="px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold whitespace-nowrap shadow-lg border transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${
        isSelected
          ? 'bg-cyan-500 text-slate-950 border-white scale-110 ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
          : isEncumbered
          ? 'bg-rose-950/90 text-rose-300 border-rose-500/60'
          : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:border-cyan-400'
      }">
        ${surveyNo}
      </div>
    `,
    iconSize: [0, 0]
  });
};

// Map Events Handler for cursor coordinates & measurement
function MapEventsHandler({ onMouseMove, onClickMap, isMeasuring }) {
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

// Map Bounds / FlyTo Controller
function MapBoundsUpdater({ parcels, userGpsPos, targetFlyTo }) {
  const map = useMap();

  useEffect(() => {
    if (targetFlyTo) {
      map.flyTo(targetFlyTo.center, targetFlyTo.zoom || 16, { duration: 1.5 });
    } else if (userGpsPos) {
      map.flyTo([userGpsPos.lat, userGpsPos.lng], 16, { duration: 1.5 });
    } else if (parcels && parcels.length > 0 && !targetFlyTo) {
      const allCoords = parcels.flatMap((p) => p.coordinates);
      if (allCoords.length > 0) {
        const bounds = allCoords.map((c) => [c[1], c[0]]);
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [parcels, userGpsPos, targetFlyTo, map]);

  return null;
}

// Geodesic Polygon Area Calculation in Square Meters
function calculatePolygonAreaSqMeters(latlngs) {
  if (latlngs.length < 3) return 0;
  const R = 6378137;
  let total = 0;
  const len = latlngs.length;
  for (let i = 0; i < len; i++) {
    const p1 = latlngs[i];
    const p2 = latlngs[(i + 1) % len];
    const x1 = (p1[1] * Math.PI) / 180 * Math.cos(((p1[0] + p2[0]) / 2 * Math.PI) / 180) * R;
    const y1 = (p1[0] * Math.PI) / 180 * R;
    const x2 = (p2[1] * Math.PI) / 180 * Math.cos(((p1[0] + p2[0]) / 2 * Math.PI) / 180) * R;
    const y2 = (p2[0] * Math.PI) / 180 * R;
    total += (x1 * y2 - x2 * y1);
  }
  return Math.abs(total / 2);
}

export default function GISMap({
  parcels = [],
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
  const [showCadastralMesh, setShowCadastralMesh] = useState(true);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'LIEN' | 'ENCROACH' | 'CLEAR'

  // Region Jump State
  const [activeRegion, setActiveRegion] = useState('shimla');
  const [targetFlyTo, setTargetFlyTo] = useState(null);

  // Real-time GPS Location & Scan state
  const [userGpsPos, setUserGpsPos] = useState(null);
  const [scanningGps, setScanningGps] = useState(false);
  const [isLiveLocation, setIsLiveLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const locationWatchRef = useRef(null);
  const [surroundingScanData, setSurroundingScanData] = useState(null);
  const [showSurroundingModal, setShowSurroundingModal] = useState(false);

  // Measurement Tool State
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);

  // Drone HUD Overlay State
  const [showDroneHUD, setShowDroneHUD] = useState(false);
  const [droneCameraFeed, setDroneCameraFeed] = useState('optical'); // 'optical' | 'thermal' | 'ndvi'
  const [droneSnapshot, setDroneSnapshot] = useState(null);
  const [localDronePos, setLocalDronePos] = useState(null);

  // Satellite Telemetry State
  const [satelliteMeta, setSatelliteMeta] = useState(null);

  const defaultCenter = [31.1048, 77.1734];

  // Available Indian Cadastral Regions
  const regions = [
    { id: 'shimla', name: '🏔️ Shimla Hills (HP)', center: [31.10480, 77.17340], zoom: 16 },
    { id: 'blr', name: '🏙️ Bengaluru Tech Corridor (KA)', center: [12.93400, 77.69400], zoom: 16 },
    { id: 'pune', name: '🏭 Pune Hinjawadi (MH)', center: [18.59500, 73.72900], zoom: 16 }
  ];

  // Handle Region Switching
  const handleRegionSwitch = (region) => {
    playClickSound();
    setActiveRegion(region.id);
    setTargetFlyTo({ center: region.center, zoom: region.zoom });

    // Select the first parcel in this region
    const firstInRegion = parcels.find(p => p.region?.includes(region.id === 'shimla' ? 'Shimla' : region.id === 'blr' ? 'Bengaluru' : 'Pune'));
    if (firstInRegion) {
      setSelectedParcel(firstInRegion);
    }
  };

  // Sync Drone Telemetry or override with local dispatch
  const currentDrone = localDronePos || droneTelemetry || {
    lat: 31.10480,
    lng: 77.17340,
    alt: 120,
    battery: 94,
    speedKmh: 24.5,
    headingDeg: 90,
    status: 'SCANNING_PARCEL'
  };

  // Fetch real-time Satellite Metadata
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

  useEffect(() => {
    return () => {
      if (locationWatchRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
      }
    };
  }, []);

  const stopLiveLocation = () => {
    if (locationWatchRef.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(locationWatchRef.current);
      locationWatchRef.current = null;
    }
    setIsLiveLocation(false);
  };

  const startLiveLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Live location is not supported by this browser.');
      return;
    }

    playRadarPing();
    setLocationError('');
    setIsLiveLocation(true);
    locationWatchRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed
        };
        setUserGpsPos(nextPosition);
        setTargetFlyTo(null);
      },
      (error) => {
        setLocationError(error.code === 1 ? 'Location permission was denied.' : 'Unable to update live location.');
        stopLiveLocation();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
    );
  };

  const handleLiveLocationToggle = () => {
    if (isLiveLocation) {
      stopLiveLocation();
      playClickSound();
    } else {
      startLiveLocation();
    }
  };

  // Real-Time GPS Location Scan Handler
  const handleScanMyLocation = () => {
    playRadarPing();
    setScanningGps(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserGpsPos({ lat, lng, accuracy: position.coords.accuracy });
          setTargetFlyTo({ center: [lat, lng], zoom: 16 });

          try {
            const res = await axios.post('/api/gis/scan-surrounding', {
              userLat: lat,
              userLng: lng,
              radiusMeters: 1000
            });
            if (res.data.success) {
              setSurroundingScanData(res.data);
              setShowSurroundingModal(true);
              playSuccessChime();
            }
          } catch (err) {
            console.error('Error performing spatial scan:', err);
          } finally {
            setScanningGps(false);
          }
        },
        async (error) => {
          console.warn('Browser GPS permission fallback:', error);
          const fallbackLat = 31.10480;
          const fallbackLng = 77.17340;
          setUserGpsPos({ lat: fallbackLat, lng: fallbackLng, accuracy: 25 });
          setTargetFlyTo({ center: [fallbackLat, fallbackLng], zoom: 16 });

          try {
            const res = await axios.post('/api/gis/scan-surrounding', {
              userLat: fallbackLat,
              userLng: fallbackLng,
              radiusMeters: 1000
            });
            if (res.data.success) {
              setSurroundingScanData(res.data);
              setShowSurroundingModal(true);
              playSuccessChime();
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

  // Measurement tool calculations
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
  const totalAreaSqMeters = measurePoints.length >= 3 ? calculatePolygonAreaSqMeters(measurePoints) : 0;
  const totalAreaSqFt = Math.round(totalAreaSqMeters * 10.7639);
  const totalAreaAcres = (totalAreaSqMeters / 4046.86).toFixed(3);

  const handleMapClick = (latlngArr) => {
    playClickSound();
    setMeasurePoints((prev) => [...prev, latlngArr]);
  };

  // Dispatch Drone to currently selected parcel
  const handleDispatchDrone = () => {
    if (!selectedParcel) return;
    playRadarPing();
    const target = {
      lat: selectedParcel.center[0],
      lng: selectedParcel.center[1],
      alt: 135,
      battery: Math.max(50, currentDrone.battery - 3),
      speedKmh: 42.0,
      headingDeg: Math.floor(Math.random() * 360),
      status: `PATROL_ULPIN_${selectedParcel.ulpin}`
    };
    setLocalDronePos(target);
    setTargetFlyTo({ center: selectedParcel.center, zoom: 17 });
    setShowDroneHUD(true);
    playSuccessChime();
  };

  // Take Drone Orthophoto Snapshot
  const handleTakeDroneSnapshot = () => {
    playRadarPing();
    setDroneSnapshot({
      id: `SNAP-${Date.now().toString().substring(6)}`,
      timestamp: new Date().toISOString(),
      lat: currentDrone.lat,
      lng: currentDrone.lng,
      alt: currentDrone.alt,
      targetUlpin: selectedParcel ? selectedParcel.ulpin : '14829304812901',
      feedMode: droneCameraFeed
    });
    playSuccessChime();
  };

  // Filter parcels
  const filteredParcels = parcels.filter(p => {
    if (filterMode === 'LIEN') return p.financial?.isEncumbered || p.financial?.lienLockActive;
    if (filterMode === 'ENCROACH') return p.aiSurveillance?.encroachmentDetected;
    if (filterMode === 'CLEAR') return p.owner?.mutationStatus === 'MUTATED_CLEAR';
    return true;
  });

  const lienCount = parcels.filter((p) => p.financial?.isEncumbered || p.financial?.lienLockActive).length;
  const encroachmentCount = parcels.filter((p) => p.aiSurveillance?.encroachmentDetected).length;
  const conclusiveTitleCount = parcels.filter((p) => p.owner?.mutationStatus === 'MUTATED_CLEAR').length;

  const getPolygonStyle = (parcel) => {
    const isSelected = selectedParcel && selectedParcel.id === parcel.id;

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
        'Commercial SEZ': '#06b6d4',
        Residential: '#0284c7',
        'Residential High-Rise': '#3b82f6',
        Agricultural: '#eab308',
        'Industrial Logistics': '#8b5cf6',
        'Eco Buffer Zone': '#10b981',
        'Lake Valley Buffer Zone': '#ef4444',
        'Transit Oriented Development': '#ec4899'
      };
      const color = zColors[parcel.zoning] || '#3b82f6';
      return {
        fillColor: color,
        fillOpacity: isSelected ? 0.8 : 0.45,
        color: isSelected ? '#ffffff' : color,
        weight: isSelected ? 4 : 2
      };
    }

    // Default: Ownership
    if (parcel.owner.mutationStatus === 'MUTATED_CLEAR') {
      return {
        fillColor: '#10b981',
        fillOpacity: isSelected ? 0.75 : 0.45,
        color: isSelected ? '#ffffff' : '#059669',
        weight: isSelected ? 4 : 2
      };
    } else if (parcel.owner.mutationStatus === 'MUTATION_DISPUTED') {
      return {
        fillColor: '#ef4444',
        fillOpacity: isSelected ? 0.8 : 0.5,
        color: isSelected ? '#ffffff' : '#dc2626',
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
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 max-w-[calc(100vw-350px)]">
        {/* Multi-Region Jump Selector */}
        <div className="bg-slate-900/95 backdrop-blur border border-cyan-500/40 rounded-xl p-1 flex items-center space-x-1 shadow-2xl text-xs">
          <span className="text-cyan-300 font-bold px-2 flex items-center gap-1 font-mono">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            Cadastre:
          </span>
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => handleRegionSwitch(reg)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeRegion === reg.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {reg.name}
            </button>
          ))}
        </div>

        {/* Real-time GPS Location Scan Button */}
        <button
          onClick={handleLiveLocationToggle}
          className={`bg-gradient-to-r text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xl flex items-center space-x-1.5 transition-all border ${
            isLiveLocation
              ? 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-emerald-400/50'
              : 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-blue-400/40'
          }`}
        >
          <Target className={`w-3.5 h-3.5 ${isLiveLocation ? 'animate-ping' : 'animate-pulse'}`} />
          <span>{isLiveLocation ? 'Live Location On' : 'Start Live Location'}</span>
        </button>

        <button
          onClick={handleScanMyLocation}
          disabled={scanningGps}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold py-2 px-3 rounded-xl text-xs shadow-xl flex items-center space-x-1.5 transition-all border border-slate-700"
        >
          <Radar className={`w-3.5 h-3.5 ${scanningGps ? 'animate-spin' : ''}`} />
          <span>{scanningGps ? 'Scanning...' : 'Scan Nearby Plots'}</span>
        </button>

        {/* Live Drone HUD Toggle */}
        <button
          onClick={() => {
            playClickSound();
            setShowDroneHUD(!showDroneHUD);
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold shadow-xl flex items-center space-x-1.5 transition-all border ${
            showDroneHUD
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-slate-900/90 text-slate-200 hover:bg-slate-800 border-slate-700'
          }`}
        >
          <Plane className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showDroneHUD ? 'Close UAV HUD' : '🛸 Drone HUD'}</span>
        </button>

        {/* Cadastral Measurement Tool Toggle */}
        <button
          onClick={() => {
            playClickSound();
            setIsMeasuring(!isMeasuring);
            if (!isMeasuring) setMeasurePoints([]);
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold shadow-xl flex items-center space-x-1.5 transition-all border ${
            isMeasuring
              ? 'bg-amber-500 text-slate-950 border-amber-300 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.6)]'
              : 'bg-slate-900/90 text-slate-200 hover:bg-slate-800 border-slate-700'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>{isMeasuring ? 'Measuring Active' : '📐 Measure Area'}</span>
        </button>

        {/* Cadastral Mesh Toggle */}
        <button
          onClick={() => {
            playClickSound();
            setShowCadastralMesh(!showCadastralMesh);
          }}
          className={`py-2 px-2.5 rounded-xl text-xs font-semibold shadow-xl transition-all border ${
            showCadastralMesh
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
              : 'bg-slate-900/90 text-slate-400 border-slate-800'
          }`}
          title="Toggle Cadastral Boundary Polygons"
        >
          Mesh: {showCadastralMesh ? 'ON' : 'OFF'}
        </button>

        {/* Layer Selector */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-1 flex items-center space-x-1 shadow-xl text-xs">
          <button
            onClick={() => {
              playClickSound();
              setActiveLayer('ownership');
            }}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              activeLayer === 'ownership' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Title
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveLayer('encumbrance');
            }}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              activeLayer === 'encumbrance' ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Lien Lock
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveLayer('zoning');
            }}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              activeLayer === 'zoning' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Zoning
          </button>
        </div>
      </div>

      {/* Quick Filter Badges Bar (Below main toolbar) */}
      <div className="absolute top-16 left-4 z-[400] flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
        <button
          onClick={() => {
            playClickSound();
            setFilterMode('ALL');
          }}
          className={`px-2.5 py-1 rounded-lg border transition-all ${
            filterMode === 'ALL'
              ? 'bg-slate-800 text-cyan-300 border-cyan-400 font-bold shadow-md'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          All ({parcels.length})
        </button>
        <button
          onClick={() => {
            playClickSound();
            setFilterMode('LIEN');
          }}
          className={`px-2.5 py-1 rounded-lg border transition-all ${
            filterMode === 'LIEN'
              ? 'bg-rose-950 text-rose-300 border-rose-500 font-bold shadow-md'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-rose-300'
          }`}
        >
          🔒 Lien Locked ({lienCount})
        </button>
        <button
          onClick={() => {
            playClickSound();
            setFilterMode('ENCROACH');
          }}
          className={`px-2.5 py-1 rounded-lg border transition-all ${
            filterMode === 'ENCROACH'
              ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold shadow-md'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-amber-300'
          }`}
        >
          🚨 AI Encroachments ({encroachmentCount})
        </button>
        <button
          onClick={() => {
            playClickSound();
            setFilterMode('CLEAR');
          }}
          className={`px-2.5 py-1 rounded-lg border transition-all ${
            filterMode === 'CLEAR'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold shadow-md'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-emerald-300'
          }`}
        >
          🛡️ Conclusive Titles ({conclusiveTitleCount})
        </button>
      </div>

      {/* Interactive Military / ISRO UAV Drone HUD Overlay */}
      {showDroneHUD && (
        <div className="absolute top-28 left-4 z-[410] w-80 bg-slate-950/95 border border-emerald-500/50 backdrop-blur-xl rounded-2xl p-4 shadow-[0_0_35px_rgba(16,185,129,0.3)] text-xs font-mono space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-extrabold text-white tracking-wide">DRONE-ISRO-VTOL-04</span>
            </div>
            <button
              onClick={() => setShowDroneHUD(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Camera Feed Simulator Window */}
          <div className="relative h-32 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <div className={`absolute inset-0 transition-all ${
              droneCameraFeed === 'thermal'
                ? 'bg-gradient-to-tr from-purple-900 via-rose-900 to-amber-700 opacity-80'
                : droneCameraFeed === 'ndvi'
                ? 'bg-gradient-to-tr from-emerald-900 via-green-800 to-yellow-900 opacity-85'
                : 'bg-slate-900'
            }`}></div>

            {/* Crosshair Graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-emerald-400/60">
              <Crosshair className="w-16 h-16 animate-pulse" />
            </div>

            {/* Live HUD Readouts on Camera */}
            <div className="absolute top-2 left-2 text-[10px] text-emerald-300 drop-shadow">
              ALT: {currentDrone.alt}m MSL | SPEED: {currentDrone.speedKmh} km/h
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] text-emerald-300 drop-shadow">
              HDG: {currentDrone.headingDeg}° | BATT: {currentDrone.battery}%
            </div>
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] text-cyan-300 uppercase font-bold border border-cyan-500/30">
              {droneCameraFeed} 4K
            </div>
          </div>

          {/* Camera Sensor Switchers */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              onClick={() => setDroneCameraFeed('optical')}
              className={`py-1 rounded-lg border font-bold transition-all ${
                droneCameraFeed === 'optical'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Optical 4K
            </button>
            <button
              onClick={() => setDroneCameraFeed('thermal')}
              className={`py-1 rounded-lg border font-bold transition-all ${
                droneCameraFeed === 'thermal'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              FLIR Thermal
            </button>
            <button
              onClick={() => setDroneCameraFeed('ndvi')}
              className={`py-1 rounded-lg border font-bold transition-all ${
                droneCameraFeed === 'ndvi'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              NDVI Agri
            </button>
          </div>

          {/* Drone Action Controls */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={handleDispatchDrone}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-lg transition-all"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Dispatch Drone to Selected Plot</span>
            </button>

            <button
              onClick={handleTakeDroneSnapshot}
              className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold py-1.5 px-3 rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition-all text-[11px]"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Cadastral Orthophoto</span>
            </button>
          </div>

          {/* Snapshot Confirmation Box */}
          {droneSnapshot && (
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-emerald-200">
              📸 Snapshot **{droneSnapshot.id}** captured at Lat {droneSnapshot.lat.toFixed(4)}, Lng {droneSnapshot.lng.toFixed(4)}. GeoTIFF tagged to ULPIN {droneSnapshot.targetUlpin}.
            </div>
          )}
        </div>
      )}

      {/* Live Measurement Floating Card */}
      {isMeasuring && (
        <div className="absolute top-28 right-4 z-[410] w-72 bg-slate-900/95 border border-amber-500/60 backdrop-blur-xl rounded-2xl p-4 shadow-2xl text-xs space-y-2 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-bold text-amber-300">
            <span className="flex items-center gap-1.5">
              <Ruler className="w-4 h-4" />
              <span>Cadastral Area Measure</span>
            </span>
            <button
              onClick={() => setMeasurePoints([])}
              className="text-[10px] text-slate-400 hover:text-white underline"
            >
              Reset
            </button>
          </div>
          <p className="text-[11px] text-slate-300">
            Click on boundary vertices on the map to calculate exact legal land area.
          </p>
          <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Vertices Placed:</span>
              <span className="text-white font-bold">{measurePoints.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Perimeter:</span>
              <span className="text-cyan-300 font-bold">{totalDistanceMeters.toFixed(1)} m ({(totalDistanceMeters * 3.28084).toFixed(0)} ft)</span>
            </div>
            {measurePoints.length >= 3 && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">Enclosed Area:</span>
                  <span className="text-amber-300 font-bold">{totalAreaSqFt.toLocaleString()} sq.ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Standard Acres:</span>
                  <span className="text-emerald-400 font-bold">{totalAreaAcres} Acres</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Leaflet Map Canvas */}
      <div className="flex-1 w-full h-[60vh] md:h-full relative">
        <MapContainer
          center={defaultCenter}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ cursor: isMeasuring ? 'crosshair' : 'grab' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://copernicus.eu/">Copernicus Sentinel-2</a> &copy; Esri World Satellite'
            url={getTileLayerUrl()}
          />
          <MapBoundsUpdater
            parcels={parcels}
            userGpsPos={userGpsPos}
            targetFlyTo={targetFlyTo}
          />
          <MapEventsHandler
            onMouseMove={setCursorCoords}
            onClickMap={handleMapClick}
            isMeasuring={isMeasuring}
          />

          {/* Render Cadastral Mesh & Polygons */}
          {showCadastralMesh && filteredParcels.map((parcel) => {
            const polygonCoords = parcel.coordinates.map((c) => [c[1], c[0]]);
            const style = getPolygonStyle(parcel);
            const isSelected = selectedParcel && selectedParcel.id === parcel.id;
            const isEncumbered = parcel.financial?.isEncumbered;

            return (
              <React.Fragment key={parcel.id}>
                <Polygon
                  positions={polygonCoords}
                  pathOptions={style}
                  eventHandlers={{
                    click: () => {
                      playClickSound();
                      setSelectedParcel(parcel);
                    }
                  }}
                >
                  <Tooltip sticky direction="top" opacity={0.95}>
                    <div className="text-xs p-1 font-sans">
                      <div className="font-bold text-cyan-300 font-mono">ULPIN: {parcel.ulpin}</div>
                      <div className="text-slate-200">{parcel.surveyNo} • {parcel.village}</div>
                      <div className="text-slate-400">Owner: {parcel.owner.name}</div>
                      <div className="text-[10px] text-amber-300 font-bold">
                        {isEncumbered ? `⚠️ Lien Locked: ${parcel.financial.bankLien}` : '✅ Conclusive Clear Title'}
                      </div>
                    </div>
                  </Tooltip>
                </Polygon>

                {/* Plot Center Badge Marker */}
                <Marker
                  position={parcel.center}
                  icon={createPlotBadgeIcon(parcel.surveyNo, isSelected, isEncumbered)}
                  eventHandlers={{
                    click: () => {
                      playClickSound();
                      setSelectedParcel(parcel);
                    }
                  }}
                />
              </React.Fragment>
            );
          })}

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
          <Marker
            position={[currentDrone.lat, currentDrone.lng]}
            icon={createDroneIcon(currentDrone.headingDeg)}
            eventHandlers={{
              click: () => {
                playRadarPing();
                setShowDroneHUD(true);
              }
            }}
          />

          {/* Measurement Polygon & Vertices */}
          {measurePoints.length > 1 && (
            <>
              <Polyline positions={measurePoints} pathOptions={{ color: '#f59e0b', weight: 3, dashArray: '6, 6' }} />
              {measurePoints.map((pt, idx) => (
                <Circle
                  key={idx}
                  center={pt}
                  radius={2}
                  pathOptions={{ fillColor: '#f59e0b', color: '#ffffff', weight: 2, fillOpacity: 1 }}
                />
              ))}
            </>
          )}
          {measurePoints.length >= 3 && (
            <Polygon
              positions={measurePoints}
              pathOptions={{ fillColor: '#f59e0b', fillOpacity: 0.25, color: '#f59e0b', weight: 2 }}
            />
          )}
        </MapContainer>

        {/* Real-time Telemetry Coordinates Bar */}
        <div className="absolute bottom-4 left-4 z-[400] flex flex-col gap-2">
          {surroundingScanData && (
            <div className="bg-slate-900/95 border border-cyan-500/50 backdrop-blur p-3 rounded-xl shadow-2xl text-xs space-y-1 max-w-sm">
              <div className="flex items-center justify-between font-bold text-cyan-300 border-b border-slate-800 pb-1">
                <span className="flex items-center gap-1.5 truncate">
                  <Radar className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                  <span>{surroundingScanData.userLocation?.areaName || 'Surrounding Audit'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">1000m Scan</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
                <div>Nearby: <span className="font-bold text-white">{surroundingScanData.scanSummary.totalParcelsFound} Plots</span></div>
                <div>Circle Rate: <span className="font-bold text-amber-300">₹{surroundingScanData.scanSummary.avgCircleRatePerSqFt}</span></div>
              </div>
            </div>
          )}

          <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs font-mono text-slate-300 flex items-center justify-between max-w-xs gap-3">
            <span className="flex items-center gap-1 text-cyan-400">
              <Compass className="w-3.5 h-3.5" />
              WGS84:
            </span>
            <span>{cursorCoords.lat}, {cursorCoords.lng}</span>
          </div>

          {userGpsPos && (
            <div className={`bg-slate-900/95 backdrop-blur border p-2.5 rounded-xl shadow-xl text-[10px] font-mono max-w-xs ${
              isLiveLocation ? 'border-emerald-500/50 text-emerald-200' : 'border-blue-500/40 text-blue-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`w-1.5 h-1.5 rounded-full ${isLiveLocation ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`}></span>
                <span>{isLiveLocation ? 'LIVE LOCATION TRACKING' : 'LAST KNOWN LOCATION'}</span>
              </div>
              <div className="mt-1 text-slate-400">
                Accuracy: {Math.round(userGpsPos.accuracy)}m
                {typeof userGpsPos.speed === 'number' && userGpsPos.speed >= 0 ? ` • Speed: ${(userGpsPos.speed * 3.6).toFixed(1)} km/h` : ''}
              </div>
            </div>
          )}

          {locationError && (
            <div className="bg-rose-950/95 border border-rose-500/50 text-rose-200 p-2.5 rounded-xl shadow-xl text-[10px] font-mono max-w-xs">
              {locationError}
            </div>
          )}
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
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {selectedParcel.surveyNo}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
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
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Circle Valuation</span>
                <span className="font-bold text-amber-300">₹{(selectedParcel.marketValue / 10000000).toFixed(2)} Cr</span>
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
                <div className="space-y-1.5 text-slate-300 pt-2 border-t border-rose-800/40 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank:</span>
                    <span className="font-semibold text-white">{selectedParcel.financial.bankLien}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mortgage Loan:</span>
                    <span className="font-bold text-amber-300">₹{selectedParcel.financial.loanAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Toggle Lien Lock Action Button */}
              <button
                onClick={() => {
                  playLockSound();
                  onToggleLien(selectedParcel);
                }}
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
                onClick={() => {
                  playClickSound();
                  onRunAIScan(selectedParcel);
                }}
                className="w-full mt-1 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/50 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1"
              >
                <span>Inspect AI Change Detection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Instant Encumbrance Certificate Generator Trigger */}
            <button
              onClick={() => {
                playSuccessChime();
                onGenerateEC(selectedParcel);
              }}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-950/60 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <FileText className="w-5 h-5" />
              <span>Generate Official Title Certificate</span>
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
                Click any cadastral plot on the interactive map or choose a region above to inspect Bhu-Aadhaar records.
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
