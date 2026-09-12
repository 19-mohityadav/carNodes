import React, { useState, useEffect } from 'react';
import { VEHICLES } from './data/vehicles';
import Navbar from './components/Navbar';
import HeroShowroom from './components/HeroShowroom';
import TrustStrip from './components/TrustStrip';
import ComparisonMatrix from './components/ComparisonMatrix';
import HowItWorks from './components/HowItWorks';
import VehiclePassportSection from './components/VehiclePassportSection';
import EscrowSection from './components/EscrowSection';
import StakeholdersSection from './components/StakeholdersSection';
import ImpactVisionSection from './components/ImpactVisionSection';
import FooterCTA from './components/FooterCTA';
import LoginModal from './components/LoginModal';
import MarketplaceModal from './components/MarketplaceModal';
import ListVehicleModal from './components/ListVehicleModal';
import VerifyVinModal from './components/VerifyVinModal';
import DashboardContainer from './components/dashboard/DashboardContainer';
import { useAuth } from './context/AuthContext';
import { useWallet } from './context/WalletContext';

export default function App() {
  const { isAuthenticated, user, profile, role, signOut, loading: authLoading } = useAuth();
  const { account, isConnected } = useWallet();

  const [activeCarIndex, setActiveCarIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  // App View State: 'landing' | 'dashboard'
  const [viewMode, setViewMode] = useState('landing');
  const [dashboardRole, setDashboardRole] = useState('buyer');

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin'
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Synchronize authenticated user from AuthContext
  useEffect(() => {
    if (isAuthenticated && user) {
      const activeProf = {
        id: user.id,
        name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        phone: profile?.phone || user.user_metadata?.phone || '',
        role: role,
        walletAddress: profile?.wallet_address || account || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      };
      setCurrentUser(activeProf);
      setDashboardRole(role || 'buyer');
    } else if (!authLoading && !isAuthenticated) {
      setCurrentUser(null);
      setViewMode('landing');
    }
  }, [isAuthenticated, user, profile, role, account, authLoading]);

  // Auto-navigate to dashboard when user authenticates
  useEffect(() => {
    if (isAuthenticated && !authLoading && viewMode === 'landing') {
      setDashboardRole(role || 'buyer');
      setViewMode('dashboard');
      setIsLoginOpen(false);
    }
  }, [isAuthenticated, authLoading]); // eslint-disable-line

  const handleOpenAuth = (mode = 'signup') => {
    setAuthMode(mode);
    setIsLoginOpen(true);
  };

  const handleConnected = (provider, address, userObj) => {
    if (userObj) {
      setCurrentUser(userObj);
      setDashboardRole(userObj.role || 'buyer');
      setViewMode('dashboard');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
    setViewMode('landing');
  };

  const handleOpenDashboard = (targetRole = 'buyer') => {
    setDashboardRole(targetRole);
    setViewMode('dashboard');
  };

  // If in Dashboard View, render the unified 3-role Dashboard container
  if (viewMode === 'dashboard') {
    return (
      <DashboardContainer
        initialRole={dashboardRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onReturnToLanding={() => setViewMode('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2B2521] selection:bg-[#FF3B30] selection:text-white font-sans antialiased">

      {/* 1. NAVBAR — logo, 3 nav links, Role Dashboards, Login + Get Started or Active User Profile */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => handleOpenAuth('signin')}
        onOpenGetStarted={() => handleOpenAuth('signup')}
        onOpenMarketplace={() => setIsMarketplaceOpen(true)}
        onOpenDashboard={handleOpenDashboard}
      />

      <main>
        {/* 2. HERO SHOWROOM — 3D CSS orbit carousel */}
        <HeroShowroom
          vehicles={VEHICLES}
          activeIndex={activeCarIndex}
          onSelectVehicle={(idx) => setActiveCarIndex(idx)}
          onOpenMarketplace={() => setIsMarketplaceOpen(true)}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        />

        {/* 3. TRUST STRIP */}
        <TrustStrip />

        {/* 4. COMPARISON MATRIX */}
        <ComparisonMatrix />

        {/* 5. HOW IT WORKS */}
        <HowItWorks />

        {/* 6. DIGITAL VEHICLE PASSPORT */}
        <VehiclePassportSection activeCar={VEHICLES[activeCarIndex]} />


        {/* 8. ESCROW SECTION */}
        <EscrowSection onOpenWalletModal={() => handleOpenAuth('signin')} />

        {/* 9. STAKEHOLDERS */}
        <StakeholdersSection
          onOpenMarketplace={() => setIsMarketplaceOpen(true)}
          onOpenListModal={() => setIsListModalOpen(true)}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        />


        {/* 11. IMPACT & VISION */}
        <ImpactVisionSection />
      </main>

      {/* 12. FOOTER CTA */}
      <FooterCTA
        onOpenMarketplace={() => setIsMarketplaceOpen(true)}
        onOpenListModal={() => setIsListModalOpen(true)}
        onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
      />

      {/* MODALS */}
      <LoginModal
        key={authMode}
        isOpen={isLoginOpen}
        initialMode={authMode}
        onClose={() => setIsLoginOpen(false)}
        onConnected={handleConnected}
      />

      <MarketplaceModal
        isOpen={isMarketplaceOpen}
        onClose={() => setIsMarketplaceOpen(false)}
        vehicles={VEHICLES}
        onSelectVehicle={(car) => {
          const idx = VEHICLES.findIndex((v) => v.id === car.id);
          if (idx !== -1) setActiveCarIndex(idx);
        }}
        onOpenWalletModal={() => setIsLoginOpen(true)}
        walletConnected={isConnected}
      />

      <ListVehicleModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onOpenWalletModal={() => setIsLoginOpen(true)}
        walletConnected={isConnected}
      />

      <VerifyVinModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );
}
