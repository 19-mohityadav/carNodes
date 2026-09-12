import React, { useState } from 'react';
import { X, ShieldCheck, PlusCircle, ArrowRight, Bot, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ListVehicleModal({ isOpen, onClose, onOpenWalletModal, walletConnected }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [vin, setVin] = useState('1FA6P8CF0H51092831');
  const [makeModel, setMakeModel] = useState('2023 Audi RS5 Coupé');
  const [mileage, setMileage] = useState('12,400 mi');
  const [askingPrice, setAskingPrice] = useState('68,000');
  const [isMinting, setIsMinting] = useState(false);
  const [mintCompleted, setMintCompleted] = useState(false);

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!vin || !makeModel) return;
    setStep(2);
  };

  const handleMintRwa = () => {
    if (!walletConnected) {
      onOpenWalletModal();
      return;
    }
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      setMintCompleted(true);
      setStep(3);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FDFBF7] w-full max-w-2xl rounded-3xl border border-zinc-300 shadow-2xl p-6 sm:p-8 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-[#111111] p-1 rounded-lg hover:bg-zinc-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Wizard Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#2B2521] text-white flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-[#FF3B30]" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-extrabold uppercase text-[#111111]">
              List Vehicle & Mint RWA Passport
            </h3>
            <span className="text-xs font-mono text-[#6E6259]">Step 0{step} of 03 — Algorand ASA Minting Wizard</span>
          </div>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {['1. VIN Entry', '2. AI Valuation', '3. RWA Mint'].map((name, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${step >= i + 1 ? 'bg-[#FF3B30]' : 'bg-zinc-200'
                }`}
            ></div>
          ))}
        </div>

        {/* STEP 1: VIN ENTRY FORM */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#6E6259] font-bold mb-1">
                Vehicle Identification Number (VIN)
              </label>
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="e.g. 1FA6P8CF0H51092831"
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 font-mono text-sm font-bold text-[#111111] focus:border-[#FF3B30] focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#6E6259] font-bold mb-1">
                  Year, Make & Model
                </label>
                <input
                  type="text"
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 font-sans text-xs font-bold text-[#111111]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#6E6259] font-bold mb-1">
                  Odometer Mileage
                </label>
                <input
                  type="text"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 font-mono text-xs font-bold text-[#111111]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#6E6259] font-bold mb-1">
                Asking Price ($ USD)
              </label>
              <input
                type="text"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 font-heading text-lg font-extrabold text-[#111111]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#2B2521] hover:bg-[#FF3B30] text-white font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 mt-6 cursor-pointer"
            >
              <span>Run AI Valuation & Authority Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: AI VALUATION & CONFIRMATION */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <span className="text-xs font-mono uppercase font-bold text-[#B36B39]">AI Valuation Report</span>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                  Trust 96/100
                </span>
              </div>

              <div className="text-sm font-heading font-bold text-[#111111]">{makeModel}</div>
              <div className="text-xs font-mono text-[#6E6259]">VIN: {vin} • Mileage: {mileage}</div>

              <div className="pt-2 flex justify-between items-center text-xs font-mono border-t border-zinc-100">
                <span>Fair Market Range:</span>
                <span className="text-emerald-700 font-bold">$67,500 - $70,200</span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span>Your Asking Price:</span>
                <span className="text-[#FF3B30] font-extrabold">${askingPrice}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-900 space-y-1">
              <div className="flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>DMV Title Check: Clean Title Verified</span>
              </div>
              <p className="text-emerald-700 text-[11px] pl-6">
                0 accidents logged, 0 active liens detected. Ready for instant Algorand ASA minting.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl border border-zinc-300 text-xs font-bold uppercase hover:bg-zinc-100"
              >
                Back
              </button>
              <button
                onClick={handleMintRwa}
                disabled={isMinting}
                className="w-2/3 py-3 rounded-xl bg-[#2B2521] hover:bg-[#FF3B30] text-white font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isMinting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Minting RWA ASA Token...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 text-[#B36B39]" />
                    <span>Mint RWA Passport & List</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MINT COMPLETED */}
        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-heading font-extrabold uppercase text-[#111111]">
              Vehicle Successfully Minted!
            </h3>

            <p className="text-xs text-[#6E6259] max-w-md mx-auto">
              Your vehicle <strong className="text-[#111111]">{makeModel}</strong> is now registered as a cryptographic Real-World Asset (ASA #99401294) on Algorand and live in the carNodes marketplace.
            </p>

            <div className="bg-zinc-100 p-4 rounded-xl text-xs font-mono text-left space-y-1">
              <div className="flex justify-between">
                <span>Passport ID:</span>
                <strong className="text-[#FF3B30]">#CN-99401</strong>
              </div>
              <div className="flex justify-between">
                <span>Algorand Txn:</span>
                <strong className="text-emerald-700">0x99a8b...11c2</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-[#2B2521] text-white font-bold text-xs uppercase tracking-wider"
            >
              Return to Showroom
            </button>
          </div>
        )}

      </div>
    </div>
  );
}