import React, { useState } from 'react';
import {
  Plus,
  Car,
  FileCheck,
  Bot,
  Users,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Sparkles,
  ChevronRight,
  Edit,
  Eye,
  Check,
  X,
  Building2
} from 'lucide-react';
import GlobalVehicleCard from './GlobalVehicleCard';

export default function SellerDashboardView({
  vehicles = [],
  activeTab,
  onOpenPassport,
  onSelectVehicle
}) {
  const safeVehicles = Array.isArray(vehicles) && vehicles.length > 0 ? vehicles : [];

  // Create Listing Modal / Form Wizard Step (1 to 4)

  const [listingStep, setListingStep] = useState(1);
  const [formData, setFormData] = useState({
    make: 'Audi',
    model: 'R8 V10 Performance',
    year: '2023',
    registration: 'CA-9812-409',
    mileage: '12,400 mi',
    priceUsd: '145000',
    vin: 'WAUZZZF88NA009812',
  });

  // Seller Buyer Offers / Inquiries list
  const [buyerOffers, setBuyerOffers] = useState([
    {
      id: 1,
      buyerName: 'Alex Mercer',
      vehicle: '2022 Toyota Camry XSE / Audi R8 V10',
      offerPrice: 47500,
      askingPrice: 48500,
      status: 'Pending Review',
      date: 'Today, 2:15 PM'
    },
    {
      id: 2,
      buyerName: 'Sarah Jenkins',
      vehicle: '2023 Audi TT RS Coupé',
      offerPrice: 62000,
      askingPrice: 62900,
      status: 'Verification Requested',
      date: 'Yesterday'
    }
  ]);

  const handleNextListingStep = () => {
    if (listingStep < 4) setListingStep(listingStep + 1);
  };

  const handlePrevListingStep = () => {
    if (listingStep > 1) setListingStep(listingStep - 1);
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ──────────────────────────────────────────────────────────
          TAB 1: SELLER HOME & SUMMARY
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <>
          {/* SELLER HOME HEADER */}
          <div className="bg-[#2B2521] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider border border-slate-700">
                <Building2 className="w-3.5 h-3.5" />
                <span>SELLER WORKSPACE ACTIVE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-heading tracking-tight">
                Welcome back, Apex Motors 👋
              </h1>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                Manage your vehicle portfolio with confidence. Mint digital RWA passports, verify titles, and accept instant escrow payments.
              </p>
            </div>

            <div className="flex items-center gap-3 relative z-10 shrink-0">
              <a
                href="#create-listing"
                onClick={(e) => { e.preventDefault(); alert('Switched to Create Listing Wizard'); }}
                className="px-6 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0B7A70] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Vehicle</span>
              </a>

              <button
                onClick={() => alert('View all active listings')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all duration-200 cursor-pointer"
              >
                View Listings
              </button>
            </div>
          </div>

          {/* SELLER SUMMARY CARDS (EXACTLY 4 CARDS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#6E6259] font-bold block">Active Listings</span>
                <span className="text-2xl font-heading font-extrabold text-[#111111] mt-1 block">4</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 text-[#2B2521] flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#6E6259] font-bold block">Verified Vehicles</span>
                <span className="text-2xl font-heading font-extrabold text-emerald-700 mt-1 block">3</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#6E6259] font-bold block">Buyer Interest</span>
                <span className="text-2xl font-heading font-extrabold text-[#0D9488] mt-1 block">18</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#6E6259] font-bold block">Pending Transfers</span>
                <span className="text-2xl font-heading font-extrabold text-amber-700 mt-1 block">1</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* MY VEHICLES TABLE LAYOUT */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-lg font-heading font-extrabold text-[#111111] uppercase tracking-tight">
                  My Managed Vehicles
                </h2>
                <p className="text-xs font-mono text-[#6E6259]">Track verification status, buyer offers & passport minting</p>
              </div>

              <button
                onClick={() => alert('Opening listing wizard')}
                className="px-4 py-2 rounded-xl bg-[#2B2521] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Listing</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 font-mono uppercase">
                    <th className="pb-3 font-semibold">Vehicle</th>
                    <th className="pb-3 font-semibold">Listing Price</th>
                    <th className="pb-3 font-semibold">Verification Status</th>
                    <th className="pb-3 font-semibold">Risk Status</th>
                    <th className="pb-3 font-semibold">Listing Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {safeVehicles.map((car) => (
                    <tr key={car.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 font-bold font-heading text-zinc-900 flex items-center space-x-3">
                        <img src={car.image} alt={car.shortName} className="w-12 h-9 rounded-lg object-cover" />
                        <div>
                          <div className="text-sm">{car.model}</div>
                          <span className="text-[10px] font-mono text-zinc-400">VIN: {car.vin}</span>
                        </div>
                      </td>

                      <td className="py-4 font-extrabold font-mono text-zinc-900">${car.priceUsd?.toLocaleString()}</td>

                      <td className="py-4 font-mono font-bold text-emerald-700">
                        <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>✓ Verified Title</span>
                        </span>
                      </td>

                      <td className="py-4 font-mono">
                        <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold">
                          Low Risk ({car.trustScore}/100)
                        </span>
                      </td>

                      <td className="py-4 font-mono">
                        <span className="bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                          Listed Live
                        </span>
                      </td>

                      <td className="py-4 text-right space-x-1.5">
                        <button
                          onClick={() => onOpenPassport(car)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-[11px]"
                        >
                          Passport
                        </button>
                        <button
                          onClick={() => onSelectVehicle(car)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#2B2521] text-white hover:bg-[#0D9488] font-bold text-[11px]"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 2: CREATE VEHICLE LISTING MULTI-STEP WIZARD
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'create' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl font-heading font-extrabold uppercase text-[#111111] tracking-tight">
              Create Vehicle Listing
            </h1>
            <p className="text-xs font-mono text-[#6E6259]">Mint a Real-World Asset (RWA) digital passport and list your car on carNodes</p>
          </div>

          {/* STEP PROGRESS INDICATOR */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { num: '01', label: 'Vehicle Details' },
              { num: '02', label: 'Documents' },
              { num: '03', label: 'Verification' },
              { num: '04', label: 'Publish' },
            ].map((step, idx) => {
              const isCurrent = listingStep === idx + 1;
              const isPast = listingStep > idx + 1;
              return (
                <div
                  key={idx}
                  onClick={() => setListingStep(idx + 1)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-[#0D9488] bg-teal-50/50 ring-2 ring-[#0D9488]/30 font-bold'
                      : isPast
                      ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-400'
                  }`}
                >
                  <div className="text-[10px] font-mono text-zinc-400">STEP {step.num}</div>
                  <div className="text-xs font-heading font-bold text-zinc-900 mt-0.5">{step.label}</div>
                </div>
              );
            })}
          </div>

          {/* STEP 1: VEHICLE DETAILS */}
          {listingStep === 1 && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-mono font-bold uppercase text-[#6E6259]">Step 01: Core Vehicle Identity</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Vehicle Make & Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-[#0D9488]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Chassis VIN Number</label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-mono uppercase focus:outline-none focus:border-[#0D9488]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Model Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-[#0D9488]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Listing Price (USD $)</label>
                  <input
                    type="text"
                    value={formData.priceUsd}
                    onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-mono font-bold focus:outline-none focus:border-[#0D9488]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DOCUMENTS UPLOAD */}
          {listingStep === 2 && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-mono font-bold uppercase text-[#6E6259]">Step 02: Verification Documents Upload</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Registration Certificate (RC)',
                  'Insurance Policy Certificate',
                  'Ownership Proof Deed',
                  'RTO Pre-Inspection Report',
                ].map((docName, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 text-center hover:border-[#0D9488] transition-colors cursor-pointer space-y-1">
                    <Upload className="w-6 h-6 text-zinc-400 mx-auto" />
                    <div className="text-xs font-bold text-zinc-800">{docName}</div>
                    <p className="text-[10px] font-mono text-zinc-400">PDF, PNG, or JPG (Max 15MB)</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: VERIFICATION STATUS */}
          {listingStep === 3 && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-mono font-bold uppercase text-[#6E6259]">Step 03: Automated Risk & Title Checks</h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-emerald-950">DMV Database VIN Query Passed</span>
                  </div>
                  <span className="text-emerald-700 font-bold">✓ 0 Liens</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-emerald-950">IPFS Document Cryptographic Hashing</span>
                  </div>
                  <span className="text-emerald-700 font-bold">✓ Hashed</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PUBLISH */}
          {listingStep === 4 && (
            <div className="space-y-4 pt-4 border-t border-zinc-100 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-heading font-extrabold text-zinc-900">Ready to Publish RWA Passport!</h3>
              <p className="text-xs text-zinc-600 max-w-md mx-auto">
                Your vehicle identity will be minted on Algorand MainNet and listed on the verified carNodes marketplace.
              </p>
            </div>
          )}

          {/* WIZARD NAVIGATION CONTROLS */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <button
              onClick={handlePrevListingStep}
              disabled={listingStep === 1}
              className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 disabled:opacity-40"
            >
              Previous
            </button>

            {listingStep < 4 ? (
              <button
                onClick={handleNextListingStep}
                className="px-6 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0B7A70] text-white font-bold text-xs uppercase"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={() => alert('Vehicle published successfully to carNodes RWA Registry!')}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase"
              >
                Confirm & Publish Vehicle
              </button>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 3: AI SELLER VALUATION & PRICING AGENT
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'ai-pricing' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B2521] text-white flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-extrabold uppercase text-[#111111] tracking-tight">
                AI Seller Valuation Agent
              </h1>
              <p className="text-xs font-mono text-[#6E6259]">Intelligent market pricing algorithms & listing optimization</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-3">
              <span className="text-xs font-mono uppercase text-[#6E6259] font-bold block">Suggested Market Price</span>
              <div className="text-3xl font-heading font-extrabold text-zinc-900">$48,500</div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                Price Confidence: High (99.1%)
              </div>
              <button
                onClick={() => alert('Suggested price applied to listing!')}
                className="w-full py-2.5 rounded-xl bg-[#0D9488] text-white font-bold text-xs uppercase mt-2 cursor-pointer"
              >
                Use Suggested Price
              </button>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-3">
              <h3 className="text-sm font-heading font-bold text-zinc-900 uppercase">Automated AI Description Generator</h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-mono bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                "Pristine 2022 Toyota Camry XSE / Audi R8 V10 with Daytona Grey Pearl finish. 24,850 verified miles, certified by San Francisco RTO #409. Complete 100% IPFS digital passport with zero accident history and smart contract escrow protection."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 4: BUYER REQUESTS & OFFERS
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-extrabold uppercase text-[#111111] tracking-tight">
              Buyer Inquiries & Price Offers
            </h1>
            <p className="text-xs font-mono text-[#6E6259]">Review incoming purchase offers and verify buyer escrows</p>
          </div>

          <div className="space-y-3">
            {buyerOffers.map((offer) => (
              <div key={offer.id} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-zinc-900 font-heading">{offer.buyerName}</h3>
                    <span className="text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                      {offer.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">{offer.vehicle}</p>
                  <span className="text-[10px] font-mono text-zinc-400">{offer.date}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase">Offer Price</span>
                    <strong className="text-base font-heading text-[#0D9488]">${offer.offerPrice?.toLocaleString()}</strong>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => alert(`Offer from ${offer.buyerName} accepted! Initiating ownership transfer.`)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => alert('Offer declined')}
                      className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs uppercase"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
