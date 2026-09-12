import React, { useState } from 'react';
import { FileCheck, ShieldCheck, CheckCircle2, ExternalLink, Copy, Check, Clock, Database, Award, ArrowUpRight } from 'lucide-react';

export default function VehiclePassportSection({ activeCar }) {
  const [selectedEventIndex, setSelectedEventIndex] = useState(2);
  const [copiedHash, setCopiedHash] = useState(false);

  const currentCar = activeCar || {
    id: "CN-48291",
    model: "2022 Toyota Camry XSE / Audi R8 V10",
    vin: "1FA6P8CF0H51092831",
    trustScore: 94,
    mileage: "24,850 mi",
    ipfsHash: "ipfs://bafybeigx47f3m89a1c2d3e4f5a6b7c8d9e0f1a2b3c",
    algorandAssetId: "ASA-89410294",
    passportTimeline: [
      {
        year: "2022",
        date: "Apr 12, 2022",
        title: "Factory Assembly & Registration",
        location: "Audi Forum Neckarsulm",
        mileage: "0 mi",
        txHash: "0x89a19412f849b2c019284fa920194827103a89a1",
        verifiedBy: "OEM Manufacturer Node"
      },
      {
        year: "2024",
        date: "Jan 15, 2024",
        title: "Scheduled Maintenance & Brake Service",
        location: "Apex Euro Service Center",
        mileage: "14,200 mi",
        txHash: "0x3c91029481a02938475610294857102938481a0",
        verifiedBy: "Certified Service Node #12"
      },
      {
        year: "2026",
        date: "Feb 10, 2026",
        title: "carNodes RWA Cryptographic Passport Minted",
        location: "Algorand MainNet",
        mileage: "24,850 mi",
        txHash: "0x7f4a890129347890123490182390128390192b1",
        verifiedBy: "carNodes Authority Oracle"
      }
    ]
  };

  const selectedEvent = currentCar.passportTimeline[selectedEventIndex] || currentCar.passportTimeline[2];

  const handleCopyHash = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section id="passport-section" className="py-20 bg-[#FDFBF7] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-300 text-xs font-mono text-[#B36B39] mb-4">
            <FileCheck className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">CRYPTOGRAPHIC VEHICLE IDENTITY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111] font-heading">
            Every Vehicle Has a Story. <br />
            <span className="text-[#FF3B30]">We Make It Verifiable.</span>
          </h2>

          <p className="mt-4 text-base text-[#6E6259] leading-relaxed">
            The carNodes Digital Vehicle Passport creates a transparent, tamper-resistant record of a vehicle's ownership, verification, maintenance, and transaction history.
          </p>
        </div>

        {/* INTERACTIVE DIGITAL PASSPORT CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: TIMELINE & BADGES (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Passport Identity Header Card */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#6E6259] block">Digital Passport Record</span>
                <h3 className="text-xl font-heading font-extrabold text-[#111111]">{currentCar.model}</h3>
                <div className="mt-1 flex items-center space-x-3 text-xs font-mono">
                  <span>ID: <strong className="text-[#FF3B30]">{currentCar.id}</strong></span>
                  <span className="text-zinc-300">|</span>
                  <span>VIN: <strong className="text-[#2B2521]">{currentCar.vin}</strong></span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-center">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">Trust Score</span>
                <span className="text-2xl font-mono font-black text-emerald-700">{currentCar.trustScore}/100</span>
              </div>
            </div>

            {/* Verification Status Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: "Owner ID", status: "Verified ✓", color: "emerald" },
                { title: "Clean Title", status: "No Lien ✓", color: "emerald" },
                { title: "Insurance", status: "Active ✓", color: "emerald" },
                { title: "Damage Log", status: "0 Accidents", color: "emerald" }
              ].map((badge, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-zinc-200 text-center">
                  <span className="text-[10px] uppercase font-mono text-[#6E6259] block">{badge.title}</span>
                  <span className="text-xs font-bold text-emerald-700 mt-1 block">{badge.status}</span>
                </div>
              ))}
            </div>

            {/* HISTORICAL OWNERSHIP & MAINTENANCE TIMELINE */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#B36B39] font-bold mb-6 flex items-center justify-between">
                <span>Verified Historical Timeline (2022 — 2026)</span>
                <span className="text-zinc-400 font-normal">Click event to inspect proof</span>
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
                {currentCar.passportTimeline.map((evt, idx) => {
                  const isSelected = idx === selectedEventIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedEventIndex(idx)}
                      className={`relative cursor-pointer group transition-all p-3.5 rounded-xl border ${
                        isSelected
                          ? 'bg-[#FDFBF7] border-[#FF3B30] shadow-sm'
                          : 'bg-white border-transparent hover:border-zinc-200'
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute -left-6 top-5 w-4 h-4 rounded-full border-2 transition-all ${
                        isSelected ? 'bg-[#FF3B30] border-white ring-4 ring-[#FF3B30]/20' : 'bg-zinc-300 border-white'
                      }`}></div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#FF3B30]">{evt.year} — {evt.date}</span>
                        <span className="text-[11px] font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                          {evt.mileage}
                        </span>
                      </div>

                      <h5 className="text-sm font-heading font-bold text-[#111111] mt-1">
                        {evt.title}
                      </h5>

                      <div className="mt-1 flex items-center justify-between text-xs text-[#6E6259]">
                        <span>📍 {evt.location}</span>
                        <span className="text-[11px] font-mono text-[#B36B39]">Verified by {evt.verifiedBy}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: CRYPTOGRAPHIC PROOF INSPECTOR (Cols 8-12) */}
          <div className="lg:col-span-5">
            <div className="bg-[#2B2521] text-white p-6 rounded-2xl border border-zinc-800 shadow-2xl space-y-5 sticky top-28">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono uppercase font-bold text-emerald-400">
                    On-Chain Cryptographic Inspector
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              {/* Event Name */}
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Inspected Event</span>
                <h4 className="text-base font-heading font-bold text-white mt-0.5">{selectedEvent.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">Verified on {selectedEvent.date} at {selectedEvent.location}</p>
              </div>

              {/* Cryptographic Hash Details Box */}
              <div className="bg-black/60 p-4 rounded-xl border border-zinc-800 font-mono space-y-3">
                
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Algorand Transaction Hash:</span>
                    <button
                      onClick={() => handleCopyHash(selectedEvent.txHash)}
                      className="text-xs text-[#FF3B30] hover:underline flex items-center space-x-1"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHash ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-xs text-emerald-400 bg-zinc-900/90 p-2 rounded break-all border border-zinc-800 font-mono">
                    {selectedEvent.txHash}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-zinc-400 mb-1">IPFS Immutable Document Storage CID:</div>
                  <div className="text-xs text-amber-400 bg-zinc-900/90 p-2 rounded break-all border border-zinc-800 font-mono">
                    {currentCar.ipfsHash}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-zinc-400 mb-1">Algorand ASA Asset ID:</div>
                  <div className="text-xs text-sky-400 bg-zinc-900/90 p-2 rounded font-mono font-bold">
                    {currentCar.algorandAssetId}
                  </div>
                </div>

              </div>

              {/* Blockchain Proof Badge */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-[#FF3B30] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Tamper-Proof Guarantee</span>
                  <span className="text-zinc-400 text-[11px]">This record cannot be edited, modified, or deleted by any third party.</span>
                </div>
              </div>

              {/* View on Explorer Button */}
              <a
                href={`https://algoexplorer.io`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#FF3B30] hover:bg-rose-600 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <span>Verify on Algorand Explorer</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
