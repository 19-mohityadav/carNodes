import React from 'react';
import { ShieldCheck, CheckCircle, ArrowRight, FileText, Award, ChevronRight } from 'lucide-react';
import CarouselOrbit from './CarouselOrbit';

export default function HeroShowroom({
  vehicles,
  activeIndex,
  onSelectVehicle,
  onOpenMarketplace,
  onOpenVerifyModal,
}) {
  const activeCar = vehicles[activeIndex] || vehicles[0];

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] bg-[#FDFBF7] overflow-hidden pt-6 pb-16 border-b border-zinc-200"
    >
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <h1
          className="text-[13vw] font-extrabold uppercase tracking-tighter text-[#111111]/[0.032] leading-none whitespace-nowrap transition-all duration-700 ease-out font-heading"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {activeCar.watermark || 'SUPER SPORT'}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SIDE-BY-SIDE HERO LAYOUT: LEFT = MAIN TEXT, RIGHT = CIRCULAR MOTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[78vh]">

          {/* LEFT COLUMN (6 cols): Main Text, Headline & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            

            {/* Main Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-[#111111] leading-[1.06] font-heading"
            >
              Buy a Vehicle.{' '}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B2521] via-[#6E6259] to-[#FF3B30]">
                Not the Risk Behind It.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6E6259] max-w-xl leading-relaxed">
              A trusted vehicle marketplace where every vehicle is verified, its history is transparent, and ownership is digitally secured as a Real-World Asset (RWA).
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenMarketplace}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2B2521] hover:bg-[#FF3B30] text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Explore Verified Vehicles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-wider font-semibold text-[#6E6259] pt-2">
              <span className="flex items-center space-x-1.5"><span className="text-[#FF3B30]">●</span> Authority-Verified</span>
              <span className="flex items-center space-x-1.5"><span className="text-[#B36B39]">●</span> Digital Vehicle Passport</span>
              <span className="flex items-center space-x-1.5"><span className="text-emerald-600">●</span> Blockchain-Backed</span>
            </div>


          </div>

          {/* RIGHT COLUMN (6 cols): 3D Circular Motion Orbit Carousel */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center">
              <CarouselOrbit
                onSelectVehicle={onSelectVehicle}
                activeIndex={activeIndex}
              />


            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

