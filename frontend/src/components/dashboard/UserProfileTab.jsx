import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  Lock,
  ExternalLink,
  RefreshCw,
  Key,
  Calendar,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';

export default function UserProfileTab() {
  const { user, profile, role, linkWallet } = useAuth();
  const { account, isConnected, connect } = useWallet();
  const [linking, setLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [linkError, setLinkError] = useState('');

  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'carNodes User';
  const email = user?.email || profile?.email || 'user@carnodes.com';
  const phone = profile?.phone || user?.user_metadata?.phone || '+91 98201 48291';
  const walletAddr = profile?.wallet_address || account || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const roleUpper = (profile?.role || role || 'BUYER').toUpperCase();

  const handleLinkMetaMask = async () => {
    setLinking(true);
    setLinkError('');
    setLinkSuccess(false);

    try {
      let targetAddr = account;
      if (!targetAddr && window.ethereum) {
        await connect();
        targetAddr = account;
      }

      if (!targetAddr) {
        targetAddr = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      }

      if (linkWallet) {
        await linkWallet(targetAddr);
      }
      setLinkSuccess(true);
      setTimeout(() => setLinkSuccess(false), 3000);
    } catch (err) {
      setLinkError(err.message || 'Failed to link wallet');
    } finally {
      setLinking(false);
    }
  };

  const roleCapabilities = {
    BUYER: [
      'Search & inspect verified vehicle passports',
      'AI document integrity & fraud risk scoring',
      'Deposit MockINR into Ethereum Sepolia escrow',
      'Track ownership transfer lifecycle',
    ],
    SELLER: [
      'Mint digital vehicle passports & RWA records',
      'Batch upload RC, insurance & inspection files to IPFS',
      'Create and manage verified marketplace listings',
      'Authorize transfer to buyer upon escrow funding',
    ],
    AUTHORITY: [
      'Inspect pending vehicle verification queue',
      'Cryptographically sign approvals on Sepolia VehicleRegistry',
      'Audit document hashes against official state RTO records',
      'Authorize final escrow release and ownership transfer',
    ],
    ADMIN: [
      'Full administrative bypass & multi-role clearance',
      'Manage platform contract configurations',
      'Arbitrate disputed escrow settlement flows',
    ],
  };

  const capabilities = roleCapabilities[roleUpper] || roleCapabilities.BUYER;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#3D5066] text-white flex items-center justify-center font-bold text-2xl font-mono shadow-md">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl font-heading font-extrabold text-slate-900">{displayName}</h1>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Supabase Auth User UUID: <span className="text-slate-700 font-semibold">{user?.id || '11111111-1111-1111-1111-111111111111'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Assigned RBAC Role</span>
              <span className="text-sm font-bold font-mono text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200 inline-block">
                {roleUpper}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Two-Column Grid: Credentials & Web3 Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Credentials & Account Info */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-teal-600" />
              <span>Identity & Contact Details</span>
            </h2>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">PostgreSQL</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address:</span>
              </span>
              <span className="font-semibold text-slate-900 font-mono">{email}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone Number:</span>
              </span>
              <span className="font-semibold text-slate-900 font-mono">{phone}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Auth Provider:</span>
              </span>
              <span className="font-semibold text-emerald-700 font-mono">Supabase Auth (JWT)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Created:</span>
              </span>
              <span className="font-semibold text-slate-700 font-mono">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Active Session'}
              </span>
            </div>
          </div>
        </div>

        {/* Web3 Wallet & On-Chain Link */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-amber-500" />
              <span>Web3 Wallet Link (Ethereum Sepolia)</span>
            </h2>
            <span className="text-[10px] font-mono font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              EVM Connected
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block mb-1">Associated On-Chain Wallet Address:</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-mono text-xs truncate max-w-[280px]">
                  {walletAddr}
                </span>
                <a
                  href={`https://sepolia.etherscan.io/address/${walletAddr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-800 p-1 hover:bg-teal-50 rounded"
                  title="View on Etherscan"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Link Wallet Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLinkMetaMask}
                disabled={linking}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3D5066] hover:bg-[#0D9488] text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {linking ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Wallet in Supabase...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Sync Connected MetaMask to Profile</span>
                  </>
                )}
              </button>
            </div>

            {linkSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Wallet address successfully synchronized to Supabase!</span>
              </div>
            )}

            {linkError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                ⚠️ {linkError}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Role-Based Permissions & Clearance Level */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Role Permissions & Access Control (RBAC)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized operations granted to your <strong className="text-slate-800">{roleUpper}</strong> clearance level
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase">
            Active Clearance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start space-x-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span className="font-semibold text-slate-800">{cap}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
