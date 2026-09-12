import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Bookmark,
  GitCompare,
  FileBadge2,
  Bot,
  ShoppingBag,
  CreditCard,
  Bell,
  User,
  Car,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  BadgeDollarSign,
  ArrowRightLeft,
  Files,
  ListOrdered,
  BookOpenCheck,
  CheckSquare,
  AlertTriangle,
  History,
  CheckCircle,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function DashboardSidebar({
  activeRole,
  activeTab,
  onSelectTab,
  onLogout,
  isOpen,
  onClose
}) {
  // Define sidebar navigation items for each role per prompt requirements
  const buyerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Vehicles', icon: Compass },
    { id: 'saved', label: 'Saved Vehicles', icon: Bookmark, badge: '5' },
    { id: 'comparisons', label: 'My Comparisons', icon: GitCompare },
    { id: 'passport', label: 'Vehicle Passport', icon: FileBadge2 },
    { id: 'purchases', label: 'My Purchases', icon: ShoppingBag, badge: '1' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile & Wallet', icon: User },
  ];

  const sellerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-vehicles', label: 'My Vehicles', icon: Car, badge: '4' },
    { id: 'create-listing', label: 'Create Listing', icon: PlusCircle, isPrimary: true },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'buyer-requests', label: 'Buyer Requests', icon: MessageSquare, badge: '18' },
    { id: 'offers', label: 'Offers', icon: BadgeDollarSign, badge: '3' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'transfer', label: 'Ownership Transfer', icon: ArrowRightLeft, badge: '1' },
    { id: 'documents', label: 'Documents', icon: Files },
    { id: 'profile', label: 'Profile & Wallet', icon: User },
  ];

  const authorityNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', label: 'Verification Queue', icon: ListOrdered, badge: '24', badgeColor: 'bg-teal-700 text-white' },
    { id: 'registry', label: 'Vehicle Registry', icon: BookOpenCheck },
    { id: 'pending-approvals', label: 'Pending Approvals', icon: CheckSquare, badge: '7' },
    { id: 'transfers', label: 'Ownership Transfers', icon: ArrowRightLeft },
    { id: 'documents', label: 'Documents', icon: Files },
    { id: 'risk-alerts', label: 'Risk Alerts', icon: AlertTriangle, badge: '3', badgeColor: 'bg-rose-500 text-white' },
    { id: 'audit-trail', label: 'Audit Trail', icon: History },
    { id: 'verified-vehicles', label: 'Verified Vehicles', icon: CheckCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getNavItems = () => {
    switch (activeRole) {
      case 'seller':
        return sellerNav;
      case 'authority':
        return authorityNav;
      case 'buyer':
      default:
        return buyerNav;
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: carNodes Brand Logo */}
        <div>
          <div className="h-16 px-6 border-b border-slate-200/90 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/carnodes-logo.svg"
                alt="carNodes"
                className="h-9 w-auto"
              />
              
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          {/* Role Status Tag */}
          <div className="px-5 pt-4 pb-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                
                <span className="text-xs font-bold font-heading text-slate-900 capitalize">
                  {activeRole === 'authority' ? 'RTO Authority Node' : `${activeRole} Dashboard`}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-teal-500 ring-4 ring-teal-100" />
            </div>
          </div>

          {/* Nav List */}
          <nav className="px-3 py-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-230px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-teal-400'
                        : item.isAi
                        ? 'text-teal-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-100 text-slate-600')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-200/90 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-[11px] font-mono text-slate-500">CarNodes</span>
            </div>
            <button
              onClick={onLogout}
              className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
