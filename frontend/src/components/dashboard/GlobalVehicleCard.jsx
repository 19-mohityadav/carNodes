import React from 'react';
import { ShieldCheck, ArrowUpRight, Award, FileText, CheckCircle2, AlertTriangle, Eye, Sparkles } from 'lucide-react';

export default function GlobalVehicleCard({
  vehicle,
  onViewVehicle,
  onViewPassport,
  role = 'buyer', // 'buyer' | 'seller' | 'authority'
  onAction,
  className = ''
}) {
  if (!vehicle) return null;

  const priceInr = vehicle.priceInr || `₹${((vehicle.priceUsd || 45000) * 85).toLocaleString('en-IN')}`;
  const priceUsd = vehicle.priceUsd ? `$${vehicle.priceUsd.toLocaleString()}` : '$48,500';

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-teal-600/40 ${className}`}>
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden flex items-center justify-center p-3 border-b border-slate-100">
        <img
          src={vehicle.image || '/cars/audi_r8_camry.png'}
          alt={vehicle.shortName || vehicle.model || 'Vehicle'}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 select-none"
        />

        {/* Blockchain Verified Pill */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-teal-500/30 text-teal-800 text-[11px] font-semibold shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Blockchain Verified</span>
        </div>

        {/* Trust Score Badge */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-mono font-bold shadow-xs">
          <Award className="w-3.5 h-3.5 text-teal-400" />
          <span>{vehicle.trustScore || 94}/100</span>
        </div>

        {/* Vehicle ID Pill */}
        <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold uppercase tracking-wider border border-slate-200">
          {vehicle.id || 'CN-48291'}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Year & Risk Status */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-600">{vehicle.year || '2023'} • {vehicle.mileage || '18,500 mi'}</span>
            <span className="inline-flex items-center space-x-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Low Risk</span>
            </span>
          </div>

          {/* Vehicle Name */}
          <h3 className="text-base font-heading font-bold text-slate-900 leading-snug group-hover:text-teal-900 transition-colors line-clamp-1">
            {vehicle.shortName || vehicle.model || vehicle.name || 'Audi R8 / Camry XSE'}
          </h3>

          {/* Quick Spec Highlights */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-mono">
            {vehicle.engine || '5.2L V10'} • {vehicle.transmission || 'Automatic'} • {vehicle.drivetrain || 'AWD'}
          </p>
        </div>

        {/* Price & Primary Details */}
        <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Verified Price</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-heading font-extrabold text-slate-900">{priceInr}</span>
              <span className="text-xs font-mono text-slate-500 font-medium">({priceUsd})</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Sepolia Oracle</span>
            <span className="text-xs font-mono font-bold text-teal-700">100% On-Chain</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onViewVehicle && onViewVehicle(vehicle)}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <span>View Vehicle</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onViewPassport && onViewPassport(vehicle)}
            className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>View Passport</span>
          </button>
        </div>
      </div>
    </div>
  );
}
