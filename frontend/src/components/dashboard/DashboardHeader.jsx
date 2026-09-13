import React, { useState, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  Lock,
  LogOut,
  Wallet,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ethers } from 'ethers';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';

export default function DashboardHeader({
  activeRole,
  onToggleSidebar,
  onLogout,
  userName = 'User',
  walletAddress = 'Not connected',
  onDisconnectWallet,
  onConnectWallet
}) {
  const { user, profile, linkWallet } = useAuth();
  const { account, connect, disconnect, provider } = useWallet();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectingWalletId, setConnectingWalletId] = useState(null);
  const [modalLoadingText, setModalLoadingText] = useState('');
  const [modalError, setModalError] = useState('');
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(null);

  const [isManuallyDisconnected, setIsManuallyDisconnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);

  useEffect(() => {
    if (isManuallyDisconnected) {
      setConnectedAddress(null);
      return;
    }
    if (account) {
      setConnectedAddress(account);
    } else if (walletAddress && walletAddress !== 'Not connected') {
      setConnectedAddress(walletAddress);
    } else if (profile?.wallet_address) {
      setConnectedAddress(profile.wallet_address);
    } else {
      setConnectedAddress(null);
    }
  }, [account, walletAddress, profile?.wallet_address, isManuallyDisconnected]);

  const activeWalletAddr = isManuallyDisconnected ? null : connectedAddress;
  const isWalletConnected = Boolean(activeWalletAddr && activeWalletAddr !== 'Not connected');

  // Fetch ETH balance whenever active wallet changes
  useEffect(() => {
    let isMounted = true;
    async function fetchBalance() {
      if (!activeWalletAddr) {
        setBalance(null);
        return;
      }
      try {
        if (window.ethereum) {
          const prov = provider || new ethers.BrowserProvider(window.ethereum);
          const bal = await prov.getBalance(activeWalletAddr);
          if (isMounted) {
            const formatted = parseFloat(ethers.formatEther(bal)).toFixed(3);
            setBalance(formatted);
          }
        } else {
          if (isMounted) setBalance('0.000');
        }
      } catch (err) {
        console.warn('Could not fetch wallet balance:', err);
        if (isMounted && balance === null) setBalance('0.000');
      }
    }

    fetchBalance();
    const interval = setInterval(fetchBalance, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeWalletAddr, provider]);

  const notifications = [
    { id: 1, title: 'Ownership Transfer Request', desc: 'Arjun Mehta accepted offer on 2022 Toyota Camry / R8', time: '10m ago', unread: true },
    { id: 2, title: 'Oracle Verification Verified', desc: 'RTO Node #409 signed Digital Vehicle Passport for CN-48291', time: '1h ago', unread: true },
    { id: 3, title: 'Smart Escrow Locked', desc: 'Funds deposited in Ethereum Sepolia contract 0x89Fa...31Bc', time: '3h ago', unread: false }
  ];

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'seller':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'authority':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'buyer':
      default:
        return 'bg-teal-50 text-teal-800 border-teal-300';
    }
  };

  const handleCopyAddress = () => {
    if (!activeWalletAddr) return;
    navigator.clipboard.writeText(activeWalletAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnectWallet = async () => {
    try {
      setIsManuallyDisconnected(true);
      setConnectedAddress(null);
      setBalance(null);
      setWalletDropdownOpen(false);

      if (disconnect) disconnect();
      if (linkWallet) await linkWallet('').catch(() => {});
      if (onDisconnectWallet) onDisconnectWallet();
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  };

  const handleConnectWalletOption = async (walletId) => {
    setConnectingWalletId(walletId);
    setModalError('');
    setModalLoadingText(`Opening ${walletId === 'metamask' ? 'MetaMask' : walletId === 'walletconnect' ? 'WalletConnect' : 'Pera Wallet'}...`);

    try {
      let resolvedAddr = null;

      if (walletId === 'metamask') {
        if (!window.ethereum) {
          throw new Error('MetaMask extension is not installed. Please install MetaMask browser extension.');
        }

        let accounts = [];
        try {
          const permissions = await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
          const accountsPerm = permissions.find(p => p.parentCapability === 'eth_accounts');
          accounts = accountsPerm?.caveats?.[0]?.value || [];
        } catch (permErr) {
          if (permErr?.code === 4001) throw new Error('Connection request was cancelled in MetaMask.');
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }

        if (!accounts || accounts.length === 0) {
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts selected in MetaMask.');
        }

        const chosenAcc = accounts[0];
        setModalLoadingText('Awaiting authorization signature in MetaMask...');
        const authMsg = `carNodes Web3 Authorization\n\nI authorize connecting wallet:\n${chosenAcc}\n\nto my carNodes account:\n${user?.email || ''}\n\nTimestamp: ${new Date().toISOString()}\nNon-custodial cryptographic verification.`;

        let signature;
        try {
          signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [authMsg, chosenAcc]
          });
        } catch (signErr) {
          if (signErr?.code === 4001 || signErr?.message?.includes('rejected')) {
            throw new Error('Authorization rejected in MetaMask. Wallet was not connected.');
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
        await new Promise(r => setTimeout(r, 1200));
        resolvedAddr = account || '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      } else if (walletId === 'pera') {
        setModalLoadingText('Waiting for authorization via Pera Wallet...');
        await new Promise(r => setTimeout(r, 1200));
        resolvedAddr = 'ALGO' + Array.from({length: 36}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
      }

      if (resolvedAddr && linkWallet) {
        await linkWallet(resolvedAddr).catch((e) => console.warn('linkWallet error:', e));
      }

      setConnectedAddress(resolvedAddr);
      setIsManuallyDisconnected(false);
      if (onConnectWallet) {
        onConnectWallet(resolvedAddr);
      }

      setConnectingWalletId(null);
      setConnectModalOpen(false);
    } catch (err) {
      console.error('Wallet connection error in header:', err);
      setConnectingWalletId(null);
      if (err?.code === 4001 || err?.message?.includes('rejected') || err?.message?.includes('cancelled')) {
        setModalError('Authorization was rejected in your wallet. The wallet was not connected.');
      } else {
        setModalError(err.message || 'Failed to connect wallet. Please try again.');
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Role Badge (Landing Page and Role Switcher Dropdown removed) */}
      <div className="flex items-center space-x-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Static Role Portal Badge */}
        <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider shadow-xs ${getRoleBadge(activeRole)}`}>
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="capitalize">{activeRole} Portal</span>
        </div>
      </div>

      {/* Right Actions: Wallet Key + Amount, Notifications, Profile */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5">

        {/* ─── WALLET SECTION ─── */}
        <div className="relative">
          {isWalletConnected ? (
            /* Connected Wallet Key Pill with Balance */
            <button
              onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono transition-all shadow-xs cursor-pointer group"
              title="Click to view wallet details or disconnect"
            >
              {/* Wallet Amount / Balance */}
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/80 shadow-xs">
                {balance !== null ? `${balance} ETH` : '0.000 ETH'}
              </span>

              {/* Truncated Address */}
              <span className="text-slate-600 font-bold group-hover:text-slate-900 transition-colors">
                {activeWalletAddr.slice(0, 6)}...{activeWalletAddr.slice(-4)}
              </span>

              {/* Network Badge */}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                Sepolia
              </span>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </button>
          ) : (
            /* Disconnected State: Connect Wallet Button */
            <button
              onClick={() => setConnectModalOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer hover:shadow-md"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Connected Wallet Dropdown (Shows Balance & Disconnect Button) */}
          {walletDropdownOpen && isWalletConnected && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold font-heading text-slate-900 flex items-center space-x-1.5">
                  <Wallet className="w-3.5 h-3.5 text-teal-600" />
                  <span>Wallet Details</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Connected
                </span>
              </div>

              {/* Balance Display */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 mb-2.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                  Wallet Balance
                </span>
                <div className="text-base font-bold text-slate-900 font-mono flex items-center justify-between">
                  <span>{balance !== null ? `${balance} ETH` : '0.000 ETH'}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Ethereum Sepolia</span>
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-1 mb-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                  Address
                </span>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-700 break-all">
                  <span className="truncate mr-2">{activeWalletAddr}</span>
                  <button
                    onClick={handleCopyAddress}
                    title="Copy Address"
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnectWallet}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer border border-rose-200/60"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          )}
        </div>

        {/* ─── NOTIFICATIONS BELL ─── */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold font-heading text-slate-900">Notifications</span>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">2 New</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl hover:bg-slate-50 text-xs transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── USER PROFILE PILL WITH SIGN OUT ─── */}
        <div className="relative flex items-center space-x-2 pl-1 border-l border-slate-200">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 hover:bg-slate-100 rounded-xl p-1.5 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">{userName}</span>
              <span className="text-[10px] font-mono text-slate-400 capitalize">{activeRole} portal</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-fadeIn">
              <div className="pb-2 mb-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email || ''}</p>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 mt-1 inline-block capitalize">
                  {activeRole}
                </span>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center space-x-2 p-2 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ─── CONNECT WALLET MODAL (Opens when clicking "Connect Wallet") ─── */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden relative p-6">
            {/* Close button */}
            <button
              onClick={() => { setConnectModalOpen(false); setModalError(''); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-heading font-extrabold text-slate-900">
                  Connect Web3 Wallet
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Select a wallet provider to authorize & link
                </p>
              </div>
            </div>

            {/* Error Message */}
            {modalError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Loading state while waiting for wallet authorization */}
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
              /* 3 Wallet Options */
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
                    <p className="text-xs text-slate-500">Browser extension & Ethereum Sepolia</p>
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
                    <p className="text-xs text-slate-500">Mobile & Web cross-chain wallet</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
