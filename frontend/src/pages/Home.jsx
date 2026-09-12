import { Hero } from '../components/Hero';
import { ShieldCheck, FileCheck2, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Main Hero Section */}
      <Hero />

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Three Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              HOW CARNODES WORKS
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Combining official inspection verification, document IPFS storage, and smart contract escrow for seamless digital transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-8 space-y-4 relative group hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Vehicle Registration & Audit</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sellers submit vehicle details and RC documents. Authorized inspectors verify physical condition and official database records.
              </p>
              <div className="pt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <FileCheck2 className="w-4 h-4" />
                Verified Status Issued
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-8 space-y-4 relative group hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Digital Passport Minting</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                An ERC-721 Digital Vehicle Passport NFT is minted containing cryptographic VIN hashes, ownership history, and document CIDs.
              </p>
              <div className="pt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <Cpu className="w-4 h-4" />
                Immutable Blockchain Record
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-8 space-y-4 relative group hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Escrow & Ownership Transfer</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Buyers deposit funds into the smart contract escrow. Once approved, vehicle ownership and funds release atomically.
              </p>
              <div className="pt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Atomic Settlement Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Protocol Section */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-100/80 px-3 py-1 rounded-full border border-indigo-200">
                About CarNodes Protocol
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                ELIMINATING CAR FRAUD WITH DIGITAL VERIFICATION
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Traditional vehicle resale is plagued by tampered odometers, hidden accident histories, and fraudulent title claims. CarNodes bridges real-world vehicle databases with public smart contracts.
              </p>
              <div className="pt-2">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 text-base group"
                >
                  Browse Verified Vehicle Marketplace
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
              <h4 className="font-extrabold text-slate-900 text-lg uppercase tracking-wider border-b border-slate-100 pb-3">
                Protocol Architecture
              </h4>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">PostgreSQL Core Database</strong>
                    Pessimistic locking and transactional ownership transfer tables.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-600 mt-2 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">Ethereum Solidity Contracts</strong>
                    `VehiclePassport`, `VehicleRegistry`, and `VehicleEscrow` smart contracts.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">Decentralized Storage (IPFS)</strong>
                    Cryptographic document metadata anchoring for registration cards & inspection reports.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
