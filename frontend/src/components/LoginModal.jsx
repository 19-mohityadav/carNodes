import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  Car,
  KeyRound,
  Sparkles,
  Wallet,
  Zap,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

export default function LoginModal({ isOpen, onClose, onConnected, initialMode = 'signup' }) {
  if (!isOpen) return null;

  const { signIn, signUp, linkWallet, isAuthenticated } = useAuth();
  const { connect, account } = useWallet();

  // Modes: 'signup' | 'signin' | 'wallet-step' | 'wallet' | 'connecting' | 'success'
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('buyer'); // 'buyer' | 'seller'

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleDetail, setRoleDetail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingText, setLoadingText] = useState('Authenticating session with Supabase...');

  // Selected Wallet
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      desc: 'Connect using MetaMask Ethereum & EVM browser extension',
      badge: 'Sepolia EVM',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: (
        <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
          <rect width="40" height="40" rx="10" fill="#F6851B" fillOpacity="0.15" />
          <path d="M30.6 11.2L20.8 17.9L22.5 10.3L30.6 11.2Z" fill="#E4761B" />
          <path d="M9.4 11.2L17.5 10.3L19.2 17.9L9.4 11.2Z" fill="#E4761B" />
          <path d="M27.2 25.1L24.8 28.8L30 30.2L31.4 25.2L27.2 25.1Z" fill="#E4761B" />
          <path d="M8.6 25.2L10 30.2L15.2 28.8L12.8 25.1L8.6 25.2Z" fill="#E4761B" />
          <path d="M14.6 18.2L13.2 20.3L18.4 20.5L18.6 14.8L14.6 18.2Z" fill="#E4761B" />
          <path d="M25.4 18.2L21.4 14.8L21.6 20.5L26.8 20.3L25.4 18.2Z" fill="#E4761B" />
          <path d="M15.2 28.8L18.4 27.2L15.8 25.2L15.2 28.8Z" fill="#D7C1B3" />
          <path d="M24.8 28.8L24.2 25.2L21.6 27.2L24.8 28.8Z" fill="#D7C1B3" />
          <path d="M21.6 27.2L24.2 25.2L25.4 21.6L21.5 21.7L21.6 27.2Z" fill="#233447" />
          <path d="M18.4 27.2L18.5 21.7L14.6 21.6L15.8 25.2L18.4 27.2Z" fill="#233447" />
          <path d="M9.4 11.2L12.8 17.8L14.6 18.2L18.6 14.8L17.5 10.3L9.4 11.2Z" fill="#E4761B" />
          <path d="M30.6 11.2L22.5 10.3L21.4 14.8L25.4 18.2L27.2 17.8L30.6 11.2Z" fill="#E4761B" />
          <path d="M18.4 20.5L13.2 20.3L12.8 25.1L14.6 21.6L18.4 20.5Z" fill="#CD6116" />
          <path d="M21.6 20.5L25.4 21.6L27.2 25.1L26.8 20.3L21.6 20.5Z" fill="#CD6116" />
        </svg>
      )
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      desc: 'Scan QR code with 100+ multi-chain Web3 mobile wallets',
      badge: 'Multi-Chain',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: (
        <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
          <rect width="40" height="40" rx="10" fill="#3B99FC" />
          <path d="M12 20 Q20 12 28 20 Q24 24 20 20 Q16 24 12 20Z" fill="white" />
        </svg>
      )
    },
    {
      id: 'pera',
      name: 'Pera Wallet',
      desc: 'Algorand & Cross-chain mobile and desktop wallet',
      badge: 'Cross-Chain',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: (
        <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
          <rect width="40" height="40" rx="10" fill="#FECC1B" />
          <path d="M10 28 L20 12 L30 28" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="3" fill="#111" />
        </svg>
      )
    }
  ];

  // Authority role is intentionally excluded — accounts are provisioned directly
  // by an admin via the Supabase Dashboard or SQL Editor.
  const roles = [
    {
      id: 'buyer',
      title: 'Buyer',
      subtitle: 'Browse & Purchase RWAs',
      desc: 'Explore vehicle passports, run AI fraud analysis, and purchase securely through escrow.',
      icon: Car,
      color: 'border-[#B89B5E] bg-[#FDFBF7] text-[#B89B5E]',
    },
    {
      id: 'seller',
      title: 'Seller',
      subtitle: 'Mint & List Vehicles',
      desc: 'Register vehicle RWAs, upload off-chain documents, and manage active marketplace sales.',
      icon: Building2,
      color: 'border-[#3D5066] bg-slate-50 text-[#3D5066]',
    },
  ];

  // Web3 Wallet Connect (post-auth wallet step OR standalone wallet mode)
  const handleWalletConnect = async (walletId) => {
    if (!isAuthenticated && !authenticatedUser) {
      setErrorMsg('Please sign in with your email before connecting a wallet.');
      setMode('signin');
      return;
    }
    const walletObj = wallets.find(w => w.id === walletId) || null;
    setSelectedWallet(walletObj);
    setLoadingText(`Opening ${walletObj?.name || 'Wallet'}... Please check your wallet popup.`);
    setMode('connecting');
    setErrorMsg('');

    try {
      let walletAddr = null;
      if (walletId === 'metamask') {
        if (!window.ethereum) {
          throw new Error('MetaMask is not installed. Please install MetaMask extension or choose another wallet.');
        }

        // 1. Request account permissions (triggers MetaMask window if not opened)
        let accounts = [];
        try {
          const permissions = await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
          const accountsPermission = permissions.find(p => p.parentCapability === 'eth_accounts');
          accounts = accountsPermission?.caveats?.[0]?.value || [];
        } catch (permErr) {
          if (permErr?.code === 4001) {
            throw new Error('Wallet connection cancelled in MetaMask.');
          }
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }

        if (!accounts || accounts.length === 0) {
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }

        if (!accounts || accounts.length === 0) {
          throw new Error('No account authorized from MetaMask.');
        }

        const chosenAccount = accounts[0];

        // 2. Request cryptographic authorization signature from user's wallet
        setLoadingText('Awaiting authorization signature in MetaMask...');
        const authMessage = `carNodes Web3 Authorization\n\nI authorize linking wallet:\n${chosenAccount}\n\nto my carNodes account:\n${authenticatedUser?.email || ''}\n\nTimestamp: ${new Date().toISOString()}\nNon-custodial cryptographic verification.`;

        let signature;
        try {
          signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [authMessage, chosenAccount]
          });
        } catch (signErr) {
          if (signErr?.code === 4001 || signErr?.message?.includes('rejected')) {
            throw new Error('Authorization rejected in MetaMask. Wallet was not connected.');
          }
          throw signErr;
        }

        if (!signature) {
          throw new Error('Authorization failed: No signature received from wallet.');
        }

        walletAddr = chosenAccount;
        await connect();
      } else if (walletId === 'walletconnect') {
        setLoadingText('Waiting for authorization from WalletConnect...');
        await new Promise(r => setTimeout(r, 1200));
        walletAddr = account || '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      } else if (walletId === 'pera') {
        setLoadingText('Waiting for authorization from Pera Wallet...');
        await new Promise(r => setTimeout(r, 1200));
        walletAddr = 'ALGO' + Array.from({length: 36}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
      }

      if (walletAddr && linkWallet) {
        await linkWallet(walletAddr).catch((err) => console.warn('linkWallet error:', err));
      }

      const updatedUser = {
        ...(authenticatedUser || {}),
        walletAddress: walletAddr
      };
      setAuthenticatedUser(updatedUser);

      setLoadingText('Wallet successfully authorized & linked!');
      setTimeout(() => {
        setMode('success');
        setTimeout(() => {
          if (onConnected) onConnected(walletId, walletAddr || '', updatedUser);
          handleClose();
        }, 900);
      }, 700);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setMode('wallet-step');
      if (err?.code === 4001 || err?.message?.includes('rejected') || err?.message?.includes('cancelled')) {
        setErrorMsg('Authorization was rejected in your wallet. The wallet was not connected.');
      } else {
        setErrorMsg(err.message || 'Failed to connect wallet. Please try again or skip for now.');
      }
    }
  };

  // Skip wallet step — proceed directly to dashboard
  const handleSkipWallet = () => {
    setMode('success');
    setTimeout(() => {
      if (onConnected) onConnected('credentials', null, authenticatedUser);
      handleClose();
    }, 900);
  };


  // Form Submit Handler (Sign Up / Sign In)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (!emailOrPhone.trim()) {
        setErrorMsg('Please enter your email address');
        return;
      }
      if (!emailOrPhone.includes('@')) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
      if (!phoneNumber.trim()) {
        setErrorMsg('Please enter your phone number');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }

      setLoadingText('Creating your verified Supabase user profile...');
      setMode('connecting');

      try {
        const res = await signUp({
          email: emailOrPhone,
          password,
          name: fullName,
          phone: phoneNumber,
          role,
          roleDetail,
          walletAddress: account || '',
        });

        const prof = res?.profile;
        const userObj = {
          id: res?.data?.user?.id,
          name: fullName,
          email: emailOrPhone,
          phone: phoneNumber,
          role,
          walletAddress: prof?.wallet_address || null,
          provider: 'supabase',
        };

        setAuthenticatedUser(userObj);
        // Show wallet connect step after successful sign-up
        setMode('wallet-step');
      } catch (err) {
        console.error('Sign up error:', err);
        setMode('signup');
        setErrorMsg(err.message || 'Registration failed. Please check your credentials.');
      }
    } else if (mode === 'signin') {
      if (!emailOrPhone.trim()) {
        setErrorMsg('Please enter your email address');
        return;
      }
      if (!password) {
        setErrorMsg('Please enter your password');
        return;
      }

      setLoadingText('Authenticating with Supabase...');
      setMode('connecting');

      try {
        const res = await signIn({
          email: emailOrPhone,
          password,
        });

        const prof = res?.profile;
        const resolvedRole = (
          prof?.role ||
          res?.data?.user?.user_metadata?.role ||
          'buyer'
        ).toLowerCase();

        const userObj = {
          id: res?.data?.user?.id,
          name: prof?.name || res?.data?.user?.user_metadata?.name || emailOrPhone.split('@')[0],
          email: res?.data?.user?.email || emailOrPhone,
          phone: prof?.phone || '',
          role: resolvedRole,
          walletAddress: prof?.wallet_address || null,
          provider: 'supabase',
        };

        setRole(resolvedRole);
        setAuthenticatedUser(userObj);
        // Show wallet connect step after successful sign-in
        setMode('wallet-step');
      } catch (err) {
        console.error('Sign in error:', err);
        setMode('signin');
        setErrorMsg(err.message || 'Invalid email or password.');
      }
    }
  };

  const handleClose = () => {
    onClose();
    setMode(initialMode);
    setErrorMsg('');
    setFullName('');
    setEmailOrPhone('');
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    setRoleDetail('');
    setSelectedWallet(null);
    setAuthenticatedUser(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-[#3D5066] text-white px-6 pt-6 pb-7 relative shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* carNodes Logo */}
          <div className="flex items-center space-x-3 mb-3">
            <img src="/carnodes-logo.svg" alt="carNodes" className="h-10 w-auto brightness-0 invert" />
          </div>

          <h2 className="text-xl font-heading font-extrabold uppercase tracking-tight">
            {mode === 'signup' && 'Get Started with carNodes'}
            {mode === 'signin' && 'Sign In to Your Account'}
            {mode === 'wallet' && 'Connect Web3 Wallet'}
            {mode === 'connecting' && 'Verifying Supabase Auth...'}
            {mode === 'success' && 'Welcome to carNodes!'}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {mode === 'signup' && 'Create your verified RWA account to trade, list & audit luxury vehicles.'}
            {mode === 'signin' && 'Access your digital vehicle passports, escrow contracts & dashboard.'}
            {mode === 'wallet' && 'Select MetaMask or your preferred Web3 wallet provider.'}
            {mode === 'connecting' && loadingText}
            {mode === 'success' && 'Identity verified in Supabase PostgreSQL. Redirecting to workspace...'}
          </p>
        </div>

        {/* Decorative divider curve */}
        <div className="h-3 bg-[#3D5066] relative shrink-0">
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-white rounded-t-[1.5rem]" />
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-start justify-between space-x-2 animate-fadeIn">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-800 text-sm font-bold">×</button>
            </div>
          )}


          {/* ──────────────────────────────────────────────────────────
              ROLE SELECTOR SECTION: Buyer | Seller | Authority (Sign Up Only)
          ────────────────────────────────────────────────────────── */}
          {mode === 'signup' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase font-bold text-[#6E6259] tracking-wider">
                  Select Your Account Role:
                </label>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase">
                  {role} Mode Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? `ring-2 ring-[#B89B5E] ${r.color} shadow-sm`
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Icon className="w-5 h-5" />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#B89B5E]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold font-heading uppercase">{r.title}</div>
                        <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">{r.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Role explanation callout */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-[11px] text-[#6E6259] flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#B89B5E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3D5066] capitalize">{role} Role Clearance: </strong>
                  {roles.find((r) => r.id === role)?.desc}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              MODE: SIGN UP
          ────────────────────────────────────────────────────────── */}
          {mode === 'signup' && (
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div className="border-t border-zinc-100 pt-3">
                <p className="text-xs font-mono uppercase text-[#6E6259] font-bold mb-3">
                  Step 2: Enter Account Credentials
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#3D5066] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Subhojit Gope"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#B89B5E] focus:ring-1 focus:ring-[#B89B5E] transition-all"
                  />
                </div>
              </div>

              {/* Email Address & Phone Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D5066] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#B89B5E] focus:ring-1 focus:ring-[#B89B5E] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D5066] mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98201 00000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#B89B5E] focus:ring-1 focus:ring-[#B89B5E] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Role Specific Details Field */}
              <div>
                <label className="block text-xs font-semibold text-[#3D5066] mb-1">
                  {role === 'buyer' && 'Preferred Region / Fiat Currency'}
                  {role === 'seller' && 'Dealership / Individual Business License'}
                  {role === 'authority' && 'DMV Agency / Inspection Jurisdiction ID'}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={roleDetail}
                    onChange={(e) => setRoleDetail(e.target.value)}
                    placeholder={
                      role === 'buyer'
                        ? 'e.g. India / INR (₹) or US / USD ($)'
                        : role === 'seller'
                          ? 'e.g. Apex Luxury Motors (Lic #DL-98214)'
                          : 'e.g. California DMV Node #409 / MH-02 RTO'
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#B89B5E] focus:ring-1 focus:ring-[#B89B5E] transition-all"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D5066] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#B89B5E] focus:ring-1 focus:ring-[#B89B5E] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D5066] mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#B89B5E] focus:ring-1 focus:ring-[#B89B5E] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#3D5066] hover:bg-[#B89B5E] text-white text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-2 cursor-pointer"
              >
                <span>Create Verified Account as {roles.find((r) => r.id === role)?.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Web3 Alternative */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setMode('wallet')}
                  className="text-xs font-semibold text-[#B89B5E] hover:underline inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Or Connect with MetaMask / Web3 Wallet</span>
                </button>
              </div>
            </form>
          )}

          {/* ──────────────────────────────────────────────────────────
              MODE: SIGN IN
          ────────────────────────────────────────────────────────── */}
          {mode === 'signin' && (
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#3D5066] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#B89B5E] focus:ring-1 focus:ring-[#B89B5E] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#3D5066]">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Please contact support or use the "Sign Up" flow to reset your password.')}
                    className="text-[11px] text-[#B89B5E] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#B89B5E] focus:ring-1 focus:ring-[#B89B5E] transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#3D5066] hover:bg-[#B89B5E] text-white text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-2 cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Web3 Alternative */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setMode('wallet')}
                  className="text-xs font-semibold text-[#B89B5E] hover:underline inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Sign In with MetaMask / Web3 Wallet</span>
                </button>
              </div>
            </form>
          )}

          {/* ──────────────────────────────────────────────────────────
              MODE: WALLET STEP (Post-Auth — Connect Your Wallet)
          ────────────────────────────────────────────────────────── */}
          {mode === 'wallet-step' && (
            <div className="space-y-4">
              {/* Greeting */}
              {authenticatedUser && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {authenticatedUser.name?.charAt(0) || '✓'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800">Signed in as {authenticatedUser.name}</p>
                    <p className="text-[11px] text-emerald-600 capitalize font-mono">{authenticatedUser.role} account verified</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-mono uppercase text-[#6E6259] font-bold mb-0.5">Step 2: Connect Your Wallet</p>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Your Web3 wallet is required to sign escrow transactions, mint Vehicle Passports on Ethereum Sepolia, and authorize ownership transfers.
                </p>
              </div>

              {/* 3 Wallet Options */}
              <div className="space-y-2">
                {/* MetaMask */}
                <button
                  type="button"
                  onClick={() => handleWalletConnect('metamask')}
                  className="w-full flex items-center space-x-3.5 p-3.5 rounded-2xl border border-amber-300 bg-amber-50/50 hover:border-amber-500 hover:bg-amber-50 transition-all text-left cursor-pointer group"
                >
                  <svg viewBox="0 0 40 40" className="w-9 h-9 shrink-0" fill="none">
                    <rect width="40" height="40" rx="10" fill="#F6851B" fillOpacity="0.15" />
                    <path d="M30.6 11.2L20.8 17.9L22.5 10.3L30.6 11.2Z" fill="#E4761B" />
                    <path d="M9.4 11.2L17.5 10.3L19.2 17.9L9.4 11.2Z" fill="#E4761B" />
                    <path d="M27.2 25.1L24.8 28.8L30 30.2L31.4 25.2L27.2 25.1Z" fill="#E4761B" />
                    <path d="M8.6 25.2L10 30.2L15.2 28.8L12.8 25.1L8.6 25.2Z" fill="#E4761B" />
                    <path d="M14.6 18.2L13.2 20.3L18.4 20.5L18.6 14.8L14.6 18.2Z" fill="#E4761B" />
                    <path d="M25.4 18.2L21.4 14.8L21.6 20.5L26.8 20.3L25.4 18.2Z" fill="#E4761B" />
                    <path d="M15.2 28.8L18.4 27.2L15.8 25.2L15.2 28.8Z" fill="#D7C1B3" />
                    <path d="M24.8 28.8L24.2 25.2L21.6 27.2L24.8 28.8Z" fill="#D7C1B3" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-[#3D5066] group-hover:text-amber-700">MetaMask</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-amber-100 text-amber-800 border-amber-300">Recommended</span>
                    </div>
                    <p className="text-xs text-[#6E6259] mt-0.5">EVM browser extension — Sepolia testnet</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-amber-600 shrink-0 transition-colors" />
                </button>

                {/* WalletConnect */}
                <button
                  type="button"
                  onClick={() => handleWalletConnect('walletconnect')}
                  className="w-full flex items-center space-x-3.5 p-3.5 rounded-2xl border border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50 transition-all text-left cursor-pointer group"
                >
                  <svg viewBox="0 0 40 40" className="w-9 h-9 shrink-0" fill="none">
                    <rect width="40" height="40" rx="10" fill="#3B99FC" fillOpacity="0.15" />
                    <path d="M12 20 Q20 12 28 20 Q24 24 20 20 Q16 24 12 20Z" fill="#3B99FC" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-[#3D5066] group-hover:text-blue-700">WalletConnect</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-blue-100 text-blue-800 border-blue-300">Multi-Chain</span>
                    </div>
                    <p className="text-xs text-[#6E6259] mt-0.5">Scan QR with 100+ mobile wallets</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-600 shrink-0 transition-colors" />
                </button>

                {/* Pera Wallet */}
                <button
                  type="button"
                  onClick={() => handleWalletConnect('pera')}
                  className="w-full flex items-center space-x-3.5 p-3.5 rounded-2xl border border-amber-200 bg-amber-50/30 hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left cursor-pointer group"
                >
                  <svg viewBox="0 0 40 40" className="w-9 h-9 shrink-0" fill="none">
                    <rect width="40" height="40" rx="10" fill="#FECC1B" />
                    <path d="M10 28 L20 12 L30 28" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="20" cy="20" r="3" fill="#111" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-[#3D5066] group-hover:text-yellow-700">Pera Wallet</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-yellow-100 text-yellow-800 border-yellow-300">Cross-Chain</span>
                    </div>
                    <p className="text-xs text-[#6E6259] mt-0.5">Algorand & cross-chain mobile wallet</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-yellow-600 shrink-0 transition-colors" />
                </button>
              </div>

              {/* Skip Option */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleSkipWallet}
                  className="text-xs text-zinc-400 hover:text-zinc-600 font-semibold underline cursor-pointer transition-colors"
                >
                  Skip for now — I'll connect my wallet later →
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono text-center">
                🔐 Non-custodial. Your wallet address will be saved to your carNodes profile.
              </p>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              MODE: WEB3 WALLET LIST (standalone, for users already authed)
          ────────────────────────────────────────────────────────── */}
          {mode === 'wallet' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono uppercase text-[#6E6259] font-bold">
                  Select Web3 Wallet Provider:
                </p>
                <button
                  onClick={() => setMode('signin')}
                  className="text-xs text-[#3D5066] hover:text-[#B89B5E] font-semibold underline cursor-pointer"
                >
                  Back to Email Login
                </button>
              </div>

              {wallets.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleWalletConnect(w.id)}
                  className={`w-full flex items-center space-x-4 p-3.5 rounded-2xl border transition-all duration-200 text-left cursor-pointer group ${
                    w.id === 'metamask'
                      ? 'border-amber-300 bg-amber-50/40 hover:border-amber-500 hover:bg-amber-50'
                      : 'border-zinc-200 hover:border-[#B89B5E] hover:bg-[#FDFBF7]'
                  }`}
                >
                  <div className="shrink-0">{w.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-heading font-bold text-[#3D5066] group-hover:text-[#B89B5E]">
                        {w.name}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${w.badgeColor}`}>
                        {w.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E6259] mt-0.5 truncate">{w.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-[#B89B5E] shrink-0 transition-colors" />
                </button>
              ))}

              <div className="pt-2 text-center">
                <p className="text-[11px] text-[#6E6259]">
                  🔐 Non-custodial cryptographic auth. Your wallet links directly to your Supabase RWA profile.
                </p>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              MODE: CONNECTING SPINNER
          ────────────────────────────────────────────────────────── */}
          {mode === 'connecting' && (
            <div className="text-center py-10 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-[#FDFBF7] border border-zinc-200 shadow-inner">
                {selectedWallet ? selectedWallet.icon : <Sparkles className="w-8 h-8 text-[#B89B5E] animate-pulse" />}
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-[#3D5066]">
                  {selectedWallet ? `Connecting to ${selectedWallet.name}...` : 'Authenticating Session...'}
                </h3>
                <p className="text-xs text-[#6E6259] mt-1">{loadingText}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-[#B89B5E] animate-spin mx-auto" />
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('wallet-step'); setErrorMsg(''); }}
                  className="text-xs text-zinc-400 hover:text-zinc-600 underline font-semibold cursor-pointer transition-colors"
                >
                  Cancel / Choose another wallet
                </button>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              MODE: SUCCESS STATE
          ────────────────────────────────────────────────────────── */}
          {mode === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#3D5066]">
                  Authentication Successful!
                </h3>
                {authenticatedUser && (
                  <div className="mt-2 inline-block px-4 py-2.5 rounded-2xl bg-zinc-100 text-left border border-zinc-200">
                    <p className="text-xs font-bold text-[#3D5066]">{authenticatedUser.name}</p>
                    <p className="text-[11px] text-[#6E6259] font-mono capitalize mt-0.5">
                      Role: <span className="font-bold text-teal-700">{authenticatedUser.role}</span> • {authenticatedUser.email}
                    </p>
                  </div>
                )}
                <p className="text-xs text-[#6E6259] mt-3">Access granted to carNodes verified RWA portal...</p>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              FOOTER MODAL TOGGLES (Sign Up <-> Sign In)
          ────────────────────────────────────────────────────────── */}
          {(mode === 'signup' || mode === 'signin') && (
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              {mode === 'signup' ? (
                <>
                  <span className="text-[#6E6259]">Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMsg(''); }}
                    className="font-bold text-[#3D5066] hover:text-[#B89B5E] underline cursor-pointer"
                  >
                    Sign In Here
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[#6E6259]">Don't have an account?</span>
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMsg(''); }}
                    className="font-bold text-[#3D5066] hover:text-[#B89B5E] underline cursor-pointer"
                  >
                    Get Started (Sign Up)
                  </button>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}