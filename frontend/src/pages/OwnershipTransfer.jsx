import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEscrowById, MOCK_ESCROWS } from '../mock/transactions';
import { getVehicleById } from '../mock/vehicles';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { SwissButton } from '../components/ui/SwissButton';
import { SwissTextarea } from '../components/ui/SwissInput';
import { useWallet } from '../context/WalletContext';
import { useRole } from '../context/RoleContext';
import { shortAddress, weiToINR, formatDate } from '../utils/format';
import { ArrowLeft, ShieldCheck, ShieldAlert, Check, X, AlertCircle } from 'lucide-react';

export default function OwnershipTransfer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account } = useWallet();
  const { isAuthority, setRole } = useRole();

  const escrow = getEscrowById(id) || MOCK_ESCROWS[0];
  const vehicle = getVehicleById(escrow?.vehicleId || '1');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'approved' | 'rejected'
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    // TODO: Call VehicleEscrow.sol or VehicleRegistry.sol approveTransfer(...)
    setTimeout(() => {
      setLoading(false);
      setStatus('approved');
    }, 1200);
  };

  const handleReject = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Call VehicleEscrow.sol rejectTransfer(...)
    setTimeout(() => {
      setLoading(false);
      setStatus('rejected');
    }, 1200);
  };

  return (
    <div className="bg-swiss-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to={`/escrow/${escrow.escrowId}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-swiss-black hover:text-swiss-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Escrow Record</span>
          </Link>
        </div>

        {/* Header */}
        <div className="border-b-2 border-swiss-black pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <SectionLabel number="08" label="GOVERNMENT RTO AUTHORITY GATEWAY" className="mb-2" />
            <SwissHeading level={1} className="text-4xl sm:text-5xl">
              Title Transfer <span className="text-swiss-accent">Audit</span>
            </SwissHeading>
            <p className="mt-2 text-sm text-swiss-black/70 font-medium">
              Regional Transport Office • Karnataka State Division (RTO-KA01)
            </p>
          </div>

          {/* Role Status Switcher for Hackathon Demo */}
          <div className="border-2 border-swiss-black p-4 bg-swiss-muted flex items-center gap-4">
            <div className="text-xs">
              <span className="text-swiss-black/50 block text-[10px] uppercase font-bold">Simulated Identity</span>
              <span className="font-bold text-swiss-black">
                {isAuthority ? 'RTO Authority Officer' : 'Public Observer'}
              </span>
            </div>
            {!isAuthority && (
              <button
                onClick={() => setRole && setRole('authority')}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-swiss-black text-swiss-white hover:bg-swiss-accent transition-colors"
              >
                Act as Authority
              </button>
            )}
          </div>
        </div>

        {/* Success or Rejected Banners */}
        {status === 'approved' && (
          <div className="border-4 border-swiss-black p-8 bg-swiss-muted mb-10 text-center">
            <ShieldCheck className="w-12 h-12 text-swiss-accent mx-auto mb-3" />
            <div className="text-2xl font-black uppercase text-swiss-black mb-2">
              Ownership Title Transfer Certified
            </div>
            <p className="text-sm text-swiss-black/70 max-w-lg mx-auto mb-6">
              RTO digital signature affixed on-chain. VehiclePassport NFT title transferred to buyer. Escrow unlocked for buyer final confirmation.
            </p>
            <Link to={`/escrow/${escrow.escrowId}`}>
              <SwissButton variant="primary">Return to Escrow Vault</SwissButton>
            </Link>
          </div>
        )}

        {status === 'rejected' && (
          <div className="border-4 border-swiss-accent p-8 bg-swiss-muted mb-10 text-center">
            <ShieldAlert className="w-12 h-12 text-swiss-accent mx-auto mb-3" />
            <div className="text-2xl font-black uppercase text-swiss-black mb-2">
              Transfer Rejected by Authority
            </div>
            <p className="text-sm text-swiss-black/70 max-w-lg mx-auto mb-6">
              Rejection signature recorded. The smart contract has triggered a full escrow refund back to the buyer's wallet.
            </p>
            <Link to={`/escrow/${escrow.escrowId}`}>
              <SwissButton variant="secondary">View Updated Escrow</SwissButton>
            </Link>
          </div>
        )}

        {/* Transfer Audit Comparison Layout */}
        {!status && (
          <div className="grid grid-cols-1 lg:grid-cols-7-5 gap-10">
            {/* Left: Transfer Data Verification Matrix */}
            <div className="flex flex-col gap-6">
              <div className="border-2 border-swiss-black p-6 bg-swiss-white">
                <SectionLabel number="01" label="OFFICIAL TITLE TRANSFER PARTIES" className="mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border-2 border-swiss-black bg-swiss-muted">
                  {/* Current Owner */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-swiss-black/50 block mb-1">
                      Registered Title Holder (Transferor)
                    </span>
                    <div className="font-sans font-bold text-base text-swiss-black">
                      {vehicle?.sellerName || 'Rajesh Kumar'}
                    </div>
                    <div className="font-mono text-xs text-swiss-black/70 break-all mt-1">
                      {escrow.seller}
                    </div>
                  </div>

                  {/* Intended Buyer */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-swiss-black/50 block mb-1">
                      Intended New Owner (Transferee)
                    </span>
                    <div className="font-sans font-bold text-base text-swiss-black">
                      Verified Buyer Account
                    </div>
                    <div className="font-mono text-xs text-swiss-black/70 break-all mt-1">
                      {escrow.buyer}
                    </div>
                  </div>
                </div>

                <div className="mt-6 divide-y divide-swiss-black/15 font-mono text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-swiss-black/50 uppercase">Vehicle:</span>
                    <span className="font-bold text-swiss-black font-sans">{vehicle?.year} {vehicle?.make} {vehicle?.model}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-swiss-black/50 uppercase">Official Reg No:</span>
                    <span className="font-bold text-swiss-black">{vehicle?.registrationNo}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-swiss-black/50 uppercase">Chassis (VIN):</span>
                    <span className="font-bold text-swiss-black">{vehicle?.vin}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-swiss-black/50 uppercase">Locked Escrow:</span>
                    <span className="font-bold text-swiss-accent font-sans">{weiToINR(escrow.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Document Audit Checklist */}
              <div className="border-2 border-swiss-black p-6 bg-swiss-white">
                <SectionLabel number="02" label="MANDATORY STATUTORY AUDIT CHECKS" className="mb-4" />

                <div className="flex flex-col gap-3 font-mono text-xs">
                  <div className="flex items-center gap-3 p-3 bg-swiss-muted border border-swiss-black/20">
                    <Check className="w-4 h-4 text-swiss-black" />
                    <span>Original Registration Certificate (Form 23) match on IPFS</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-swiss-muted border border-swiss-black/20">
                    <Check className="w-4 h-4 text-swiss-black" />
                    <span>Valid Pollution Under Control (PUC) & Comprehensive Insurance</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-swiss-muted border border-swiss-black/20">
                    <Check className="w-4 h-4 text-swiss-black" />
                    <span>No outstanding e-Challan or police hypothecation lien</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-swiss-muted border border-swiss-black/20">
                    <Check className="w-4 h-4 text-swiss-black" />
                    <span>Smart contract escrow balance confirmed funded</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Authority Signing Actions */}
            <div className="flex flex-col gap-6">
              <div className="border-4 border-swiss-black p-8 bg-swiss-white">
                <SectionLabel number="03" label="AUTHORITY ATTESTATION" className="mb-4" />
                <div className="text-lg font-black uppercase tracking-tight text-swiss-black mb-2">
                  Official Signature Authorization
                </div>
                <p className="text-xs text-swiss-black/70 mb-6">
                  Signing this transaction executes an immutable state transition in the <span className="font-mono font-bold">VehicleRegistry</span> and <span className="font-mono font-bold">VehicleEscrow</span> smart contracts on Sepolia.
                </p>

                <div className="flex flex-col gap-4">
                  <SwissButton
                    variant="accent"
                    size="lg"
                    loading={loading}
                    onClick={handleApprove}
                  >
                    <ShieldCheck className="inline w-5 h-5 mr-2" />
                    Sign & Approve Title Transfer
                  </SwissButton>

                  {!showRejectForm ? (
                    <SwissButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRejectForm(true)}
                    >
                      Reject Transfer Application
                    </SwissButton>
                  ) : (
                    <form onSubmit={handleReject} className="border-2 border-swiss-accent p-4 bg-swiss-muted mt-2">
                      <div className="text-xs font-bold uppercase text-swiss-accent mb-2">
                        Specify Rejection Grounds
                      </div>
                      <SwissTextarea
                        id="rejectReason"
                        placeholder="e.g. Mismatched chassis number on physical inspection or document tampering."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        required
                        rows={3}
                        className="mb-3"
                      />
                      <div className="flex gap-2">
                        <SwissButton type="submit" variant="danger" size="sm" loading={loading}>
                          Confirm Rejection
                        </SwissButton>
                        <SwissButton type="button" variant="ghost" size="sm" onClick={() => setShowRejectForm(false)}>
                          Cancel
                        </SwissButton>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
