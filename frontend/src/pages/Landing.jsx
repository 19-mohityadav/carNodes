import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Cpu, Lock, BarChart3, Zap } from 'lucide-react';
import { SwissButton } from '../components/ui/SwissButton';
import { SectionLabel } from '../components/ui/SectionLabel';
import { useWallet } from '../context/WalletContext';

const FEATURES = [
  {
    num: '01',
    icon: Shield,
    title: 'Authority Verified',
    desc: 'Every vehicle must pass RTO-authority verification before listing. No unverified vehicles enter the marketplace.',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'Digital Passport',
    desc: 'Each vehicle gets an on-chain RWA passport — immutable, transparent, tamper-resistant. VIN hash, ownership, and evidence anchored forever.',
  },
  {
    num: '03',
    icon: Lock,
    title: 'Escrow Settlement',
    desc: 'Funds lock in smart contract escrow. Released only after seller confirms transfer and authority approves. No middlemen.',
  },
  {
    num: '04',
    icon: BarChart3,
    title: 'AI Risk Analysis',
    desc: 'Document inconsistency detection, risk scoring, price recommendations, and buyer Q&A powered by intelligent agents.',
  },
  {
    num: '05',
    icon: Zap,
    title: 'IPFS Evidence',
    desc: 'Inspection reports, RC scans, and insurance documents stored on IPFS. Hashes anchored on-chain. Content verifiable, private off-chain.',
  },
];

const STATS = [
  { label: 'Vehicles Verified', value: '3' },
  { label: 'Transactions', value: '12' },
  { label: 'Network', value: 'Sepolia' },
  { label: 'Contracts Deployed', value: '4' },
];

