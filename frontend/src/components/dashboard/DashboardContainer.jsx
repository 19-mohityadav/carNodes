import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import BuyerDashboardView from './BuyerDashboardView';
import SellerDashboardView from './SellerDashboardView';
import AuthorityDashboardView from './AuthorityDashboardView';
import GlobalPassportModal from './GlobalPassportModal';
import { VEHICLES } from '../../data/vehicles';
import { useAuth } from '../../context/AuthContext';
import { Lock, ShieldX, ArrowLeft, LogIn } from 'lucide-react';

// --- Guard Screens ---

function AuthRequiredScreen({ onSignIn, onReturnHome }) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-6">
      <div className="text-center max-w-sm space-y-5">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-2xl">
          <Lock className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Authentication Required</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Please sign in to access your workspace. Your carNodes dashboard requires a verified account.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSignIn}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#3D5066] hover:bg-teal-700 text-white text-sm font-bold transition-all shadow-md cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to carNodes</span>
          </button>
          <button
            onClick={onReturnHome}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AccessDeniedScreen({ currentRole, requiredRole, onGoToOwnDashboard, onReturnHome }) {
  const roleLabel = (r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : 'Unknown';
  const roleColor = {
    buyer: 'text-teal-700 bg-teal-50 border-teal-200',
    seller: 'text-slate-700 bg-slate-100 border-slate-300',
    authority: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  };
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-6">
      <div className="text-center max-w-md space-y-5">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-600 text-white flex items-center justify-center shadow-2xl">
          <ShieldX className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Insufficient Clearance</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Your account is registered as{' '}
            <span className={`font-bold px-2 py-0.5 rounded border text-xs uppercase font-mono ${roleColor[currentRole] || 'bg-zinc-100 text-zinc-700 border-zinc-300'}`}>
              {roleLabel(currentRole)}
            </span>{' '}
            and does not have clearance for the{' '}
            <span className={`font-bold px-2 py-0.5 rounded border text-xs uppercase font-mono ${roleColor[requiredRole] || 'bg-zinc-100 text-zinc-700 border-zinc-300'}`}>
              {roleLabel(requiredRole)}
            </span>{' '}
            workspace.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-800">
          <p className="font-bold mb-1">Why am I seeing this?</p>
          <p>Each workspace is restricted to its registered role. Authority accounts require RTO clearance provisioned by an admin. If you believe this is an error, please contact support.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoToOwnDashboard}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#3D5066] hover:bg-teal-700 text-white text-sm font-bold transition-all shadow-md cursor-pointer"
          >
            <span>Go to My {roleLabel(currentRole)} Workspace</span>
          </button>
          <button
            onClick={onReturnHome}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Dashboard Container ---

export default function DashboardContainer({
  initialRole = 'buyer',
  currentUser,
  onLogout,
  onReturnToLanding,
  onOpenLogin,
}) {
  const { isAuthenticated, role: authRole, isAdmin, signOut } = useAuth();

  const sanitizeRole = (r) => {
    const valid = ['buyer', 'seller', 'authority'];
    const norm = String(r || '').toLowerCase();
    return valid.includes(norm) ? norm : 'buyer';
  };

  const normalizedAuthRole = sanitizeRole(authRole || currentUser?.role);

  // The role for THIS workspace view — always sanitized
  const [activeRole, setActiveRole] = useState(() => {
    return sanitizeRole(currentUser?.role || initialRole || authRole);
  });

  // Keep activeRole in sync with authRole for non-admins
  useEffect(() => {
    if (!isAdmin && normalizedAuthRole) {
      setActiveRole(normalizedAuthRole);
    }
  }, [normalizedAuthRole, isAdmin]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [selectedPassportVehicle, setSelectedPassportVehicle] = useState(VEHICLES[0]);

  // --- Guard 1: Not Authenticated ---
  if (!isAuthenticated) {
    return (
      <AuthRequiredScreen
        onSignIn={() => {
          if (onOpenLogin) onOpenLogin();
          else if (onReturnToLanding) onReturnToLanding();
        }}
        onReturnHome={onReturnToLanding}
      />
    );
  }

  // --- Guard 2: Wrong Role (RBAC) ---
  const normalizedActiveRole = sanitizeRole(activeRole);
  if (!isAdmin && normalizedAuthRole !== normalizedActiveRole) {
    return (
      <AccessDeniedScreen
        currentRole={normalizedAuthRole}
        requiredRole={normalizedActiveRole}
        onGoToOwnDashboard={() => setActiveRole(normalizedAuthRole)}
        onReturnHome={onReturnToLanding}
      />
    );
  }

  const handleSwitchRole = (newRole) => {
    // Only admin can switch roles freely
    if (isAdmin) {
      setActiveRole(newRole);
      setActiveTab('dashboard');
    }
  };

  const handleOpenPassport = (vehicle) => {
    setSelectedPassportVehicle(vehicle);
    setPassportModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    if (onLogout) onLogout();
  };

  const getUserName = () => currentUser?.name || 'User';

  const [currentWalletAddress, setCurrentWalletAddress] = useState(currentUser?.walletAddress || null);

  useEffect(() => {
    setCurrentWalletAddress(currentUser?.walletAddress || null);
  }, [currentUser?.walletAddress]);

  const handleWalletDisconnected = () => {
    setCurrentWalletAddress(null);
    if (currentUser) {
      currentUser.walletAddress = null;
    }
  };

  const handleWalletConnected = (newAddr) => {
    setCurrentWalletAddress(newAddr);
    if (currentUser) {
      currentUser.walletAddress = newAddr;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 font-sans flex overflow-x-hidden antialiased">
      {/* 1. LEFT SIDEBAR */}
      <DashboardSidebar
        activeRole={activeRole}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
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
          onLogout={handleLogout}
          userName={getUserName()}
          walletAddress={currentWalletAddress || 'Not connected'}
          onDisconnectWallet={handleWalletDisconnected}
          onConnectWallet={handleWalletConnected}
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
