import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:bg-indigo-600 transition-colors duration-200">
              <ShieldCheck className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                CarNodes
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                Verified. Digital. Trusted.
              </span>
            </div>
          </Link>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors hover:text-indigo-600 ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-600'
              }`
            }
          >
            Marketplace
          </NavLink>
          <a
            href="#how-it-works"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            About
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 hover:text-[#0F766E] transition-colors px-3 py-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[#0F766E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#0D645E] active:scale-95 transition-all duration-200"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <NavLink
            to="/marketplace"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-indigo-600"
          >
            Marketplace
          </NavLink>
          <a
            href="#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-indigo-600"
          >
            How It Works
          </a>
          <a
            href="#about"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 hover:text-indigo-600"
          >
            About
          </a>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-slate-700 font-semibold text-sm hover:bg-slate-50 rounded-xl"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 bg-[#0F766E] text-white font-semibold text-sm rounded-xl shadow-sm hover:bg-[#0D645E]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
