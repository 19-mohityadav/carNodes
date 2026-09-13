import React from 'react';
import { ShieldCheck, Car, PlusCircle, ArrowRight, Globe, MessageSquare, Disc as Discord } from 'lucide-react';

export default function FooterCTA({ onOpenMarketplace, onOpenListModal, onOpenVerifyModal }) {
  return (
    <footer className="bg-[#111111] text-white pt-20 pb-12 border-t border-zinc-800 relative overflow-hidden">

      {/* FINAL CALL TO ACTION BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-[#2B2521] p-10 sm:p-16 rounded-3xl border border-zinc-800 text-center relative overflow-hidden shadow-2xl">

          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3B30]/10 rounded-full blur-3xl pointer-events-none"></div>

          <span className="text-xs font-mono uppercase tracking-widest text-[#FF3B30] font-semibold mb-3 inline-block">
            READY FOR UNCOMPROMISED AUTOMOTIVE TRUST?
          </span>

          <h2 className="text-3xl sm:text-6xl font-extrabold uppercase tracking-tight text-white font-heading max-w-3xl mx-auto leading-none">
            Don't Just Buy a Car. <br />
            <span className="text-[#FF3B30]">Buy Confidence.</span>
          </h2>

          <p className="mt-4 text-base text-zinc-300 max-w-xl mx-auto font-sans">
            Join thousands of buyers, sellers, and authority nodes on the world's first verified RWA vehicle marketplace.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenMarketplace}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF3B30] hover:bg-rose-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 group"
            >
              <Car className="w-4 h-4" />
              <span>Explore Verified Vehicles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenListModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Vehicle</span>
            </button>
          </div>

        </div>
      </div>

      {/* FOOTER LINKS & BRANDING */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-zinc-800 text-xs text-zinc-400">

          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-white text-[#111111] flex items-center justify-center font-mono font-bold">
                cN
              </div>
              <span className="text-xl font-heading font-extrabold text-white tracking-tight">carNodes</span>
              <span className="w-2 h-2 rounded-full bg-[#FF3B30]"></span>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              The Swiss Modernist Real-World Asset (RWA) automotive marketplace. Verified history, transparent AI valuation.
            </p>
            
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-white uppercase text-xs tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-white transition-colors">Showroom Stage</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#passport-section" className="hover:text-white transition-colors">Digital Passport</a></li>
  
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-white uppercase text-xs tracking-wider">Stakeholders</h4>
            <ul className="space-y-2">
              <li><a href="#stakeholders" className="hover:text-white transition-colors">For Buyers</a></li>
              <li><a href="#stakeholders" className="hover:text-white transition-colors">For Sellers</a></li>
              <li><a href="#stakeholders" className="hover:text-white transition-colors">For DMV / RTOs</a></li>
              <li><a href="#stakeholders" className="hover:text-white transition-colors">Service Providers</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading font-bold text-white uppercase text-xs tracking-wider">Protocol Oracles</h4>
            <p className="text-zinc-400">
              Integrate your authority database or certified service center directly into carNodes HTTP 402 verification API.
            </p>
            <button
              onClick={onOpenVerifyModal}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase font-bold transition-colors"
            >
              Verify Vehicle VIN →
            </button>
          </div>

        </div>

        {/* COPYRIGHT & BOTTOM */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} carNodes RWA Protocol. Built with Swiss Modernist Design Principles.
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Verification</a>
            <a href="#" className="hover:text-white transition-colors">Algorand Security Audit</a>
          </div>
        </div>

      </div>
    </footer>
  );
}