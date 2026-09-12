import React from 'react';
import { ShieldCheck, Lock, CreditCard, FileCheck } from 'lucide-react';

// AI Assisted box removed per design spec — only 4 cards remain
const TRUST_BADGES = [
  {
    icon: 'ShieldCheck',
    title: 'Authority Verified',
    tagline: 'Pre-Listing Inspection',
    desc: 'Every vehicle title, chassis VIN, and seller identity are cryptographically validated by certified RTO/DMV authority nodes prior to marketplace entry.',
  },
  {
    icon: 'Lock',
    title: 'Blockchain Backed',
    tagline: 'Algorand RWA Standard',
    desc: 'Immutable ownership records and real-world asset smart tokens ensure zero title tampering, zero mileage rollback fraud, and instant digital transfer.',
  },
  {
    icon: 'CreditCard',
    title: 'Secure Payments',
    tagline: 'Smart Contract Escrow',
    desc: 'Funds are locked in non-custodial smart escrow contracts on Algorand, releasing payment to the seller only when title transfer completes.',
  },
  {
    icon: 'FileCheck',
    title: 'Digital Passport',
    tagline: '100% History Transparency',
    desc: 'Single unified cryptographic passport compiling factory assembly, service records, accident logs, and ownership transfers anchored to IPFS.',
  },
];

export default function TrustStrip() {
  const iconMap = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#FF3B30]" />,
    Lock: <Lock className="w-6 h-6 text-[#B36B39]" />,
    CreditCard: <CreditCard className="w-6 h-6 text-emerald-600" />,
    FileCheck: <FileCheck className="w-6 h-6 text-[#B36B39]" />,
  };

  return (
    <section className="py-16 bg-[#FFFFFF] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B36B39] font-semibold">
            Institutional Trust Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111] mt-1 font-heading">
            Trust Built Into Every Transaction
          </h2>
          <div className="w-12 h-1 bg-[#FF3B30] mx-auto mt-4 rounded-full" />
        </div>

        {/* 4 Cards (AI Assisted removed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_BADGES.map((badge, idx) => (
            <div
              key={idx}
              className="bg-[#FDFBF7] p-6 rounded-2xl border border-zinc-200 hover:border-[#FF3B30] transition-all duration-300 hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {iconMap[badge.icon]}
                </div>

                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B36B39] block mb-1">
                  {badge.tagline}
                </span>

                <h3 className="text-base font-heading font-bold text-[#111111] mb-2">
                  {badge.title}
                </h3>

                <p className="text-xs text-[#6E6259] leading-relaxed">
                  {badge.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>VERIFIED</span>
                <span className="text-[#FF3B30] font-bold">100%</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}