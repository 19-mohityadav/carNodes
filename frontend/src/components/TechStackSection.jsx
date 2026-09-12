import React from 'react';
import { Cpu, Zap, Bot, Database, Code2, ShieldCheck, ArrowRight } from 'lucide-react';
import { TECH_STACK } from '../data/vehicles';

export default function TechStackSection() {
  const iconMap = {
    Cpu: <Cpu className="w-6 h-6 text-[#FF3B30]" />,
    Zap: <Zap className="w-6 h-6 text-amber-500" />,
    Bot: <Bot className="w-6 h-6 text-emerald-600" />,
    Database: <Database className="w-6 h-6 text-[#B36B39]" />,
    Code2: <Code2 className="w-6 h-6 text-sky-600" />,
  };

  return (
    <section id="tech-stack" className="py-20 bg-[#FDFBF7] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B36B39] font-semibold">
            Enterprise Architecture & Infrastructure
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111] mt-1 font-heading">
            Powered by Trust + Intelligence
          </h2>
          <p className="mt-4 text-base text-[#6E6259]">
            A state-of-the-art Web3 automotive stack combining carbon-negative L1 blockchain consensus, pay-per-use HTTP 402 APIs, autonomous AI valuation agents, and immutable storage.
          </p>
        </div>

        {/* 5 Tech Stack Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_STACK.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-zinc-200 hover:border-[#FF3B30] transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] border border-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {iconMap[item.icon]}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 text-[#2B2521] px-2.5 py-1 rounded">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-extrabold text-[#111111] mb-1">
                  {item.name}
                </h3>

                <span className="text-xs font-mono font-bold text-[#B36B39] block mb-3">
                  {item.role}
                </span>

                <p className="text-xs text-[#6E6259] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-[#6E6259]">
                <span>Status: <strong className="text-emerald-600">Production Ready</strong></span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}

          {/* Special Architecture Summary Box */}
          <div className="bg-[#2B2521] text-white p-7 rounded-2xl border border-zinc-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#FF3B30] uppercase font-bold mb-2">
                SYSTEM THROUGHPUT
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                Sub-Second Verification Latency
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Our hybrid off-chain indexer and Algorand smart contracts achieve 10,000+ transactions per second with sub-4 second deterministic finality.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Security Audit:</span>
              <span className="text-emerald-400 font-bold">100% Passed ✓</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}