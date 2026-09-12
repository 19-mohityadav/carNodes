import React, { useState } from 'react';
import {
  Search,
  Bell,
  Wallet,
  User,
  Check,
  ChevronDown,
  Layers,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Car,
  X,
  ExternalLink
} from 'lucide-react';

export default function DashboardHeader({
  activeRole,
  onSwitchRole,
  activeTab,
  onReturnToLanding,
  onToggleSidebar,
  userName = 'User',
  walletAddress = '0x71C7...976F'
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'Ownership Transfer Request', desc: 'Arjun Mehta accepted offer on 2022 Toyota Camry / R8', time: '10m ago', unread: true },
    { id: 2, title: 'Oracle Verification Verified', desc: 'RTO Node #409 signed Digital Vehicle Passport for CN-48291', time: '1h ago', unread: true },
    { id: 3, title: 'Smart Escrow Locked', desc: 'Funds deposited in Ethereum Sepolia contract 0x89Fa...31Bc', time: '3h ago', unread: false }
  ];

  const roles = [
    { id: 'buyer', name: 'Buyer Dashboard', icon: Car, desc: 'Discover & purchase verified vehicles safely' },
    { id: 'seller', name: 'Seller Dashboard', icon: Building2, desc: 'Mint passports & manage verified vehicle sales' },
    { id: 'authority', name: 'Authority / RTO Dashboard', icon: ShieldCheck, desc: 'Audit documents & sign ownership approvals' }
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'seller':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'authority':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'buyer':
      default:
        return 'bg-teal-50 text-teal-800 border-teal-300';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Home / Return button */}
        <button
          onClick={onReturnToLanding}
          className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Landing Page</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

        {/* Role Pill Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer ${getRoleBadge(activeRole)}`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="capitalize">{activeRole} Portal</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Role Switcher Dropdown */}
          {roleSwitcherOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-100">
                Switch Role Dashboard
              </div>
              <div className="space-y-1 mt-1">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isCurrent = activeRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        onSwitchRole(r.id);
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start space-x-2.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isCurrent ? 'text-teal-400' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold font-heading">{r.name}</div>
                        <div className={`text-[10px] leading-tight mt-0.5 ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`}>
                          {r.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Right Actions: Notifications, Wallet, Profile */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        
        {/* Subtle MetaMask Wallet Indicator */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 font-bold">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">Sepolia</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold font-heading text-slate-900">Notifications</span>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">2 New</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl hover:bg-slate-50 text-xs transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono">
            {userName.charAt(0)}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-slate-900 block leading-tight">{userName}</span>
            <span className="text-[10px] font-mono text-slate-400 capitalize">{activeRole}</span>
          </div>
        </div>

      </div>
    </header>
  );
}
