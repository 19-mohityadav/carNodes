import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, Car, Lock, FileText, Cpu } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 lg:py-24 border-b border-slate-200">
      {/* Subtle Background Node/Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#CBD5E1 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Next-Gen RWA Vehicle Protocol</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                TRUSTED VEHICLE OWNERSHIP{' '}
                <span className="block text-indigo-600">BUILT FOR THE DIGITAL WORLD</span>
              </h1>
            </div>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl leading-relaxed">
              CarNodes makes vehicle buying and ownership transfer more trusted by combining verified vehicle records, secure document storage, and blockchain-backed ownership.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/30 active:scale-[0.98] transition-all duration-200"
              >
                Explore Vehicles
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/create-listing"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 border-2 border-slate-300 font-semibold text-base px-7 py-3.5 rounded-xl hover:border-slate-400 hover:bg-slate-100 active:scale-[0.98] transition-all duration-200"
              >
                <Car className="w-5 h-5 text-slate-600" />
                Register Vehicle
              </Link>
            </div>

            {/* Key Value Pill Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-xl">
              <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified RTO Records</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Encrypted Documents</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                <Cpu className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>On-Chain NFT Passport</span>
              </div>
            </div>
          </div>

          {/* Right Column: Vehicle Visual & Verification Card */}
          <div className="lg:col-span-5 relative">
            {/* Background Glow Container */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

            <div className="relative bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Top Verified Badge Pill overlay */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✓ Verified Vehicle</span>
                </div>
                <span className="text-xs font-mono font-medium text-slate-400">
                  TOKEN #VPASS-1024
                </span>
              </div>

              {/* Vehicle Image Card */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80"
                  alt="Verified Vehicle - Porsche 911 GT3"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Porsche 911 GT3 RS</h3>
                    <p className="text-xs text-slate-300 font-mono">VIN: WP0ZZZ99ZLS102948</p>
                  </div>
                  <span className="text-sm font-extrabold bg-indigo-600 px-2.5 py-1 rounded-lg text-white">
                    $185,000
                  </span>
                </div>
              </div>

              {/* Status & Passport Metadata Strip */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    RC & Insurance Document
                  </span>
                  <span className="text-emerald-600 font-bold">Encrypted & Anchored</span>
                </div>
                
                <div className="flex items-center justify-between text-xs border-t border-slate-200/70 pt-2.5">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                    Blockchain Ownership Status
                  </span>
                  <span className="font-mono text-indigo-600 font-semibold">Sepolia Confirmed</span>
                </div>
              </div>

              {/* Bottom Quick Audit Seal */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>RTO Verification ID: <strong className="text-slate-700 font-mono">RTO-DEL-2026-981</strong></span>
                <span className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                  View Passport →
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
