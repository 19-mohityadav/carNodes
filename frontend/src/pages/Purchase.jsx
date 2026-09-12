import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getVehicleById } from '../mock/vehicles';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { SwissButton } from '../components/ui/SwissButton';
import { VerificationBadge } from '../components/vehicle/VerificationBadge';
import { useWallet } from '../context/WalletContext';
import { weiToINR, shortAddress } from '../utils/format';
import { ArrowLeft, ShieldCheck, Lock, Check, ArrowRight, AlertTriangle } from 'lucide-react';

export default function Purchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account, isConnected, connect } = useWallet();

  // TODO: Replace with GET /api/vehicles/:id
  const vehicle = getVehicleById(id);

  const [step, setStep] = useState('review'); // 'review' | 'approved' | 'completed'
  const [approving, setApproving] = useState(false);
  const [funding, setFunding] = useState(false);

  if (!vehicle) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-24 text-center">
        <SectionLabel number="404" label="VEHICLE NOT FOUND" className="justify-center mb-4" />
        <SwissHeading level={1} className="text-4xl mb-6">Listing Not Available</SwissHeading>
        <Link to="/marketplace">
          <SwissButton variant="primary">Return to Marketplace</SwissButton>
        </Link>
      </div>
    );
  }

  const handleApprove = async () => {
    setApproving(true);
    // TODO: Call MockINR.sol approve(VehicleEscrow, amount)
    setTimeout(() => {
      setApproving(false);
      setStep('approved');
    }, 1500);
  };

  const handleCreateEscrow = async () => {
    setFunding(true);
    // TODO: Call VehicleEscrow.sol createAndFundEscrow(...)
    setTimeout(() => {
      setFunding(false);
      setStep('completed');
      navigate('/escrow/1');
    }, 2000);
  };

  return (
    <div className="bg-swiss-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-swiss-black hover:text-swiss-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel and Return to Vehicle</span>
          </Link>
        </div>

        {/* Title */}
        <div className="border-b-2 border-swiss-black pb-8 mb-8">
          <SectionLabel number="06" label="SMART CONTRACT ESCROW INITIATION" className="mb-2" />
          <SwissHeading level={1} className="text-4xl sm:text-5xl">
            Initiate <span className="text-swiss-accent">Purchase</span>
          </SwissHeading>
          <p className="mt-3 text-sm text-swiss-black/70 font-medium max-w-2xl">
            Execute a zero-trust vehicle acquisition on Ethereum Sepolia. Your payment is held securely in the VehicleEscrow smart contract until the Regional Transport Authority approves the title transfer.
          </p>
        </div>

        {/* Two-Column Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-7-5 gap-10">
          {/* Left: Purchase & Escrow Stepper */}
          <div className="flex flex-col gap-8">
            {/* Step Explanation Flow Diagram */}
            <div className="border-2 border-swiss-black p-6 bg-swiss-muted">
              <div className="text-xs font-black uppercase tracking-widest text-swiss-black mb-6">
                Guaranteed Escrow Protection Protocol
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border-2 border-swiss-black p-4 bg-swiss-white flex flex-col justify-between">
                  <div className="font-mono text-xs font-black text-swiss-accent mb-2">01 / LOCK</div>
                  <div className="text-xs font-bold uppercase tracking-tight text-swiss-black">
                    Buyer Locks MockINR in Escrow
                  </div>
                  <div className="text-[11px] text-swiss-black/60 mt-2">
                    Seller cannot withdraw funds yet.
                  </div>
                </div>

                <div className="border-2 border-swiss-black p-4 bg-swiss-white flex flex-col justify-between">
                  <div className="font-mono text-xs font-black text-swiss-accent mb-2">02 / SIGN</div>
                  <div className="text-xs font-bold uppercase tracking-tight text-swiss-black">
                    RTO Authority Verifies & Signs
                  </div>
                  <div className="text-[11px] text-swiss-black/60 mt-2">
                    Official title deed transfer on-chain.
                  </div>
                </div>

                <div className="border-2 border-swiss-black p-4 bg-swiss-white flex flex-col justify-between">
                  <div className="font-mono text-xs font-black text-swiss-accent mb-2">03 / RELEASE</div>
                  <div className="text-xs font-bold uppercase tracking-tight text-swiss-black">
                    Title & Funds Release Atomically
                  </div>
                  <div className="text-[11px] text-swiss-black/60 mt-2">
                    NFT transferred to buyer, payment to seller.
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Action Card */}
            <div className="border-4 border-swiss-black p-8 bg-swiss-white">
              <SectionLabel number="02" label="ON-CHAIN TRANSACTION ACTIONS" className="mb-4" />

              {!isConnected ? (
                <div className="p-6 border-2 border-swiss-accent bg-swiss-muted text-center">
                  <AlertTriangle className="w-8 h-8 text-swiss-accent mx-auto mb-3" />
                  <div className="text-sm font-black uppercase tracking-wide text-swiss-black mb-2">
                    Web3 Wallet Required
                  </div>
                  <p className="text-xs text-swiss-black/60 mb-6 max-w-sm mx-auto">
                    Please connect MetaMask on Sepolia Testnet to approve ERC-20 allowances and fund the escrow contract.
                  </p>
                  <SwissButton variant="primary" onClick={connect}>
                    Connect Wallet Now
                  </SwissButton>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Step 1: Token Approval */}
                  <div className={`border-2 border-swiss-black p-6 transition-colors ${
                    step !== 'review' ? 'bg-swiss-muted' : 'bg-swiss-white'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black uppercase tracking-widest text-swiss-accent">
                        Step 1 of 2: ERC-20 Allowance
                      </span>
                      {step !== 'review' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-swiss-black">
                          <Check className="w-4 h-4 text-swiss-accent" /> Approved
                        </span>
                      )}
                    </div>
                    <div className="text-base font-black uppercase tracking-tight text-swiss-black mb-2">
                      Approve MockINR Spending
                    </div>
                    <p className="text-xs text-swiss-black/70 mb-4">
                      Authorize the VehicleEscrow contract (0x20c5...B317) to transfer {weiToINR(vehicle.listingPrice)} from your wallet.
                    </p>

                    <SwissButton
                      variant={step === 'review' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={handleApprove}
                      loading={approving}
                      disabled={step !== 'review'}
                    >
                      {step === 'review' ? 'Approve Token Allowance' : 'Token Approved ✓'}
                    </SwissButton>
                  </div>

                  {/* Step 2: Fund Escrow */}
                  <div className={`border-2 border-swiss-black p-6 transition-colors ${
                    step === 'approved' ? 'bg-swiss-white' : 'bg-swiss-muted'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black uppercase tracking-widest text-swiss-accent">
                        Step 2 of 2: Lock Payment
                      </span>
                    </div>
                    <div className="text-base font-black uppercase tracking-tight text-swiss-black mb-2">
                      Deposit & Create Escrow Contract
                    </div>
                    <p className="text-xs text-swiss-black/70 mb-4">
                      Lock {weiToINR(vehicle.listingPrice)} into the escrow vault. The seller will be notified to request RTO title transfer.
                    </p>

                    <SwissButton
                      variant="accent"
                      size="md"
                      onClick={handleCreateEscrow}
                      loading={funding}
                      disabled={step !== 'approved'}
                    >
                      <Lock className="inline w-4 h-4 mr-2" />
                      Deposit {weiToINR(vehicle.listingPrice)} & Lock Escrow
                    </SwissButton>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary Order Box */}
          <div className="flex flex-col gap-6">
            <div className="border-4 border-swiss-black p-8 bg-swiss-white">
              <SectionLabel number="01" label="PURCHASE SUMMARY" className="mb-4" />

              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Item</div>
                <div className="font-black text-2xl uppercase tracking-tight text-swiss-black mt-1">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </div>
                <div className="font-mono text-xs text-swiss-black/60 mt-1">
                  REG: {vehicle.registrationNo} • ID #{vehicle.vehicleId}
                </div>
              </div>

              <div className="border-t-2 border-b-2 border-swiss-black py-6 my-6">
                <div className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 mb-1">
                  Total Contract Amount
                </div>
                <div className="font-black text-4xl sm:text-5xl font-mono text-swiss-black">
                  {weiToINR(vehicle.listingPrice)}
                </div>
                <div className="text-xs font-mono text-swiss-black/50 mt-1">
                  MockINR (18 Decimals)
                </div>
              </div>

              <div className="divide-y divide-swiss-black/10 font-mono text-xs mb-6">
                <div className="py-2.5 flex justify-between">
                  <span className="text-swiss-black/60">Seller Address:</span>
                  <span className="font-bold text-swiss-black">{shortAddress(vehicle.owner)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-swiss-black/60">Seller Name:</span>
                  <span className="font-bold text-swiss-black font-sans">{vehicle.sellerName}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-swiss-black/60">Location:</span>
                  <span className="font-bold text-swiss-black font-sans">{vehicle.location}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-swiss-black/60">Protocol Fee:</span>
                  <span className="font-bold text-swiss-black">0.00 MockINR (Free for Demo)</span>
                </div>
              </div>

              <div className="p-4 bg-swiss-muted border-2 border-swiss-black">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-swiss-black mb-1">
                  <ShieldCheck className="w-4 h-4 text-swiss-accent" />
                  Cryptographic Guarantee
                </div>
                <p className="text-[11px] text-swiss-black/70 leading-normal">
                  If the RTO authority rejects the transfer or verification fails, funds will be automatically refunded back to your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
