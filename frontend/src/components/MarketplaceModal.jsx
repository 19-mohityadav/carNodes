import React, { useState } from 'react';
import { X, Search, SlidersHorizontal, Award, CheckCircle2, ShieldCheck, ArrowRight, Lock, Car, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { initiateBuyerEscrow } from '../services/blockchainService';
import { ETHERSCAN_BASE, CONTRACT_ADDRESSES } from '../contracts/addresses';
import { shortAddress } from '../utils/format';

export default function MarketplaceModal({ 
  isOpen, 
  onClose, 
  vehicles, 
  onSelectVehicle, 
  onOpenWalletModal,
  walletConnected 
}) {
  if (!isOpen) return null;

  const { signer, account, connect } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [minTrustScore, setMinTrustScore] = useState(90);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isProcessingEscrow, setIsProcessingEscrow] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);

  const filteredVehicles = vehicles.filter(car => {
    const matchesSearch = car.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          car.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrust = car.trustScore >= minTrustScore;
    const matchesPrice = car.priceUsd <= maxPrice;
    return matchesSearch && matchesTrust && matchesPrice;
  });

  const handleInitiateEscrow = async () => {
    setTxError(null);
    if (!walletConnected && !signer) {
      if (onOpenWalletModal) onOpenWalletModal();
      else if (connect) await connect();
      return;
    }

    setIsProcessingEscrow(true);
    try {
      const res = await initiateBuyerEscrow({
        signer,
        tokenId: 1,
        vin: selectedVehicle.vin || 'VIN-CN-48291',
        amountEth: '0.0001',
        vehicleName: selectedVehicle.model,
      });

      setTxHash(res.txHash);
      setPurchaseSuccess(true);
    } catch (err) {
      console.error('Escrow on-chain error:', err);
      const msg = err.reason || err.message || 'Transaction could not be completed on Sepolia.';
      if (msg.toLowerCase().includes('user rejected') || msg.toLowerCase().includes('action_rejected')) {
        setTxError('Transaction was rejected in your Web3 wallet.');
      } else {
        setTxError(msg.length > 120 ? msg.slice(0, 120) + '...' : msg);
      }
    } finally {
      setIsProcessingEscrow(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FDFBF7] w-full max-w-6xl h-[92vh] rounded-3xl border border-zinc-300 shadow-2xl flex flex-col overflow-hidden">
        
        {/* MODAL HEADER BAR */}
        <div className="bg-[#2B2521] text-white p-5 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF3B30] flex items-center justify-center font-bold text-white">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-extrabold uppercase tracking-tight">
                Verified RWA Vehicle Marketplace
              </h2>
              <span className="text-xs font-mono text-zinc-400">
                Showing {filteredVehicles.length} Verified Node Listings
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="p-4 bg-white border-b border-zinc-200 flex flex-wrap gap-4 items-center justify-between shrink-0">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Model, VIN, or Passport ID (#CN-48291)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-300 focus:border-[#FF3B30] focus:outline-none text-xs font-sans"
            />
          </div>

          {/* Min Trust Score Filter */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#6E6259]">Min Trust:</span>
            <select
              value={minTrustScore}
              onChange={(e) => setMinTrustScore(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-zinc-300 bg-white font-bold text-[#111111]"
            >
              <option value={80}>80+ Trust Score</option>
              <option value={90}>90+ Trust Score</option>
              <option value={95}>95+ Elite Trust</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#6E6259]">Max Price:</span>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-zinc-300 bg-white font-bold text-[#111111]"
            >
              <option value={50000}>Under $50,000</option>
              <option value={80000}>Under $80,000</option>
              <option value={150000}>All Price Ranges</option>
            </select>
          </div>
        </div>

        {/* BODY CONTENT: GRID + DETAIL SPLIT VIEW */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* VEHICLES GRID (Cols 1-7) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto divide-y divide-zinc-200 space-y-4 bg-zinc-50/50">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-16 text-[#6E6259]">
                <p className="font-mono text-sm">No vehicles match your search filters.</p>
              </div>
            ) : (
              filteredVehicles.map((car) => {
                const isSelected = selectedVehicle.id === car.id;
                return (
                  <div
                    key={car.id}
                    onClick={() => {
                  if (!walletConnected) {
                    onOpenWalletModal();
                    return;
                  }
                  setSelectedVehicle(car);
                }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row gap-4 items-center ${
                      isSelected
                        ? 'bg-white border-[#FF3B30] shadow-md ring-2 ring-[#FF3B30]/10'
                        : 'bg-white border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {/* Car Image Thumbnail */}
                    <div className="w-full sm:w-40 h-24 bg-[#FDFBF7] rounded-xl border border-zinc-200 p-2 flex items-center justify-center shrink-0">
                      <img src={car.image} alt={car.model} className="max-h-full max-w-full object-contain" />
                    </div>

                    {/* Car Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono text-[#FF3B30] font-bold">{car.id}</span>
                        <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Trust {car.trustScore}/100
                        </span>
                      </div>

                      <h3 className="text-sm font-heading font-extrabold text-[#111111] truncate">{car.model}</h3>
                      <p className="text-[11px] font-mono text-[#6E6259]">VIN: {car.vin}</p>

                      <div className="mt-2 flex items-center justify-between pt-2 border-t border-zinc-100">
                        <span className="text-sm font-heading font-extrabold text-[#2B2521]">
                          ${car.priceUsd.toLocaleString()}
                        </span>
                        <span className="text-xs font-mono text-[#B36B39] font-bold">
                          {car.priceAlgo.toLocaleString()} ALGO
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* VEHICLE INSPECTION & ESCROW ACTION (Cols 8-12) */}
          <div className="lg:col-span-5 p-6 bg-white border-l border-zinc-200 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
                <span className="text-xs font-mono uppercase font-bold text-[#B36B39]">Inspected Asset Specification</span>
                <span className="text-xs font-mono font-bold text-[#FF3B30]">{selectedVehicle.id}</span>
              </div>

              {/* Selected Car Title */}
              <h3 className="text-xl font-heading font-extrabold text-[#111111] leading-snug mb-1">
                {selectedVehicle.model}
              </h3>
              <p className="text-xs font-mono text-[#6E6259] mb-4">VIN: {selectedVehicle.vin}</p>

              {/* Image Preview */}
              <div className="w-full h-44 bg-[#FDFBF7] rounded-2xl border border-zinc-200 p-4 flex items-center justify-center mb-4">
                <img src={selectedVehicle.image} alt={selectedVehicle.model} className="max-h-full object-contain drop-shadow-md" />
              </div>

              {/* Price & Valuation Fairness */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-4 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono text-[#6E6259]">Listed Price:</span>
                  <span className="text-2xl font-heading font-extrabold text-[#111111]">
                    ${selectedVehicle.priceUsd.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#6E6259]">AI Valuation:</span>
                  <span className="text-emerald-700 font-bold">{selectedVehicle.valuation.fairness}</span>
                </div>
              </div>

              {/* Authority Checkmarks */}
              <div className="space-y-2 mb-6">
                <span className="text-xs font-mono uppercase text-[#6E6259] block font-bold">Verification Oracles:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 bg-[#FDFBF7] p-2 rounded-lg border border-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Clean Title</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-[#FDFBF7] p-2 rounded-lg border border-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>0 Accidents</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ESCROW PURCHASE ACTION */}
            <div className="space-y-3">
              {txError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-800 block">Transaction Error</span>
                    <span className="text-red-700">{txError}</span>
                  </div>
                </div>
              )}
              {purchaseSuccess && txHash ? (
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl space-y-3 font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">Escrow Locked on Sepolia!</h4>
                      <p className="text-[11px] text-emerald-700">Real transaction broadcast to Ethereum Sepolia.</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-emerald-200 p-3 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Transaction Hash</span>
                    <span className="font-mono text-[11px] text-slate-800 break-all block">{txHash}</span>
                  </div>
                  <a
                    href={`${ETHERSCAN_BASE}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View on Sepolia Etherscan →
                  </a>
                  <button
                    onClick={() => { setPurchaseSuccess(false); setTxHash(null); setTxError(null); }}
                    className="w-full mt-1 text-xs text-emerald-700 hover:underline font-bold"
                  >
                    Close & Reset
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleInitiateEscrow}
                  disabled={isProcessingEscrow}
                  className="w-full py-4 rounded-2xl bg-[#2B2521] hover:bg-[#FF3B30] disabled:opacity-70 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isProcessingEscrow ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Broadcasting to Sepolia...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Lock Funds in Sepolia Escrow (0.0001 ETH)</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
