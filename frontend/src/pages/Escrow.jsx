import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEscrowById, MOCK_ESCROWS } from '../mock/transactions';
import { getVehicleById } from '../mock/vehicles';
import { EscrowStateMachine } from '../components/escrow/EscrowStateMachine';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { SwissButton } from '../components/ui/SwissButton';
import { useWallet } from '../context/WalletContext';
import { useRole } from '../context/RoleContext';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import { weiToINR, shortAddress, formatDate, etherscanTx } from '../utils/format';
import { Shield, ExternalLink, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export default function Escrow() {
  const { id } = useParams();
  const { account } = useWallet();
  const { isAuthority } = useRole();

  // Look up mock escrow or fallback to index 0
  const initialEscrow = getEscrowById(id) || MOCK_ESCROWS[0];
  const [escrow, setEscrow] = useState(initialEscrow);
  const [loadingAction, setLoadingAction] = useState(false);

  const vehicle = getVehicleById(escrow?.vehicleId || '1');

  const advanceState = (newState) => {
    setLoadingAction(true);
    // TODO: Call VehicleEscrow.sol contract method
    setTimeout(() => {
      setEscrow(prev => ({ ...prev, state: newState }));
      setLoadingAction(false);
    }, 800);
  };

  return (
    <div className="bg-swiss-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b-2 border-swiss-black pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <SectionLabel number="07" label="ESCROW SMART CONTRACT LIFECYCLE" className="mb-2" />
            <SwissHeading level={1} className="text-4xl sm:text-5xl">
              Escrow Vault <span className="text-swiss-accent">#{escrow.escrowId}</span>
            </SwissHeading>
            <p className="mt-2 text-sm text-swiss-black/70 font-medium font-mono">
              Contract Address: {CONTRACT_ADDRESSES.VehicleEscrow} • Sepolia
            </p>
          </div>

          <div className="border-2 border-swiss-black p-4 bg-swiss-muted font-mono text-xs">
            <span className="text-swiss-black/50 block text-[10px] uppercase">Locked Escrow Value</span>
            <span className="font-black text-2xl text-swiss-black font-sans">{weiToINR(escrow.amount)}</span>
          </div>
        </div>

        {/* 2-Column Split: State Machine Left, Details & Actions Right */}
        <div className="grid grid-cols-1 lg:grid-cols-5-7 gap-10">
          {/* Left Column: Vertical State Machine */}
          <div className="border-2 border-swiss-black p-8 bg-swiss-white">
            <div className="border-b-2 border-swiss-black pb-4 mb-6">
              <SectionLabel number="01" label="EXECUTION PROTOCOL STATUS" />
              <SwissHeading level={3} className="text-xl mt-1">State Progression</SwissHeading>
            </div>
            <EscrowStateMachine currentState={escrow.state} />

            {/* Demo Simulation Controls for Judges */}
            <div className="mt-10 pt-6 border-t-2 border-swiss-black bg-swiss-muted p-4 border">
              <div className="text-[10px] font-black uppercase tracking-widest text-swiss-black/60 mb-2">
                Hackathon Demo State Switcher
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => advanceState(s)}
                    className={`px-2 py-1 text-[11px] font-mono font-bold border border-swiss-black transition-colors ${
                      escrow.state === s
                        ? 'bg-swiss-black text-swiss-white'
                        : 'bg-swiss-white hover:bg-swiss-black hover:text-swiss-white'
                    }`}
                  >
                    State {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Escrow Information and Contextual Actions */}
          <div className="flex flex-col gap-6">
            {/* Vehicle Summary */}
            {vehicle && (
              <div className="border-2 border-swiss-black p-6 bg-swiss-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-swiss-black/50">
                    Associated Vehicle Title
                  </span>
                  <Link to={`/vehicle/${vehicle.id}`} className="text-xs font-bold uppercase text-swiss-accent hover:underline">
                    View Vehicle →
                  </Link>
                </div>
                <div className="font-black text-2xl uppercase tracking-tight text-swiss-black">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </div>
                <div className="font-mono text-xs text-swiss-black/60 mt-1">
                  CHASSIS: {vehicle.vin} • REG: {vehicle.registrationNo}
                </div>
              </div>
            )}

            {/* Escrow Parties & Timestamps */}
            <div className="border-2 border-swiss-black p-6 bg-swiss-white">
              <SectionLabel number="02" label="CRYPTOGRAPHIC PARTIES & PROOF" className="mb-4" />

              <div className="divide-y-2 divide-swiss-black/10 font-mono text-xs">
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-swiss-black/50 uppercase">Buyer Address:</span>
                  <span className="font-bold text-swiss-black break-all">{escrow.buyer}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-swiss-black/50 uppercase">Seller Address:</span>
                  <span className="font-bold text-swiss-black break-all">{escrow.seller}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-swiss-black/50 uppercase">Escrow Initiated:</span>
                  <span className="font-sans font-bold text-swiss-black">{formatDate(escrow.createdAt)}</span>
                </div>
                {escrow.fundedAt && (
                  <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-swiss-black/50 uppercase">Funds Locked:</span>
                    <span className="font-sans font-bold text-swiss-black">{formatDate(escrow.fundedAt)}</span>
                  </div>
                )}
                {escrow.authorityApprovedAt && (
                  <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-swiss-black/50 uppercase">Authority Signed:</span>
                    <span className="font-sans font-bold text-swiss-black">{formatDate(escrow.authorityApprovedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contextual Action Card */}
            <div className="border-4 border-swiss-black p-8 bg-swiss-white">
              <SectionLabel number="03" label="PENDING PROTOCOL ACTION" className="mb-4" />

              {escrow.state === 0 && (
                <div>
                  <div className="text-lg font-black uppercase text-swiss-black mb-2">Escrow Created (Awaiting Funding)</div>
                  <p className="text-xs text-swiss-black/70 mb-6">
                    The escrow record is initialized. The buyer must deposit the purchase amount to activate the escrow.
                  </p>
                  <SwissButton variant="accent" loading={loadingAction} onClick={() => advanceState(1)}>
                    Deposit & Fund Escrow
                  </SwissButton>
                </div>
              )}

              {escrow.state === 1 && (
                <div>
                  <div className="text-lg font-black uppercase text-swiss-black mb-2">Funds Locked in Vault</div>
                  <p className="text-xs text-swiss-black/70 mb-6">
                    {weiToINR(escrow.amount)} is securely held. The seller must request ownership transfer from the Regional Transport Authority.
                  </p>
                  <SwissButton variant="primary" loading={loadingAction} onClick={() => advanceState(2)}>
                    Seller: Request Ownership Transfer
                  </SwissButton>
                </div>
              )}

              {escrow.state === 2 && (
                <div>
                  <div className="text-lg font-black uppercase text-swiss-black mb-2">Awaiting RTO Authority Approval</div>
                  <p className="text-xs text-swiss-black/70 mb-6">
                    The ownership transfer request has been queued on-chain. Regional Transport Authority officer signature is required.
                  </p>
                  <div className="flex gap-4">
                    <Link to={`/ownership-transfer/${escrow.escrowId}`}>
                      <SwissButton variant="accent">
                        Open Authority Review Portal
                        <ArrowRight className="inline w-4 h-4 ml-2" />
                      </SwissButton>
                    </Link>
                  </div>
                </div>
              )}

              {escrow.state === 3 && (
                <div>
                  <div className="text-lg font-black uppercase text-swiss-black mb-2">Authority Signature Confirmed</div>
                  <p className="text-xs text-swiss-black/70 mb-6">
                    The RTO authority has cryptographically approved the title transfer. The buyer can now confirm vehicle receipt and trigger token release.
                  </p>
                  <SwissButton variant="accent" loading={loadingAction} onClick={() => advanceState(4)}>
                    Buyer: Confirm Receipt & Release {weiToINR(escrow.amount)}
                  </SwissButton>
                </div>
              )}

              {escrow.state === 4 && (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-swiss-black mx-auto mb-3" />
                  <div className="text-xl font-black uppercase text-swiss-black mb-1">Escrow Completed</div>
                  <p className="text-xs text-swiss-black/70 max-w-md mx-auto mb-6">
                    Title NFT has been transferred to the buyer, and {weiToINR(escrow.amount)} MockINR has been released to the seller.
                  </p>
                  <Link to={`/passport/${vehicle?.id || '1'}`}>
                    <SwissButton variant="primary">
                      View Updated Passport
                    </SwissButton>
                  </Link>
                </div>
              )}

              {escrow.state === 5 && (
                <div className="text-center py-4">
                  <RotateCcw className="w-12 h-12 text-swiss-accent mx-auto mb-3" />
                  <div className="text-xl font-black uppercase text-swiss-black mb-1">Escrow Refunded</div>
                  <p className="text-xs text-swiss-black/70 max-w-md mx-auto mb-6">
                    Transaction was cancelled or rejected by authority. Funds returned to buyer's wallet.
                  </p>
                  <Link to="/marketplace">
                    <SwissButton variant="secondary">Return to Marketplace</SwissButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
