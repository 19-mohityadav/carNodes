import React, { useState } from 'react';
import {
  Car,
  Bookmark,
  GitCompare,
  FileCheck,
  Bot,
  ShoppingBag,
  CreditCard,
  Bell,
  User,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
  Plus,
  Building2,
  Clock,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Wallet,
  Home,
  Check,
  Lock,
  HelpCircle
} from 'lucide-react';

import BuyerDashboardView from './BuyerDashboardView';
import SellerDashboardView from './SellerDashboardView';
import AuthorityDashboardView from './AuthorityDashboardView';
import GlobalPassportModal from './GlobalPassportModal';

export default function DashboardLayout({
  vehicles = [],
  initialRole = 'buyer',
  currentUser,
  onLogout,
  onReturnToHome
}) {
  // Active Role: 'buyer' | 'seller' | 'authority'
  const [role, setRole] = useState(initialRole);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Passport Modal State
  const [passportVehicle, setPassportVehicle] = useState(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  // Search input state in top bar
  const [globalSearch, setGlobalSearch] = useState('');

  // Define sidebar navigation items for each role
  const getSidebarNavItems = (currentRole) => {
    switch (currentRole) {
      case 'seller':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'my-vehicles', label: 'My Vehicles', icon: Car },
          { id: 'create', label: 'Create Listing', icon: Plus },
          { id: 'verification', label: 'Verification', icon: ShieldCheck },
          { id: 'ai-pricing', label: 'AI Pricing', icon: Bot },
          { id: 'requests', label: 'Buyer Requests & Offers', icon: ShoppingBag },
          { id: 'transfers', label: 'Ownership Transfer', icon: FileCheck },
        ];

      case 'authority':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'queue', label: 'Verification Queue', icon: Clock },
          { id: 'registry', label: 'Vehicle Registry', icon: Car },
          { id: 'transfers', label: 'Ownership Transfers', icon: FileCheck },
          { id: 'audit-trail', label: 'Audit Trail', icon: Lock },
          { id: 'risk-alerts', label: 'Risk Alerts', icon: AlertTriangle },
        ];

      case 'buyer':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'explore', label: 'Explore Vehicles', icon: Car },
          { id: 'saved', label: 'Saved Vehicles', icon: Bookmark },
          { id: 'comparisons', label: 'My Comparisons', icon: GitCompare },
          { id: 'ai-agent', label: 'AI Vehicle Agent', icon: Bot },
          { id: 'purchases', label: 'My Purchases', icon: ShoppingBag },
        ];
    }
  };

  const currentNavItems = getSidebarNavItems(role);

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setActiveTab('dashboard');
    setSidebarOpen(false);
  };

  const handleOpenPassport = (car) => {
    setPassportVehicle(car);
    setIsPassportOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2B2521] flex flex-col font-sans selection:bg-[#0D9488] selection:text-white antialiased">
      
      {/* ──────────────────────────────────────────────────────────
          TOP HEADER Across All 3 Dashboards
      ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E7E7] shadow-xs transition-all h-[72px] flex items-center">
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* LEFT: Logo / Mobile Toggle & Page Title / Breadcrumb */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-[#171C1C] hover:bg-[#F5F7F7] rounded-xl"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div
                onClick={onReturnToHome}
                className="flex items-center space-x-3 group cursor-pointer"
              >
                <img
                  src="/carnodes-logo.svg"
                  alt="carNodes"
                  className="h-10 w-auto transition-opacity group-hover:opacity-85"
                />
              </div>

              {/* Breadcrumb & Title for Authority Mode */}
              {role === 'authority' && (
                <div className="hidden sm:block border-l border-[#E2E7E7] pl-4 space-y-0.5">
                  <div className="text-[10px] font-mono font-semibold text-[#687272]">
                    carNodes / Authority
                  </div>
                  <h2 className="text-sm font-heading font-extrabold text-[#171C1C] leading-tight">
                    Authority Dashboard
                  </h2>
                </div>
              )}
            </div>

            {/* CENTER: ROLE SWITCHER PILL & SEARCH FIELD */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-[#F5F7F7] p-1.5 rounded-2xl border border-[#E2E7E7]">
                <button
                  onClick={() => handleRoleSwitch('buyer')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-extrabold uppercase transition-all cursor-pointer ${
                    role === 'buyer'
                      ? 'bg-white text-[#171C1C] shadow-xs border border-[#E2E7E7] ring-1 ring-[#159A9C]/30'
                      : 'text-[#687272] hover:text-[#171C1C]'
                  }`}
                >
                  Buyer
                </button>

                <button
                  onClick={() => handleRoleSwitch('seller')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-extrabold uppercase transition-all cursor-pointer ${
                    role === 'seller'
                      ? 'bg-white text-[#171C1C] shadow-xs border border-[#E2E7E7] ring-1 ring-[#159A9C]/30'
                      : 'text-[#687272] hover:text-[#171C1C]'
                  }`}
                >
                  Seller
                </button>

                <button
                  onClick={() => handleRoleSwitch('authority')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-extrabold uppercase transition-all cursor-pointer ${
                    role === 'authority'
                      ? 'bg-white text-[#171C1C] shadow-xs border border-[#E2E7E7] ring-1 ring-[#159A9C]/30'
                      : 'text-[#687272] hover:text-[#171C1C]'
                  }`}
                >
                  Authority / RTO
                </button>
              </div>

              {/* Large Search Field */}
              <div className="hidden xl:flex items-center relative w-80">
                <Search className="w-4 h-4 text-[#687272] absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder={role === 'authority' ? "Search Vehicle ID, Registration or Owner" : "Search make, model, or VIN..."}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E2E7E7] bg-[#F5F7F7] text-xs text-[#171C1C] focus:outline-none focus:border-[#159A9C] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* RIGHT HEADER: Notification, Help, MetaMask, Avatar */}
            <div className="flex items-center space-x-3">
              {/* Notification icon */}
              <button
                title="Notifications"
                className="relative p-2 rounded-xl border border-[#E2E7E7] text-[#687272] hover:text-[#171C1C] hover:bg-[#F5F7F7] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#159A9C] animate-pulse" />
              </button>

              {/* Help icon */}
              <button
                title="Help & Support"
                className="p-2 rounded-xl border border-[#E2E7E7] text-[#687272] hover:text-[#171C1C] hover:bg-[#F5F7F7] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* MetaMask Wallet Indicator */}
              <div className="hidden sm:flex items-center space-x-2 bg-[#123B3D] text-white px-3 py-1.5 rounded-xl text-xs font-mono border border-[#159A9C]/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#159A9C] shrink-0 animate-ping" />
                <span className="text-[#159A9C] font-bold">● Connected</span>
                <span className="text-zinc-300">0x71...9A2C</span>
              </div>

              {/* User Profile Avatar */}
              <div className="flex items-center space-x-2 pl-2 border-l border-[#E2E7E7]">
                <div className="w-8 h-8 rounded-xl bg-[#123B3D] text-[#159A9C] flex items-center justify-center font-extrabold text-xs font-mono shadow-xs">
                  {role === 'authority' ? 'A' : (currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S')}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-[#171C1C] leading-tight">
                    {role === 'authority' ? 'Authority' : (currentUser?.name || 'Subhojit Gope')}
                  </div>
                  <div className="text-[10px] font-mono text-[#687272] uppercase font-semibold">
                    {role === 'authority' ? 'RTO Verifier' : role}
                  </div>
                </div>
              </div>

              {/* Return to Home / Exit */}
              <button
                onClick={onReturnToHome}
                title="Return to Showroom"
                className="px-3 py-1.5 rounded-xl bg-[#F5F7F7] border border-[#E2E7E7] text-[#171C1C] text-xs font-mono font-bold hover:bg-[#E2E7E7] transition-colors cursor-pointer"
              >
                Exit
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────
          MAIN BODY LAYOUT: SIDEBAR + DASHBOARD CONTENT
      ────────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto flex">

        {/* LEFT SIDEBAR NAVIGATION (FIXED 250PX WIDE & STICKY ON DESKTOP) */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-[250px] bg-white border-r border-[#E2E7E7] pt-24 pb-8 px-4 flex flex-col justify-between transition-transform duration-300 lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:translate-x-0 lg:pt-6 lg:pb-6 overflow-y-auto shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="space-y-6">

            {/* Logo area inside sidebar top if role === 'authority' */}
            {role === 'authority' ? (
              <div className="space-y-3 pb-3 border-b border-[#E2E7E7]">
                <div className="flex items-center space-x-2.5">
                  <img src="/carnodes-logo.svg" alt="carNodes" className="h-8 w-auto" />
                </div>
                <div className="text-[11px] font-mono text-[#687272] tracking-tight">
                  Trusted Vehicle Network
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-[#F5F7F7] border border-[#E2E7E7]">
                <span className="text-[10px] font-mono uppercase text-[#687272] font-bold block">ROLE DASHBOARD</span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#159A9C]" />
                  <span className="text-xs font-heading font-extrabold uppercase text-[#171C1C]">{role} Mode</span>
                </div>
              </div>
            )}

            {/* Sidebar Navigation rendering for Authority vs Buyer/Seller */}
            {role === 'authority' ? (
              <div className="space-y-5 text-xs">
                {/* SECTION 1: MAIN */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#687272] px-2 mb-1">
                    MAIN
                  </div>
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: Home },
                    { id: 'queue', label: 'Verification Queue', icon: Clock },
                    { id: 'registry', label: 'Vehicle Registry', icon: Car },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#159A9C]/10 text-[#171C1C] font-bold shadow-xs'
                            : 'text-[#687272] hover:text-[#171C1C] hover:bg-[#F5F7F7]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#159A9C]' : 'text-[#687272]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <div className="w-1 h-4 bg-[#159A9C] rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                {/* SECTION 2: VERIFICATION */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#687272] px-2 mb-1">
                    VERIFICATION
                  </div>
                  {[
                    { id: 'doc-review', label: 'Document Review', icon: FileCheck },
                    { id: 'risk-alerts', label: 'Risk Alerts', icon: AlertTriangle },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#159A9C]/10 text-[#171C1C] font-bold shadow-xs'
                            : 'text-[#687272] hover:text-[#171C1C] hover:bg-[#F5F7F7]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#159A9C]' : 'text-[#687272]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <div className="w-1 h-4 bg-[#159A9C] rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                {/* SECTION 3: OWNERSHIP */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#687272] px-2 mb-1">
                    OWNERSHIP
                  </div>
                  {[
                    { id: 'transfers', label: 'Transfer Requests', icon: RefreshCw },
                    { id: 'records', label: 'Ownership Records', icon: ShieldCheck },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#159A9C]/10 text-[#171C1C] font-bold shadow-xs'
                            : 'text-[#687272] hover:text-[#171C1C] hover:bg-[#F5F7F7]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#159A9C]' : 'text-[#687272]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <div className="w-1 h-4 bg-[#159A9C] rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                {/* SECTION 4: RECORDS */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#687272] px-2 mb-1">
                    RECORDS
                  </div>
                  {[
                    { id: 'audit-trail', label: 'Audit Trail', icon: Lock },
                    { id: 'verified-vehicles', label: 'Verified Vehicles', icon: CheckCircle2 },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id === 'verified-vehicles' ? 'registry' : item.id); setSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#159A9C]/10 text-[#171C1C] font-bold shadow-xs'
                            : 'text-[#687272] hover:text-[#171C1C] hover:bg-[#F5F7F7]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#159A9C]' : 'text-[#687272]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <div className="w-1 h-4 bg-[#159A9C] rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                {/* SECTION 5: ACCOUNT */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#687272] px-2 mb-1">
                    ACCOUNT
                  </div>
                  {[
                    { id: 'profile', label: 'Authority Profile', icon: User },
                    { id: 'settings', label: 'Settings', icon: Building2 },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#159A9C]/10 text-[#171C1C] font-bold shadow-xs'
                            : 'text-[#687272] hover:text-[#171C1C] hover:bg-[#F5F7F7]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#159A9C]' : 'text-[#687272]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <div className="w-1 h-4 bg-[#159A9C] rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Buyer & Seller Nav Items */
              <nav className="space-y-1">
                {currentNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#171C1C] text-white shadow-xs font-bold'
                          : 'text-[#687272] hover:text-[#171C1C] hover:bg-[#F5F7F7]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#159A9C]' : 'text-[#687272]'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}

          </div>

          {/* Bottom of Sidebar: Authority Verification Badge */}
          {role === 'authority' ? (
            <div className="pt-4 border-t border-[#E2E7E7] space-y-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-[#159A9C] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#159A9C] animate-pulse" />
                <span>AUTHORITY VERIFIED</span>
              </div>
              <div className="text-[11px] text-[#687272] flex items-center justify-between">
                <span>Status:</span>
                <strong className="text-emerald-700 font-bold">● Active</strong>
              </div>
              <div className="text-[11px] text-[#687272] flex items-center justify-between">
                <span>Authority ID:</span>
                <strong className="text-[#171C1C] font-bold">AUTH-CN-00182</strong>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#E2E7E7] space-y-2 text-[11px] font-mono text-[#687272]">
              <div className="flex items-center justify-between">
                <span>Network:</span>
                <strong className="text-emerald-700 font-bold">Ethereum Sepolia</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Storage:</span>
                <strong className="text-[#171C1C] font-bold">IPFS Network</strong>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN DASHBOARD CONTENT VIEWPORT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* BUYER DASHBOARD */}
          {role === 'buyer' && (
            <BuyerDashboardView
              vehicles={vehicles}
              activeTab={activeTab}
              onOpenPassport={handleOpenPassport}
              onSelectVehicle={(car) => handleOpenPassport(car)}
            />
          )}

          {/* SELLER DASHBOARD */}
          {role === 'seller' && (
            <SellerDashboardView
              vehicles={vehicles}
              activeTab={activeTab}
              onOpenPassport={handleOpenPassport}
              onSelectVehicle={(car) => handleOpenPassport(car)}
            />
          )}

          {/* AUTHORITY DASHBOARD */}
          {role === 'authority' && (
            <AuthorityDashboardView
              vehicles={vehicles}
              activeTab={activeTab}
              onOpenPassport={handleOpenPassport}
              onSelectVehicle={(car) => handleOpenPassport(car)}
            />
          )}

        </main>
      </div>

      {/* GLOBAL DIGITAL VEHICLE PASSPORT MODAL */}
      <GlobalPassportModal
        vehicle={passportVehicle}
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        role={role}
        onAction={(car, actionType) => {
          alert(`Action [${actionType}] executed for vehicle ${car.id} in ${role} mode.`);
        }}
      />

    </div>
  );
}
