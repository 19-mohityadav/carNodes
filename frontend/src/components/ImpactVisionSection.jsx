import React from 'react';
import { TrendingUp, ShieldCheck, Clock, Award, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ImpactVisionSection() {
  const metrics = [
    { label: "Fraud Prevention Rate", value: "99.4%", change: "+42% vs DMV paper title standard", icon: <ShieldCheck className="w-5 h-5 text-emerald-600" /> },
    { label: "Ownership Handoff Speed", value: "< 2 Mins", change: "Down from 14 business days", icon: <Clock className="w-5 h-5 text-[#FF3B30]" /> },
    { label: "History Auditability", value: "100%", change: "Immutable IPFS + Algorand proof", icon: <Award className="w-5 h-5 text-[#B36B39]" /> },
    { label: "Hidden Broker Fees", value: "$0", change: "Zero middleman margin markup", icon: <TrendingUp className="w-5 h-5 text-[#2B2521]" /> },
  ];

  const roadmapPhases = [
    {
      phase: "Phase 1",
      title: "Pilot Showroom MVP",
      status: "Live Active",
      badge: "Current Stage",
      desc: "Curated luxury RWA supercar showroom with interactive digital vehicle passports, AI valuation, and Algorand smart escrow."
    },
    {
      phase: "Phase 2",
      title: "Metro City DMV Rollout",
      status: "Q4 2026",
      badge: "In Integration",
      desc: "Direct RTO/DMV API integrations across top metropolitan jurisdictions for instant automated title clearance."
    },
    {
      phase: "Phase 3",
      title: "Statewide Digital Registry",
      status: "2027",
      badge: "Planned",
      desc: "Mandatory RWA digital title issuance with automated tax compliance, lien management, and cross-state transfer."
    },
    {
      phase: "Phase 4",
      title: "Global Passport Network",
      status: "2028+",
      badge: "Vision",
      desc: "Cross-border vehicle passports enabling seamless international vehicle export, import, financing, and Web3 collateralization."
    }
  ];

  return (
    <section className="py-20 bg-[#FFFFFF] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF3B30] font-semibold">
            Quantifiable Impact & Roadmap
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111] mt-1 font-heading">
            From One Verified Vehicle <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B2521] via-[#B36B39] to-[#FF3B30]">
              To a Trusted Global Network
            </span>
          </h2>
          <p className="mt-4 text-base text-[#6E6259]">
            Measuring real-world friction reduction while building the scalable foundation for modern automotive asset liquid markets.
          </p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-[#FDFBF7] p-6 rounded-2xl border border-zinc-200 shadow-xs hover:border-[#FF3B30] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase font-bold text-[#6E6259]">{m.label}</span>
                {m.icon}
              </div>
              <div className="text-4xl font-heading font-black text-[#111111] tracking-tight">{m.value}</div>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-2">{m.change}</div>
            </div>
          ))}
        </div>

        {/* ROADMAP TIMELINE CARDS */}
        <div className="bg-[#2B2521] text-white p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono text-[#FF3B30] font-bold uppercase tracking-widest">
              EXPANSION BLUEPRINT
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold uppercase mt-1">
              Future Network Expansion
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {roadmapPhases.map((rp, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${
                  idx === 0
                    ? 'bg-white/10 border-[#FF3B30] shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#FF3B30]">{rp.phase}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    idx === 0 ? 'bg-[#FF3B30] text-white' : 'bg-white/10 text-zinc-300'
                  }`}>
                    {rp.status}
                  </span>
                </div>

                <h4 className="text-base font-heading font-bold text-white mb-2">{rp.title}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{rp.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
