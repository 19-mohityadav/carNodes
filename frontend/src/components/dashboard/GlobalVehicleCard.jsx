import React from 'react';
import { ShieldCheck, Award, FileText, ChevronRight, Eye } from 'lucide-react';

export default function GlobalVehicleCard({ vehicle, onSelect, onOpenPassport, role = 'buyer' }) {
  const isLowRisk = vehicle.trustScore >= 90;

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200 hover:border-[#0D9488]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Vehicle Image Container */}
      <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.model}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 text-[10px] font-mono font-bold text-emerald-800 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Blockchain Verified</span>
          </span>

          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#111111]/85 backdrop-blur-md text-[10px] font-mono font-bold text-white shadow-xs">
            <span>{vehicle.id}</span>
          </span>
        </div>

        {/* Bottom Trust & Risk Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-1.5 bg-emerald-500/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold shadow-xs">
            <Award className="w-3 h-3" />
            <span>Score {vehicle.trustScore}/100</span>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur-md uppercase ${
            isLowRisk
              ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300'
              : 'bg-amber-100/90 text-amber-900 border border-amber-300'
          }`}>
            {isLowRisk ? 'Low Risk' : 'Medium Risk'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-[#6E6259] mb-1">
            <span>Year {vehicle.year || '2023'}</span>
            <span>{vehicle.mileage}</span>
          </div>

          <h3 className="text-base font-heading font-extrabold text-[#111111] line-clamp-1 group-hover:text-[#0D9488] transition-colors">
            {vehicle.model}
          </h3>

          <p className="text-xs font-mono text-[#6E6259] mt-1 truncate">
            VIN: {vehicle.vin}
          </p>
        </div>

        {/* Specs Pill List */}
        <div className="grid grid-cols-2 gap-1.5 py-2 border-y border-zinc-100 text-[11px] font-mono text-zinc-600">
          <div className="truncate">
            <span className="text-zinc-400">Power: </span>
            <span className="font-semibold text-zinc-800">{vehicle.horsepower || '450 HP'}</span>
          </div>
          <div className="truncate text-right">
            <span className="text-zinc-400">Node: </span>
            <span className="font-semibold text-[#0D9488] truncate">{vehicle.verifications?.authorityNode?.split(' ')[0] || 'RTO #409'}</span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-1 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#6E6259] block font-semibold">Verified Price</span>
            <span className="text-lg font-heading font-extrabold text-[#111111]">
              ${vehicle.priceUsd?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {onOpenPassport && (
              <button
                onClick={() => onOpenPassport(vehicle)}
                title="View Digital Vehicle Passport"
                className="p-2 rounded-xl bg-zinc-100 hover:bg-[#0D9488]/10 text-zinc-700 hover:text-[#0D9488] transition-colors border border-zinc-200 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Passport</span>
              </button>
            )}

            {onSelect && (
              <button
                onClick={() => onSelect(vehicle)}
                className="px-3.5 py-2 rounded-xl bg-[#2B2521] hover:bg-[#0D9488] text-white text-xs font-bold transition-colors shadow-xs flex items-center space-x-1 cursor-pointer"
              >
                <span>{role === 'authority' ? 'Review' : role === 'seller' ? 'Manage' : 'View'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
