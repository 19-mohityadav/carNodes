import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import BuyerDashboardView from './BuyerDashboardView';
import SellerDashboardView from './SellerDashboardView';
import AuthorityDashboardView from './AuthorityDashboardView';
import GlobalPassportModal from './GlobalPassportModal';
import { MOCK_BUYER_DATA, MOCK_SELLER_DATA, MOCK_AUTHORITY_DATA } from '../../data/dashboardData';
import { VEHICLES } from '../../data/vehicles';

export default function DashboardContainer({
  initialRole = 'buyer',
  currentUser,
  onLogout,
  onReturnToLanding
}) {
  const [activeRole, setActiveRole] = useState(currentUser?.role || initialRole);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [selectedPassportVehicle, setSelectedPassportVehicle] = useState(VEHICLES[0]);

  const handleSwitchRole = (newRole) => {
    setActiveRole(newRole);
    setActiveTab('dashboard');
  };

  const handleOpenPassport = (vehicle) => {
    setSelectedPassportVehicle(vehicle);
    setPassportModalOpen(true);
  };

  const getUserName = () => {
    if (currentUser?.name) return currentUser.name;
    switch (activeRole) {
      case 'seller':
        return MOCK_SELLER_DATA.name;
      case 'authority':
        return MOCK_AUTHORITY_DATA.name;
      case 'buyer':
      default:
        return MOCK_BUYER_DATA.name;
    }
  };

  const getWalletAddress = () => {
    if (currentUser?.walletAddress) return currentUser.walletAddress;
    switch (activeRole) {
      case 'seller':
        return MOCK_SELLER_DATA.walletAddress;
      case 'authority':
        return MOCK_AUTHORITY_DATA.walletAddress;
      case 'buyer':
      default:
        return MOCK_BUYER_DATA.walletAddress;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 font-sans flex overflow-x-hidden antialiased">
      {/* 1. LEFT SIDEBAR (Changes according to activeRole) */}
      <DashboardSidebar
        activeRole={activeRole}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onLogout={onLogout || onReturnToLanding}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <DashboardHeader
          activeRole={activeRole}
          onSwitchRole={handleSwitchRole}
          activeTab={activeTab}
          onReturnToLanding={onReturnToLanding}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userName={getUserName()}
          walletAddress={getWalletAddress()}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeRole === 'buyer' && (
            <BuyerDashboardView
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onOpenPassport={handleOpenPassport}
              onStartPurchase={(v) => {
                setSelectedPassportVehicle(v);
                setActiveTab('purchases');
              }}
            />
          )}

          {activeRole === 'seller' && (
            <SellerDashboardView
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onOpenPassport={handleOpenPassport}
            />
          )}

          {activeRole === 'authority' && (
            <AuthorityDashboardView
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onOpenPassport={handleOpenPassport}
            />
          )}
        </main>
      </div>

      {/* 3. GLOBAL DIGITAL VEHICLE PASSPORT MODAL */}
      <GlobalPassportModal
        isOpen={passportModalOpen}
        onClose={() => setPassportModalOpen(false)}
        vehicle={selectedPassportVehicle}
        role={activeRole}
        onApproveByAuthority={(v) => {
          alert(`Official Authority approval signed for ${v.shortName} on Ethereum Sepolia!`);
        }}
        onUpdateDocsBySeller={(v) => {
          alert(`Document evidence batch uploaded to IPFS for ${v.shortName}.`);
        }}
        onProceedPurchaseByBuyer={(v) => {
          setActiveTab('purchases');
        }}
      />
    </div>
  );
}
