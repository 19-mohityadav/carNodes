import React, { useState, useEffect } from 'react';
import { VEHICLES } from './data/vehicles';
import Navbar from './components/Navbar';
import HeroShowroom from './components/HeroShowroom';
import TrustStrip from './components/TrustStrip';
import HowItWorks from './components/HowItWorks';
import VehiclePassportSection from './components/VehiclePassportSection';
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

  const getSanitizedRole = (r) => {
    const validRoles = ['buyer', 'seller', 'authority', 'admin'];
    const norm = String(r || '').toLowerCase();
    return validRoles.includes(norm) ? norm : 'buyer';
  };

  // Synchronize authenticated user from AuthContext
  useEffect(() => {
    if (isAuthenticated && user) {
      const sanitized = getSanitizedRole(role);
      const activeProf = {
        id: user.id,
        name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        phone: profile?.phone || user.user_metadata?.phone || '',
        role: sanitized,
        walletAddress: profile?.wallet_address || account || null,
      };
      setCurrentUser(activeProf);
      setDashboardRole(sanitized);
    } else if (!authLoading && !isAuthenticated) {
      setCurrentUser(null);
      setViewMode('landing');
    }
  }, [isAuthenticated, user, profile, role, account, authLoading]);

  // Auto-navigate on initial app load if already authenticated (not while modal is actively open)
  useEffect(() => {
    if (isAuthenticated && !authLoading && viewMode === 'landing' && !isLoginOpen) {
      const sanitized = getSanitizedRole(role);
      setDashboardRole(sanitized);
      setViewMode('dashboard');
    }
  }, [isAuthenticated, authLoading, role, viewMode, isLoginOpen]);

  const handleOpenAuth = (mode = 'signup') => {
    setAuthMode(mode);
    setIsLoginOpen(true);
  };

  const handleConnected = (provider, address, userObj) => {
    if (userObj) {
      const targetRole = getSanitizedRole(role || userObj.role);
      setCurrentUser({
        ...userObj,
        role: targetRole,
        walletAddress: address || userObj.walletAddress
      });
      setDashboardRole(targetRole);
      setViewMode('dashboard');
      setIsLoginOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
    setViewMode('landing');
  };

  const handleOpenDashboard = (targetRole = 'buyer') => {
    // Require authentication before accessing any dashboard
    if (!isAuthenticated) {
      setAuthMode('signin');
      setIsLoginOpen(true);
      return;
    }
    // RBAC: only allow access to own role (admin can access all)
    const userRole = getSanitizedRole(role);
    const isAdmin = userRole === 'admin';
    const normalizedTarget = getSanitizedRole(targetRole);
    if (!isAdmin && userRole !== normalizedTarget) {
      // Redirect to the user's own authorized dashboard
      setDashboardRole(userRole);
    } else {
      setDashboardRole(normalizedTarget);
    }
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


        {/* 5. HOW IT WORKS */}
        <HowItWorks />

        {/* 6. DIGITAL VEHICLE PASSPORT */}
        <VehiclePassportSection activeCar={VEHICLES[activeCarIndex]} />


        {/* 8. ESCROW SECTION */}
  

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
