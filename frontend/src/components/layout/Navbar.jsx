import { Link, NavLink } from 'react-router-dom';
import { Wallet, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useRole } from '../../context/RoleContext';
import { shortAddress } from '../../utils/format';
import { SwissButton } from '../ui/SwissButton';
import { NetworkBadge } from '../wallet/NetworkBadge';

const NAV_LINKS = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/ai-analysis', label: 'AI Analysis' },
  { to: '/tx-history', label: 'Transactions' },
];

const AUTH_NAV_LINKS = [
  { to: '/authority', label: 'Authority' },
];

export function Navbar() {
  const { account, isConnected, connect, disconnect, connecting } = useWallet();
  const { isAuthority } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allLinks = isAuthority ? [...NAV_LINKS, ...AUTH_NAV_LINKS] : NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 bg-swiss-white border-b-2 border-swiss-black">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-black text-xl uppercase tracking-tighter text-swiss-black hover:text-swiss-accent transition-colors duration-150"
        >
          CAR<span className="text-swiss-accent">NODES</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {allLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link text-sm font-bold uppercase tracking-widest ${isActive ? 'text-swiss-accent' : 'text-swiss-black'}`
              }
            >
              <span>{label}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {isConnected && <NetworkBadge />}
          {isConnected ? (
            <div className="flex items-center gap-3">
              <Link
                to="/marketplace"
                className="flex items-center gap-2 px-4 py-2 border-2 border-swiss-black bg-swiss-muted font-mono text-xs font-bold hover:bg-swiss-black hover:text-swiss-white transition-all duration-150"
              >
                <Wallet className="w-3.5 h-3.5" />
                {shortAddress(account)}
              </Link>
              <button
                onClick={disconnect}
                className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 hover:text-swiss-accent transition-colors duration-150"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <SwissButton
              onClick={connect}
              loading={connecting}
              size="sm"
              variant="primary"
            >
              <Wallet className="inline w-3.5 h-3.5 mr-2" />
              Connect Wallet
            </SwissButton>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 border-2 border-swiss-black hover:bg-swiss-black hover:text-swiss-white transition-all duration-150"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-swiss-black bg-swiss-white">
          <nav className="flex flex-col divide-y-2 divide-swiss-black/10">
            {allLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-6 py-4 text-sm font-bold uppercase tracking-widest ${isActive ? 'text-swiss-accent' : 'text-swiss-black'} hover:bg-swiss-muted`
                }
              >
                {label}
                <ChevronRight className="w-4 h-4" />
              </NavLink>
            ))}
          </nav>
          <div className="px-6 py-4 border-t-2 border-swiss-black">
            {isConnected ? (
              <div className="flex flex-col gap-3">
                <NetworkBadge />
                <div className="font-mono text-xs font-bold text-swiss-black/60">{account}</div>
                <button onClick={disconnect} className="text-xs font-bold uppercase tracking-widest text-swiss-accent">
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <SwissButton onClick={connect} loading={connecting} size="full">
                <Wallet className="inline w-4 h-4 mr-2" />
                Connect Wallet
              </SwissButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
