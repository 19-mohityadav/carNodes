import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Search,
  Filter,
  Check,
  X,
  Building2,
  FileCheck,
  Lock,
  ArrowRight,
  Eye,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  UserCheck,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  CheckSquare
} from 'lucide-react';
import GlobalVehicleCard from './GlobalVehicleCard';

export default function AuthorityDashboardView({
  vehicles = [],
  activeTab = 'dashboard',
  onOpenPassport,
  onSelectVehicle,
  onNavigateTab
}) {
  const safeVehicles = Array.isArray(vehicles) && vehicles.length > 0 ? vehicles : [];

  // Mock Queue Data matching prompt spec
  const queueItems = [
    {
      id: 'CN-1969-001',
      model: '1969 Dodge Charger R/T',
      year: '1969',
      owner: 'Arjun Mehta',
      registration: 'WB XX XXXX',
      type: 'Vehicle + Documents',
      submitted: 'Today',
      risk: 'Low',
      trustScore: 92,
      status: 'Pending',
      image: '/cars/shelby_gt500.png',
      vin: '1FA6P8SJ4L5502910'
    },
    {
      id: 'CN-2023-082',
      model: 'BMW 3 Series',
      year: '2023',
      owner: 'Rahul Sharma',
      registration: 'DL 01 AB 9821',
      type: 'Documents',
      submitted: 'Today',
      risk: 'Medium',
      trustScore: 84,
      status: 'Under Review',
      image: '/cars/audi_r8_camry.png',
      vin: 'WBA33AY090FP19283'
    },
    {
      id: 'CN-2024-114',
      model: 'Hyundai Creta',
      year: '2024',
      owner: 'Priya Das',
      registration: 'MH 12 PQ 4410',
      type: 'Vehicle + Documents',
      submitted: 'Yesterday',
      risk: 'Low',
      trustScore: 96,
      status: 'Pending',
      image: '/cars/audi_tt.png',
      vin: 'KMHD841ECFU019284'
    },
    {
      id: 'CN-2023-509',
      model: 'Toyota Fortuner',
      year: '2023',
      owner: 'Amit Roy',
      registration: 'KA 05 MN 7712',
      type: 'Ownership',
      submitted: 'Yesterday',
      risk: 'High',
      trustScore: 78,
      status: 'Flagged',
      image: '/cars/rs_line.png',
      vin: 'MHFJ115G009124810'
    }
  ];

  // Selected item for Verification Detail page/modal
  const [selectedItem, setSelectedItem] = useState(queueItems[0]);
  const [isReviewing, setIsReviewing] = useState(false);

  // Approval Modal State
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [confirmedCheck, setConfirmedCheck] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(false);

  // Filters State
  const [queueSearch, setQueueSearch] = useState('');
  const [queueFilter, setQueueFilter] = useState('All');

  // Registry Filters
  const [registrySearch, setRegistrySearch] = useState('');
  const [registryFilter, setRegistryFilter] = useState('All');

  // Transfer Detail state
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const filteredQueue = queueItems.filter((item) => {
    const matchesSearch =
      item.model.toLowerCase().includes(queueSearch.toLowerCase()) ||
      item.owner.toLowerCase().includes(queueSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(queueSearch.toLowerCase());
    
    if (queueFilter === 'All') return matchesSearch;
    return matchesSearch && item.status.toLowerCase() === queueFilter.toLowerCase();
  });

  const handleOpenReview = (item) => {
    setSelectedItem(item);
    setIsReviewing(true);
  };

  const handleConfirmApprovalSubmit = () => {
    if (!confirmedCheck) return;
    setApprovalSuccess(true);
    setTimeout(() => {
      setShowApprovalModal(false);
      setApprovalSuccess(false);
      setConfirmedCheck(false);
      setIsReviewing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#171C1C]">

      {/* ──────────────────────────────────────────────────────────
          MAIN DASHBOARD OVERVIEW (activeTab === 'dashboard')
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && !isReviewing && (
        <>
          {/* HEADER CONTROL CENTER BANNER */}
          <div className="bg-white p-6 sm:p-8 rounded-[18px] border border-[#E2E7E7] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#159A9C]">
                AUTHORITY CONTROL CENTER
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#171C1C] tracking-tight leading-tight">
                Vehicle verification &<br className="hidden sm:inline" /> ownership management.
              </h1>
              <p className="text-sm text-[#687272] leading-relaxed">
                “Review vehicle records, verify submitted documents, approve registrations, and manage digital ownership transfers.”
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-[#159A9C]/10 border border-[#159A9C]/20 text-[#159A9C] px-3.5 py-2 rounded-full font-mono text-xs font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#159A9C]" />
              <span>✓ AUTHORITY VERIFIED</span>
            </div>
          </div>

          {/* OVERVIEW CARDS (EXACTLY FOUR COMPACT CARDS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* CARD 1 */}
            <div className="bg-white p-6 rounded-[18px] border border-[#E2E7E7] shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#687272] block">Pending Verification</span>
                <div className="text-3xl font-heading font-extrabold text-[#171C1C]">24</div>
                <span className="text-[11px] text-[#687272] block">Vehicles awaiting verification</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#159A9C]/10 text-[#159A9C] flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white p-6 rounded-[18px] border border-[#E2E7E7] shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#687272] block">Approved Today</span>
                <div className="text-3xl font-heading font-extrabold text-[#159A9C]">18</div>
                <span className="text-[11px] text-[#687272] block">Successfully verified vehicles</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#159A9C] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white p-6 rounded-[18px] border border-[#E2E7E7] shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#687272] block">Transfer Requests</span>
                <div className="text-3xl font-heading font-extrabold text-[#123B3D]">07</div>
                <span className="text-[11px] text-[#687272] block">Ownership transfers requiring review</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#123B3D] flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>

            {/* CARD 4 */}
            <div className="bg-white p-6 rounded-[18px] border border-[#E2E7E7] shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#687272] block">Risk Alerts</span>
                <div className="text-3xl font-heading font-extrabold text-amber-600">03</div>
                <span className="text-[11px] text-[#687272] block">Records requiring attention</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* VERIFICATION QUEUE SECTION */}
          <div className="bg-white rounded-[18px] border border-[#E2E7E7] shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7E7] pb-4">
              <div>
                <h2 className="text-lg font-heading font-extrabold text-[#171C1C]">Verification Queue</h2>
                <p className="text-xs text-[#687272] mt-0.5">“Review and process recently submitted vehicle records.”</p>
              </div>

              <button
                onClick={() => onNavigateTab && onNavigateTab('queue')}
                className="text-xs font-mono font-bold text-[#159A9C] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>View All 24</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* SEARCH & FILTER ROW */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={queueSearch}
                  onChange={(e) => setQueueSearch(e.target.value)}
                  placeholder="Search Vehicle ID, Registration or Owner"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E7E7] text-xs focus:outline-none focus:border-[#159A9C]"
                />
              </div>

              <div className="flex items-center space-x-1 bg-[#F5F7F7] p-1 rounded-xl border border-[#E2E7E7] text-xs font-mono">
                {['All', 'Pending', 'Under Review', 'Verified', 'Flagged'].map((flt) => (
                  <button
                    key={flt}
                    onClick={() => setQueueFilter(flt)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      queueFilter === flt
                        ? 'bg-white text-[#171C1C] font-bold shadow-xs'
                        : 'text-[#687272] hover:text-[#171C1C]'
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>
            </div>

            {/* QUEUE TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#E2E7E7] text-[#687272] font-mono uppercase text-[11px]">
                    <th className="pb-3 font-semibold">Vehicle</th>
                    <th className="pb-3 font-semibold">Owner</th>
                    <th className="pb-3 font-semibold">Verification</th>
                    <th className="pb-3 font-semibold">Submitted</th>
                    <th className="pb-3 font-semibold">Risk</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E7E7]/60">
                  {filteredQueue.map((item) => {
                    let statusColor = 'bg-amber-50 text-amber-800 border-amber-200';
                    if (item.status === 'Under Review') statusColor = 'bg-teal-50 text-[#159A9C] border-[#159A9C]/30';
                    if (item.status === 'Verified') statusColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    if (item.status === 'Flagged') statusColor = 'bg-rose-50 text-rose-800 border-rose-200';

                    return (
                      <tr key={item.id} className="hover:bg-[#F5F7F7]/60 transition-colors">
                        <td className="py-4 font-bold font-heading text-[#171C1C]">
                          <div className="text-sm">{item.model}</div>
                          <span className="text-[10px] font-mono text-[#687272] font-normal">{item.id}</span>
                        </td>
                        <td className="py-4 font-semibold text-[#171C1C]">{item.owner}</td>
                        <td className="py-4 font-mono text-[#687272]">{item.type}</td>
                        <td className="py-4 font-mono text-[#687272]">{item.submitted}</td>
                        <td className="py-4 font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            item.risk === 'Low' ? 'bg-emerald-50 text-emerald-800' : item.risk === 'Medium' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'
                          }`}>
                            {item.risk}
                          </span>
                        </td>
                        <td className="py-4 font-mono font-bold">
                          <span className={`px-2.5 py-1 rounded-full border text-[10px] uppercase ${statusColor}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleOpenReview(item)}
                            className="px-4 py-2 rounded-xl bg-[#171C1C] hover:bg-[#159A9C] text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <span>Review</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          VEHICLE VERIFICATION DETAIL SCREEN (isReviewing || activeTab === 'queue')
      ────────────────────────────────────────────────────────── */}
      {(isReviewing || activeTab === 'queue' || activeTab === 'doc-review') && (
        <div className="space-y-6">
          {/* HEADER & BACK BUTTON */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsReviewing(false)}
              className="px-4 py-2 rounded-xl bg-white border border-[#E2E7E7] text-xs font-mono font-bold text-[#171C1C] hover:bg-[#F5F7F7] flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Verification Queue</span>
            </button>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              STATUS: {selectedItem.status.toUpperCase()}
            </span>
          </div>

          <div className="bg-white p-6 rounded-[18px] border border-[#E2E7E7] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-mono text-[#687272] block">Vehicle Verification Request: #{selectedItem.id}</span>
              <h1 className="text-2xl font-heading font-extrabold text-[#171C1C] mt-0.5">{selectedItem.model}</h1>
            </div>

            <button
              onClick={() => onOpenPassport && onOpenPassport(selectedItem)}
              className="px-4 py-2 rounded-xl bg-[#159A9C]/10 text-[#159A9C] border border-[#159A9C]/30 text-xs font-mono font-bold hover:bg-[#159A9C]/20 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Digital Vehicle Passport →</span>
            </button>
          </div>

          {/* VEHICLE INFORMATION CARD */}
          <div className="bg-white rounded-[18px] border border-[#E2E7E7] p-6 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* LEFT: Premium Car Image */}
              <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-[#F5F7F7] aspect-[16/10] border border-[#E2E7E7]">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.model}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* RIGHT: Vehicle Details Table */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-heading font-extrabold text-[#171C1C]">Vehicle Information</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 bg-[#F5F7F7] rounded-xl border border-[#E2E7E7]">
                    <span className="text-[10px] text-[#687272] block font-bold">VEHICLE ID</span>
                    <strong className="text-[#171C1C]">{selectedItem.id}</strong>
                  </div>

                  <div className="p-3 bg-[#F5F7F7] rounded-xl border border-[#E2E7E7]">
                    <span className="text-[10px] text-[#687272] block font-bold">REGISTRATION NUMBER</span>
                    <strong className="text-[#171C1C]">{selectedItem.registration}</strong>
                  </div>

                  <div className="p-3 bg-[#F5F7F7] rounded-xl border border-[#E2E7E7]">
                    <span className="text-[10px] text-[#687272] block font-bold">MAKE & MODEL</span>
                    <strong className="text-[#171C1C] truncate block">{selectedItem.model}</strong>
                  </div>

                  <div className="p-3 bg-[#F5F7F7] rounded-xl border border-[#E2E7E7]">
                    <span className="text-[10px] text-[#687272] block font-bold">YEAR</span>
                    <strong className="text-[#171C1C]">{selectedItem.year}</strong>
                  </div>

                  <div className="p-3 bg-[#F5F7F7] rounded-xl border border-[#E2E7E7]">
                    <span className="text-[10px] text-[#687272] block font-bold">CURRENT OWNER</span>
                    <strong className="text-[#171C1C] truncate block">{selectedItem.owner}</strong>
                  </div>

                  <div className="p-3 bg-[#F5F7F7] rounded-xl border border-[#E2E7E7]">
                    <span className="text-[10px] text-[#687272] block font-bold">STATUS</span>
                    <strong className="text-[#159A9C]">{selectedItem.status}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VERIFICATION CHECKLIST & DOCUMENT REVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* VERIFICATION CHECKLIST (LEFT 6 COLS) */}
            <div className="lg:col-span-6 bg-white p-6 rounded-[18px] border border-[#E2E7E7] shadow-xs space-y-4">
              <h3 className="text-base font-heading font-extrabold text-[#171C1C]">Verification Checklist</h3>

              <div className="space-y-2.5 text-xs font-mono">
                {[
                  { name: 'Vehicle Identity', status: '✓ Matched', state: 'success' },
                  { name: 'Registration Document', status: '✓ Verified', state: 'success' },
                  { name: 'Ownership Proof', status: '✓ Verified', state: 'success' },
                  { name: 'Insurance', status: '✓ Verified', state: 'success' },
                  { name: 'Inspection Record', status: '✓ Verified', state: 'success' },
                  { name: 'Finance Status', status: '○ Pending', state: 'pending' },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#F5F7F7] border border-[#E2E7E7] flex items-center justify-between">
                    <span className="font-bold text-[#171C1C]">{item.name}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.state === 'success' ? 'bg-emerald-50 text-[#159A9C] border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DOCUMENT REVIEW CARDS (RIGHT 6 COLS) */}
            <div className="lg:col-span-6 bg-white p-6 rounded-[18px] border border-[#E2E7E7] shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-heading font-extrabold text-[#171C1C]">Submitted Documents</h3>
                <p className="text-xs text-[#687272] mt-0.5">“Review the documents submitted for vehicle verification.”</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { name: 'Registration Certificate', status: '✓ Verified' },
                  { name: 'Insurance Document', status: '✓ Verified' },
                  { name: 'Ownership Proof', status: '✓ Verified' },
                  { name: 'Inspection Report', status: '✓ Verified' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F5F7F7] border border-[#E2E7E7] flex flex-col justify-between space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#159A9C]" />
                      <span className="font-bold text-[#171C1C] truncate">{doc.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#159A9C] font-bold">{doc.status}</span>
                      <button onClick={() => alert(`Opening ${doc.name}`)} className="text-[#159A9C] hover:underline font-bold">
                        View Document →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RISK ASSESSMENT (2-COLUMN SECTION) */}
          <div className="bg-white p-6 sm:p-8 rounded-[18px] border border-[#E2E7E7] shadow-xs space-y-6">
            <h3 className="text-base font-heading font-extrabold text-[#171C1C]">Vehicle Risk Assessment</h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* LEFT */}
              <div className="md:col-span-5 p-6 rounded-2xl bg-[#F5F7F7] border border-[#E2E7E7] space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                  LOW RISK
                </span>
                <div className="text-3xl font-heading font-extrabold text-[#171C1C] pt-1">
                  Trust Score: 92 / 100
                </div>
                <p className="text-xs text-[#687272] leading-relaxed">
                  “No major inconsistencies detected in the submitted vehicle record.”
                </p>
              </div>

              {/* RIGHT: Signals Progress bars */}
              <div className="md:col-span-7 space-y-3.5 text-xs font-mono">
                {[
                  { name: 'Document Consistency', pct: '92%' },
                  { name: 'Ownership Consistency', pct: '100%' },
                  { name: 'Vehicle History', pct: '88%' },
                  { name: 'Insurance Status', pct: '100%' },
                  { name: 'Finance Status', pct: 'Pending' },
                ].map((sig, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-bold text-[#171C1C]">
                      <span>{sig.name}</span>
                      <span className="text-[#159A9C]">{sig.pct}</span>
                    </div>
                    <div className="w-full bg-[#E2E7E7] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#159A9C] h-full rounded-full"
                        style={{ width: sig.pct.includes('%') ? sig.pct : '50%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AUTHORITY DECISION SECTION */}
          <div className="bg-white p-6 sm:p-8 rounded-[18px] border border-[#E2E7E7] shadow-xs space-y-5">
            <div>
              <h3 className="text-lg font-heading font-extrabold text-[#171C1C]">Verification Decision</h3>
              <p className="text-xs text-[#687272] mt-0.5">
                “Review the submitted vehicle information before approving this vehicle for the carNodes verified registry.”
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="review-confirm"
                checked={confirmedCheck}
                onChange={(e) => setConfirmedCheck(e.target.checked)}
                className="w-4 h-4 rounded border-[#E2E7E7] text-[#159A9C] focus:ring-[#159A9C]"
              />
              <label htmlFor="review-confirm" className="text-xs font-mono text-[#171C1C] cursor-pointer">
                I confirm that the submitted vehicle information has been reviewed.
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setShowApprovalModal(true)}
                disabled={!confirmedCheck}
                className="px-6 py-3 rounded-xl bg-[#159A9C] hover:bg-[#123B3D] text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
              >
                Approve Vehicle
              </button>

              <button
                onClick={() => alert('Correction request sent to applicant')}
                className="px-6 py-3 rounded-xl bg-white border border-[#E2E7E7] text-[#171C1C] hover:bg-[#F5F7F7] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Request Correction
              </button>

              <button
                onClick={() => alert('Vehicle verification rejected')}
                className="px-6 py-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 3: VERIFIED VEHICLE REGISTRY PAGE
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-extrabold uppercase text-[#171C1C] tracking-tight">
              Verified Vehicle Registry
            </h1>
            <p className="text-xs font-mono text-[#687272]">“A transparent registry of verified vehicles on carNodes.”</p>
          </div>

          {/* Registry Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-[18px] border border-[#E2E7E7] shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={registrySearch}
                onChange={(e) => setRegistrySearch(e.target.value)}
                placeholder="Search Vehicle ID or Registration Number"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E7E7] text-xs focus:outline-none focus:border-[#159A9C]"
              />
            </div>

            <div className="flex items-center space-x-1 bg-[#F5F7F7] p-1 rounded-xl border border-[#E2E7E7] text-xs font-mono">
              {['All Vehicles', 'Verified', 'Pending', 'Rejected'].map((flt) => (
                <button
                  key={flt}
                  onClick={() => setRegistryFilter(flt)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    registryFilter === flt ? 'bg-white text-[#171C1C] font-bold shadow-xs' : 'text-[#687272]'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[18px] border border-[#E2E7E7] p-6 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#E2E7E7] text-[#687272] font-mono uppercase text-[11px]">
                  <th className="pb-3 font-semibold">Vehicle</th>
                  <th className="pb-3 font-semibold">Owner</th>
                  <th className="pb-3 font-semibold">Registration</th>
                  <th className="pb-3 font-semibold">Documents</th>
                  <th className="pb-3 font-semibold">Blockchain Record</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7E7]/60">
                {[
                  { model: '1969 Dodge Charger R/T', owner: 'Arjun Mehta', reg: 'Verified', docs: '5 / 5 Verified', network: 'Ethereum Sepolia', status: '✓ Verified' },
                  { model: 'BMW 3 Series', owner: 'Rahul Sharma', reg: 'Verified', docs: '4 / 4 Verified', network: 'Ethereum Sepolia', status: '✓ Verified' },
                  { model: 'Hyundai Creta', owner: 'Priya Das', reg: 'Verified', docs: '5 / 5 Verified', network: 'Ethereum Sepolia', status: '✓ Verified' },
                  { model: 'Toyota Fortuner', owner: 'Amit Roy', reg: 'Verified', docs: '3 / 5 Verified', network: 'Ethereum Sepolia', status: '✓ Verified' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F7F7]/60 transition-colors">
                    <td className="py-4 font-bold font-heading text-[#171C1C]">{item.model}</td>
                    <td className="py-4 font-semibold text-[#171C1C]">{item.owner}</td>
                    <td className="py-4 font-mono text-[#159A9C] font-bold">{item.reg}</td>
                    <td className="py-4 font-mono text-[#687272]">{item.docs}</td>
                    <td className="py-4 font-mono text-[#123B3D] font-bold">{item.network}</td>
                    <td className="py-4 font-mono font-bold text-[#159A9C]">{item.status}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => onOpenPassport && onOpenPassport(safeVehicles[0])}
                        className="px-3 py-1.5 rounded-xl bg-[#171C1C] hover:bg-[#159A9C] text-white font-bold text-xs font-mono cursor-pointer"
                      >
                        View Record →
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
          TAB 4: OWNERSHIP TRANSFER REQUESTS PAGE & DETAIL
      ────────────────────────────────────────────────────────── */}
      {(activeTab === 'transfers' || activeTab === 'records') && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-extrabold uppercase text-[#171C1C] tracking-tight">
              Ownership Transfer Requests
            </h1>
            <p className="text-xs font-mono text-[#687272]">“Review and approve vehicle ownership transfers.”</p>
          </div>

          {/* TRANSFER CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[18px] border border-[#E2E7E7] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E7E7] pb-3">
                <h3 className="text-base font-heading font-extrabold text-[#171C1C]">1969 Dodge Charger R/T</h3>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Pending Approval
                </span>
              </div>

              {/* Transfer Flow */}
              <div className="flex items-center justify-between text-xs font-mono bg-[#F5F7F7] p-3 rounded-xl border border-[#E2E7E7]">
                <div>
                  <span className="text-[10px] text-[#687272] block">Current Owner</span>
                  <strong className="text-[#171C1C]">Arjun Mehta</strong>
                </div>
                <ArrowRight className="w-4 h-4 text-[#159A9C]" />
                <div>
                  <span className="text-[10px] text-[#687272] block">New Owner</span>
                  <strong className="text-[#171C1C]">Rahul Sharma</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-emerald-50 text-[#159A9C] rounded-lg border border-emerald-200">
                  ✓ Vehicle Complete
                </div>
                <div className="p-2 bg-emerald-50 text-[#159A9C] rounded-lg border border-emerald-200">
                  ✓ Docs Complete
                </div>
                <div className="p-2 bg-emerald-50 text-[#159A9C] rounded-lg border border-emerald-200">
                  ✓ Tx Secured
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedTransfer(queueItems[0])}
                  className="px-5 py-2.5 rounded-xl bg-[#171C1C] hover:bg-[#159A9C] text-white font-bold text-xs uppercase transition-colors cursor-pointer"
                >
                  Review Transfer →
                </button>
              </div>
            </div>
          </div>

          {/* TRANSFER DETAIL STEP FLOW */}
          {selectedTransfer && (
            <div className="bg-white p-6 sm:p-8 rounded-[18px] border border-[#E2E7E7] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E7E7] pb-3">
                <h3 className="text-lg font-heading font-extrabold text-[#171C1C]">
                  Ownership Transfer: {selectedTransfer.model}
                </h3>
                <button onClick={() => setSelectedTransfer(null)} className="text-xs text-[#687272] hover:underline">
                  Close Detail
                </button>
              </div>

              {/* HORIZONTAL STEP FLOW */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
                {[
                  { title: 'CURRENT OWNER', detail: 'Arjun Mehta' },
                  { title: 'TRANSFER REQUEST', detail: 'Request #TR-01982' },
                  { title: 'NEW OWNER', detail: 'Rahul Sharma' },
                  { title: 'AUTHORITY REVIEW', detail: 'Pending' },
                  { title: 'DIGITAL OWNERSHIP RECORD', detail: 'Not Updated' },
                ].map((step, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border ${idx < 3 ? 'bg-emerald-50 border-emerald-200 text-[#159A9C] font-bold' : idx === 3 ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold' : 'bg-[#F5F7F7] border-[#E2E7E7] text-[#687272]'}`}>
                    <div className="text-[10px] text-[#687272]">{step.title}</div>
                    <div className="mt-1">{step.detail}</div>
                  </div>
                ))}
              </div>

              {/* CHECKLIST & BUTTONS */}
              <div className="pt-2 space-y-3">
                <h4 className="text-xs font-mono uppercase font-bold text-[#687272]">Transfer Checklist</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <span className="text-[#159A9C] font-bold">✓ Vehicle verified</span>
                  <span className="text-[#159A9C] font-bold">✓ Seller verified</span>
                  <span className="text-[#159A9C] font-bold">✓ Buyer verified</span>
                  <span className="text-[#159A9C] font-bold">✓ Documents verified</span>
                  <span className="text-[#159A9C] font-bold">✓ Transaction secured</span>
                  <span className="text-amber-800 font-bold">○ Authority approval</span>
                </div>

                <div className="pt-3 flex items-center space-x-3">
                  <button
                    onClick={() => { alert('Transfer Approved & Signed on Ethereum Sepolia!'); setSelectedTransfer(null); }}
                    className="px-6 py-2.5 rounded-xl bg-[#159A9C] hover:bg-[#123B3D] text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    Approve Transfer
                  </button>
                  <button
                    onClick={() => alert('Correction requested')}
                    className="px-6 py-2.5 rounded-xl bg-white border border-[#E2E7E7] text-[#171C1C] font-bold text-xs uppercase cursor-pointer"
                  >
                    Request Correction
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 5: AUDIT TRAIL PAGE
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'audit-trail' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-extrabold uppercase text-[#171C1C] tracking-tight">
              Ownership & Verification Audit Trail
            </h1>
            <p className="text-xs font-mono text-[#687272]">“A transparent history of important vehicle events.”</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[18px] border border-[#E2E7E7] shadow-xs space-y-6">
            {/* VERTICAL TIMELINE */}
            <div className="relative pl-6 border-l-2 border-[#159A9C]/40 space-y-6 font-mono text-xs">
              {[
                { title: 'Vehicle Registered', time: '12 Sep 2026 • 10:42 AM', desc: 'Vehicle added to carNodes registry.' },
                { title: 'Documents Verified', time: '12 Sep 2026 • 11:08 AM', desc: 'Registration and ownership documents verified.' },
                { title: 'Vehicle Approved', time: '12 Sep 2026 • 11:32 AM', desc: 'Authority approved the vehicle.' },
                { title: 'Transfer Initiated', time: '13 Sep 2026 • 02:15 PM', desc: 'Ownership transfer requested.' },
                { title: 'Authority Review', time: 'Pending', desc: 'Awaiting final transfer signature.' },
              ].map((ev, i) => (
                <div key={i} className="relative space-y-1">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#159A9C] border-2 border-white ring-2 ring-[#159A9C]/20" />
                  <div className="font-bold text-[#171C1C] text-sm">{ev.title}</div>
                  <div className="text-[11px] text-[#159A9C] font-bold">{ev.time}</div>
                  <p className="text-xs text-[#687272]">{ev.desc}</p>
                </div>
              ))}
            </div>

            {/* BLOCKCHAIN RECORD CARD AT BOTTOM */}
            <div className="pt-4 border-t border-[#E2E7E7]">
              <div className="p-5 rounded-2xl bg-[#123B3D] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-[#159A9C] font-bold uppercase text-[10px] block">BLOCKCHAIN RECORD LAYER</span>
                  <div className="text-sm font-bold text-white">Network: Ethereum Sepolia</div>
                  <div className="text-zinc-300 text-[11px]">Record Status: ✓ Verified • Vehicle ID: CN-1969-001</div>
                </div>

                <button
                  onClick={() => window.open('https://sepolia.etherscan.io/', '_blank')}
                  className="px-5 py-2.5 rounded-xl bg-[#159A9C] hover:bg-[#0F7072] text-white font-bold text-xs uppercase flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <span>View Blockchain Record →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 6: RISK ALERTS PAGE
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'risk-alerts' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-extrabold uppercase text-[#171C1C] tracking-tight">
              Risk Alerts
            </h1>
            <p className="text-xs font-mono text-[#687272]">“Records requiring additional attention.”</p>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Document mismatch detected', vehicle: 'BMW 3 Series', issue: 'Registration details do not match submitted ownership document.', risk: 'Medium Risk' },
              { title: 'Finance verification pending', vehicle: 'Toyota Fortuner', issue: 'Finance status requires additional verification.', risk: 'Medium Risk' },
              { title: 'Ownership information requires review', vehicle: 'Hyundai Creta', issue: 'Previous ownership record requires confirmation.', risk: 'High Risk' },
            ].map((alertItem, i) => (
              <div key={i} className="bg-white p-6 rounded-[18px] border border-[#E2E7E7] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <h3 className="text-base font-heading font-extrabold text-[#171C1C]">{alertItem.title}</h3>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#159A9C]">Vehicle: {alertItem.vehicle}</div>
                  <p className="text-xs text-[#687272]">{alertItem.issue}</p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {alertItem.risk}
                  </span>
                  <button
                    onClick={() => handleOpenReview(queueItems[1])}
                    className="px-5 py-2.5 rounded-xl bg-[#171C1C] hover:bg-[#159A9C] text-white font-bold text-xs font-mono cursor-pointer"
                  >
                    Review →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 7: AUTHORITY PROFILE PAGE
      ────────────────────────────────────────────────────────── */}
      {(activeTab === 'profile' || activeTab === 'settings') && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-extrabold uppercase text-[#171C1C] tracking-tight">
              Authority Profile
            </h1>
            <p className="text-xs font-mono text-[#687272]">Official verifier account credentials & node parameters</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[18px] border border-[#E2E7E7] shadow-xs max-w-2xl space-y-6 font-mono text-xs">
            <div className="flex items-center space-x-4 border-b border-[#E2E7E7] pb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#123B3D] text-[#159A9C] flex items-center justify-center font-heading font-extrabold text-2xl">
                AUTH
              </div>
              <div>
                <h2 className="text-lg font-heading font-extrabold text-[#171C1C]">Authority Node #00182</h2>
                <span className="text-xs font-bold text-[#159A9C]">Authorized Vehicle Authority</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#E2E7E7]/60">
                <span className="text-[#687272]">Authority ID:</span>
                <strong className="text-[#171C1C]">AUTH-CN-00182</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E2E7E7]/60">
                <span className="text-[#687272]">Organization:</span>
                <strong className="text-[#171C1C]">Regional Vehicle Authority (RTO)</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E2E7E7]/60">
                <span className="text-[#687272]">Verification Status:</span>
                <strong className="text-[#159A9C]">✓ Verified Authority</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E2E7E7]/60">
                <span className="text-[#687272]">Connected Wallet:</span>
                <strong className="text-[#171C1C]">0x71C7...9A2C (MetaMask)</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E2E7E7]/60">
                <span className="text-[#687272]">Authentication Layer:</span>
                <strong className="text-[#171C1C]">OTP / Email Verified</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E2E7E7]/60">
                <span className="text-[#687272]">Node Status:</span>
                <strong className="text-[#159A9C]">● Active Operational</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          CONFIRMATION APPROVAL MODAL
      ────────────────────────────────────────────────────────── */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[18px] border border-[#E2E7E7] shadow-2xl p-6 space-y-5 relative">
            <button
              onClick={() => setShowApprovalModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {approvalSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#159A9C] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-lg font-heading font-extrabold text-[#171C1C]">✓ Vehicle Verified</h3>
                <p className="text-xs text-[#687272]">
                  “Vehicle has been added to the carNodes verified registry.”
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-[#171C1C]">Approve Vehicle?</h3>
                  <p className="text-xs text-[#687272] mt-1">
                    “You are approving this vehicle for the carNodes verified registry.”
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F5F7F7] border border-[#E2E7E7] text-xs font-mono space-y-1">
                  <div className="font-bold text-[#171C1C]">{selectedItem.model}</div>
                  <div className="text-[#687272]">Vehicle ID: {selectedItem.id}</div>
                </div>

                <div className="flex items-start space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="modal-confirm-chk"
                    checked={confirmedCheck}
                    onChange={(e) => setConfirmedCheck(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#E2E7E7] text-[#159A9C] focus:ring-[#159A9C]"
                  />
                  <label htmlFor="modal-confirm-chk" className="text-xs text-[#171C1C] cursor-pointer leading-tight">
                    I have reviewed the vehicle and submitted documents.
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#E2E7E7] text-xs font-semibold text-zinc-600 hover:bg-[#F5F7F7]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmApprovalSubmit}
                    disabled={!confirmedCheck}
                    className="flex-1 py-2.5 rounded-xl bg-[#159A9C] hover:bg-[#123B3D] text-white font-bold text-xs uppercase disabled:opacity-40"
                  >
                    Confirm Approval
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
