import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Gauge } from 'lucide-react';
import { SwissBadge } from '../ui/SwissBadge';
import { weiToINR } from '../../utils/format';
import { RiskScore } from './RiskScore';

export function VehicleCard({ vehicle, listingId }) {
  const href = listingId
    ? `/vehicle/${vehicle.vehicleId}`
    : `/vehicle/${vehicle.vehicleId}`;

  return (
    <Link to={href} className="block group">
      <article className="border-2 border-swiss-black bg-swiss-white hover:bg-swiss-black hover:text-swiss-white transition-all duration-200 h-full flex flex-col">
        {/* Header band */}
        <div className="border-b-2 border-swiss-black group-hover:border-swiss-white/30 p-6 flex items-start justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 group-hover:text-swiss-white/50 mb-1">
              {vehicle.make}
            </div>
            <h3 className="text-lg font-black uppercase leading-tight tracking-tight">
              {vehicle.model}
            </h3>
            <div className="text-sm font-medium mt-0.5 text-swiss-black/70 group-hover:text-swiss-white/70">
              {vehicle.year} · {vehicle.color}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <SwissBadge type={vehicle.verified ? 'verified' : 'pending'} />
            <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>

        {/* Stats row */}
        <div className="border-b-2 border-swiss-black group-hover:border-swiss-white/30 grid grid-cols-3 divide-x-2 divide-swiss-black group-hover:divide-swiss-white/30">
          <div className="p-4 flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-swiss-black/40 group-hover:text-swiss-white/40">Fuel</span>
            <span className="text-sm font-bold uppercase">{vehicle.fuelType}</span>
          </div>
          <div className="p-4 flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-swiss-black/40 group-hover:text-swiss-white/40">Trans.</span>
            <span className="text-sm font-bold uppercase">{vehicle.transmission.slice(0, 6)}</span>
          </div>
          <div className="p-4 flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-swiss-black/40 group-hover:text-swiss-white/40">ODO (km)</span>
            <span className="text-sm font-bold">{vehicle.odometer.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Risk Score */}
        <div className="border-b-2 border-swiss-black group-hover:border-swiss-white/30 px-6 py-3">
          <RiskScore score={vehicle.riskScore} compact />
        </div>

        {/* Footer: price + location */}
        <div className="p-6 mt-auto flex items-end justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-swiss-black/40 group-hover:text-swiss-white/40 mb-1">
              Asking Price
            </div>
            <div className="text-2xl font-black tracking-tight">
              {weiToINR(vehicle.listingPrice)}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-swiss-black/50 group-hover:text-swiss-white/50">
            <MapPin className="w-3 h-3" />
            {vehicle.location?.split(',')[0]}
          </div>
        </div>
      </article>
    </Link>
  );
}
