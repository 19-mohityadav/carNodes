import React, { useState } from 'react';
import { ShieldCheck, Cpu, FileCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/vehicles';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const stepIcons = [
    <ShieldCheck className="w-6 h-6 text-[#FF3B30]" />,
    <Cpu className="w-6 h-6 text-[#B36B39]" />,
    <FileCheck className="w-6 h-6 text-[#2B2521]" />,
    <Sparkles className="w-6 h-6 text-emerald-600" />,
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#FFFFFF] border-b border-zinc-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B36B39] font-semibold">
            Protocol Execution Flow
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111] mt-1 font-heading">
            From Vehicle to Verified Asset
          </h2>
          <p className="mt-3 text-base text-[#6E6259]">
            A seamless 4-step cryptographic pipeline turning physical motor vehicles into trusted, liquid Real-World Assets.
          </p>
        </div>

        {/* 4-STEP HORIZONTAL FLOW CONNECTOR */}
        <div className="relative mb-16 hidden lg:block">
          {/* Horizontal Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-4 gap-4 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 relative cursor-pointer focus:outline-none ${
                    isActive
                      ? 'bg-[#FDFBF7] border-[#FF3B30] shadow-xl scale-105'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-mono text-2xl font-black ${isActive ? 'text-[#FF3B30]' : 'text-zinc-400'}`}>
                      {step.num}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isActive ? 'bg-white border-[#FF3B30]' : 'bg-zinc-100 border-zinc-200'
                    }`}>
                      {stepIcons[idx]}
                    </div>
                  </div>

                  <h3 className="text-lg font-heading font-extrabold text-[#111111] uppercase tracking-tight mb-1">
                    {step.title}
                  </h3>
                  
                  <span className="text-xs font-mono text-[#B36B39] block mb-2 font-medium">
                    {step.subtitle}
                  </span>

                  <p className="text-xs text-[#6E6259] leading-relaxed">
                    {step.desc}
                  </p>

                  {isActive && (
                    <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#FF3B30]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{step.detail}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBILE RESPONSIVE STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden mb-12">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div key={idx} className="bg-[#FDFBF7] p-6 rounded-2xl border border-zinc-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xl font-bold text-[#FF3B30]">{step.num}</span>
                {stepIcons[idx]}
              </div>
              <h3 className="text-base font-heading font-bold uppercase text-[#111111]">{step.title}</h3>
              <span className="text-xs font-mono text-[#B36B39] block mb-2">{step.subtitle}</span>
              <p className="text-xs text-[#6E6259]">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Active Step Deep-Dive Card Display */}
        <div className="bg-[#2B2521] text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF3B30]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-white/10 border border-white/20 text-xs font-mono text-[#FF3B30] mb-3">
                <span>STAGE {HOW_IT_WORKS_STEPS[activeStep].num} DEEP DIVE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight">
                {HOW_IT_WORKS_STEPS[activeStep].title}: {HOW_IT_WORKS_STEPS[activeStep].subtitle}
              </h3>
              <p className="mt-3 text-sm text-zinc-300 max-w-xl leading-relaxed">
                {HOW_IT_WORKS_STEPS[activeStep].desc} Every action in this stage generates a verifiable cryptographic signature logged directly to the Algorand blockchain and IPFS decentralized storage node network.
              </p>
            </div>

            <div className="md:col-span-4 bg-white/5 p-5 rounded-2xl border border-white/10 text-xs font-mono space-y-3">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Node Status:</span>
                <span className="text-emerald-400 font-bold">Active Node ✓</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Latency:</span>
                <span className="text-white font-bold">&lt; 1.2 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Consensus:</span>
                <span className="text-[#B36B39] font-bold">Pure Proof of Stake</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