export default function Landing() {
  const { isConnected, connect, connecting } = useWallet();

  return (
    <div className="flex flex-col">

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="border-b-2 border-swiss-black">
        <div className="max-w-screen-xl mx-auto">
          {/* Top hero row */}
          <div className="grid grid-cols-1 lg:grid-cols-8-4 border-b-2 border-swiss-black">
            {/* Left: headline */}
            <div className="border-r-0 lg:border-r-2 border-swiss-black p-8 md:p-16 lg:p-24 flex flex-col justify-end min-h-[60vh] swiss-grid-pattern">
              <div className="mb-8">
                <SectionLabel number="00" label="Trusted Vehicle Commerce" />
              </div>
              <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black uppercase leading-none tracking-tightest text-swiss-black">
                CAR
                <br />
                <span className="text-swiss-accent">NODES</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl font-medium text-swiss-black/70 max-w-xl leading-relaxed">
                Authority-verified vehicle RWAs. Blockchain-backed ownership history.
                AI risk analysis. Escrow-protected transactions.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {isConnected ? (
                  <Link to="/marketplace">
                    <SwissButton size="lg">
                      Browse Marketplace
                      <ArrowRight className="inline w-5 h-5 ml-2" />
                    </SwissButton>
                  </Link>
                ) : (
                  <SwissButton size="lg" onClick={connect} loading={connecting}>
                    Connect Wallet to Start
                    <ArrowRight className="inline w-5 h-5 ml-2" />
                  </SwissButton>
                )}
                <Link to="/vehicle/1">
                  <SwissButton variant="secondary" size="lg">
                    View Demo Passport
                  </SwissButton>
                </Link>
              </div>
            </div>

            {/* Right: Bauhaus geometric composition */}
            <div className="bg-swiss-black relative overflow-hidden min-h-64 lg:min-h-auto">
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 swiss-grid-pattern opacity-10" />
              {/* Geometric composition */}
              <div className="absolute inset-0 flex items-center justify-center p-12">
                {/* Large circle */}
                <div className="absolute w-64 h-64 border-2 border-swiss-white/20 rounded-none" style={{borderRadius:0}} />
                <div className="absolute w-48 h-48 border-2 border-swiss-white/10" />
                {/* Swiss Red accent square */}
                <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-swiss-accent" />
                {/* Horizontal line */}
                <div className="absolute left-0 right-0 h-0.5 bg-swiss-white/20 top-1/2" />
                {/* Vertical line */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-swiss-white/20 left-1/2" />
                {/* Center text */}
                <div className="relative z-10 text-center">
                  <div className="text-swiss-white/20 text-xs font-bold uppercase tracking-widest mb-2">On-Chain</div>
                  <div className="text-swiss-white font-black text-3xl uppercase tracking-tight leading-tight">
                    RWA<br/>PASSPORT
                  </div>
                </div>
                {/* Small dot matrix overlay */}
                <div className="absolute inset-0 swiss-dots opacity-30" />
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-swiss-black border-b-2 border-swiss-black">
            {STATS.map(({ label, value }) => (
              <div key={label} className="p-8 flex flex-col gap-2 hover:bg-swiss-muted transition-colors duration-150">
                <div className="text-3xl md:text-4xl font-black tracking-tighter text-swiss-black">
                  {value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-swiss-black/50">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────── */}
      <section className="border-b-2 border-swiss-black">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-5-7 border-b-0">
          {/* Left sticky label */}
          <div className="border-r-0 lg:border-r-2 border-swiss-black p-8 lg:p-16 bg-swiss-muted swiss-dots flex flex-col justify-start sticky top-16 h-fit">
            <SectionLabel number="01" label="Method" className="mb-8" />
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-none tracking-tighter text-swiss-black">
              HOW<br />CARNODES<br />WORKS
            </h2>
            <p className="mt-6 text-sm font-medium text-swiss-black/60 leading-relaxed">
              A four-step process from vehicle registration to secure ownership transfer.
              Every step is verifiable on-chain.
            </p>
          </div>

          {/* Right: steps */}
          <div className="divide-y-2 divide-swiss-black">
            {[
              { n: '01', title: 'Register Vehicle', body: 'Seller submits vehicle details and documents. Backend validates. IPFS stores documents. Hash anchored on Sepolia via VehiclePassport contract.' },
              { n: '02', title: 'Authority Verification', body: 'Authorized RTO-authority verifier reviews the vehicle on-chain. Approves or rejects. Verification event emitted permanently on-chain.' },
              { n: '03', title: 'Marketplace Listing', body: 'Verified vehicles appear in the marketplace. Buyers inspect the full digital passport — ownership history, evidence, risk score, and all on-chain proofs.' },
              { n: '04', title: 'Escrow Purchase & Transfer', body: 'Buyer deposits MockINR into escrow. Seller confirms. Authority approves transfer. Escrow releases funds. Ownership changes on-chain. All verifiable on Etherscan.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="p-8 lg:p-12 flex gap-8 items-start hover:bg-swiss-muted/50 transition-colors duration-150 group">
                <div className="text-5xl font-black text-swiss-accent/20 leading-none flex-shrink-0 group-hover:text-swiss-accent/40 transition-colors duration-200">
                  {n}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3">{title}</h3>
                  <p className="text-sm font-medium text-swiss-black/60 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────── */}
      <section className="border-b-2 border-swiss-black bg-swiss-muted swiss-diagonal">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-12 border-b-2 border-swiss-black pb-8">
            <div>
              <SectionLabel number="02" label="System" className="mb-4" />
              <h2 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter">
                CORE<br />CAPABILITIES
              </h2>
            </div>
            <Link to="/marketplace">
              <SwissButton variant="secondary">
                Enter Marketplace
                <ArrowRight className="inline w-4 h-4 ml-2" />
              </SwissButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l-2 border-t-2 border-swiss-black">
            {FEATURES.map(({ num, icon: Icon, title, desc }) => (
              <div
                key={num}
                className="border-r-2 border-b-2 border-swiss-black p-8 bg-swiss-white hover:bg-swiss-black hover:text-swiss-white transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 border-2 border-swiss-black group-hover:border-swiss-white/30 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-black text-swiss-black/10 group-hover:text-swiss-white/10">{num}</span>
                </div>
                <h3 className="text-base font-black uppercase tracking-tight mb-3">{title}</h3>
                <p className="text-sm text-swiss-black/60 group-hover:text-swiss-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}

            {/* CTA card */}
            <div className="border-r-2 border-b-2 border-swiss-black p-8 bg-swiss-accent text-swiss-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-4 text-swiss-white/60">Ready to start?</div>
                <p className="text-2xl font-black uppercase leading-tight tracking-tighter">
                  CONNECT WALLET & EXPLORE
                </p>
              </div>
              <div className="mt-8">
                {isConnected ? (
                  <Link to="/marketplace">
                    <button className="w-full bg-swiss-white text-swiss-accent font-bold uppercase tracking-widest text-sm px-6 py-3 border-2 border-swiss-white hover:bg-swiss-black hover:text-swiss-white hover:border-swiss-black transition-all duration-150">
                      Go to Marketplace <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={connect}
                    className="w-full bg-swiss-white text-swiss-accent font-bold uppercase tracking-widest text-sm px-6 py-3 border-2 border-swiss-white hover:bg-swiss-black hover:text-swiss-white hover:border-swiss-black transition-all duration-150"
                  >
                    Connect Wallet <ArrowRight className="inline w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEMO SCRIPT ───────────────────────────────────── */}
      <section className="border-b-2 border-swiss-black">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-4-8">
          <div className="border-r-0 lg:border-r-2 border-swiss-black p-8 lg:p-16 bg-swiss-black text-swiss-white swiss-noise">
            <SectionLabel number="03" label="Demo" className="mb-8 text-swiss-white/40" />
            <h2 className="text-4xl font-black uppercase leading-none tracking-tighter text-swiss-white">
              JUDGE<br />DEMO<br />SCRIPT
            </h2>
            <p className="mt-6 text-sm text-swiss-white/60 leading-relaxed">
              Follow this 10-step script to see the full carNodes flow. Every
              transaction is live on Sepolia and verifiable on Etherscan.
            </p>
          </div>
          <div className="divide-y-2 divide-swiss-black">
            {[
              'Connect MetaMask wallet to Sepolia testnet.',
              'Browse the marketplace — see verified vehicles with RWA badges.',
              'Open a vehicle — view full digital passport.',
              'Inspect on-chain verification evidence and IPFS document links.',
              'Check the immutable ownership history and blockchain TX.',
              'Buyer starts a purchase — funds enter escrow smart contract.',
              'Watch MockINR lock in VehicleEscrow contract.',
              'Authority approves ownership transfer on-chain.',
              'Vehicle passport ownership changes immediately.',
              'Open Sepolia Etherscan and verify every transaction hash.',
            ].map((step, i) => (
              <div key={i} className="px-8 py-6 flex gap-6 items-center hover:bg-swiss-muted transition-colors duration-150">
                <span className="text-swiss-accent font-black text-lg flex-shrink-0 w-8">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <span className="text-sm font-medium text-swiss-black">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
