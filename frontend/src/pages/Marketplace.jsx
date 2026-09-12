import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { SwissInput } from '../components/ui/SwissInput';
import { MOCK_VEHICLES } from '../mock/vehicles';

// TODO: Replace MOCK_VEHICLES with: const res = await fetch('/api/listings'); const { listings } = await res.json();

const FUEL_TYPES  = ['All', 'Petrol', 'Diesel', 'Electric', 'CNG'];
const TRANS_TYPES = ['All', 'Manual', 'Automatic'];

export default function Marketplace() {
  const [query, setQuery]   = useState('');
  const [fuel, setFuel]     = useState('All');
  const [trans, setTrans]   = useState('All');
  const [verified, setVerified] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_VEHICLES.filter(v => {
      if (verified && !v.verified) return false;
      if (fuel !== 'All' && v.fuelType !== fuel) return false;
      if (trans !== 'All' && v.transmission !== trans) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.registrationNo.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, fuel, trans, verified]);

  function clearFilters() {
    setQuery('');
    setFuel('All');
    setTrans('All');
    setVerified(false);
  }

  const hasActiveFilters = query || fuel !== 'All' || trans !== 'All' || verified;

  return (
    <div className="flex flex-col">
      {/* Page header */}
      <div className="border-b-2 border-swiss-black">
        <div className="max-w-screen-xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <SectionLabel number="02" label="Listings" className="mb-4" />
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter">
              VEHICLE<br />MARKETPLACE
            </h1>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black tracking-tight">{filtered.length}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-swiss-black/50">
              {filtered.length === 1 ? 'Vehicle' : 'Vehicles'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5-7 border-b-2 border-swiss-black">

          {/* ─ Sidebar Filter ─────────────────────────────── */}
          <aside className="border-r-0 lg:border-r-2 border-swiss-black lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
            <div className="p-6 border-b-2 border-swiss-black bg-swiss-muted swiss-dots">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <Filter className="w-3.5 h-3.5" />
                  Filters
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-swiss-accent hover:text-swiss-black transition-colors duration-150"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
              <SwissInput
                id="search"
                placeholder="Make, model, reg. no..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            {/* Verified only toggle */}
            <div className="p-6 border-b-2 border-swiss-black">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold uppercase tracking-widest">Verified Only</span>
                <button
                  role="switch"
                  aria-checked={verified}
                  onClick={() => setVerified(v => !v)}
                  className={`w-12 h-6 border-2 border-swiss-black relative transition-colors duration-150 ${verified ? 'bg-swiss-black' : 'bg-swiss-white'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 transition-all duration-150 ${verified ? 'left-6 bg-swiss-white' : 'left-0.5 bg-swiss-black'}`} />
                </button>
              </label>
            </div>

            {/* Fuel type */}
            <div className="p-6 border-b-2 border-swiss-black">
              <div className="label-swiss mb-3">Fuel Type</div>
              <div className="flex flex-col gap-2">
                {FUEL_TYPES.map(f => (
                  <button
                    key={f}
                    onClick={() => setFuel(f)}
                    className={`text-left text-sm font-bold uppercase tracking-widest px-3 py-2 border-2 transition-all duration-150 ${
                      fuel === f
                        ? 'bg-swiss-black text-swiss-white border-swiss-black'
                        : 'bg-swiss-white text-swiss-black border-swiss-black hover:bg-swiss-muted'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="p-6">
              <div className="label-swiss mb-3">Transmission</div>
              <div className="flex flex-col gap-2">
                {TRANS_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTrans(t)}
                    className={`text-left text-sm font-bold uppercase tracking-widest px-3 py-2 border-2 transition-all duration-150 ${
                      trans === t
                        ? 'bg-swiss-black text-swiss-white border-swiss-black'
                        : 'bg-swiss-white text-swiss-black border-swiss-black hover:bg-swiss-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ─ Vehicle Grid ──────────────────────────────── */}
          <main className="p-6">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="text-6xl font-black text-swiss-black/10 uppercase">NONE</div>
                <p className="text-sm font-bold uppercase tracking-widest text-swiss-black/40">
                  No vehicles match your filters
                </p>
                <button onClick={clearFilters} className="btn-swiss-secondary mt-2">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 border-l-2 border-t-2 border-swiss-black">
                {filtered.map(v => (
                  <div key={v.id} className="border-r-2 border-b-2 border-swiss-black">
                    <VehicleCard vehicle={v} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
