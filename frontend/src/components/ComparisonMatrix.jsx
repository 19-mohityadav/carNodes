import React, { useState } from 'react';
import { XCircle, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { COMPARISON_DATA } from '../data/vehicles';

export default function ComparisonMatrix() {
  const [viewMode, setViewMode] = useState('all'); // 'all', 'buyer', 'seller'

  return (
    <section className="py-20 bg-[#FDFBF7] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
  
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111] mt-1 font-heading">
            The Used-Car Market Has a Trust Problem.
          </h2>
          <p className="mt-3 text-base text-[#6E6259]">
            Traditional car buying is riddled with hidden damage, forged titles, payment risks, and weeks of paperwork. carNodes solves trust at the protocol level.
          </p>

          {/* View Filter Switch */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-zinc-200/80 border border-zinc-300">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${viewMode === 'all' ? 'bg-[#2B2521] text-white shadow-xs' : 'text-[#6E6259] hover:text-[#111111]'
                }`}
            >
              Full Comparison Matrix
            </button>
            <button
              onClick={() => setViewMode('buyer')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${viewMode === 'buyer' ? 'bg-[#FF3B30] text-white shadow-xs' : 'text-[#6E6259] hover:text-[#111111]'
                }`}
            >
              Buyer Protection
            </button>
            <button
              onClick={() => setViewMode('seller')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${viewMode === 'seller' ? 'bg-[#B36B39] text-white shadow-xs' : 'text-[#6E6259] hover:text-[#111111]'
                }`}
            >
              Seller Efficiency
            </button>
          </div>
        </div>

        {/* COMPARISON TABLE / MATRIX */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-[#2B2521] text-white p-5 text-xs font-mono font-bold uppercase tracking-wider">
            <div className="md:col-span-3 text-zinc-400">Market Risk Vector</div>
            <div className="md:col-span-4 text-rose-400 flex items-center space-x-1.5 mt-2 md:mt-0">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Traditional Used-Car Market</span>
            </div>
            <div className="md:col-span-5 text-emerald-400 flex items-center space-x-1.5 mt-2 md:mt-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>carNodes RWA Platform</span>
            </div>
          </div>

          {/* Matrix Rows */}
          <div className="divide-y divide-zinc-200">
            {COMPARISON_DATA.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-5 text-sm hover:bg-zinc-50/80 transition-colors items-center gap-y-3"
              >
                {/* Feature Name */}
                <div className="md:col-span-3 font-heading font-bold text-[#111111] flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B30]"></span>
                  <span>{row.feature}</span>
                </div>

                {/* Traditional Problem */}
                <div className="md:col-span-4 text-[#6E6259] flex items-start space-x-2 pr-4 bg-rose-50/40 md:bg-transparent p-3 md:p-0 rounded-lg">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{row.traditional}</span>
                </div>

                {/* carNodes Solution */}
                <div className="md:col-span-5 text-[#2B2521] font-medium flex items-start space-x-2 bg-emerald-50/50 md:bg-transparent p-3 md:p-0 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-emerald-950 leading-relaxed">
                    {row.carNodes}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer Banner */}
          <div className="bg-zinc-100 p-5 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#FF3B30] text-white flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <span className="text-xs font-mono font-bold text-[#2B2521] uppercase">
                100% Cryptographic Verification • 
              </span>
            </div>
            <a
              href="#how-it-works"
              className="text-xs font-semibold uppercase tracking-wider text-[#FF3B30] hover:text-[#111111] flex items-center space-x-1"
            >
              <span>See How It Works</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}