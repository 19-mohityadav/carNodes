import React, { useState } from 'react';
import { Menu, X, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  currentUser,
  onLogout,
  onOpenLogin,
  onOpenGetStarted,
  onOpenMarketplace,
  onOpenDashboard
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = useAuth();

  // Active user resolution: prefer auth context if authenticated
  const activeUser = currentUser || (auth.isAuthenticated ? {
    name: auth.profile?.name || auth.user?.user_metadata?.name || auth.user?.email?.split('@')[0] || 'User',
    email: auth.user?.email,
    role: auth.role,
    walletAddress: auth.profile?.wallet_address || '',
  } : null);

  const navLinks = [
    { name: 'Marketplace', href: '#marketplace', action: onOpenMarketplace },
    { name: 'Vehicle Passports', href: '#passport-section', action: null },
    { name: 'How It Works', href: '#how-it-works', action: null },
    { name: 'Escrow', href: '#escrow', action: null },
    { name: 'About', href: '#tech-stack', action: null },
  ];

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'seller':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'authority':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'admin':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'buyer':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const handleLogoutClick = async () => {
    await auth.signOut();
    if (onLogout) onLogout();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* LEFT: carNodes Brand Logo */}
          <a
            href="#hero"
            className="flex items-center group shrink-0 focus:outline-none"
            aria-label="carNodes Home"
          >
            <img
              src="/car.svg"
              alt="carNodes"
              className="h-10 w-auto transition-transform duration-200 group-hover:scale-102"
            />
          </a>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={link.action ? (e) => { e.preventDefault(); link.action(); } : undefined}
                className="px-3.5 py-1.5 rounded-full text-[13.5px] font-medium text-[#5E5750] hover:text-[#111111] hover:bg-black/[0.04] transition-all duration-200 tracking-normal cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* RIGHT: Login + Sign Up OR Active Logged In User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {activeUser ? (
              <div className="flex items-center space-x-3 bg-white/90 p-1.5 pl-3 pr-2 rounded-full border border-zinc-200 shadow-xs backdrop-blur-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#2B2521] text-white flex items-center justify-center font-bold text-xs font-mono">
                    {activeUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-[#111111] max-w-[110px] truncate">{activeUser.name}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(activeUser.role)}`}>
                        {activeUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenDashboard && onOpenDashboard(activeUser.role)}
                  className="px-3.5 py-1.5 rounded-full bg-[#111111] hover:bg-[#FF3B30] text-white font-semibold text-xs transition-all duration-200 cursor-pointer shadow-xs"
                >
                  Dashboard →
                </button>

                <button
                  onClick={handleLogoutClick}
                  title="Logout"
                  className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Login Button */}
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenLogin && onOpenLogin('signin')}
                  className="px-4 py-2 rounded-full text-[13.5px] font-semibold text-[#2B2521] hover:text-[#111111] hover:bg-black/[0.05] transition-all duration-200 cursor-pointer"
                >
                  Login
                </button>

                {/* Sign Up (Primary CTA) */}
                <button
                  id="nav-get-started-btn"
                  onClick={() => onOpenGetStarted ? onOpenGetStarted('signup') : onOpenLogin('signup')}
                  className="px-5 py-2 rounded-full text-[13.5px] font-bold text-white bg-[#111111] hover:bg-[#FF3B30] transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer flex items-center space-x-1.5 group"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {activeUser ? (
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-full border ${getRoleBadgeStyle(activeUser.role)}`}>
                {activeUser.name.split(' ')[0]} ({activeUser.role})
              </span>
            ) : (
              <button
                onClick={() => onOpenLogin && onOpenLogin('signin')}
                className="text-xs font-semibold text-[#111111] px-3 py-1.5 rounded-full border border-zinc-300 hover:bg-black/5"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2B2521] hover:text-[#FF3B30] rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF7] border-b border-zinc-200 px-6 pt-2 pb-6 space-y-2 animate-fadeIn shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (link.action) { e.preventDefault(); link.action(); }
              }}
              className="block py-2.5 text-sm font-medium text-[#2B2521] hover:text-[#FF3B30] border-b border-zinc-100 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3">
            {activeUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); if (onOpenDashboard) onOpenDashboard(activeUser.role); }}
                  className="w-full py-2.5 rounded-xl bg-[#111111] hover:bg-[#FF3B30] text-white font-bold text-sm transition-colors"
                >
                  Go to {activeUser.role.toUpperCase()} Dashboard
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogoutClick(); }}
                  className="w-full py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); if (onOpenGetStarted) onOpenGetStarted('signup'); }}
                className="w-full py-2.5 rounded-full bg-[#111111] hover:bg-[#FF3B30] text-white font-bold text-sm transition-colors shadow-sm"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
