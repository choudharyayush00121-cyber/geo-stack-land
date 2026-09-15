import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GISMap from './components/GISMap';
import DPIGateway from './components/DPIGateway';
import ECVerification from './components/ECVerification';
import OCRVerification from './components/OCRVerification';
import RiskMitigation from './components/RiskMitigation';
import LandAcquisition from './components/LandAcquisition';
import FeasibilityMatrix from './components/FeasibilityMatrix';
import AIEncroachment from './components/AIEncroachment';
import TaxCalculator from './components/TaxCalculator';
import DashboardStats from './components/DashboardStats';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import ParcelInspectorModal from './components/ParcelInspectorModal';
import Toast from './components/Toast';
import axios from 'axios';
import AdminOptionsManager from './components/AdminOptionsManager';
import { navigationGroups } from './components/Sidebar';
import UserTrackingDashboard from './components/UserTrackingDashboard';
import ResearchReferences from './components/ResearchReferences';
import DigitalTwin3DViewer from './components/DigitalTwin3DViewer';
import ProblemSolution from './components/ProblemSolution';
import AgentOrchestrationCockpit from './components/AgentOrchestrationCockpit';

export default function App() {
  const [activeView, setActiveView] = useState('map');
  const [userRole, setUserRole] = useState('ADMIN');
  const [disabledForUsers, setDisabledForUsers] = useState(['risk', 'dpi', 'feasibility']);
  const [currentUser, setCurrentUser] = useState({
    id: 'USER-001',
    name: 'Ayush Choudhary',
    email: 'ayush@geoland.gov.in',
    role: 'ADMIN',
    organization: 'Ministry of Housing & Land Governance'
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [inspectingParcel, setInspectingParcel] = useState(null);
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-01',
      title: 'VTOL Drone Telemetry Sync',
      message: 'Drone DRONE-ISRO-VTOL-04 locked position over ULPIN 14829304812901.',
      time: 'Just Now',
      type: 'DRONE',
      read: false
    },
    {
      id: 'NOTIF-02',
      title: 'Encumbrance Certificate Issued',
      message: 'Form 15 EC verification hash generated for ULPIN 14829304812902.',
      time: '12m ago',
      type: 'EC',
      read: false
    },
    {
      id: 'NOTIF-03',
      title: 'State Bank Mortgage Lien Lock',
      message: 'Lien lock applied under DPI multi-agency protocol.',
      time: '1h ago',
      type: 'LIEN_LOCK',
      read: true
    }
  ]);
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [dpiStatus, setDpiStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Satellite API Key & Telemetry State
  const [satelliteApiKey, setSatelliteApiKey] = useState('sh-live-7fa9812903bc184a20f92b');

  // Real-time telemetry & SSE state
  const [droneTelemetry, setDroneTelemetry] = useState(null);
  const [liveSseEvent, setLiveSseEvent] = useState(null);

  // Fetch all GIS parcels from backend
  const fetchParcels = async (searchTerm = '') => {
    try {
      const res = await axios.get('/api/parcels', {
        params: { search: searchTerm }
      });
      if (res.data.success) {
        setParcels(res.data.parcels);
        if (!selectedParcel && res.data.parcels.length > 0) {
          setSelectedParcel(res.data.parcels[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching parcels:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch DPI Gateway live status
  const fetchDPIStatus = async () => {
    try {
      const res = await axios.get('/api/dpi/gateway-status');
      if (res.data.success) {
        setDpiStatus(res.data.dpiGateway);
      }
    } catch (err) {
      console.error('Error fetching DPI status:', err);
    }
  };

  useEffect(() => {
    fetchParcels();
    fetchDPIStatus();

    // Establish Real-time Server-Sent Events (SSE) Stream
    const eventSource = new EventSource('/api/realtime/stream');

    eventSource.addEventListener('DRONE_TELEMETRY', (e) => {
      try {
        const data = JSON.parse(e.data);
        setDroneTelemetry(data);
      } catch (err) {
        console.error('Error parsing drone telemetry:', err);
      }
    });

    eventSource.addEventListener('LIEN_STATUS_CHANGED', (e) => {
      try {
        const data = JSON.parse(e.data);
        setLiveSseEvent(data);
        fetchParcels();
        fetchDPIStatus();
        setTimeout(() => setLiveSseEvent(null), 5000);
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSearch = (query) => {
    fetchParcels(query);
  };

  const handleGenerateEC = (parcel) => {
    setSelectedParcel(parcel);
    setActiveView('ec');
  };

  const handleToggleLien = async (parcel) => {
    const nextAction = parcel.financial.isEncumbered ? 'UNLOCK' : 'LOCK';
    try {
      const res = await axios.post('/api/parcels/toggle-lien', {
        ulpin: parcel.ulpin,
        bankName: 'State Bank of India (DPI Gateway)',
        loanAmount: 4500000,
        action: nextAction
      });
      if (res.data.success) {
        fetchParcels();
        fetchDPIStatus();
        setSelectedParcel(res.data.parcel);
      }
    } catch (err) {
      console.error('Error toggling lien:', err);
    }
  };

  const handleRunAIScan = (parcel) => {
    setSelectedParcel(parcel);
    setActiveView('ai');
  };

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.role) {
      setUserRole(userData.role);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole('CITIZEN');
  };

  const handleInspectParcel = (parcel) => {
    setSelectedParcel(parcel);
    setInspectingParcel(parcel);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Top Navigation Header */}
      <Header
        onSearch={handleSearch}
        activeView={activeView}
        setActiveView={setActiveView}
        dpiStatus={dpiStatus}
        userRole={userRole}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        notifications={notifications}
        onClearNotifications={() => setNotifications([])}
        onNotificationClick={(n) => {
          showToast(`Clicked: ${n.title}`, 'info');
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          userRole={userRole}
          setUserRole={setUserRole}
          disabledForUsers={disabledForUsers}
        />

        {/* Main View Area */}
        <main className="flex-1 overflow-y-auto relative bg-slate-950 flex flex-col justify-between">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 py-24">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-mono text-cyan-400 font-bold">Initializing GeoLand Unified Architecture...</p>
            </div>
          ) : (
            <>
              <div className="flex-1">
                {activeView === 'map' && (
                  <GISMap
                    parcels={parcels}
                    selectedParcel={selectedParcel}
                    setSelectedParcel={(p) => {
                      setSelectedParcel(p);
                      setInspectingParcel(p);
                    }}
                    onGenerateEC={handleGenerateEC}
                    onToggleLien={(p) => {
                      handleToggleLien(p);
                      showToast(`Mortgage Lien updated for ULPIN ${p.ulpin}`, 'warning');
                    }}
                    onRunAIScan={handleRunAIScan}
                    droneTelemetry={droneTelemetry}
                    liveSseEvent={liveSseEvent}
                    satelliteApiKey={satelliteApiKey}
                  />
                )}

                {activeView === 'twin-3d' && (
                  <DigitalTwin3DViewer
                    parcels={parcels}
                    selectedParcel={selectedParcel}
                    onSelectParcel={(p) => {
                      setSelectedParcel(p);
                      setInspectingParcel(p);
                    }}
                  />
                )}

                {activeView === 'acquisition' && (
                  <LandAcquisition parcels={parcels} />
                )}

                {activeView === 'feasibility' && (
                  <FeasibilityMatrix />
                )}

                {activeView === 'agent-cockpit' && (
                  <AgentOrchestrationCockpit
                    parcels={parcels}
                    selectedParcel={selectedParcel}
                    showToast={showToast}
                  />
                )}

                {activeView === 'ocr' && (
                  <OCRVerification parcels={parcels} />
                )}

                {activeView === 'risk' && (
                  <RiskMitigation />
                )}

                {activeView === 'dpi' && (
                  <DPIGateway dpiStatus={dpiStatus} fetchDPIStatus={fetchDPIStatus} />
                )}

                {activeView === 'ec' && (
                  <ECVerification
                    selectedParcel={selectedParcel}
                    parcels={parcels}
                    onSelectParcel={setSelectedParcel}
                  />
                )}

                {activeView === 'ai' && (
                  <AIEncroachment parcels={parcels} selectedParcel={selectedParcel} />
                )}

                {activeView === 'tax' && (
                  <TaxCalculator selectedParcel={selectedParcel} />
                )}

                {activeView === 'dashboard' && (
                  <DashboardStats dpiStatus={dpiStatus} parcels={parcels} />
                )}

                {activeView === 'research' && (
                  <ResearchReferences />
                )}

                {activeView === 'solution' && (
                  <ProblemSolution />
                )}

                {activeView === 'admin-options' && userRole === 'ADMIN' && (
                  <AdminOptionsManager 
                    disabledForUsers={disabledForUsers} 
                    setDisabledForUsers={setDisabledForUsers} 
                    allOptions={navigationGroups.flatMap(g => g.items)} 
                  />
                )}

                {activeView === 'user-tracking' && userRole === 'ADMIN' && (
                  <UserTrackingDashboard currentUser={currentUser} />
                )}
              </div>

              {/* Global Footer with Credit */}
              <Footer setActiveView={setActiveView} />
            </>
          )}
        </main>
      </div>

      {/* User Auth Login & Create Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => {
          handleAuthSuccess(u);
          showToast(`Welcome ${u.name}! Authenticated as ${u.role}.`, 'success');
        }}
      />

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        parcels={parcels}
        onSelectParcel={(p) => {
          setSelectedParcel(p);
          setInspectingParcel(p);
        }}
        setActiveView={setActiveView}
        showToast={showToast}
      />

      {/* 360 Degree Parcel Inspector Drawer */}
      <ParcelInspectorModal
        parcel={inspectingParcel}
        onClose={() => setInspectingParcel(null)}
        onGenerateEC={(p) => {
          handleGenerateEC(p);
          showToast(`Generated Encumbrance Certificate for ULPIN ${p.ulpin}`, 'success');
        }}
        onToggleLien={(p) => {
          handleToggleLien(p);
          showToast(`Lien status updated for ULPIN ${p.ulpin}`, 'warning');
        }}
        onRunAIScan={handleRunAIScan}
        showToast={showToast}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
