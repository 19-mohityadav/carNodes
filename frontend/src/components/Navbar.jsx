import React, { useState } from 'react';
import { Menu, X, User, LogOut, ShieldCheck, Car, Building2 } from 'lucide-react';

export default function Navbar({
  currentUser,
  onLogout,
  onOpenLogin,
  onOpenGetStarted,
  onOpenMarketplace,
  onOpenDashboard
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Marketplace', href: '#marketplace', action: onOpenMarketplace },
    { name: 'How It Works', href: '#how-it-works', action: null },
    { name: 'About', href: '#tech-stack', action: null },
  ];

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'seller':
        return 'bg-slate-100 text-[#3D5066] border-slate-300';
      case 'authority':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'buyer':
      default:
        return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-zinc-200/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* LEFT: carNodes Brand Logo */}
          <a href="#hero" className="flex items-center group shrink-0">
            <img
              src="/carnodes-logo.svg"
              alt="carNodes"
              className="h-14 w-auto transition-opacity duration-200 group-hover:opacity-85"
            />
          </a>

          {/* CENTER: Navigation Links + Role Dashboards Dropdown */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={link.action ? (e) => { e.preventDefault(); link.action(); } : undefined}
                className="text-sm font-semibold text-[#3D5066] hover:text-[#0D9488] transition-colors duration-200 relative group tracking-wide"
              >
                {link.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[#0D9488] transition-all duration-200 group-hover:w-full rounded-full" />
              </a>
            ))}

            {/* Role Dashboards Nav Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
                className="text-sm font-semibold text-[#0D9488] hover:text-teal-800 transition-colors flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-teal-50/80 border border-teal-200/80 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse mr-1" />
                <span>Role Dashboards</span>
                <span className="text-[10px] opacity-70">▾</span>
              </button>

              {dashboardDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-100">
                    Open Dedicated Dashboard
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        setDashboardDropdownOpen(false);
                        if (onOpenDashboard) onOpenDashboard('buyer');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs text-slate-800 font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <Car className="w-4 h-4 text-teal-600" />
                      <span>1. Buyer Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setDashboardDropdownOpen(false);
                        if (onOpenDashboard) onOpenDashboard('seller');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs text-slate-800 font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-slate-700" />
                      <span>2. Seller Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setDashboardDropdownOpen(false);
                        if (onOpenDashboard) onOpenDashboard('authority');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs text-slate-800 font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>3. Authority / RTO Dashboard</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT: Login + Get Started OR Active Logged In User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3 bg-white p-1.5 pl-3 pr-2 rounded-2xl border border-zinc-200 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#2B2521] text-white flex items-center justify-center font-bold text-xs font-mono">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold font-heading text-[#111111]">{currentUser.name}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getRoleBadgeStyle(currentUser.role)}`}>
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenDashboard && onOpenDashboard(currentUser.role)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Dashboard →
                </button>

                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-zinc-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Login Button */}
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenLogin && onOpenLogin('signin')}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#3D5066] border border-[#3D5066]/30 hover:border-[#0D9488] hover:text-[#0D9488] bg-white transition-all duration-200 cursor-pointer"
                >
                  Login
                </button>

                {/* Get Started (Primary CTA - Sign Up Modal) */}
                <button
                  id="nav-get-started-btn"
                  onClick={() => onOpenGetStarted ? onOpenGetStarted('signup') : onOpenLogin('signup')}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#3D5066] hover:bg-[#0D9488] transition-all duration-200 shadow-md hover:shadow-lg tracking-wide cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            {currentUser ? (
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded border ${getRoleBadgeStyle(currentUser.role)}`}>
                {currentUser.name.split(' ')[0]} ({currentUser.role})
              </span>
            ) : (
              <button
                onClick={() => onOpenLogin && onOpenLogin('signin')}
                className="text-sm font-semibold text-[#3D5066] border border-[#3D5066]/30 px-3 py-1.5 rounded-lg"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#3D5066] hover:text-[#B89B5E]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>


      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF7] border-b border-zinc-200 px-6 pt-2 pb-6 space-y-1 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (link.action) { e.preventDefault(); link.action(); }
              }}
              className="block py-3 text-sm font-semibold text-[#3D5066] hover:text-[#B89B5E] border-b border-zinc-100 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4">
            <button
              onClick={() => { setMobileMenuOpen(false); if (onOpenGetStarted) onOpenGetStarted('signup'); }}
              className="w-full py-3 rounded-xl bg-[#3D5066] text-white font-bold text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
