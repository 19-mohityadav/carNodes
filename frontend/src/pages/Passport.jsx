import { useParams, Link } from 'react-router-dom';
import { getVehicleById } from '../mock/vehicles';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { SwissButton } from '../components/ui/SwissButton';
import { VerificationBadge } from '../components/vehicle/VerificationBadge';
import { RiskScore } from '../components/vehicle/RiskScore';
import { shortAddress, formatDate, etherscanTx, etherscanAddr } from '../utils/format';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import { ArrowLeft, Printer, ExternalLink, ShieldCheck, QrCode } from 'lucide-react';

export default function Passport() {
  const { id } = useParams();

  // TODO: Replace with GET /api/vehicles/:id or on-chain VehiclePassport.sol call
  const vehicle = getVehicleById(id);

  if (!vehicle) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-24 text-center">
        <SectionLabel number="404" label="DOCUMENT NOT FOUND" className="justify-center mb-4" />
        <SwissHeading level={1} className="text-4xl mb-6">Passport Certificate Missing</SwissHeading>
        <Link to="/marketplace">
          <SwissButton variant="primary">Back to Marketplace</SwissButton>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-swiss-muted min-h-screen py-12 px-4 sm:px-6 print:p-0 print:bg-white">
      {/* Top Bar for Screen (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          to={`/vehicle/${vehicle.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-swiss-black hover:text-swiss-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vehicle Details</span>
        </Link>
        <div className="flex gap-3">
          <SwissButton variant="secondary" size="sm" onClick={handlePrint}>
            <Printer className="inline w-3.5 h-3.5 mr-2" />
            Print Certificate
          </SwissButton>
        </div>
      </div>

      {/* Official Certificate Container (Architectural Document Layout) */}
      <div className="max-w-4xl mx-auto bg-swiss-white border-4 border-swiss-black p-8 sm:p-14 relative shadow-2xl print:shadow-none print:border-4 print:border-black">
        {/* Certificate Header Banner */}
        <div className="border-b-4 border-swiss-black pb-8 mb-8 text-center relative">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-swiss-black/60 mb-2">
            DECENTRALIZED VEHICLE REGISTRY PROTOCOL • ETHEREUM SEPOLIA
          </div>
          <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter text-swiss-black">
            OFFICIAL VEHICULAR PASSPORT
          </h1>
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-swiss-accent mt-2">
            CERTIFICATE OF IMMUTABLE TITLE & PROVENANCE • NFT TOKEN #{vehicle.vehicleId}
          </div>

          <div className="absolute top-0 right-0 hidden sm:flex flex-col items-center border-2 border-swiss-black p-2 bg-swiss-white">
            <QrCode className="w-12 h-12 text-swiss-black" />
            <span className="text-[8px] font-mono font-bold mt-1">VERIFY ID #{vehicle.vehicleId}</span>
          </div>
        </div>

        {/* Status and Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-2 border-swiss-black pb-8 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 mb-1">
              Registered Vehicle
            </div>
            <div className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-swiss-black">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </div>
            <div className="font-mono text-sm font-bold text-swiss-black mt-1">
              REGISTRATION NO: <span className="bg-swiss-black text-swiss-white px-2 py-0.5">{vehicle.registrationNo}</span>
            </div>
          </div>
          <div>
            <VerificationBadge verified={vehicle.verified} verifier={vehicle.verifier} />
          </div>
        </div>

        {/* 4-Quadrant Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-swiss-black mb-8 divide-y-2 md:divide-y-0 md:divide-x-2 divide-swiss-black">
          {/* Section 1: Mechanical Identifiers */}
          <div className="p-6">
            <div className="text-xs font-black uppercase tracking-widest text-swiss-accent mb-4">
              01. Mechanical Identifiers
            </div>
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div>
                <span className="text-swiss-black/50 uppercase block text-[10px]">VIN (Chassis Number)</span>
                <span className="font-bold text-swiss-black break-all">{vehicle.vin}</span>
              </div>
              <div>
                <span className="text-swiss-black/50 uppercase block text-[10px]">VIN Cryptographic Hash</span>
                <span className="text-swiss-black/70 break-all">{vehicle.vinHash}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <span className="text-swiss-black/50 uppercase block text-[10px]">Fuel Type</span>
                  <span className="font-sans font-bold uppercase text-swiss-black">{vehicle.fuelType}</span>
                </div>
                <div>
                  <span className="text-swiss-black/50 uppercase block text-[10px]">Transmission</span>
                  <span className="font-sans font-bold uppercase text-swiss-black">{vehicle.transmission}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-swiss-black/50 uppercase block text-[10px]">Odometer Reading</span>
                  <span className="font-sans font-bold text-swiss-black">{Number(vehicle.odometer).toLocaleString()} KM</span>
                </div>
                <div>
                  <span className="text-swiss-black/50 uppercase block text-[10px]">Color</span>
                  <span className="font-sans font-bold text-swiss-black">{vehicle.color}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: On-Chain Ownership */}
          <div className="p-6">
            <div className="text-xs font-black uppercase tracking-widest text-swiss-accent mb-4">
              02. Cryptographic Ownership
            </div>
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div>
                <span className="text-swiss-black/50 uppercase block text-[10px]">Current Title Holder (Ethereum Address)</span>
                <span className="font-bold text-swiss-black break-all">{vehicle.owner}</span>
              </div>
              <div>
                <span className="text-swiss-black/50 uppercase block text-[10px]">Certifying Authority</span>
                <span className="text-swiss-black/80 break-all">{vehicle.verifier || 'Pending Authority Signature'}</span>
              </div>
              <div>
                <span className="text-swiss-black/50 uppercase block text-[10px]">Initial Registration Date</span>
                <span className="font-sans font-bold text-swiss-black">{formatDate(vehicle.createdAt)}</span>
              </div>
              <div>
                <span className="text-swiss-black/50 uppercase block text-[10px]">IPFS Metadata Manifest</span>
                <a
                  href={`https://ipfs.io/ipfs/${vehicle.metadataCID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-swiss-accent hover:underline break-all"
                >
                  ipfs://{vehicle.metadataCID}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership Provenance Summary */}
        <div className="border-2 border-swiss-black p-6 mb-8 bg-swiss-white">
          <div className="text-xs font-black uppercase tracking-widest text-swiss-black mb-4">
            03. Verified Provenance History ({vehicle.ownershipHistory.length} Events)
          </div>
          <div className="divide-y divide-swiss-black/15 font-mono text-xs">
            {vehicle.ownershipHistory.map((item, idx) => (
              <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="font-sans font-bold text-swiss-black uppercase mr-3">{item.event}</span>
                  <span className="text-swiss-black/50">To: {shortAddress(item.to)}</span>
                </div>
                <div className="text-swiss-black/40 text-[11px]">
                  {formatDate(item.timestamp)} • TX: {item.txHash}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Contract Blockchain Anchor Footer */}
        <div className="border-t-4 border-swiss-black pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div>
            <div className="text-[10px] uppercase font-bold text-swiss-black/50">Smart Contract Anchor</div>
            <div className="text-swiss-black font-bold">VehiclePassport.sol ({shortAddress(CONTRACT_ADDRESSES.VehiclePassport)})</div>
            <div className="text-swiss-black/40 text-[10px] mt-0.5">Network: Sepolia Testnet (Chain ID 11155111)</div>
          </div>

          <a
            href={etherscanTx(vehicle.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-swiss-black bg-swiss-black text-swiss-white hover:bg-swiss-accent hover:border-swiss-accent transition-colors font-sans text-xs font-bold uppercase tracking-wider"
          >
            <span>Verify on Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
