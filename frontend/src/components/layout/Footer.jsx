import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESSES, ETHERSCAN_BASE } from '../../contracts/addresses';
import { shortAddress } from '../../utils/format';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Marketplace',   to: '/marketplace' },
    { label: 'AI Analysis',   to: '/ai-analysis' },
    { label: 'TX History',    to: '/tx-history' },
    { label: 'Authority',     to: '/authority' },
  ],
  Contracts: Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => ({
    label: name,
    href: `${ETHERSCAN_BASE}/address/${addr}`,
    addr,
  })),
};

export function Footer() {
  return (
    <footer className="border-t-2 border-swiss-black bg-swiss-black text-swiss-white mt-auto">
      {/* Main Footer Grid */}
      <div className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-0 divide-x-0 md:divide-x-2 md:divide-swiss-white/10">
        {/* Brand */}
        <div className="md:pr-12 pb-12 md:pb-0">
          <div className="font-black text-2xl uppercase tracking-tighter mb-4">
            CAR<span className="text-swiss-accent">NODES</span>
          </div>
          <p className="text-swiss-white/60 text-sm leading-relaxed font-medium">
            Authority-verified vehicle RWAs. Digital passports. Blockchain-backed ownership.
            Escrow-protected transactions.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-swiss-white/40">
            <span className="w-2 h-2 bg-swiss-accent" />
            Sepolia Testnet
          </div>
        </div>

        {/* Platform Links */}
        <div className="md:px-12 pb-12 md:pb-0">
          <h3 className="text-xs font-bold uppercase tracking-widest text-swiss-white/40 mb-6">
            Platform
          </h3>
          <ul className="space-y-3">
            {FOOTER_LINKS.Platform.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm font-medium text-swiss-white hover:text-swiss-accent transition-colors duration-150"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contracts */}
        <div className="md:px-12 pb-12 md:pb-0 col-span-1 md:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-swiss-white/40 mb-6">
            Deployed Contracts — Sepolia
          </h3>
          <ul className="space-y-4">
            {FOOTER_LINKS.Contracts.map(({ label, href, addr }) => (
              <li key={label}>
                <div className="text-xs font-bold uppercase tracking-widest text-swiss-white/40 mb-1">
                  {label}
                </div>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-swiss-white hover:text-swiss-accent transition-colors duration-150 flex items-center gap-2"
                >
                  {addr}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-swiss-white/10 max-w-screen-xl mx-auto px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-xs text-swiss-white/40 font-medium uppercase tracking-widest">
          © 2026 carNodes — Hackathon Demo. Not financial or legal advice.
        </p>
        <p className="text-xs text-swiss-white/40 font-medium">
          MockINR is a test token. No real funds are used.
        </p>
      </div>
    </footer>
  );
}
