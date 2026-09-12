import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, CheckCircle2, UserCheck, Wallet, RefreshCw, Key } from 'lucide-react';

export default function EscrowSection({ onOpenWalletModal }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Deposit, 2: Inspection, 3: Ownership, 4: Released

  const steps = [
    {
      num: 1,
      title: "1. Buyer Locks Funds",
      desc: "Buyer deposits $48,500 (24,250 ALGO) into non-custodial Algorand Smart Escrow Contract.",
      status: currentStep >= 1 ? "Complete" : "Pending"
    },
    {
      num: 2,
      title: "2. Authority Node Inspection",
      desc: "San Francisco RTO Node verifies physical handoff & cryptographic OBD-II telemetry sync.",
      status: currentStep >= 2 ? "Complete" : "Pending"
    },
    {
      num: 3,
      title: "3. Digital Title Transfer",
      desc: "Algorand ASA ownership token transfers instantly to buyer's verified Web3 wallet address.",
      status: currentStep >= 3 ? "Complete" : "Pending"
    },
    {
      num: 4,
      title: "4. Escrow Payout to Seller",
      desc: "Smart Contract automatically unlocks & transfers funds directly to seller's payout account.",
      status: currentStep >= 4 ? "Complete" : "Pending"
    }
  ];

  return (
    <section id="escrow" className="py-20 bg-[#FDFBF7] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-800 mb-4">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span className="font-bold uppercase tracking-wider">ZERO PAYMENT RISK PROTOCOL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111] font-heading">
            Your Money Moves Only When <br />
            <span className="text-[#B36B39]">The Vehicle Does.</span>
          </h2>

          <p className="mt-4 text-base text-[#6E6259]">
            Buyer funds are locked safely in smart contracts and released to the seller only after ownership transfer and buyer confirmation are verified on-chain.
          </p>
        </div>

        {/* VISUAL FLOW DIAGRAM (BUYER -> ESCROW -> SELLER) */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl mb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* BUYER NODE */}
            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-zinc-200 text-center relative group hover:border-[#FF3B30] transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-[#2B2521] text-white mx-auto flex items-center justify-center mb-3">
                <Wallet className="w-7 h-7 text-[#FF3B30]" />
              </div>
              <h3 className="text-base font-heading font-extrabold text-[#111111] uppercase">BUYER</h3>
              <p className="text-xs text-[#6E6259] mt-1">Deposits ALGO/USDC into Escrow</p>
              <div className="mt-4 pt-3 border-t border-zinc-200 text-xs font-mono font-bold text-emerald-700">
                {currentStep >= 1 ? "✓ Funds Locked in Contract" : "Awaiting Deposit"}
              </div>
            </div>

            {/* ESCROW SMART CONTRACT (CENTER) */}
            <div className="bg-[#2B2521] text-white p-6 rounded-2xl border border-zinc-800 text-center relative shadow-2xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF3B30] text-white text-[10px] font-mono px-3 py-0.5 rounded-full uppercase font-bold tracking-wider">
                ALGORAND SMART ESCROW 🔐
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center mb-3 mt-1">
                <Lock className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>

              <h3 className="text-lg font-heading font-bold text-white">ASA #89410294</h3>
              <p className="text-xs text-zinc-400 mt-1 font-mono">Automated State Machine Execution</p>

              <div className="mt-4 pt-3 border-t border-zinc-800 text-xs font-mono text-emerald-400 font-bold">
                {currentStep === 4 ? "Escrow Payout Complete ✓" : `State ${currentStep}/4: In Progress`}
              </div>
            </div>

            {/* SELLER NODE */}
            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-zinc-200 text-center relative group hover:border-[#B36B39] transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-[#2B2521] text-white mx-auto flex items-center justify-center mb-3">
                <UserCheck className="w-7 h-7 text-[#B36B39]" />
              </div>
              <h3 className="text-base font-heading font-extrabold text-[#111111] uppercase">SELLER</h3>
              <p className="text-xs text-[#6E6259] mt-1">Receives Instant Payout upon Transfer</p>
              <div className="mt-4 pt-3 border-t border-zinc-200 text-xs font-mono font-bold text-[#B36B39]">
                {currentStep === 4 ? "✓ Payout Cleared" : "Escrow Lock Active"}
              </div>
            </div>

          </div>

        </div>

        {/* INTERACTIVE ESCROW STEPPER CONTROLS */}
        <div className="bg-zinc-100 p-6 rounded-2xl border border-zinc-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-heading font-bold uppercase text-[#111111]">
                Interactive Escrow Simulation Stepper
              </h3>
              <span className="text-xs text-[#6E6259]">Click steps to simulate the state transition sequence:</span>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-mono text-[#FF3B30] hover:underline flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Simulation</span>
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {steps.map((st) => (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  currentStep >= st.num
                    ? 'bg-white border-[#FF3B30] shadow-sm'
                    : 'bg-zinc-200/60 border-zinc-300 text-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${currentStep >= st.num ? 'text-[#FF3B30]' : 'text-zinc-400'}`}>
                    Step 0{st.num}
                  </span>
                  {currentStep >= st.num && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>

                <h4 className="text-xs font-heading font-bold text-[#111111]">{st.title}</h4>
                <p className="text-[11px] text-[#6E6259] mt-1 leading-snug">{st.desc}</p>
              </button>
            ))}
          </div>

          {/* Connect Wallet Trigger Banner */}
          <div className="mt-6 pt-4 border-t border-zinc-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="font-mono text-[#6E6259]">
              Ready to test real Algorand mainnet escrow execution?
            </span>
            <button
              onClick={onOpenWalletModal}
              className="px-5 py-2.5 rounded-lg bg-[#2B2521] hover:bg-[#FF3B30] text-white font-mono uppercase font-bold text-xs transition-colors flex items-center space-x-2"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Connect Wallet to Escrow</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
