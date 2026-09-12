import React, { useState } from 'react';
import { UserCheck, ShoppingBag, Building2, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';
import { STAKEHOLDERS } from '../data/vehicles';

export default function StakeholdersSection({ onOpenMarketplace, onOpenListModal, onOpenVerifyModal }) {
  const [activeTab, setActiveTab] = useState('buyers');

  const roleIcons = {
    buyers: <ShoppingBag className="w-5 h-5" />,
    sellers: <UserCheck className="w-5 h-5" />,
    authorities: <Building2 className="w-5 h-5" />,
    providers: <Wrench className="w-5 h-5" />
  };

  const currentRole = STAKEHOLDERS.find(s => s.id === activeTab) || STAKEHOLDERS[0];

  return (
    <section id="stakeholders" className="py-20 bg-[#FFFFFF] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B36B39] font-semibold">
            Ecosystem Participants
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111] mt-1 font-heading">
            Built for Everyone
          </h2>
          <p className="mt-3 text-base text-[#6E6259]">
            A multi-sided Web3 automotive protocol empowering buyers, sellers, DMVs, and certified service technicians.
          </p>
        </div>

        {/* ROLE TABS SELECTOR */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {STAKEHOLDERS.map((stk) => {
            const isActive = stk.id === activeTab;
            return (
              <button
                key={stk.id}
                onClick={() => setActiveTab(stk.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl border text-xs font-heading font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-[#2B2521] text-white border-[#2B2521] shadow-lg scale-105'
                  : 'bg-[#FDFBF7] text-[#6E6259] border-zinc-300 hover:border-zinc-400 hover:text-[#111111]'
                  }`}
              >
                <span className={isActive ? 'text-[#FF3B30]' : 'text-[#6E6259]'}>
                  {roleIcons[stk.id]}
                </span>
                <span>{stk.title}</span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE ROLE FEATURE CARD */}
        <div className="bg-[#FDFBF7] rounded-3xl border border-zinc-200 p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-7">
              <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider bg-[#FF3B30] text-white px-3 py-1 rounded-md mb-4">
                {currentRole.badge}
              </span>

              <h3 className="text-2xl sm:text-4xl font-heading font-extrabold uppercase text-[#111111] leading-tight">
                {currentRole.headline}
              </h3>

              <p className="mt-4 text-base text-[#6E6259] leading-relaxed">
                {currentRole.desc}
              </p>

              <div className="mt-6 space-y-3">
                {currentRole.points.map((pt, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-sm font-medium text-[#2B2521]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Action Triggers */}
              <div className="mt-8 flex flex-wrap gap-4">
                {activeTab === 'buyers' && (
                  <button
                    onClick={onOpenMarketplace}
                    className="px-6 py-3 rounded-xl bg-[#2B2521] hover:bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2"
                  >
                    <span>Browse Verified Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {activeTab === 'sellers' && (
                  <button
                    onClick={onOpenListModal}
                    className="px-6 py-3 rounded-xl bg-[#2B2521] hover:bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2"
                  >
                    <span>Mint RWA & List Vehicle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {(activeTab === 'authorities' || activeTab === 'providers') && (
                  <button
                    onClick={onOpenVerifyModal}
                    className="px-6 py-3 rounded-xl bg-[#2B2521] hover:bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2"
                  >
                    <span>Access Node Verification Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

            {/* Visual Box */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <span className="text-xs font-mono uppercase font-bold text-[#B36B39]">Role Architecture</span>
                <span className="text-[11px] font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">Active Mode</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-[#6E6259]">
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-zinc-200 flex justify-between">
                  <span>Cryptographic Keypair:</span>
                  <span className="text-[#111111] font-bold">ED25519 Verified</span>
                </div>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-zinc-200 flex justify-between">
                  <span>Authority Signature:</span>
                  <span className="text-emerald-700 font-bold">DMV Node Signed ✓</span>
                </div>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-zinc-200 flex justify-between">
                  <span>Smart Escrow Lock:</span>
                  <span className="text-[#FF3B30] font-bold">Enabled</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}