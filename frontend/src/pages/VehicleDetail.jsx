import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVehicleById } from '../mock/vehicles';
import { PassportHeader } from '../components/vehicle/PassportHeader';
import { OwnershipTimeline } from '../components/vehicle/OwnershipTimeline';
import { EvidenceGrid } from '../components/vehicle/EvidenceGrid';
import { RiskScore } from '../components/vehicle/RiskScore';
import { VerificationBadge } from '../components/vehicle/VerificationBadge';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { SwissButton } from '../components/ui/SwissButton';
import { etherscanTx, etherscanAddr, shortAddress, formatDate } from '../utils/format';
import { Shield, FileText, History, Cpu, ExternalLink, ArrowRight } from 'lucide-react';

export default function VehicleDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('specs');

  // TODO: Replace with GET /api/vehicles/:id
  const vehicle = getVehicleById(id);

  if (!vehicle) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-24 text-center">
        <SectionLabel number="404" label="NOT FOUND" className="justify-center mb-4" />
        <SwissHeading level={1} className="text-4xl mb-6">Vehicle Record Not Found</SwissHeading>
        <p className="text-sm font-bold uppercase tracking-widest text-swiss-black/50 mb-8">
          The requested vehicle identifier does not match any registered passport in the registry.
        </p>
        <Link to="/marketplace">
          <SwissButton variant="primary">Return to Marketplace</SwissButton>
        </Link>
      </div>
    );
  }

  const TABS = [
    { id: 'specs', label: '01. Specifications', icon: Shield },
    { id: 'timeline', label: '02. Ownership History', icon: History },
    { id: 'evidence', label: '03. Evidence & IPFS', icon: FileText },
    { id: 'ai', label: '04. AI Risk Assessment', icon: Cpu },
  ];

  return (
    <div className="bg-swiss-white min-h-screen">
      {/* Passport Hero */}
      <PassportHeader vehicle={vehicle} />

      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Tab Navigation */}
        <div className="border-b-2 border-swiss-black flex flex-wrap gap-0">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest border-r-2 border-t-2 sm:border-t-0 border-swiss-black transition-colors duration-150 ${
                  isActive
                    ? 'bg-swiss-black text-swiss-white'
                    : 'bg-swiss-white text-swiss-black hover:bg-swiss-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="pt-8">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 lg:grid-cols-8-4 gap-8">
              {/* Left Column: Tech Details */}
              <div className="border-2 border-swiss-black bg-swiss-white">
                <div className="p-6 border-b-2 border-swiss-black bg-swiss-muted flex items-center justify-between">
                  <SectionLabel number="01" label="TECHNICAL PASSPORT SPECIFICATIONS" />
                  <span className="font-mono text-xs text-swiss-black/50">ON-CHAIN VERIFIED</span>
                </div>

                <div className="divide-y-2 divide-swiss-black/10">
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">Make & Model</div>
                      <div className="font-black text-lg text-swiss-black">{vehicle.make} {vehicle.model}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">Registration Number</div>
                      <div className="font-mono font-bold text-lg text-swiss-black">{vehicle.registrationNo}</div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">Model Year</div>
                      <div className="font-mono font-bold text-base text-swiss-black">{vehicle.year}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">Fuel Type</div>
                      <div className="font-bold text-base text-swiss-black uppercase">{vehicle.fuelType}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">Transmission</div>
                      <div className="font-bold text-base text-swiss-black uppercase">{vehicle.transmission}</div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">Vehicle Identification Number (VIN)</div>
                      <div className="font-mono font-bold text-sm text-swiss-black bg-swiss-muted p-2 border border-swiss-black/20 break-all">
                        {vehicle.vin}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">VIN SHA-256 Hash</div>
                      <div className="font-mono text-xs text-swiss-black/70 bg-swiss-muted p-2 border border-swiss-black/20 break-all">
                        {vehicle.vinHash}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">IPFS Metadata CID</div>
                      <a
                        href={`https://ipfs.io/ipfs/${vehicle.metadataCID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-swiss-accent hover:underline flex items-center gap-1.5 break-all mt-1"
                      >
                        <span>{vehicle.metadataCID}</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      </a>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">Mint Transaction Hash</div>
                      <a
                        href={etherscanTx(vehicle.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-swiss-accent hover:underline flex items-center gap-1.5 break-all mt-1"
                      >
                        <span>{vehicle.txHash}</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Verification & Quick Action Panel */}
              <div className="flex flex-col gap-6">
                <VerificationBadge verified={vehicle.verified} verifier={vehicle.verifier} large />

                {/* Purchase Card */}
                <div className="border-2 border-swiss-black p-6 bg-swiss-muted">
                  <SectionLabel number="02" label="ESCROW TRANSACTION" className="mb-4" />
                  <p className="text-xs text-swiss-black/70 leading-relaxed mb-6">
                    Smart contract escrow locks MockINR tokens on Sepolia. Funds are released only after RTO authority signs the ownership transfer.
                  </p>

                  <Link to={`/purchase/${vehicle.id}`}>
                    <SwissButton variant="accent" size="full" className="mb-3">
                      Initiate Purchase Escrow
                      <ArrowRight className="inline w-4 h-4 ml-2" />
                    </SwissButton>
                  </Link>
                  <Link to={`/passport/${vehicle.id}`}>
                    <SwissButton variant="secondary" size="full">
                      Print Digital Certificate
                    </SwissButton>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="border-2 border-swiss-black p-8 bg-swiss-white">
              <div className="flex items-center justify-between pb-6 mb-8 border-b-2 border-swiss-black">
                <div>
                  <SectionLabel number="02" label="IMMUTABLE ON-CHAIN TIMELINE" />
                  <SwissHeading level={2} className="text-2xl mt-2">Vehicle Provenance Record</SwissHeading>
                </div>
                <div className="font-mono text-xs text-swiss-black/50 text-right">
                  TOTAL TRANSFERS: {vehicle.ownershipHistory.length}
                </div>
              </div>
              <OwnershipTimeline history={vehicle.ownershipHistory} />
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="border-2 border-swiss-black p-8 bg-swiss-white">
              <div className="flex items-center justify-between pb-6 mb-8 border-b-2 border-swiss-black">
                <div>
                  <SectionLabel number="03" label="IPFS CRYPTOGRAPHIC EVIDENCE" />
                  <SwissHeading level={2} className="text-2xl mt-2">Decentralized Document Vault</SwissHeading>
                </div>
                <div className="font-mono text-xs text-swiss-black/50 text-right">
                  {vehicle.evidence.length} DOCUMENTS ANCHORED
                </div>
              </div>
              <EvidenceGrid evidence={vehicle.evidence} />
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="border-2 border-swiss-black p-8 bg-swiss-white">
              <div className="flex items-center justify-between pb-6 mb-8 border-b-2 border-swiss-black">
                <div>
                  <SectionLabel number="04" label="NEURAL AUDIT ANALYSIS" />
                  <SwissHeading level={2} className="text-2xl mt-2">AI Verification & Risk Engine</SwissHeading>
                </div>
                <Link to="/ai-analysis">
                  <SwissButton variant="secondary" size="sm">
                    Open Full AI Terminal
                  </SwissButton>
                </Link>
              </div>
              <div className="max-w-2xl">
                <RiskScore score={vehicle.riskScore} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
