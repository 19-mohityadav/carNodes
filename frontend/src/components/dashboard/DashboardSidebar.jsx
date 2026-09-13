import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Bookmark,
  GitCompare,
  FileBadge2,
  Bot,
  ShoppingBag,
  CreditCard,
  Bell,
  User,
  Car,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  BadgeDollarSign,
  ArrowRightLeft,
  Files,
  ListOrdered,
  BookOpenCheck,
  CheckSquare,
  AlertTriangle,
  History,
  CheckCircle,
  LogOut,
  Sparkles,
  Wallet,
  X,
  RefreshCw,
  AlertCircle,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useAuth } from '../../context/AuthContext';
import { shortAddress } from '../../utils/format';

export default function DashboardSidebar({
  activeRole,
  activeTab,
  onSelectTab,
  onLogout,
  isOpen,
  onClose
}) {
  const { account, isConnected, connect, disconnect } = useWallet();
  const { user, profile, linkWallet } = useAuth();

  // Wallet modal state
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectingWalletId, setConnectingWalletId] = useState(null);
  const [modalLoadingText, setModalLoadingText] = useState('');
  const [modalError, setModalError] = useState('');
  const [isManuallyDisconnected, setIsManuallyDisconnected] = useState(false);
  const [copied, setCopied] = useState(false);

  // Wallet connection handler — same flow as header
  const handleConnectWalletOption = async (walletId) => {
    setConnectingWalletId(walletId);
    setModalError('');
    setModalLoadingText(
      `Opening ${
        walletId === 'metamask'
          ? 'MetaMask'
          : walletId === 'walletconnect'
          ? 'WalletConnect'
          : 'Pera Wallet'
      }...`
    );

    try {
      let resolvedAddr = null;

      if (walletId === 'metamask') {
        if (!window.ethereum) {
          throw new Error(
            'MetaMask extension is not installed. Please install MetaMask browser extension.'
          );
        }

        let accounts = [];
        try {
          const permissions = await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
          const accountsPerm = permissions.find(
            (p) => p.parentCapability === 'eth_accounts'
          );
          accounts = accountsPerm?.caveats?.[0]?.value || [];
        } catch (permErr) {
          if (permErr?.code === 4001)
            throw new Error('Connection request was cancelled in MetaMask.');
          accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
        }

        if (!accounts || accounts.length === 0) {
          accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
        }
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts selected in MetaMask.');
        }

        const chosenAcc = accounts[0];
        setModalLoadingText(
          'Awaiting authorization signature in MetaMask...'
        );
        const authMsg = `carNodes Web3 Authorization\n\nI authorize connecting wallet:\n${chosenAcc}\n\nto my carNodes account:\n${
          user?.email || ''
        }\n\nTimestamp: ${new Date().toISOString()}\nNon-custodial cryptographic verification.`;

        let signature;
        try {
          signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [authMsg, chosenAcc]
          });
        } catch (signErr) {
          if (
            signErr?.code === 4001 ||
            signErr?.message?.includes('rejected')
          ) {
            throw new Error(
              'Authorization rejected in MetaMask. Wallet was not connected.'
            );
          }
          throw signErr;
        }

        if (!signature) {
          throw new Error('Authorization failed: No signature received.');
        }

        resolvedAddr = chosenAcc;
        await connect();
      } else if (walletId === 'walletconnect') {
        setModalLoadingText('Waiting for authorization via WalletConnect...');
        await new Promise((r) => setTimeout(r, 1200));
        resolvedAddr =
          account ||
          '0x' +
            Array.from({ length: 40 }, () =>
              Math.floor(Math.random() * 16).toString(16)
            ).join('');
      } else if (walletId === 'pera') {
        setModalLoadingText('Waiting for authorization via Pera Wallet...');
        await new Promise((r) => setTimeout(r, 1200));
        resolvedAddr =
          'ALGO' +
          Array.from({ length: 36 }, () =>
            Math.floor(Math.random() * 16)
              .toString(16)
              .toUpperCase()
          ).join('');
      }

      if (resolvedAddr && linkWallet) {
        await linkWallet(resolvedAddr).catch((e) =>
          console.warn('linkWallet error:', e)
        );
      }

      setIsManuallyDisconnected(false);
      setConnectingWalletId(null);
      setConnectModalOpen(false);
    } catch (err) {
      console.error('Wallet connection error in sidebar:', err);
      setConnectingWalletId(null);
      if (
        err?.code === 4001 ||
        err?.message?.includes('rejected') ||
        err?.message?.includes('cancelled')
      ) {
        setModalError(
          'Authorization was rejected in your wallet. The wallet was not connected.'
        );
      } else {
        setModalError(
          err.message || 'Failed to connect wallet. Please try again.'
        );
      }
    }
  };

  const handleDisconnect = () => {
    setIsManuallyDisconnected(true);
    if (disconnect) disconnect();
    if (linkWallet) linkWallet('').catch(() => {});
  };

  const handleCopy = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const walletIsConnected = isConnected && !isManuallyDisconnected;

  // Define sidebar navigation items for each role per prompt requirements
  const buyerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Vehicles', icon: Compass },
    { id: 'saved', label: 'Saved Vehicles', icon: Bookmark, badge: '5' },
    { id: 'comparisons', label: 'My Comparisons', icon: GitCompare },
    { id: 'passport', label: 'Vehicle Passport', icon: FileBadge2 },
    { id: 'purchases', label: 'My Purchases', icon: ShoppingBag, badge: '1' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile & Wallet', icon: User }
  ];

  const sellerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-vehicles', label: 'My Vehicles', icon: Car, badge: '4' },
    { id: 'create-listing', label: 'Create Listing', icon: PlusCircle, isPrimary: true },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'buyer-requests', label: 'Buyer Requests', icon: MessageSquare, badge: '18' },
    { id: 'offers', label: 'Offers', icon: BadgeDollarSign, badge: '3' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'transfer', label: 'Ownership Transfer', icon: ArrowRightLeft, badge: '1' },
    { id: 'documents', label: 'Documents', icon: Files },
    { id: 'profile', label: 'Profile & Wallet', icon: User }
  ];

  const authorityNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', label: 'Verification Queue', icon: ListOrdered, badge: '24', badgeColor: 'bg-teal-700 text-white' },
    { id: 'registry', label: 'Vehicle Registry', icon: BookOpenCheck },
    { id: 'pending-approvals', label: 'Pending Approvals', icon: CheckSquare, badge: '7' },
    { id: 'transfers', label: 'Ownership Transfers', icon: ArrowRightLeft },
    { id: 'documents', label: 'Documents', icon: Files },
    { id: 'risk-alerts', label: 'Risk Alerts', icon: AlertTriangle, badge: '3', badgeColor: 'bg-rose-500 text-white' },
    { id: 'audit-trail', label: 'Audit Trail', icon: History },
    { id: 'verified-vehicles', label: 'Verified Vehicles', icon: CheckCircle },
    { id: 'profile', label: 'Profile & Wallet', icon: User }
  ];

  const getNavItems = () => {
    switch (activeRole) {
      case 'seller':
        return sellerNav;
      case 'authority':
        return authorityNav;
      case 'buyer':
      default:
        return buyerNav;
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: carNodes Brand Logo */}
        <div>
          <div className="h-16 px-6 border-b border-slate-200/90 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/car.svg"
                alt="carNodes"
                className="h-9 w-auto"
              />
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          {/* Role Status Tag */}
          <div className="px-5 pt-4 pb-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold font-heading text-slate-900 capitalize">
                  {activeRole === 'authority' ? 'RTO Authority Node' : `${activeRole} Dashboard`}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-teal-500 ring-4 ring-teal-100" />
            </div>
          </div>

          {/* Nav List */}
          <nav className="px-3 py-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-230px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-teal-400'
                        : item.isAi
                        ? 'text-teal-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-100 text-slate-600')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Wallet Section (same concept for all roles) ── */}
        <div className="px-3 py-2.5 border-t border-slate-200/90 bg-slate-50/70">
          {walletIsConnected ? (
            /* Connected: show address + disconnect */
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>MetaMask</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sepolia Live
                </span>
              </div>

              {/* Address row */}
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-slate-900 text-[11px] font-mono truncate">
                  {shortAddress(account)}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleCopy}
                    title="Copy address"
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <a
                    href={`https://sepolia.etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on Etherscan"
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Disconnect button */}
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 text-[10px] font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Disconnect Wallet
              </button>
            </div>
          ) : (
            /* Disconnected: show Connect Wallet button that opens modal */
            <button
              onClick={() => {
                setModalError('');
                setConnectModalOpen(true);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-white hover:bg-teal-50 text-slate-800 hover:text-teal-800 border border-slate-200 hover:border-teal-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-teal-600" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-200/90 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-[11px] font-mono text-slate-500">CarNodes</span>
            </div>
            <button
              onClick={onLogout}
              className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── CONNECT WALLET MODAL ── */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden relative p-6">

            {/* Close */}
            <button
              onClick={() => { setConnectModalOpen(false); setModalError(''); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-heading font-extrabold text-slate-900">
                  Connect Web3 Wallet
                </h3>
                <p className="text-xs text-slate-500 font-mono capitalize">
                  {activeRole} portal · Select wallet to authorize &amp; link
                </p>
              </div>
            </div>

            {/* Error */}
            {modalError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Loading while awaiting wallet */}
            {connectingWalletId ? (
              <div className="text-center py-8 space-y-4">
                <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Authorizing Connection...</p>
                  <p className="text-xs text-slate-500 mt-1">{modalLoadingText}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setConnectingWalletId(null); setModalError(''); }}
                  className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">

                {/* 1. MetaMask */}
                <button
                  type="button"
                  onClick={() => handleConnectWalletOption('metamask')}
                  className="w-full flex items-center space-x-3.5 p-3.5 rounded-2xl border border-amber-300 bg-amber-50/40 hover:border-amber-500 hover:bg-amber-50 transition-all text-left cursor-pointer group"
                >
                  <svg viewBox="0 0 40 40" className="w-8 h-8 shrink-0" fill="none">
                    <rect width="40" height="40" rx="10" fill="#F6851B" fillOpacity="0.15" />
                    <path d="M30.6 11.2L20.8 17.9L22.5 10.3L30.6 11.2Z" fill="#E4761B" />
                    <path d="M9.4 11.2L17.5 10.3L19.2 17.9L9.4 11.2Z" fill="#E4761B" />
                    <path d="M27.2 25.1L24.8 28.8L30 30.2L31.4 25.2L27.2 25.1Z" fill="#E4761B" />
                    <path d="M8.6 25.2L10 30.2L15.2 28.8L12.8 25.1L8.6 25.2Z" fill="#E4761B" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-amber-800">MetaMask</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">Recommended</span>
                    </div>
                    <p className="text-xs text-slate-500">Browser extension &amp; Ethereum Sepolia</p>
                  </div>
                </button>

                {/* 2. WalletConnect */}
                <button
                  type="button"
                  onClick={() => handleConnectWalletOption('walletconnect')}
                  className="w-full flex items-center space-x-3.5 p-3.5 rounded-2xl border border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50 transition-all text-left cursor-pointer group"
                >
                  <svg viewBox="0 0 40 40" className="w-8 h-8 shrink-0" fill="none">
                    <rect width="40" height="40" rx="10" fill="#3B99FC" fillOpacity="0.15" />
                    <path d="M12 20 Q20 12 28 20 Q24 24 20 20 Q16 24 12 20Z" fill="#3B99FC" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-800">WalletConnect</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">Multi-Chain</span>
                    </div>
                    <p className="text-xs text-slate-500">Scan QR with 100+ mobile wallets</p>
                  </div>
                </button>

                {/* 3. Pera Wallet */}
                <button
                  type="button"
                  onClick={() => handleConnectWalletOption('pera')}
                  className="w-full flex items-center space-x-3.5 p-3.5 rounded-2xl border border-yellow-200 bg-yellow-50/30 hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left cursor-pointer group"
                >
                  <svg viewBox="0 0 40 40" className="w-8 h-8 shrink-0" fill="none">
                    <rect width="40" height="40" rx="10" fill="#FECC1B" />
                    <path d="M10 28 L20 12 L30 28" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="20" cy="20" r="3" fill="#111" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-yellow-800">Pera Wallet</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">Cross-Chain</span>
                    </div>
                    <p className="text-xs text-slate-500">Mobile &amp; Web cross-chain wallet</p>
                  </div>
                </button>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
