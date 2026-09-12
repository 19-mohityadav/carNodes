import { Link } from 'react-router-dom';
import { VerificationBadge } from './VerificationBadge';
import { RiskScore } from './RiskScore';
import { weiToINR, shortAddress } from '../../utils/format';
import { SwissButton } from '../ui/SwissButton';
import { ArrowLeft, ShieldCheck, FileCheck, ShoppingCart } from 'lucide-react';

export function PassportHeader({ vehicle, showActions = true }) {
  if (!vehicle) return null;

  return (
    <div className="border-b-2 border-swiss-black bg-swiss-white">
      {/* Top utility row */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-swiss-black/15 text-xs font-bold uppercase tracking-widest text-swiss-black/60">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 hover:text-swiss-accent transition-colors duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
        <div className="flex items-center gap-4">
          <span>REG NO: <span className="text-swiss-black font-mono">{vehicle.registrationNo}</span></span>
          <span className="hidden sm:inline">TOKEN ID: <span className="text-swiss-black font-mono">#{vehicle.vehicleId}</span></span>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="px-6 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono text-xs font-bold px-2.5 py-1 bg-swiss-black text-swiss-white uppercase tracking-widest">
                {vehicle.year}
              </span>
              <VerificationBadge verified={vehicle.verified} verifier={vehicle.verifier} />
              <span className="font-mono text-xs px-2.5 py-1 border-2 border-swiss-black uppercase tracking-wider bg-swiss-muted">
                {vehicle.fuelType}
              </span>
              <span className="font-mono text-xs px-2.5 py-1 border-2 border-swiss-black uppercase tracking-wider bg-swiss-muted">
                {vehicle.transmission}
              </span>
            </div>

            <h1 className="font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter leading-none text-swiss-black">
              {vehicle.make} <span className="text-swiss-accent">{vehicle.model}</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-swiss-black/70 max-w-2xl font-normal leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Price & Primary CTA */}
          <div className="flex flex-col items-start lg:items-end gap-4 min-w-[260px] border-t-2 lg:border-t-0 lg:border-l-2 border-swiss-black pt-6 lg:pt-0 lg:pl-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 lg:text-right">
                Listing Price
              </div>
              <div className="font-black text-3xl sm:text-4xl uppercase tracking-tight text-swiss-black lg:text-right font-mono">
                {weiToINR(vehicle.listingPrice)}
              </div>
              <div className="text-xs font-mono text-swiss-black/40 lg:text-right">
                MockINR ERC-20 on Sepolia
              </div>
            </div>

            {showActions && (
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <Link to={`/purchase/${vehicle.id}`} className="flex-1 lg:flex-none">
                  <SwissButton variant="accent" size="md" className="w-full">
                    <ShoppingCart className="inline w-4 h-4 mr-2" />
                    Buy Vehicle
                  </SwissButton>
                </Link>
                <Link to={`/passport/${vehicle.id}`} className="flex-1 lg:flex-none">
                  <SwissButton variant="secondary" size="md" className="w-full">
                    <FileCheck className="inline w-4 h-4 mr-2" />
                    View Passport
                  </SwissButton>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Specs Grid Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 border-2 border-swiss-black mt-8 bg-swiss-muted divide-x-2 divide-y sm:divide-y-0 divide-swiss-black">
          <div className="p-4 bg-swiss-white">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Mileage</div>
            <div className="font-mono text-sm sm:text-base font-bold text-swiss-black mt-1">
              {Number(vehicle.odometer).toLocaleString()} km
            </div>
          </div>
          <div className="p-4 bg-swiss-white">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Exterior Color</div>
            <div className="text-sm sm:text-base font-bold text-swiss-black mt-1 truncate">
              {vehicle.color}
            </div>
          </div>
          <div className="p-4 bg-swiss-white">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Location</div>
            <div className="text-sm sm:text-base font-bold text-swiss-black mt-1 truncate">
              {vehicle.location}
            </div>
          </div>
          <div className="p-4 bg-swiss-white">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Current Owner</div>
            <div className="font-mono text-xs sm:text-sm font-bold text-swiss-black mt-1 truncate">
              {shortAddress(vehicle.owner)}
            </div>
          </div>
          <div className="p-4 bg-swiss-white">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">Seller</div>
            <div className="text-sm sm:text-base font-bold text-swiss-black mt-1 truncate">
              {vehicle.sellerName}
            </div>
          </div>
          <div className="p-4 bg-swiss-white">
            <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50">AI Risk</div>
            <div className="mt-1">
              <RiskScore score={vehicle.riskScore} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
