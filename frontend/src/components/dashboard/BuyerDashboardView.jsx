import React, { useState } from 'react';
import {
  Car,
  Bookmark,
  GitCompare,
  FileCheck,
  Bot,
  ShoppingBag,
  CreditCard,
  Bell,
  User,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import GlobalVehicleCard from './GlobalVehicleCard';

export default function BuyerDashboardView({
  vehicles = [],
  activeTab,
  onOpenPassport,
  onSelectVehicle,
  onOpenMarketplace,
  onOpenVerifyModal
}) {
  const safeVehicles = Array.isArray(vehicles) && vehicles.length > 0 ? vehicles : [];

  // Filters State for Explore Vehicles
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  // AI Agent State
  const [aiInput, setAiInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      sender: 'agent',
      text: 'Hello Subhojit! I am your carNodes AI Vehicle Agent. Ask me anything about vehicle valuations, risk scores, title histories, or side-by-side comparisons.',
      time: 'Just now'
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Saved & Compared vehicles
  const [savedVehicles, setSavedVehicles] = useState(safeVehicles.slice(0, 2));
  const [comparedVehicles, setComparedVehicles] = useState(safeVehicles.slice(0, 2));

  // Filter logic
  const filteredVehicles = safeVehicles.filter((car) => {

    const matchesSearch =
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || car.tag?.toLowerCase().includes(selectedType);
    const matchesRisk = selectedRisk === 'all' || (selectedRisk === 'low' ? car.trustScore >= 90 : car.trustScore < 90);
    
    return matchesSearch && matchesType && matchesRisk;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.priceUsd - b.priceUsd;
    if (sortBy === 'price-high') return b.priceUsd - a.priceUsd;
    if (sortBy === 'trust') return b.trustScore - a.trustScore;
    return 0;
  });

  const handleSendAiPrompt = (promptText) => {
    const textToSend = promptText || aiInput;
    if (!textToSend.trim()) return;

    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setAiInput('');
    setAiLoading(true);

    setTimeout(() => {
      const car0 = safeVehicles[0] || { id: 'CN-101', trustScore: 94, shortName: 'Toyota Camry', priceUsd: 28500 };
      const car1 = safeVehicles[1] || { id: 'CN-[#102]', trustScore: 98, shortName: 'Audi TT RS', priceUsd: 62900 };

      let reply = `Based on our verified Algorand RWA oracle logs, vehicle #${car0.id} is priced 5.3% below current market average ($51,200). Its trust score is ${car0.trustScore}/100 with zero reported accident claims.`;
      if (textToSend.toLowerCase().includes('risk')) {
        reply = 'Risk Analysis Report: 0 title liens detected, 100% clean maintenance record on IPFS, and title verified by DMV Node #409.';
      } else if (textToSend.toLowerCase().includes('compare')) {
        reply = `Comparing ${car0.shortName} ($${car0.priceUsd.toLocaleString()}) vs ${car1.shortName} ($${car1.priceUsd.toLocaleString()}): Both have clean titles, but ${car1.shortName} has higher trust score (${car1.trustScore}/100).`;
      }

      setAiChatHistory((prev) => [
        ...prev,
        { sender: 'agent', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setAiLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ──────────────────────────────────────────────────────────
          TAB 1: BUYER DASHBOARD HOME
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <>
          {/* BUYER HOME HEADER & HERO CALLOUT */}
          <div className="bg-[#2B2521] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>BUYER PORTAL ACTIVE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-heading tracking-tight">
                Good morning, Subhojit 👋
              </h1>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                Find a vehicle you can trust. Explore verified luxury vehicles with transparent history and secure ownership records on-chain.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
              <button
                onClick={onOpenMarketplace}
                className="px-6 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0B7A70] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore Vehicles</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#ai-agent-tab"
                onClick={(e) => { e.preventDefault(); handleSendAiPrompt('Show me fair priced verified vehicles'); }}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all duration-200 flex items-center space-x-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-300" />
                <span>Ask AI Agent</span>
              </a>
            </div>
          </div>

          {/* TRUST SUMMARY CARDS (EXACTLY 4 COMPACT CARDS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#6E6259] font-bold block">Verified Viewed</span>
                <span className="text-2xl font-heading font-extrabold text-[#111111] mt-1 block">12</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 text-[#2B2521] flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#6E6259] font-bold block">Saved Vehicles</span>
                <span className="text-2xl font-heading font-extrabold text-[#111111] mt-1 block">5</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 text-[#0D9488] flex items-center justify-center font-bold">
                <Bookmark className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#6E6259] font-bold block">Active Escrow</span>
                <span className="text-2xl font-heading font-extrabold text-[#111111] mt-1 block">1</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#6E6259] font-bold block">Trust Status</span>
                <span className="text-sm font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mt-1 inline-block">
                  ✓ Verified
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* FEATURED VERIFIED VEHICLES SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-heading font-extrabold text-[#111111] uppercase tracking-tight">
                  Verified for You
                </h2>
                <p className="text-xs font-mono text-[#6E6259]">Handpicked luxury vehicles with 90+ Trust Scores & DMV title audit</p>
              </div>

              <button
                onClick={onOpenMarketplace}
                className="text-xs font-mono font-bold text-[#0D9488] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>View All 24 Verified</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {vehicles.map((car) => (
                <GlobalVehicleCard
                  key={car.id}
                  vehicle={car}
                  role="buyer"
                  onSelect={onSelectVehicle}
                  onOpenPassport={onOpenPassport}
                />
              ))}
            </div>
          </div>

          {/* ACTIVE BUYER TRANSACTION WORKFLOW PROGRESS */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#2B2521] text-white flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold text-[#111111]">Active Purchase: Audi R8 / Camry (#CN-48291)</h3>
                  <span className="text-xs font-mono text-[#6E6259]">Smart Contract Escrow Amount: $48,500 USDC</span>
                </div>
              </div>

              <span className="text-xs font-mono font-extrabold text-[#0D9488] bg-[#0D9488]/10 px-3 py-1 rounded-full border border-[#0D9488]/20">
                In Progress (Step 3/4)
              </span>
            </div>

            {/* Workflow Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              {[
                { title: '1. VEHICLE SELECTED', status: 'Completed', detail: 'Buyer confirmed terms' },
                { title: '2. VERIFICATION', status: 'Completed', detail: 'DMV Title & VIN passed' },
                { title: '3. SECURE TRANSACTION', status: 'Active', detail: 'Escrow locked on-chain' },
                { title: '4. OWNERSHIP TRANSFER', status: 'Pending', detail: 'Awaiting keys handoff' },
              ].map((step, idx) => (
                <div key={idx} className={`p-3 rounded-2xl border ${
                  step.status === 'Completed'
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : step.status === 'Active'
                    ? 'bg-teal-50 border-[#0D9488] ring-1 ring-[#0D9488]'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                }`}>
                  <div className="text-[11px] font-mono font-bold uppercase">{step.title}</div>
                  <div className="text-xs font-semibold mt-1 flex items-center space-x-1">
                    {step.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    <span>{step.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 2: EXPLORE VEHICLES (MARKETPLACE SEARCH & FILTERS)
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-extrabold uppercase text-[#111111] tracking-tight">
              Vehicle Explorer
            </h1>
            <p className="text-xs font-mono text-[#6E6259]">Search verified real-world asset vehicles backed by Algorand MainNet</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search make, model, VIN, or vehicle ID..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#0D9488]"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-mono bg-zinc-50"
                >
                  <option value="all">Risk Status: All</option>
                  <option value="low">Low Risk (90+ Score)</option>
                  <option value="med">Medium Risk</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-mono bg-zinc-50"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="trust">Trust Score</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((car) => (
              <GlobalVehicleCard
                key={car.id}
                vehicle={car}
                role="buyer"
                onSelect={onSelectVehicle}
                onOpenPassport={onOpenPassport}
              />
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 3: SAVED VEHICLES & COMPARISONS
      ────────────────────────────────────────────────────────── */}
      {(activeTab === 'saved' || activeTab === 'comparisons') && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-extrabold uppercase text-[#111111] tracking-tight">
              {activeTab === 'saved' ? 'Saved Vehicles' : 'Side-by-Side Comparisons'}
            </h1>
            <p className="text-xs font-mono text-[#6E6259]">Compare parameters, title proofs, and AI deal ratings</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 font-mono uppercase">
                  <th className="pb-3 font-semibold">Vehicle</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Trust Score</th>
                  <th className="pb-3 font-semibold">Title Status</th>
                  <th className="pb-3 font-semibold">AI Valuation</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {comparedVehicles.map((car) => (
                  <tr key={car.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 font-bold font-heading text-zinc-900 flex items-center space-x-3">
                      <img src={car.image} alt={car.shortName} className="w-12 h-9 rounded-lg object-cover" />
                      <div>
                        <div>{car.shortName}</div>
                        <span className="text-[10px] font-mono text-zinc-400">{car.id}</span>
                      </div>
                    </td>
                    <td className="py-4 font-extrabold font-mono text-zinc-900">${car.priceUsd?.toLocaleString()}</td>
                    <td className="py-4 font-mono font-bold text-emerald-700">
                      <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {car.trustScore}/100
                      </span>
                    </td>
                    <td className="py-4 font-mono text-zinc-600">✓ Clean Title</td>
                    <td className="py-4 font-mono text-[#0D9488] font-bold">{car.valuation?.dealRating}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => onOpenPassport(car)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-[#0D9488]"
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
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 4: CONVERSATIONAL AI BUYER AGENT
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'ai-agent' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B2521] text-white flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-extrabold uppercase text-[#111111] tracking-tight">
                Your AI Vehicle Agent
              </h1>
              <p className="text-xs font-mono text-[#6E6259]">Ask anything before you buy. Real-time market data & RWA oracle analysis.</p>
            </div>
          </div>

          {/* AI Presets */}
          <div className="flex flex-wrap gap-2">
            {[
              'Is this vehicle fairly priced?',
              'Show me similar verified vehicles',
              'Does this vehicle have any risk?',
              'Compare these two vehicles',
              'Explain this vehicle history'
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendAiPrompt(prompt)}
                className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-semibold text-[#2B2521] hover:border-[#0D9488] hover:bg-emerald-50/50 transition-all cursor-pointer"
              >
                💡 {prompt}
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs flex flex-col h-[420px] overflow-hidden">
            <div className="p-4 bg-zinc-50 border-b border-zinc-200 text-xs font-mono text-zinc-500 flex items-center justify-between">
              <span>● AI Decision Engine Active (Model v4.2)</span>
              <span>IPFS Oracle Live</span>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {aiChatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2B2521] text-white rounded-br-none'
                      : 'bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                    <div className="text-[9px] font-mono text-zinc-400 mt-1.5 text-right">{msg.time}</div>
                  </div>
                </div>
              ))}

              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 p-3 rounded-2xl text-xs text-zinc-500 flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0D9488]" />
                    <span>Analyzing RWA smart contract logs...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-zinc-200 flex items-center space-x-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiPrompt()}
                placeholder="Ask your AI agent anything about vehicle history, pricing or risk..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-[#0D9488]"
              />
              <button
                onClick={() => handleSendAiPrompt()}
                className="px-5 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0B7A70] text-white font-bold text-xs uppercase transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
