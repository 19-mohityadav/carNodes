import React, { useState } from 'react';
import {
  ShieldCheck,
  ListOrdered,
  BookOpenCheck,
  CheckSquare,
  ArrowRightLeft,
  Files,
  AlertTriangle,
  History,
  CheckCircle,
  User,
  CheckCircle2,
  Award,
  ArrowRight,
  Search,
  Filter,
  Eye,
  Check,
  X,
  FileText,
  AlertCircle,
  ExternalLink,
  Cpu,
  Building2,
  Lock,
  FileBadge2
} from 'lucide-react';
import { MOCK_AUTHORITY_DATA } from '../../data/dashboardData';
import { VEHICLES } from '../../data/vehicles';

export default function AuthorityDashboardView({
  activeTab,
  onSelectTab,
  onOpenPassport
}) {
  const [queue, setQueue] = useState(MOCK_AUTHORITY_DATA.verificationQueue);
  const [selectedQueueItem, setSelectedQueueItem] = useState(MOCK_AUTHORITY_DATA.verificationQueue[0]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [confirmedCheck, setConfirmedCheck] = useState(false);
  const [decisionSuccess, setDecisionSuccess] = useState(null);
  const [registrySearch, setRegistrySearch] = useState('');
  const [registryFilter, setRegistryFilter] = useState('all');

  const handleOpenReview = (item) => {
    setSelectedQueueItem(item);
    setConfirmedCheck(false);
    setDecisionSuccess(null);
    setReviewModalOpen(true);
  };

  const handleDecision = (type) => {
    if (type === 'approve' && !confirmedCheck) {
      alert("Please confirm the verification checkbox before approving.");
      return;
    }

    setDecisionSuccess(type);
    setQueue((prev) =>
      prev.map((q) => (q.id === selectedQueueItem.id ? { ...q, status: type === 'approve' ? 'Verified' : type === 'reject' ? 'Rejected' : 'Under Review' } : q))
    );

    setTimeout(() => {
      setDecisionSuccess(null);
      setReviewModalOpen(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ==========================================================
          1. AUTHORITY DASHBOARD HOME
      ========================================================== */}
      {activeTab === 'dashboard' && (
        <>
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
                Authority Dashboard
              </h1>
              
              <p className="text-sm text-slate-500 leading-relaxed">
                Review submitted physical title deeds, validate telemetry from certified inspection stations, and sign RWA ownership transitions on Ethereum Sepolia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => onSelectTab('queue')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Process Queue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ==========================================================
              AUTHORITY SUMMARY — EXACTLY FOUR COMPACT CARDS
          ========================================================== */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                Authority Operational Metrics
              </h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Pending Verifications</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {MOCK_AUTHORITY_DATA.stats.pendingVerifications}
                  </span>
                  <button onClick={() => onSelectTab('queue')} className="text-xs text-teal-700 hover:underline font-semibold cursor-pointer">
                    Review
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Approved Today</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {MOCK_AUTHORITY_DATA.stats.approvedToday}
                  </span>
                  
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Transfer Requests</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">
                    {MOCK_AUTHORITY_DATA.stats.transferRequests}
                  </span>
                  <button onClick={() => onSelectTab('transfers')} className="text-xs text-teal-700 hover:underline font-semibold cursor-pointer">
                    Inspect
                  </button>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 block">Risk Alerts</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-heading font-extrabold text-rose-600">
                    {MOCK_AUTHORITY_DATA.stats.riskAlerts}
                  </span>
                  <button onClick={() => onSelectTab('risk-alerts')} className="text-[11px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">
                    Needs Action
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Queue Snapshot on Home */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                
                <p className="text-xs text-slate-500">
                  Recent document submissions awaiting official RTO verification.
                </p>
              </div>
              <button
                onClick={() => onSelectTab('queue')}
                className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
              >
                View Full Queue →
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {queue.slice(0, 3).map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.vehicleName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">Owner: {item.ownerName} • VIN: {item.vin}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold uppercase text-slate-700">
                      {item.status}
                    </span>
                    <button
                      onClick={() => handleOpenReview(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-800 text-white font-semibold cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ==========================================================
          2. VERIFICATION QUEUE (PRIMARY AUTHORITY FEATURE)
      ========================================================== */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-slate-900">
                Official Vehicle Verification Queue ({queue.length})
              </h2>
              <p className="text-xs text-slate-500">
                Audit title deeds, chassis numbers, insurance validity, and hypothecation freedom before on-chain passport issuance.
              </p>
            </div>
          </div>

          {/* Queue Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Vehicle</th>
                    <th className="py-4 px-4">Owner / Entity</th>
                    <th className="py-4 px-4">Verification Type</th>
                    <th className="py-4 px-4">Submitted</th>
                    <th className="py-4 px-4">Risk</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {queue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 block">{item.vehicleName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Reg: {item.registrationNo} • {item.vin}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800 block">{item.ownerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.ownerType}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-700 font-medium">{item.verificationType}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-500 font-mono">{item.submittedDate}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                          item.risk === 'LOW' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {item.risk} (Score {item.riskScore})
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : item.status === 'Under Review'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleOpenReview(item)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                        >
                          Review
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
          VEHICLE VERIFICATION SCREEN MODAL (REVIEW WORKFLOW)
      ========================================================== */}
      {reviewModalOpen && selectedQueueItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-[#FDFBF7] w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Official Verification Dossier</span>
                <h3 className="text-base font-heading font-extrabold text-white">
                  Audit: {selectedQueueItem.vehicleName}
                </h3>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Split */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FDFBF7]">
              {decisionSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Authority Decision Recorded: {decisionSuccess.toUpperCase()} on Ethereum Sepolia!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* LEFT (5 cols): Vehicle Identity */}
                <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                  <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                    <img src="/cars/audi_r8_camry.png" alt="Vehicle" className="max-h-full object-contain" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-slate-900 text-sm">{selectedQueueItem.vehicleName}</h4>
                    <div className="p-2.5 rounded-lg bg-slate-50 font-mono space-y-1 text-[11px]">
                      <div>VIN: <strong className="text-slate-900">{selectedQueueItem.vin}</strong></div>
                      <div>Registration: <strong className="text-slate-900">{selectedQueueItem.registrationNo}</strong></div>
                      <div>Current Owner: <strong className="text-slate-900">{selectedQueueItem.ownerName}</strong></div>
                    </div>
                  </div>

                  {/* Document Preview Snippet */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Submitted Title Document Preview
                    </span>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-slate-700 text-xs">Form_23_RC_Book_Scan.pdf</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT (7 cols): Verification Checklist & Risk Assessment */}
                <div className="md:col-span-7 space-y-4">
                  {/* Checklist */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Authority Multi-Checklist
                    </h4>

                    <div className="space-y-2 text-xs">
                      {[
                        { label: 'Identity & Seller Match', status: selectedQueueItem.checklist.identityMatch },
                        { label: 'Registration Document (RC) Validity', status: selectedQueueItem.checklist.registrationDoc },
                        { label: 'Ownership Chain & Transfer Right', status: selectedQueueItem.checklist.ownershipProof },
                        { label: 'Insurance Policy Sync (IIB Oracle)', status: selectedQueueItem.checklist.insurance },
                        { label: 'Physical Inspection & Telemetry Scan', status: selectedQueueItem.checklist.inspection },
                        { label: 'Hypothecation / Bank Finance Status', status: selectedQueueItem.checklist.financeStatus }
                      ].map((chk, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="font-medium text-slate-700">{chk.label}</span>
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                            chk.status === 'verified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : chk.status === 'mismatch'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {chk.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compact Risk Panel */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-heading">Vehicle Risk Assessment</span>
                      <span className="text-xs font-mono font-bold text-emerald-700">Trust Score {selectedQueueItem.riskScore}/100</span>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-500">
                      <div className="flex justify-between">
                        <span>Document Consistency</span>
                        <strong className="text-slate-800">98% Match</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[98%] h-full bg-emerald-500 rounded-full" />
                      </div>

                      <div className="flex justify-between pt-1">
                        <span>Ownership Consistency</span>
                        <strong className="text-slate-800">100% Match</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[100%] h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authority Decision Panel */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="confirmReview"
                    checked={confirmedCheck}
                    onChange={(e) => setConfirmedCheck(e.target.checked)}
                    className="mt-1 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <label htmlFor="confirmReview" className="text-xs text-slate-700 font-medium cursor-pointer">
                    “Confirm vehicle and document information has been reviewed against regional VAHAN / RTO registries.”
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-mono text-slate-400">
                    Decision will be recorded to Sepolia Oracle
                  </span>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDecision('reject')}
                      className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDecision('correction')}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                    >
                      Request Correction
                    </button>
                    <button
                      onClick={() => handleDecision('approve')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve Vehicle</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================================
          3. VEHICLE REGISTRY VIEW
      ========================================================== */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Verified Vehicle Registry
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={registrySearch}
                  onChange={(e) => setRegistrySearch(e.target.value)}
                  placeholder="Search by Vehicle ID, Registration Plate, or Owner..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-teal-600 focus:bg-white font-mono"
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={registryFilter}
                  onChange={(e) => setRegistryFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending Approval</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-4 px-6">Vehicle Asset</th>
                  <th className="py-4 px-4">Registration</th>
                  <th className="py-4 px-4">Current Owner</th>
                  <th className="py-4 px-4">Blockchain Record</th>
                  <th className="py-4 px-6 text-right">Passport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {VEHICLES.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70">
                    <td className="py-4 px-6 font-bold text-slate-900">{v.model}</td>
                    <td className="py-4 px-4 font-mono text-slate-700">{v.id}</td>
                    <td className="py-4 px-4 text-slate-700">Vikram Singhania</td>
                    <td className="py-4 px-4 font-mono text-teal-700">Sepolia: 0x89a...4f92</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onOpenPassport(v)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 font-semibold cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================================
          4. OWNERSHIP TRANSFERS & AUDIT TRAIL
      ========================================================== */}
      {(activeTab === 'transfers' || activeTab === 'pending-approvals') && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Ownership Transfer Requests ({MOCK_AUTHORITY_DATA.transferRequests.length})
            </h2>
            <p className="text-xs text-slate-500">
              Verify smart escrow locking and digitally approve title transfer between parties.
            </p>
          </div>

          <div className="space-y-4">
            {MOCK_AUTHORITY_DATA.transferRequests.map((tr) => (
              <div key={tr.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Transfer ID: {tr.id}</span>
                    <h3 className="text-base font-bold font-heading text-slate-900">{tr.vehicleName}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold">
                    {tr.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Seller</span>
                    <strong>{tr.currentOwner}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Buyer</span>
                    <strong>{tr.newOwner}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Escrow Amount</span>
                    <strong className="text-teal-800">{tr.escrowAmount}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Tax & Title Status</span>
                    <strong className="text-emerald-700">{tr.taxPaidStatus}</strong>
                  </div>
                </div>

                {/* Audit Timeline */}
                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    onClick={() => alert("Digital Title Transfer Signed by Authority Node #409 on Ethereum Sepolia!")}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Ownership Transfer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================================
          5. RISK ALERTS & AUDIT TRAIL
      ========================================================== */}
      {activeTab === 'risk-alerts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Active Risk Alerts ({MOCK_AUTHORITY_DATA.riskAlerts.length})
            </h2>
            <p className="text-xs text-slate-500">
              Anomalies detected in submitted serial numbers, hypothecation status, or insurance validity.
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_AUTHORITY_DATA.riskAlerts.map((alt) => (
              <div key={alt.id} className="p-5 rounded-2xl bg-white border border-rose-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-mono font-bold uppercase">
                      {alt.severity} Severity
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{alt.vehicle}</span>
                  </div>
                  <p className="text-xs text-slate-600">{alt.issue}</p>
                  <p className="text-[10px] font-mono text-slate-400">{alt.date}</p>
                </div>
                <button
                  onClick={() => alert(`Action initialized: ${alt.action}`)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  {alt.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit-trail' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Immutable Authority Audit Trail
            </h2>
            <p className="text-xs text-slate-500">
              Cryptographic transaction logs signed by certified authority oracle nodes on Ethereum Sepolia.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {MOCK_AUTHORITY_DATA.auditTrail.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900 block font-sans">{log.action}: {log.vehicle}</span>
                  <span className="text-[11px] text-slate-500">Operator: {log.operator} • {log.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-teal-700 font-bold block">{log.txHash}</span>
                  <span className="text-[10px] text-emerald-700">✓ {log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
