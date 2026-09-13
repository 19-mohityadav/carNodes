import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Link,
  Cpu,
  Database,
  ArrowRight,
  ExternalLink,
  History,
  Check,
  Building2,
  Calendar,
  Lock,
  FileBadge2,
  UserCheck
} from 'lucide-react';
import { ETHERSCAN_BASE } from '../../contracts/addresses';

export default function GlobalPassportModal({
  isOpen,
  onClose,
  vehicle,
  role = 'buyer', // 'buyer' | 'seller' | 'authority'
  onApproveByAuthority,
  onUpdateDocsBySeller,
  onProceedPurchaseByBuyer
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline' | 'documents' | 'blockchain'
  const [docUpdatedToast, setDocUpdatedToast] = useState(false);
  const [approvedToast, setApprovedToast] = useState(false);

  if (!isOpen || !vehicle) return null;

  const priceInr = vehicle.priceInr || `₹${((vehicle.priceUsd || 45000) * 85).toLocaleString('en-IN')}`;
  const priceUsd = vehicle.priceUsd ? `$${vehicle.priceUsd.toLocaleString()}` : '$48,500';

  const handleSellerUpdate = () => {
    setDocUpdatedToast(true);
    if (onUpdateDocsBySeller) onUpdateDocsBySeller(vehicle);
    setTimeout(() => setDocUpdatedToast(false), 3000);
  };

  const handleAuthorityApprove = () => {
    setApprovedToast(true);
    if (onApproveByAuthority) onApproveByAuthority(vehicle);
    setTimeout(() => {
      setApprovedToast(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-[#FDFBF7] w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header Strip */}
        <div className="bg-slate-900 text-white px-6 py-5 relative flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <FileBadge2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-heading font-extrabold tracking-tight text-white">
                  Digital Vehicle Passport
                </h2>
                <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-600/50 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Ethereum Sepolia Live
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                RWA Identity Token #{vehicle.id || 'CN-48291'} • VIN: {vehicle.vin || '1FA6P8CF0H51092831'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Trust score pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-white">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Trust {vehicle.trustScore || 94}/100</span>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white px-6 border-b border-slate-200 flex items-center space-x-6 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'Passport Overview', icon: FileText },
            { id: 'timeline', label: 'Ownership & Service Timeline', icon: History },
            { id: 'documents', label: 'Verified Document Evidence', icon: ShieldCheck },
            { id: 'blockchain', label: 'Ethereum Sepolia & IPFS Record', icon: Cpu }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-teal-600 text-teal-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notification Toast */}
        {docUpdatedToast && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Document batch submitted for RTO Oracle re-verification.</span>
          </div>
        )}
        {approvedToast && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Digital Vehicle Passport officially approved and signed on Ethereum Sepolia!</span>
          </div>
        )}

        {/* Main Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FDFBF7]">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Vehicle Hero Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-56 h-36 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center shrink-0">
                  <img
                    src={vehicle.image || '/cars/audi_r8_camry.png'}
                    alt={vehicle.shortName || 'Vehicle'}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">RWA Digital Asset</span>
                      <h3 className="text-xl font-heading font-extrabold text-slate-900">
                        {vehicle.shortName || vehicle.model || '1969 Dodge Charger R/T / Camry XSE'} ({vehicle.year || '2022'})
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400 uppercase block">Verified Price</span>
                      <span className="text-lg font-heading font-extrabold text-teal-800">{priceInr}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Odometer</span>
                      <strong className="text-slate-800">{vehicle.mileage || '24,850 mi'}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Title Status</span>
                      <strong className="text-emerald-700">Clean Title</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Accidents</span>
                      <strong className="text-emerald-700">0 Reported</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Registration</span>
                      <strong className="text-slate-800">Active (MH02)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three Core Verification Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-teal-200/80 shadow-xs flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Vehicle Verified</h4>
                    <p className="text-[11px] text-slate-500">Chassis & Engine OEM Match</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-teal-200/80 shadow-xs flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Documents Verified</h4>
                    <p className="text-[11px] text-slate-500">RTO Title, Tax & Insurance Clean</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-teal-200/80 shadow-xs flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Ownership Verified</h4>
                    <p className="text-[11px] text-slate-500">Cryptographically Signed Deed</p>
                  </div>
                </div>
              </div>

              {/* Passport Specs Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider mb-4">
                  Cryptographic Passport Status Matrix
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Vehicle ID:</span>
                    <strong className="font-mono text-slate-800">{vehicle.id || 'CN-48291'}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Current Owner:</span>
                    <strong className="font-mono text-slate-800">Vikram Singhania</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Ownership History:</span>
                    <strong className="text-teal-800">1 Prior Owner</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Insurance Status:</span>
                    <strong className="text-emerald-700">Active (Comprehensive)</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Finance / Lien:</span>
                    <strong className="text-emerald-700">No Active Hypothecation</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">Inspection Node:</span>
                    <strong className="text-slate-800">MH RTO Node #409</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-heading font-bold text-slate-900">
                  Immutable Ownership & Maintenance History
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological records cryptographically attested by certified service and inspection nodes on Ethereum Sepolia.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                {(vehicle.passportTimeline || [
                  {
                    year: '2022',
                    date: '12 Apr 2022',
                    title: 'Factory Assembly & First Registration',
                    location: 'OEM Certified Hub',
                    mileage: '0 mi',
                    txHash: '0xa49effb9e3b3fac0478b7ea82bed5ce9d9e2c560aa491e1d69e8dccf34640dde',
                    verifiedBy: 'OEM Manufacturer Node'
                  },
                  {
                    year: '2024',
                    date: '15 Jan 2024',
                    title: 'Scheduled Maintenance & 100-Point Inspection',
                    location: 'Apex Euro Service Center',
                    mileage: '14,200 mi',
                    txHash: '0x226d2025b0e5c1dd9faa34afc04d7fadcd915b4b25e154060345f0741e1296b3',
                    verifiedBy: 'Certified Service Node #12'
                  },
                  {
                    year: '2026',
                    date: '12 Sep 2026',
                    title: 'carNodes Digital Vehicle Passport Minted',
                    location: 'Ethereum Sepolia Testnet',
                    mileage: '24,850 mi',
                    txHash: '0x5d7af784023ab5a42548ecfba2bbb97e81e75caedeec8b5703810b9b1d2b4eb7',
                    verifiedBy: 'carNodes Authority Oracle'
                  }
                ]).map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-teal-600 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <span className="text-[11px] font-mono text-slate-500">{item.date}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>📍 {item.location}</span>
                        <span>⏱️ {item.mileage}</span>
                        <a
                          href={`${ETHERSCAN_BASE}/tx/${item.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[10px] text-teal-700 hover:text-teal-900 flex items-center gap-0.5 break-all"
                        >
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          {item.txHash.slice(0, 18)}...
                        </a>
                        <span className="text-[11px] text-emerald-700 font-medium">✓ {item.verifiedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-sm font-heading font-bold text-slate-900 mb-1">
                  Verified Document Evidence (IPFS Encrypted)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Original title documents, emission certificates, and inspection photos hashed to decentralized storage.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { name: 'RTO Form 23 Registration Certificate', type: 'Official Title', status: 'Verified', size: '2.4 MB', hash: 'QmX89...a1b2' },
                    { name: 'Comprehensive Insurance Policy Certificate', type: 'Insurance', status: 'Verified', size: '1.8 MB', hash: 'QmZ44...99ef' },
                    { name: '120-Point Multi-Diagnostic Physical Inspection', type: 'Inspection', status: 'Verified', size: '4.2 MB', hash: 'QmW12...77ab' },
                    { name: 'Bank Hypothecation Clearance (NOC)', type: 'Finance', status: 'Verified', size: '1.1 MB', hash: 'QmK99...33cd' },
                    { name: 'Chassis VIN Engraving High-Res Telemetry Scan', type: 'Chassis Match', status: 'Verified', size: '3.6 MB', hash: 'QmR77...88ff' }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0">
                        <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{doc.type} • {doc.size} • {doc.hash}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BLOCKCHAIN */}
          {activeTab === 'blockchain' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 font-mono text-xs">
              <div>
                <h3 className="text-sm font-heading font-bold text-slate-900 font-sans">
                  Ethereum Sepolia Verified Record
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Immutable smart contract passport state on Ethereum Sepolia Testnet.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-teal-300 space-y-2 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Smart Contract:</span>
                  <span className="text-white">0x2b89...41c2 (carNodesPassport.sol)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Token Standard:</span>
                  <span className="text-teal-400 font-bold">ERC-721 RWA Standard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Token ID:</span>
                  <span className="text-white">482910</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IPFS Metadata URI:</span>
                  <span className="text-white truncate max-w-[280px]">{vehicle.ipfsHash || 'ipfs://bafybeigx47f3m89a1c2d3e4f5a6b7c8d9e0f1a2b3c'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authority Node Signer:</span>
                  <span className="text-emerald-400">0x892a...9A2C (Verified RTO Oracle)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-sans">
                🔐 The carNodes blockchain layer serves as an immutable, tamper-resistant audit registry that synchronizes with the authorized RTO workflow for zero fraud.
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions (Role-Specific) */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Role Viewing Mode: <strong className="capitalize text-slate-800">{role}</strong>
          </div>

          <div className="flex items-center space-x-3">
            {role === 'buyer' && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Close Passport
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onProceedPurchaseByBuyer) onProceedPurchaseByBuyer(vehicle);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Purchase</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {role === 'seller' && (
              <>
                <button
                  type="button"
                  onClick={handleSellerUpdate}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span>Update Documents</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Passport Ready
                </button>
              </>
            )}

            {role === 'authority' && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                >
                  Request Correction
                </button>
                <button
                  type="button"
                  onClick={handleAuthorityApprove}
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign & Approve Passport</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
