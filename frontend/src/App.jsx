import React, { useState } from 'react';
import { VEHICLES } from './data/vehicles';
import Navbar from './components/Navbar';
import HeroShowroom from './components/HeroShowroom';
import TrustStrip from './components/TrustStrip';
import ComparisonMatrix from './components/ComparisonMatrix';
import HowItWorks from './components/HowItWorks';
import VehiclePassportSection from './components/VehiclePassportSection';
import AiAssistantSection from './components/AiAssistantSection';
import EscrowSection from './components/EscrowSection';
import StakeholdersSection from './components/StakeholdersSection';
import TechStackSection from './components/TechStackSection';
import ImpactVisionSection from './components/ImpactVisionSection';
import FooterCTA from './components/FooterCTA';

import LoginModal from './components/LoginModal';
import MarketplaceModal from './components/MarketplaceModal';
import ListVehicleModal from './components/ListVehicleModal';
import VerifyVinModal from './components/VerifyVinModal';
import DashboardLayout from './components/dashboard/DashboardLayout';

export default function App() {
  const [activeCarIndex, setActiveCarIndex] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // View States (Landing vs Dashboards)
  const [isDashboardView, setIsDashboardView] = useState(false);
  const [dashboardRole, setDashboardRole] = useState('buyer');

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin'
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const handleOpenAuth = (mode = 'signup') => {
    setAuthMode(mode);
    setIsLoginOpen(true);
  };

  const handleOpenDashboard = (role = 'buyer') => {
    setDashboardRole(role);
    setIsDashboardView(true);
  };

  const handleConnected = (provider, address, userObj) => {
    setWalletConnected(true);
    setWalletAddress(address);
    if (userObj) {
      setCurrentUser(userObj);
      setDashboardRole(userObj.role || 'buyer');
      setIsDashboardView(true); // Open dashboard automatically upon login/signup!
    }
  };

  const handleLogout = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setCurrentUser(null);
    setIsDashboardView(false);
  };

  if (isDashboardView) {
    return (
      <DashboardLayout
        vehicles={VEHICLES}
        initialRole={currentUser?.role || dashboardRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onReturnToHome={() => setIsDashboardView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2B2521] selection:bg-[#FF3B30] selection:text-white font-sans antialiased">

      {/* 1. NAVBAR — logo, 3 nav links, Role Dashboards, Login + Get Started */}
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

        {/* 3. TRUST STRIP — 4 cards (AI Assisted removed) */}
        <TrustStrip />

        {/* 4. COMPARISON MATRIX */}
        <ComparisonMatrix />

        {/* 5. HOW IT WORKS */}
        <HowItWorks />

        {/* 6. DIGITAL VEHICLE PASSPORT */}
        <VehiclePassportSection activeCar={VEHICLES[activeCarIndex]} />

        {/* 7. AI AGENT ASSISTANT */}
        <AiAssistantSection
          onOpenMarketplace={() => setIsMarketplaceOpen(true)}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        />

        {/* 8. ESCROW SECTION */}
        <EscrowSection onOpenWalletModal={() => handleOpenAuth('signin')} />

        {/* 9. STAKEHOLDERS */}
        <StakeholdersSection
          onOpenMarketplace={() => setIsMarketplaceOpen(true)}
          onOpenListModal={() => setIsListModalOpen(true)}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        />

        {/* 10. TECH STACK */}
        <TechStackSection />

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
        walletConnected={walletConnected}
      />

      <ListVehicleModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onOpenWalletModal={() => setIsLoginOpen(true)}
        walletConnected={walletConnected}
      />

      <VerifyVinModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );
}
