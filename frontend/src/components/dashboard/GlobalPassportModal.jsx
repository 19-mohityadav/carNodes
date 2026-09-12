import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  Lock,
  Building2,
  Car,
  FileCheck,
  AlertTriangle,
  Send
} from 'lucide-react';

export default function GlobalPassportModal({ vehicle, isOpen, onClose, role = 'buyer', onAction }) {
  if (!isOpen || !vehicle) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'history' | 'documents' | 'blockchain'

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FDFBF7] w-full max-w-4xl rounded-3xl border border-zinc-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="bg-[#2B2521] text-white px-6 py-5 relative shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight text-white">
                  Digital Vehicle Passport
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                  ✓ Verified RWA Node
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-300">
                VIN: {vehicle.vin} • Vehicle ID: {vehicle.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUBHEADER NAVIGATION TABS */}
        <div className="bg-white border-b border-zinc-200 px-6 py-2 flex items-center space-x-6 text-xs font-semibold text-zinc-600 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#0D9488] text-[#0D9488] font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Vehicle Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#0D9488] text-[#0D9488] font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Ownership & Maintenance Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'documents'
                ? 'border-[#0D9488] text-[#0D9488] font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Verified Documents & Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('blockchain')}
            className={`py-2 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'blockchain'
                ? 'border-[#0D9488] text-[#0D9488] font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Ethereum Sepolia Record</span>
          </button>
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* TAB 1: OVERVIEW & PASSPORT SUMMARY CARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Passport Banner Card */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 rounded-xl overflow-hidden bg-zinc-100 aspect-[16/10]">
                    <img
                      src={vehicle.image}
                      alt={vehicle.model}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-heading font-extrabold text-[#111111]">
                        {vehicle.model}
                      </h3>
                      <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-mono font-extrabold text-emerald-800">
                          Trust Score {vehicle.trustScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                      <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                        <span className="text-zinc-400 block text-[10px]">VERIFIED PRICE</span>
                        <strong className="text-zinc-900 text-sm">${vehicle.priceUsd?.toLocaleString()}</strong>
                      </div>
                      <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                        <span className="text-zinc-400 block text-[10px]">ODOMETER</span>
                        <strong className="text-zinc-900 text-sm">{vehicle.mileage}</strong>
                      </div>
                      <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                        <span className="text-zinc-400 block text-[10px]">ENGINE / POWER</span>
                        <strong className="text-zinc-900 text-xs truncate block">{vehicle.engine}</strong>
                      </div>
                      <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                        <span className="text-zinc-400 block text-[10px]">AUTHORITY NODE</span>
                        <strong className="text-[#0D9488] text-xs truncate block">{vehicle.verifications?.authorityNode}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Verification Checks Grid */}
              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-[#6E6259] tracking-wider mb-3">
                  Verification Status Protocol Checks:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold font-heading text-zinc-900">✓ Vehicle Identity Match</h5>
                      <p className="text-[11px] text-zinc-500 font-mono">VIN & Chassis match factory assembly</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold font-heading text-zinc-900">✓ Documents Verified</h5>
                      <p className="text-[11px] text-zinc-500 font-mono">Title deed & insurance validated on IPFS</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold font-heading text-zinc-900">✓ Ownership Clean</h5>
                      <p className="text-[11px] text-zinc-500 font-mono">No active liens, 0 accident claims</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASSPORT TIMELINE */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase font-bold text-[#6E6259] tracking-wider mb-2">
                Cryptographic Ownership & Maintenance Record Chain:
              </h4>

              <div className="relative pl-6 border-l-2 border-[#0D9488]/30 space-y-6">
                {(vehicle.passportTimeline || []).map((item, idx) => (
                  <div key={idx} className="relative bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
                    <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-[#0D9488] border-2 border-white ring-2 ring-[#0D9488]/20" />
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded">{item.date}</span>
                      <span className="text-zinc-500">{item.mileage}</span>
                    </div>

                    <h5 className="text-sm font-heading font-extrabold text-zinc-900">{item.title}</h5>
                    <p className="text-xs text-zinc-600">{item.location}</p>

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>Verified Node: <strong className="text-zinc-800">{item.verifiedBy}</strong></span>
                      <span className="text-[#0D9488]">Tx: {item.txHash}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase font-bold text-[#6E6259] tracking-wider">
                Verifiable Legal & Inspection Documents (IPFS Anchored):
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { name: 'Vehicle Registration Certificate (RC)', status: 'Verified', date: '2026-08-28', hash: 'ipfs://bafybeig...rc98' },
                  { name: 'Comprehensive Insurance Policy', status: 'Active', date: '2026-09-01', hash: 'ipfs://bafybeic...ins12' },
                  { name: 'RTO Pre-Listing Inspection Report', status: 'Approved', date: '2026-08-28', hash: 'ipfs://bafybei...insp409' },
                  { name: 'Clean Title Non-Lien Affidavit', status: 'Cleared', date: '2026-08-15', hash: 'ipfs://bafybei...lien00' },
                ].map((doc, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-[#0D9488]" />
                      <div>
                        <div className="font-bold text-zinc-900">{doc.name}</div>
                        <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{doc.hash}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BLOCKCHAIN SEPOLIA */}
          {activeTab === 'blockchain' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-emerald-400 font-bold">Ethereum Sepolia Testnet Contract</span>
                  <span className="text-zinc-400 text-[10px]">Hardhat / Solidity Protocol</span>
                </div>

                <div className="space-y-1.5 text-zinc-300 text-[11px]">
                  <div className="flex justify-between">
                    <span>Contract Address:</span>
                    <span className="text-amber-300 font-bold">0x71C7...9A2C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Token Standard:</span>
                    <span className="text-zinc-100">ERC-721 Real-World Asset (RWA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IPFS Metadata Pointer:</span>
                    <span className="text-[#0D9488] font-bold">{vehicle.ipfsHash || 'ipfs://bafybeigx47f3m89...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Smart Contract Escrow:</span>
                    <span className="text-emerald-400 font-bold">Active & Locked</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER WITH ROLE TAILORED ACTIONS */}
        <div className="bg-white border-t border-zinc-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="text-xs font-mono text-[#6E6259]">
            Role Mode: <strong className="uppercase text-[#111111]">{role}</strong>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Close
            </button>

            {role === 'buyer' && (
              <button
                onClick={() => { onClose(); if (onAction) onAction(vehicle, 'buy'); }}
                className="px-6 py-2.5 rounded-xl bg-[#2B2521] hover:bg-[#0D9488] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Proceed to Buy Vehicle
              </button>
            )}

            {role === 'seller' && (
              <button
                onClick={() => { onClose(); if (onAction) onAction(vehicle, 'edit'); }}
                className="px-6 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0B7A70] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Manage / Update Listing
              </button>
            )}

            {role === 'authority' && (
              <button
                onClick={() => { onClose(); if (onAction) onAction(vehicle, 'verify'); }}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Audit & Verify Title Node
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
