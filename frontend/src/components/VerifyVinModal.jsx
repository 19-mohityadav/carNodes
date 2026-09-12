import React, { useState } from 'react';
import { X, ShieldCheck, Search, CheckCircle2, RefreshCw, Award, FileText, Database, ArrowRight } from 'lucide-react';

export default function VerifyVinModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [vinInput, setVinInput] = useState('1FA6P8CF0H51092831');
  const [isVerifying, setIsVerifying] = useState(false);
  const [report, setReport] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!vinInput.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setReport({
        vin: vinInput.toUpperCase(),
        model: "2022 Toyota Camry XSE / Audi R8 V10",
        passportId: "#CN-48291",
        trustScore: 94,
        status: "Authority Verified ✓",
        checks: [
          { name: "San Francisco DMV Node Query", status: "Clean Title Verified" },
          { name: "National Insurance Crime Bureau", status: "0 Theft / 0 Flood Logs" },
          { name: "Certified Service Node Telemetry", status: "24,850 mi Verified" },
          { name: "Algorand Smart Contract Lock", status: "Lien Free & Transfer Ready" }
        ],
        ipfsCid: "ipfs://bafybeigx47f3m89a1c2d3e4f5a6b7c8d9e0f1a2b3c",
        algorandTx: "0x7f4a...92b1"
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FDFBF7] w-full max-w-xl rounded-3xl border border-zinc-300 shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-[#111111] p-1 rounded-lg hover:bg-zinc-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#2B2521] text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#FF3B30]" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-extrabold uppercase text-[#111111]">
              Instant VIN Verification Portal
            </h3>
            <span className="text-xs font-mono text-[#6E6259]">Algorand Multi-Oracle Cryptographic Scan</span>
          </div>
        </div>

        {/* VIN Form */}
        <form onSubmit={handleVerify} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase text-[#6E6259] font-bold mb-1">
              Enter 17-Character VIN or Passport ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value)}
                placeholder="e.g. 1FA6P8CF0H51092831"
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 font-mono text-xs font-bold text-[#111111] focus:border-[#FF3B30] focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-3 rounded-xl bg-[#2B2521] hover:bg-[#FF3B30] text-white font-mono text-xs font-bold uppercase transition-colors flex items-center space-x-2 cursor-pointer"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>Verify</span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* VERIFICATION REPORT OUTPUT */}
        {report && (
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-4 font-sans animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#6E6259] block">Verified Result</span>
                <h4 className="text-base font-heading font-extrabold text-[#111111]">{report.model}</h4>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-xl text-center">
                <span className="text-[10px] font-mono text-emerald-800 font-bold block">Trust Score</span>
                <span className="text-lg font-mono font-black text-emerald-700">{report.trustScore}/100</span>
              </div>
            </div>

            {/* Checks list */}
            <div className="space-y-2">
              {report.checks.map((chk, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-[#FDFBF7] rounded-lg border border-zinc-200">
                  <span className="font-mono text-[#6E6259]">{chk.name}</span>
                  <span className="font-bold text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{chk.status}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Hashes */}
            <div className="p-3 bg-zinc-900 text-white rounded-xl text-[11px] font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Algorand Txn:</span>
                <span className="text-emerald-400 font-bold">{report.algorandTx}</span>
              </div>
              <div className="flex justify-between truncate">
                <span className="text-zinc-400">IPFS Document CID:</span>
                <span className="text-amber-400 truncate max-w-[200px]">{report.ipfsCid}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
