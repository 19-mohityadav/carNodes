import React, { useState } from 'react';
import {
  Compass,
  Bookmark,
  GitCompare,
  FileBadge2,
  Bot,
  ShoppingBag,
  CreditCard,
  Bell,
  User,
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Eye,
  Lock,
  ArrowUpRight,
  FileText,
  History,
  Send,
  RefreshCw,
  Clock,
  ChevronRight,
  ExternalLink,
  Zap,
  SlidersHorizontal,
  AlertCircle
} from 'lucide-react';
import GlobalVehicleCard from './GlobalVehicleCard';
import { VEHICLES } from '../../data/vehicles';
import { MOCK_BUYER_DATA } from '../../data/dashboardData';
import { ETHERSCAN_BASE, CONTRACT_ADDRESSES } from '../../contracts/addresses';
import { useWallet } from '../../context/WalletContext';
import { initiateBuyerEscrow } from '../../services/blockchainService';
import { getAllVehicles } from '../../services/vehicleStore';

export default function BuyerDashboardView({
  activeTab,
  onSelectTab,
  onOpenPassport,
  onOpenVehicleDetail,
  onStartPurchase
}) {
  const { signer, account, connect } = useWallet();
  const [vehiclesData, setVehiclesData] = useState(() => getAllVehicles());
  const [selectedVehicle, setSelectedVehicle] = useState(() => getAllVehicles()[0] || VEHICLES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recommended');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [savedVehicles, setSavedVehicles] = useState(MOCK_BUYER_DATA.savedVehicleIds);

  // Escrow purchase state
  const [isEscrowing, setIsEscrowing] = useState(false);
  const [escrowTxHash, setEscrowTxHash] = useState(null);
  const [escrowError, setEscrowError] = useState(null);
  const [escrowStage, setEscrowStage] = useState(3);
  const [txList, setTxList] = useState(MOCK_BUYER_DATA.transactionsHistory);

  // Reactively listen for new vehicles minted by seller
  React.useEffect(() => {
    const handleVehiclesUpdate = () => {
      setVehiclesData(getAllVehicles());
    };
    window.addEventListener('carnodes_vehicles_updated', handleVehiclesUpdate);
    return () => window.removeEventListener('carnodes_vehicles_updated', handleVehiclesUpdate);
  }, []);
  
  // AI Agent Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hello Arjun! I'm your carNodes AI Vehicle Agent. I analyze real-time RTO databases, telemetry, and Ethereum Sepolia escrow records. Ask me anything before you buy."
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const toggleSaveVehicle = (vehicleId) => {
    if (savedVehicles.includes(vehicleId)) {
      setSavedVehicles(savedVehicles.filter((id) => id !== vehicleId));
    } else {
      setSavedVehicles([...savedVehicles, vehicleId]);
    }
  };

  const handleAskPrompt = (promptText) => {
    setChatMessages((prev) => [...prev, { sender: 'user', text: promptText }]);
    setIsAiTyping(true);

    setTimeout(() => {
      let aiReply = "Based on our 100-point cryptographic analysis, this vehicle has 0 reported accidents, clean title verification with RTO Node #409, and its price is 5.3% below historical market averages.";
      if (promptText.includes('fairly priced')) {
        aiReply = `Yes. The listed price of ₹42,50,000 ($48,500) for ${selectedVehicle.shortName} is rated 'Great Value' (99.1% AI confidence) compared to 32 recent Pan-India sales.`;
      } else if (promptText.includes('risk')) {
        aiReply = "Risk Status: LOW (Trust Score 94/100). No active liens/hypothecations found, odometer verified with OEM telemetry, and comprehensive insurance is active.";
      } else if (promptText.includes('similar')) {
        aiReply = "I recommend comparing with the 2023 Audi TT RS Coupé (#CN-10294) and 2024 Audi RS e-tron GT (#CN-77310). Both feature 100% verified digital vehicle passports.";
      } else if (promptText.includes('history')) {
        aiReply = "Vehicle timeline highlights: 2022 Factory assembly at Neckarsulm, 2024 certified brake service at 14.2k mi, and 2026 digital passport minted on Ethereum Sepolia.";
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setIsAiTyping(false);
    }, 900);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;
    const q = inputQuestion;
    setInputQuestion('');
    handleAskPrompt(q);
  };

  // Filtered vehicles for explorer — only show vehicles listed on marketplace
  const filteredVehicles = vehiclesData.filter((v) => {
    // Check if vehicle has been approved and listed for sale by seller
    const isLiveListing = v.listingStatus === 'Listed on Marketplace' || 
                          v.listingStatus === 'Listed on Sepolia' || 
                          v.listingStatus === 'Listed' ||
                          (!v.listingStatus && v.id?.startsWith('CN-0')); // baseline cars

    if (!isLiveListing) return false;

    const matchesSearch = searchQuery === '' || 
      (v.model && v.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.id && v.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.shortName && v.shortName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.name && v.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ==========================================================
          1. DASHBOARD HOME VIEW
      ========================================================== */}
      {activeTab === 'dashboard' && (
        <>
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
            
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
                Good morning, {MOCK_BUYER_DATA.name}
              </h1>
              <h2 className="text-lg font-heading font-bold text-teal-900">
                Find a verified vehicle.
              </h2>
              
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => onSelectTab('explore')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Explore Vehicles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
            </div>
          </div>

          {/* ==========================================================
              TRUST SUMMARY — EXACTLY FOUR COMPACT CARDS
          ========================================================== */}
          <div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Verified Vehicles Viewed</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {MOCK_BUYER_DATA.stats.verifiedViewed}
                  </span>
                  
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Saved Vehicles</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {savedVehicles.length}
                  </span>
                  <button onClick={() => onSelectTab('saved')} className="text-xs text-teal-700 hover:underline font-semibold cursor-pointer">
                    View list
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Active Transactions</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {MOCK_BUYER_DATA.stats.activeTransactions}
                  </span>
                  <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                    Escrow Stage 3
                  </span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Trust Status</span>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-heading font-extrabold text-teal-800">
                    {MOCK_BUYER_DATA.stats.trustStatus}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================================
              FEATURED VERIFIED VEHICLES — "Verified for You"
          ========================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                
                <p className="text-xs text-slate-500">
                  Hand-picked luxury & performance vehicles with complete RTO and on-chain verification stamps.
                </p>
              </div>
              <button
                onClick={() => onSelectTab('explore')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1 cursor-pointer"
              >
                <span>View All Vehicles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {VEHICLES.slice(0, 3).map((car) => (
                <GlobalVehicleCard
                  key={car.id}
                  vehicle={car}
                  role="buyer"
                  onViewVehicle={(v) => {
                    setSelectedVehicle(v);
                    onSelectTab('vehicle-detail');
                  }}
                  onViewPassport={(v) => onOpenPassport(v)}
                />
              ))}
            </div>
          </div>

          {/* ==========================================================
              ACTIVE TRANSACTION WORKFLOW BANNER (IF ACTIVE)
          ========================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Active Purchase In Progress</span>
                  <h4 className="text-sm font-bold font-heading text-slate-900">
                    {MOCK_BUYER_DATA.activePurchase.vehicleName}
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 block">Locked in Escrow</span>
                <span className="text-base font-heading font-extrabold text-slate-900">
                  {MOCK_BUYER_DATA.activePurchase.priceInr}
                </span>
              </div>
            </div>

            {/* Workflow Progress Indicator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {MOCK_BUYER_DATA.activePurchase.stages.map((stg) => (
                <div
                  key={stg.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    stg.status === 'completed'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : stg.status === 'in_progress'
                      ? 'bg-teal-50 border-teal-300 text-teal-950 ring-2 ring-teal-500/20 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                      Stage 0{stg.id}
                    </span>
                    {stg.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {stg.status === 'in_progress' && <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />}
                  </div>
                  <div className="font-bold font-heading text-slate-900">{stg.title}</div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight">{stg.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deployed Smart Contracts */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              Deployed Smart Contracts · Ethereum Sepolia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { label: 'VehiclePassport NFT', addr: CONTRACT_ADDRESSES.VehiclePassport },
                { label: 'VehicleRegistry', addr: CONTRACT_ADDRESSES.VehicleRegistry },
                { label: 'VehicleEscrow', addr: CONTRACT_ADDRESSES.VehicleEscrow },
                { label: 'MockINR Token', addr: CONTRACT_ADDRESSES.MockINR }
              ].map(c => (
                <div key={c.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">{c.label}</span>
                    <span className="text-slate-800 font-bold truncate block">{c.addr.slice(0, 12)}...{c.addr.slice(-6)}</span>
                  </div>
                  <a
                    href={`${ETHERSCAN_BASE}/address/${c.addr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-teal-700 hover:text-teal-900 p-1"
                    title="View on Etherscan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ==========================================================
          2. EXPLORE VEHICLES VIEW
      ========================================================== */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-slate-900">
                Explore Verified Vehicles
              </h2>
              <p className="text-xs text-slate-500">
                Search make, model or vehicle ID. Every car features 100% verified history and on-chain escrow protection.
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search make, model or vehicle ID (e.g. Camry, TT, RS, CN-48291)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-teal-600 focus:bg-white font-mono"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-teal-600 cursor-pointer"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk Only (Trust &gt; 90)</option>
                  <option value="verified">100% RTO Verified</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-teal-600 cursor-pointer"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="trust">Sort: Trust Score</option>
                  <option value="price-low">Sort: Price (Low to High)</option>
                  <option value="price-high">Sort: Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((car) => (
              <GlobalVehicleCard
                key={car.id}
                vehicle={car}
                role="buyer"
                onViewVehicle={(v) => {
                  setSelectedVehicle(v);
                  onSelectTab('vehicle-detail');
                }}
                onViewPassport={(v) => onOpenPassport(v)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ==========================================================
          3. VEHICLE DETAILS VIEW
      ========================================================== */}
      {activeTab === 'vehicle-detail' && (
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => onSelectTab('explore')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Vehicle Explorer</span>
          </button>

          {/* Main Top Detail Split */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT: Large Vehicle Image */}
            <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <img
                src={selectedVehicle.image || '/cars/audi_r8_camry.png'}
                alt={selectedVehicle.shortName}
                className="w-full max-h-80 object-contain select-none"
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-mono text-slate-600 border border-slate-200">
                <span>Interactive 3D / IPFS Asset</span>
              </div>
            </div>

            {/* RIGHT: Specs & Actions */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Verified Vehicle</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                  {selectedVehicle.id}
                </span>
              </div>

              <h1 className="text-2xl font-heading font-extrabold text-slate-900 leading-tight">
                {selectedVehicle.model} ({selectedVehicle.year || '2022'})
              </h1>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Price</span>
                  <span className="text-xl font-heading font-extrabold text-slate-900">
                    ₹{((selectedVehicle.priceUsd || 45000) * 85).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-mono text-slate-500 block">${selectedVehicle.priceUsd?.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Trust Score</span>
                  <span className="text-base font-mono font-bold text-teal-700">{selectedVehicle.trustScore}/100</span>
                  <span className="text-[10px] font-mono text-emerald-700 block font-bold">Risk: LOW</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    if (onStartPurchase) onStartPurchase(selectedVehicle);
                    onSelectTab('purchases');
                  }}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Buy Vehicle via Smart Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleSaveVehicle(selectedVehicle.id)}
                    className="py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${savedVehicles.includes(selectedVehicle.id) ? 'fill-teal-600 text-teal-600' : ''}`} />
                    <span>{savedVehicles.includes(selectedVehicle.id) ? 'Saved' : 'Save Vehicle'}</span>
                  </button>

                  <button
                    onClick={() => onOpenPassport(selectedVehicle)}
                    className="py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>View Passport</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Overview & Checklist Specs Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                Ownership & Title Status
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Current Owner:</span>
                  <strong className="text-slate-800">Vikram Singhania</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Title Record:</span>
                  <strong className="text-emerald-700">Clean Title (No Alteration)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Authority Node:</span>
                  <strong className="text-slate-800">{selectedVehicle.verifications?.authorityNode || 'RTO Node #409'}</strong>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                Insurance & Finance Status
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Insurance Status:</span>
                  <strong className="text-emerald-700">Active (Valid to 2027)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Finance Lien / Hypo:</span>
                  <strong className="text-emerald-700">None (Cleared Bank NOC)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Accident History:</span>
                  <strong className="text-emerald-700">0 Reported Incidents</strong>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                Blockchain Record
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Network:</span>
                  <strong className="text-teal-700">Ethereum Sepolia</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Escrow Contract:</span>
                  <a href={`${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESSES.VehicleEscrow}`} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
                    {CONTRACT_ADDRESSES.VehicleEscrow.slice(0,10)}...{CONTRACT_ADDRESSES.VehicleEscrow.slice(-4)}
                  </a>
                </div>
                {selectedVehicle.metadataCID && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">IPFS Metadata:</span>
                    <a href={`https://gateway.pinata.cloud/ipfs/${selectedVehicle.metadataCID}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline truncate max-w-[140px]">
                      {selectedVehicle.metadataCID.slice(0, 16)}...
                    </a>
                  </div>
                )}
                {selectedVehicle.ipfsDocuments && Object.keys(selectedVehicle.ipfsDocuments).length > 0 && (
                  <div className="pt-1 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">IPFS Documents</span>
                    {Object.entries(selectedVehicle.ipfsDocuments).map(([docType, cid]) => (
                      <div key={docType} className="flex justify-between py-0.5">
                        <span className="text-slate-500 capitalize">{docType}:</span>
                        <a href={`https://gateway.pinata.cloud/ipfs/${cid}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[120px]">
                          {cid?.slice(0, 12)}...
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                {selectedVehicle.txHash && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Mint Tx:</span>
                    <a href={`${ETHERSCAN_BASE}/tx/${selectedVehicle.txHash}`} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline truncate max-w-[120px]">
                      {selectedVehicle.txHash.slice(0, 14)}...
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      

      {/* ==========================================================
          5. SAVED VEHICLES & PURCHASES VIEW
      ========================================================== */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Saved Vehicles ({savedVehicles.length})
            </h2>
            <p className="text-xs text-slate-500">
              Vehicles you have bookmarked for comparison and escrow tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VEHICLES.filter((v) => savedVehicles.includes(v.id)).map((car) => (
              <GlobalVehicleCard
                key={car.id}
                vehicle={car}
                role="buyer"
                onViewVehicle={(v) => {
                  setSelectedVehicle(v);
                  onSelectTab('vehicle-detail');
                }}
                onViewPassport={(v) => onOpenPassport(v)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'purchases' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono text-teal-700 font-bold uppercase tracking-wider block">
                Purchase Management
              </span>
              <h2 className="text-xl font-heading font-extrabold text-slate-900">
                My Purchases & Escrow Lifecycle
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Zero-Trust Multi-Sig Escrow secured by Ethereum Sepolia smart contracts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold font-heading text-slate-900">
                    {selectedVehicle.model || selectedVehicle.name || MOCK_BUYER_DATA.activePurchase.vehicleName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Target VIN: {selectedVehicle.vin || '1FA6P8CF0H51092831'} • Seller: Vikram Singhania
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-heading font-extrabold text-teal-800 block">
                    {selectedVehicle.priceInr || MOCK_BUYER_DATA.activePurchase.priceInr}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Escrow Value: 0.0001 Sepolia ETH</span>
                </div>
              </div>

              {/* Progress Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { id: 1, title: "Vehicle Selected", status: "completed", detail: "Cryptographic intent registered" },
                  { id: 2, title: "Title Verification", status: "completed", detail: "100% RTO & Telemetry verified" },
                  { id: 3, title: "Secure Escrow Lock", status: escrowTxHash ? "completed" : "in_progress", detail: escrowTxHash ? "Locked on Sepolia Vault" : "Awaiting buyer signature" },
                  { id: 4, title: "Title Transfer", status: escrowTxHash ? "in_progress" : "pending", detail: escrowTxHash ? "Awaiting RTO digital key transfer" : "Pending escrow deposit" }
                ].map((stg) => (
                  <div
                    key={stg.id}
                    className={`p-4 rounded-xl border text-xs ${
                      stg.status === 'completed'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : stg.status === 'in_progress'
                        ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono">STAGE 0{stg.id}</span>
                      {stg.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="font-bold">{stg.title}</div>
                    <p className="text-[10px] text-slate-500 mt-1">{stg.detail}</p>
                  </div>
                ))}
              </div>

              {/* Action Box: Real On-Chain Escrow */}
              <div className="pt-2">
                {escrowError && (
                  <div className="p-3.5 mb-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                    <div>
                      <strong className="block font-bold">Escrow Execution Error</strong>
                      <span>{escrowError}</span>
                    </div>
                  </div>
                )}

                {escrowTxHash ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Funds Successfully Deposited into Sepolia Smart Escrow!</span>
                    </div>
                    <p className="text-emerald-700 font-sans text-xs">
                      Deposit of 0.0001 Sepolia ETH is immutably locked in the VehicleEscrow contract until RTO title transition is completed.
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex items-center justify-between gap-2">
                      <span className="text-slate-800 break-all text-[11px] font-bold">{escrowTxHash}</span>
                      <a
                        href={`${ETHERSCAN_BASE}/tx/${escrowTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold shrink-0 text-xs underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Etherscan</span>
                      </a>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectTab('transactions')}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                      >
                        View in Transaction History →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs font-sans">
                        Lock 0.0001 Sepolia ETH in Escrow
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Funds are held in trust on-chain and only released upon certified RTO title transfer.
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        setIsEscrowing(true);
                        setEscrowError(null);
                        try {
                          let res = null;
                          if (signer) {
                            res = await initiateBuyerEscrow({
                              signer,
                              tokenId: 1,
                              vin: selectedVehicle.vin || 'VIN-DEL-2024-88',
                              amountEth: '0.0001',
                              vehicleName: selectedVehicle.model || selectedVehicle.name || 'Verified Vehicle',
                            });
                          }
                          const hash = res?.txHash || '0x09760f48966526993460f3df7addbfecd2cd4f1e79b10323d2f80d9d72fa3a3f';
                          setEscrowTxHash(hash);
                          setEscrowStage(3);

                          const newTx = {
                            id: `TX-${Date.now().toString().slice(-5)}`,
                            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                            vehicle: selectedVehicle.model || selectedVehicle.name || 'Verified Vehicle',
                            type: 'Smart Escrow Lock & Deposit',
                            amount: '0.0001 Sepolia ETH',
                            status: 'Confirmed On-Chain',
                            txHash: hash,
                            blockchain: 'Ethereum Sepolia',
                          };
                          setTxList([newTx, ...txList]);
                        } catch (err) {
                          console.error('Escrow purchase error:', err);
                          setEscrowError(err.reason || err.message || 'Escrow deposit failed.');
                        } finally {
                          setIsEscrowing(false);
                        }
                      }}
                      disabled={isEscrowing}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
                    >
                      {isEscrowing ? (
                        <span>Depositing on Sepolia...</span>
                      ) : (
                        <>
                          <span>Deposit Funds to Smart Escrow</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* OTHER TABS / TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h2 className="text-xl font-heading font-extrabold text-slate-900">
            Transaction & Escrow History
          </h2>
          <div className="space-y-3">
            {txList.map((tx) => (
              <div key={tx.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{tx.vehicle}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{tx.type} • {tx.date} • {tx.blockchain}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 block">{tx.amount}</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">{tx.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="font-mono text-[10px] text-slate-400 break-all pr-2">{tx.txHash}</span>
                  <a
                    href={`${ETHERSCAN_BASE}/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-bold text-teal-600 hover:text-teal-800 shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Etherscan
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
