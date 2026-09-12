import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_VEHICLES, getPendingVehicles, getVerifiedVehicles } from '../mock/vehicles';
import { MOCK_ESCROWS } from '../mock/transactions';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { SwissButton } from '../components/ui/SwissButton';
import { SwissBadge } from '../components/ui/SwissBadge';
import { useRole } from '../context/RoleContext';
import { useWallet } from '../context/WalletContext';
import { shortAddress, formatDate, weiToINR } from '../utils/format';
import { Shield, Check, X, Eye, FileText, ArrowRight, Clock } from 'lucide-react';

export default function AuthorityDashboard() {
  const { isAuthority, setRole } = useRole();
  const { account } = useWallet();

  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [processingId, setProcessingId] = useState(null);

  const pendingList = vehicles.filter(v => !v.verified);
  const verifiedList = vehicles.filter(v => v.verified);

  const handleVerify = (id) => {
    setProcessingId(id);
    // TODO: Call VehiclePassport.sol verifyVehicle(id)
    setTimeout(() => {
      setVehicles(prev =>
        prev.map(v => v.id === id ? { ...v, verified: true, verifier: account || '0x1a2b...9a0b' } : v)
      );
      setProcessingId(null);
    }, 1000);
  };

  const handleReject = (id) => {
    setProcessingId(id);
    setTimeout(() => {
      setVehicles(prev => prev.filter(v => v.id !== id));
      setProcessingId(null);
    }, 800);
  };

  return (
    <div className="bg-swiss-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b-2 border-swiss-black pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <SectionLabel number="09" label="MINISTRY OF TRANSPORT & HIGHWAYS" className="mb-2" />
            <SwissHeading level={1} className="text-4xl sm:text-5xl">
              Authority <span className="text-swiss-accent">Console</span>
            </SwissHeading>
            <p className="mt-2 text-sm text-swiss-black/70 font-medium">
              National Decentralized Vehicle Ledger • Digital Verification Portal
            </p>
          </div>

          {/* Role Status Switcher for Hackathon Judges */}
          <div className="border-2 border-swiss-black p-4 bg-swiss-muted flex items-center gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Current Role</div>
              <div className="text-xs font-black uppercase text-swiss-black">
                {isAuthority ? 'Authorized RTO Officer' : 'Public Viewer'}
              </div>
            </div>
            {!isAuthority && (
              <button
                onClick={() => setRole && setRole('authority')}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-swiss-black text-swiss-white hover:bg-swiss-accent transition-colors"
              >
                Enable Officer Mode
              </button>
            )}
          </div>
        </div>

        {/* 4-Stat Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-swiss-black mb-12 divide-x-2 divide-y md:divide-y-0 divide-swiss-black bg-swiss-white">
          <div className="p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Pending Verification</div>
            <div className="font-mono text-3xl font-black text-swiss-accent mt-2">{pendingList.length}</div>
          </div>
          <div className="p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Verified Passports</div>
            <div className="font-mono text-3xl font-black text-swiss-black mt-2">{verifiedList.length}</div>
          </div>
          <div className="p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Active Escrows</div>
            <div className="font-mono text-3xl font-black text-swiss-black mt-2">{MOCK_ESCROWS.length}</div>
          </div>
          <div className="p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Smart Contract</div>
            <div className="font-mono text-xs font-bold text-swiss-black mt-3 break-all">
              0x0127...0A44
            </div>
          </div>
        </div>

        {/* Section 1: Pending Queue */}
        <div className="mb-14">
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-swiss-black">
            <div>
              <SectionLabel number="01" label="INSPECTION & VERIFICATION QUEUE" />
              <SwissHeading level={2} className="text-2xl mt-1">Pending Vehicle Applications</SwissHeading>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-1 bg-swiss-black text-swiss-white">
              {pendingList.length} QUEUED
            </span>
          </div>

          {pendingList.length === 0 ? (
            <div className="border-2 border-swiss-black p-12 text-center bg-swiss-muted">
              <Shield className="w-10 h-10 mx-auto mb-2 text-swiss-black/40" />
              <div className="text-sm font-black uppercase text-swiss-black">All Queued Records Verified</div>
              <p className="text-xs text-swiss-black/60 mt-1">No pending vehicle passports waiting for authority signature.</p>
            </div>
          ) : (
            <div className="border-2 border-swiss-black overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-swiss-black bg-swiss-muted text-[10px] font-black uppercase tracking-widest text-swiss-black/60">
                    <th className="p-4">Reg No / VIN</th>
                    <th className="p-4">Vehicle Model</th>
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Evidence Docs</th>
                    <th className="p-4">AI Risk</th>
                    <th className="p-4 text-right">Officer Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-swiss-black/15 font-mono text-xs">
                  {pendingList.map(vehicle => (
                    <tr key={vehicle.id} className="hover:bg-swiss-muted/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-swiss-black text-sm">{vehicle.registrationNo}</div>
                        <div className="text-[11px] text-swiss-black/50">{vehicle.vin}</div>
                      </td>
                      <td className="p-4 font-sans">
                        <div className="font-bold text-swiss-black">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                        <div className="text-[11px] text-swiss-black/60 font-mono">{vehicle.fuelType} • {vehicle.transmission}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-sans font-bold text-swiss-black">{vehicle.sellerName}</div>
                        <div className="text-[11px] text-swiss-black/50">{shortAddress(vehicle.owner)}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-sans">
                          <FileText className="w-3.5 h-3.5 text-swiss-accent" />
                          <span className="font-bold">{vehicle.evidence.length} files attached</span>
                        </div>
                      </td>
                      <td className="p-4 font-sans">
                        <span className={`font-black uppercase text-xs ${vehicle.riskScore > 30 ? 'text-swiss-accent' : 'text-swiss-black'}`}>
                          {vehicle.riskScore}/100 Risk
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link to={`/vehicle/${vehicle.id}`}>
                            <button className="px-3 py-1.5 border border-swiss-black bg-swiss-white hover:bg-swiss-black hover:text-swiss-white font-sans text-xs font-bold uppercase transition-colors">
                              Inspect
                            </button>
                          </Link>
                          <SwissButton
                            variant="primary"
                            size="sm"
                            loading={processingId === vehicle.id}
                            onClick={() => handleVerify(vehicle.id)}
                          >
                            <Check className="inline w-3.5 h-3.5 mr-1" />
                            Approve
                          </SwissButton>
                          <SwissButton
                            variant="danger"
                            size="sm"
                            loading={processingId === vehicle.id}
                            onClick={() => handleReject(vehicle.id)}
                          >
                            <X className="inline w-3.5 h-3.5" />
                          </SwissButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Recent Verified Titles */}
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-swiss-black">
            <div>
              <SectionLabel number="02" label="ACTIVE PASSPORTS LEDGER" />
              <SwissHeading level={2} className="text-2xl mt-1">Verified Registry Passports</SwissHeading>
            </div>
            <span className="font-mono text-xs text-swiss-black/50">ALL RECORDS SEALED</span>
          </div>

          <div className="border-2 border-swiss-black overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-swiss-black bg-swiss-muted text-[10px] font-black uppercase tracking-widest text-swiss-black/60">
                  <th className="p-4">Passport ID</th>
                  <th className="p-4">Reg Number</th>
                  <th className="p-4">Vehicle Description</th>
                  <th className="p-4">Current Owner</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-swiss-black/15 font-mono text-xs">
                {verifiedList.map(v => (
                  <tr key={v.id} className="hover:bg-swiss-muted/60 transition-colors">
                    <td className="p-4 font-bold text-swiss-accent">#{v.vehicleId}</td>
                    <td className="p-4 font-bold text-swiss-black">{v.registrationNo}</td>
                    <td className="p-4 font-sans font-bold text-swiss-black">
                      {v.year} {v.make} {v.model}
                    </td>
                    <td className="p-4 text-swiss-black/70">{shortAddress(v.owner)}</td>
                    <td className="p-4 font-sans">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-swiss-black bg-swiss-muted px-2 py-0.5 border border-swiss-black">
                        <Check className="w-3 h-3 text-swiss-black" /> Verified
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/passport/${v.id}`}>
                        <button className="px-3 py-1 border border-swiss-black bg-swiss-white hover:bg-swiss-black hover:text-swiss-white font-sans text-xs font-bold uppercase transition-colors">
                          View Title →
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
