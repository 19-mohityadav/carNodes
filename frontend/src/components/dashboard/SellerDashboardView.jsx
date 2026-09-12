import React, { useState } from 'react';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  BadgeDollarSign,
  ArrowRightLeft,
  Files,
  User,
  CheckCircle2,
  Award,
  ArrowRight,
  Sparkles,
  Upload,
  FileText,
  Clock,
  Check,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Bot
} from 'lucide-react';
import { MOCK_SELLER_DATA } from '../../data/dashboardData';
import { VEHICLES } from '../../data/vehicles';

export default function SellerDashboardView({
  activeTab,
  onSelectTab,
  onOpenPassport
}) {
  const [vehiclesList, setVehiclesList] = useState(MOCK_SELLER_DATA.vehicles);
  const [buyerRequests, setBuyerRequests] = useState(MOCK_SELLER_DATA.buyerRequests);
  
  // Create Listing Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [listingForm, setListingForm] = useState({
    make: 'Audi',
    model: 'R8 V10 Coupé',
    year: '2023',
    registration: 'MH 02 ER 4829',
    mileage: '12,500 mi',
    vehicleId: 'CN-88192',
    priceInr: '₹1,45,00,000',
    docRegistration: true,
    docInsurance: true,
    docOwnership: true,
    docInspection: true
  });
  const [listingSubmitted, setListingSubmitted] = useState(false);

  const handleRequestAction = (reqId, action) => {
    setBuyerRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: action === 'accept' ? 'Accepted - Escrow Initiated' : 'Declined' } : r))
    );
  };

  const handlePublishListing = (e) => {
    e.preventDefault();
    setListingSubmitted(true);
    setTimeout(() => {
      const newCar = {
        id: listingForm.vehicleId,
        name: `${listingForm.year} ${listingForm.make} ${listingForm.model}`,
        year: listingForm.year,
        image: '/cars/audi_r8_camry.png',
        priceInr: listingForm.priceInr,
        priceUsd: '$165,000',
        verificationStatus: 'Under Review',
        riskStatus: 'LOW',
        listingStatus: 'Pending Oracle Sign',
        views: 0,
        inquiries: 0,
        trustScore: 95
      };
      setVehiclesList([newCar, ...vehiclesList]);
      setListingSubmitted(false);
      setWizardStep(1);
      onSelectTab('my-vehicles');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ==========================================================
          1. SELLER DASHBOARD HOME
      ========================================================== */}
      {activeTab === 'dashboard' && (
        <>
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-semibold border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>SELLER WORKSPACE • {MOCK_SELLER_DATA.company}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
                Welcome back, {MOCK_SELLER_DATA.name}
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Manage your vehicles with confidence. Monitor RTO verification, incoming buyer requests, and multi-sig escrow transfers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => onSelectTab('create-listing')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>+ Add Vehicle</span>
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTab('my-vehicles')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>View Listings</span>
              </button>
            </div>
          </div>

          {/* ==========================================================
              SELLER SUMMARY — EXACTLY FOUR COMPACT CARDS
          ========================================================== */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                Seller Performance Overview
              </h3>
              <span className="text-xs font-mono text-teal-700 font-bold">4 Verified Assets Live</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Active Listings</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {MOCK_SELLER_DATA.stats.activeListings}
                  </span>
                  <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                    All Active
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Verified Vehicles</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {MOCK_SELLER_DATA.stats.verifiedVehicles}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    100% Stamped
                  </span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Buyer Interest</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {MOCK_SELLER_DATA.stats.buyerInterest}
                  </span>
                  <button onClick={() => onSelectTab('buyer-requests')} className="text-xs text-teal-700 hover:underline font-semibold cursor-pointer">
                    3 new offers
                  </button>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Pending Transfers</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {MOCK_SELLER_DATA.stats.pendingTransfers}
                  </span>
                  <button onClick={() => onSelectTab('transfer')} className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
                    Awaiting RTO
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Vehicle Inventory Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-slate-900">
                  Vehicle Inventory & Listing Status
                </h3>
                <p className="text-xs text-slate-500">
                  Manage digital passports, pricing recommendations, and buyer inquiries.
                </p>
              </div>
              <button
                onClick={() => onSelectTab('my-vehicles')}
                className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
              >
                View Full Inventory →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehiclesList.slice(0, 2).map((car) => (
                <div key={car.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={car.image} alt={car.name} className="w-16 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{car.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{car.priceInr} • {car.views} Views</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenPassport(VEHICLES.find((v) => v.id === car.id) || VEHICLES[0])}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-teal-800 hover:border-teal-300 text-xs font-semibold cursor-pointer"
                  >
                    Passport
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ==========================================================
          2. MY VEHICLES MANAGEMENT VIEW
      ========================================================== */}
      {activeTab === 'my-vehicles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-slate-900">
                My Vehicle Inventory ({vehiclesList.length})
              </h2>
              <p className="text-xs text-slate-500">
                Track status, passport completeness, and active buyer engagement for each listed vehicle.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('create-listing')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create Listing</span>
            </button>
          </div>

          {/* Table / Card List */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Vehicle Asset</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Verification</th>
                    <th className="py-4 px-4">Risk Status</th>
                    <th className="py-4 px-4">Listing Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehiclesList.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img src={car.image} alt={car.name} className="w-14 h-10 object-contain bg-slate-100 rounded-lg p-1 border border-slate-200" />
                          <div>
                            <span className="font-bold text-slate-900 block">{car.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {car.id} • Trust {car.trustScore}/100</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 block">{car.priceInr}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{car.priceUsd}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{car.verificationStatus}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[10px] border border-teal-200">
                          {car.riskStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-700">{car.listingStatus}</span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => onOpenPassport(VEHICLES.find((v) => v.id === car.id) || VEHICLES[0])}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 text-xs font-semibold cursor-pointer"
                        >
                          Passport
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          3. CREATE VEHICLE LISTING WIZARD (4-STEP)
      ========================================================== */}
      {activeTab === 'create-listing' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-mono text-teal-700 font-bold uppercase tracking-wider block">
                Listing Creation Wizard
              </span>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                Mint & List a Verified Vehicle
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-step cryptographic verification ensures your vehicle receives maximum trust score and instant buyer interest.
              </p>
            </div>

            {/* Step Progress Bar */}
            <div className="grid grid-cols-4 gap-2 mb-8 text-center text-xs font-mono font-bold">
              {[
                { step: 1, label: '01. Details' },
                { step: 2, label: '02. Documents' },
                { step: 3, label: '03. Verification' },
                { step: 4, label: '04. Publish' }
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => setWizardStep(s.step)}
                  className={`py-2 px-1 rounded-xl border transition-all cursor-pointer ${
                    wizardStep === s.step
                      ? 'bg-slate-900 text-white border-slate-900'
                      : wizardStep > s.step
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>

            <form onSubmit={handlePublishListing} className="space-y-5">
              {/* STEP 1: VEHICLE DETAILS */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-heading font-bold text-slate-900">
                    Step 01: Vehicle Specifications
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Make</label>
                      <input
                        type="text"
                        value={listingForm.make}
                        onChange={(e) => setListingForm({ ...listingForm, make: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Model Spec</label>
                      <input
                        type="text"
                        value={listingForm.model}
                        onChange={(e) => setListingForm({ ...listingForm, model: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Year of Manufacture</label>
                      <input
                        type="text"
                        value={listingForm.year}
                        onChange={(e) => setListingForm({ ...listingForm, year: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Registration (RTO Plate)</label>
                      <input
                        type="text"
                        value={listingForm.registration}
                        onChange={(e) => setListingForm({ ...listingForm, registration: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Odometer Mileage</label>
                      <input
                        type="text"
                        value={listingForm.mileage}
                        onChange={(e) => setListingForm({ ...listingForm, mileage: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Asking Price (₹)</label>
                      <input
                        type="text"
                        value={listingForm.priceInr}
                        onChange={(e) => setListingForm({ ...listingForm, priceInr: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600 font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Proceed to Documents</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DOCUMENTS */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-heading font-bold text-slate-900">
                    Step 02: Upload Document Evidence (IPFS Encrypted)
                  </h3>

                  <div className="space-y-3 text-xs">
                    {[
                      { id: 'docRegistration', title: 'RTO Registration Certificate (RC)', desc: 'Official paper / smart card title deed' },
                      { id: 'docInsurance', title: 'Comprehensive Active Insurance Policy', desc: 'Valid minimum 6 months from listing' },
                      { id: 'docOwnership', title: 'Seller Ownership Proof / Invoice', desc: 'Proof of legal right to sell' },
                      { id: 'docInspection', title: '120-Point Multi-Diagnostic Inspection Evidence', desc: 'Authorized diagnostic report scan' }
                    ].map((d) => (
                      <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{d.title}</p>
                          <p className="text-[11px] text-slate-500">{d.desc}</p>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold">
                          ✓ Encrypted IPFS Uploaded
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Run Verification Check</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: VERIFICATION */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-heading font-bold text-slate-900">
                    Step 03: Automated Oracle Pre-Verification
                  </h3>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">Document Consistency Check:</span>
                      <strong className="text-emerald-700">✓ 100% Match</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">VAHAN / RTO Database Query:</span>
                      <strong className="text-emerald-700">✓ Clean Title Verified</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">Hypothecation / Lien Check:</span>
                      <strong className="text-emerald-700">✓ 0 Outstanding Liens</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">AI Risk Assessment:</span>
                      <strong className="text-teal-700">LOW RISK (Score 95/100)</strong>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Review & Confirm</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PUBLISH */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-heading font-bold text-slate-900">
                    Step 04: Review & Publish to Marketplace
                  </h3>

                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-2">
                    <p className="font-bold">
                      Vehicle Ready for Ethereum Sepolia RWA Minting
                    </p>
                    <p className="text-[11px] text-teal-800">
                      {listingForm.year} {listingForm.make} {listingForm.model} ({listingForm.registration}) will be listed with price {listingForm.priceInr}.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={listingSubmitted}
                      className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
                    >
                      {listingSubmitted ? (
                        <span>Minting on Sepolia...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Publish Vehicle</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          4. AI PRICING ASSISTANT VIEW
      ========================================================== */}
      {activeTab === 'ai-pricing' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-semibold">
                <Bot className="w-3.5 h-3.5 text-teal-600" />
                <span>AI SELLER AGENT</span>
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                Suggested Market Valuation
              </h2>
              <p className="text-xs text-slate-500">
                Data-backed pricing intelligence calculated from live dealer transactions, RTO transfers, and condition telemetry.
              </p>
            </div>

            {/* Price Card */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">Suggested Market Price</span>
                  <span className="text-3xl font-heading font-extrabold text-teal-400">
                    {MOCK_SELLER_DATA.aiPricingAssistant.suggestedPriceInr}
                  </span>
                  <span className="text-xs font-mono text-slate-400 block mt-0.5">
                    ({MOCK_SELLER_DATA.aiPricingAssistant.suggestedPriceUsd})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Price Confidence</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {MOCK_SELLER_DATA.aiPricingAssistant.confidence}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                {MOCK_SELLER_DATA.aiPricingAssistant.reasoning}
              </p>

              <button
                onClick={() => alert("Suggested price applied to listing!")}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Use Suggested Price
              </button>
            </div>

            {/* Generated Description Area */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                AI Generated Verified Listing Description
              </span>
              <p className="text-slate-700 leading-relaxed font-sans">
                {MOCK_SELLER_DATA.aiPricingAssistant.listingDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          5. BUYER REQUESTS & OFFERS VIEW
      ========================================================== */}
      {(activeTab === 'buyer-requests' || activeTab === 'offers') && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Buyer Inquiries & Purchase Offers ({buyerRequests.length})
            </h2>
            <p className="text-xs text-slate-500">
              Review verified buyer offers and initialize Ethereum Sepolia smart escrow.
            </p>
          </div>

          <div className="space-y-4">
            {buyerRequests.map((req) => (
              <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{req.buyerName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200">
                      {req.requestType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold">{req.vehicleName}</p>
                  <p className="text-xs text-slate-500 italic">"{req.message}"</p>
                  <p className="text-[10px] font-mono text-slate-400">{req.date}</p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right mr-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Offer Amount</span>
                    <span className="text-base font-heading font-extrabold text-slate-900">{req.offerInr}</span>
                  </div>

                  {req.status === 'Offer Received' || req.status === 'Pending Response' ? (
                    <>
                      <button
                        onClick={() => handleRequestAction(req.id, 'decline')}
                        className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleRequestAction(req.id, 'accept')}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Accept & Escrow
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================================
          6. OWNERSHIP TRANSFER WORKFLOW
      ========================================================== */}
      {activeTab === 'transfer' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono text-teal-700 font-bold uppercase tracking-wider block">
                Ownership Transfer Workflow
              </span>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                {MOCK_SELLER_DATA.activeTransfer.vehicleName}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Transfer ID: {MOCK_SELLER_DATA.activeTransfer.id} • Buyer: {MOCK_SELLER_DATA.activeTransfer.buyerName}
              </p>
            </div>

            {/* Stages */}
            <div className="space-y-3">
              {MOCK_SELLER_DATA.activeTransfer.stages.map((stg) => (
                <div
                  key={stg.step}
                  className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
                    stg.status === 'completed'
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : stg.status === 'in_progress'
                      ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-[10px]">
                      0{stg.step}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900">{stg.title}</h4>
                      <p className="text-[11px] text-slate-500">{stg.note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">{stg.date}</span>
                    <span className="font-bold text-[11px] capitalize text-teal-800">{stg.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
