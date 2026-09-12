import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function ConnectWalletModal({ isOpen, onClose, walletConnected, walletAddress, onConnect, onDisconnect }) {
  if (!isOpen) return null;

  const [connectingProvider, setConnectingProvider] = useState(null);

  const providers = [
    {
      id: 'metamask',
      name: 'MetaMask Wallet',
      desc: 'Connect using MetaMask Ethereum & EVM browser extension',
      badge: 'Popular',
      icon: (
        <svg viewBox="0 0 40 40" className="w-6 h-6 shrink-0" fill="none">
          <path d="M30.6 11.2L20.8 17.9L22.5 10.3L30.6 11.2Z" fill="#E4761B"/>
          <path d="M9.4 11.2L17.5 10.3L19.2 17.9L9.4 11.2Z" fill="#E4761B"/>
          <path d="M27.2 25.1L24.8 28.8L30 30.2L31.4 25.2L27.2 25.1Z" fill="#E4761B"/>
          <path d="M8.6 25.2L10 30.2L15.2 28.8L12.8 25.1L8.6 25.2Z" fill="#E4761B"/>
          <path d="M14.6 18.2L13.2 20.3L18.4 20.5L18.6 14.8L14.6 18.2Z" fill="#E4761B"/>
          <path d="M25.4 18.2L21.4 14.8L21.6 20.5L26.8 20.3L25.4 18.2Z" fill="#E4761B"/>
          <path d="M15.2 28.8L18.4 27.2L15.8 25.2L15.2 28.8Z" fill="#D7C1B3"/>
          <path d="M24.8 28.8L24.2 25.2L21.6 27.2L24.8 28.8Z" fill="#D7C1B3"/>
          <path d="M21.6 27.2L24.2 25.2L25.4 21.6L21.5 21.7L21.6 27.2Z" fill="#233447"/>
          <path d="M18.4 27.2L18.5 21.7L14.6 21.6L15.8 25.2L18.4 27.2Z" fill="#233447"/>
          <path d="M9.4 11.2L12.8 17.8L14.6 18.2L18.6 14.8L17.5 10.3L9.4 11.2Z" fill="#E4761B"/>
          <path d="M30.6 11.2L22.5 10.3L21.4 14.8L25.4 18.2L27.2 17.8L30.6 11.2Z" fill="#E4761B"/>
          <path d="M18.4 20.5L13.2 20.3L12.8 25.1L14.6 21.6L18.4 20.5Z" fill="#CD6116"/>
          <path d="M21.6 20.5L25.4 21.6L27.2 25.1L26.8 20.3L21.6 20.5Z" fill="#CD6116"/>
        </svg>
      )
    },
    { id: 'pera', name: 'Pera Wallet', desc: 'Official Algorand Mobile & Web Wallet', badge: 'Algorand' },
    { id: 'walletconnect', name: 'WalletConnect', desc: 'Connect via QR code or mobile app', badge: 'Multi-Chain' },
    { id: 'demo', name: 'Demo Testnet Wallet', desc: 'Simulated wallet with test ALGO tokens', badge: 'Instant Test' },
  ];

  const handleSelectProvider = (provId) => {
    setConnectingProvider(provId);
    setTimeout(() => {
      onConnect(provId);
      setConnectingProvider(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FDFBF7] w-full max-w-md rounded-3xl border border-zinc-300 shadow-2xl p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6E6259] hover:text-[#111111] p-1 rounded-lg hover:bg-zinc-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#2B2521] text-white flex items-center justify-center">
            <Wallet className="w-5 h-5 text-[#FF3B30]" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-extrabold uppercase text-[#111111]">
              {walletConnected ? 'Wallet Connected' : 'Connect Web3 Wallet'}
            </h3>
            <span className="text-xs font-mono text-[#6E6259]">Algorand MainNet & RWA Escrow</span>
          </div>
        </div>

        {walletConnected ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs space-y-2 font-mono">
              <div className="flex justify-between items-center text-emerald-800">
                <span className="font-bold">Connected Address:</span>
                <span className="bg-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Active</span>
              </div>
              <div className="text-sm font-bold text-emerald-950 break-all bg-white p-2.5 rounded border border-emerald-200">
                {walletAddress}
              </div>
              <div className="flex justify-between text-zinc-600 pt-1">
                <span>Balance:</span>
                <strong className="text-[#2B2521]">24,250.00 ALGO ($48,500 USDC)</strong>
              </div>
            </div>

            <button
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-mono text-xs uppercase font-bold transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#6E6259] leading-relaxed">
              Connect your Web3 wallet to verify vehicle ownership, sign smart contract escrows, and mint RWA tokens on Algorand.
            </p>

            {providers.map((prov) => (
              <button
                key={prov.id}
                onClick={() => handleSelectProvider(prov.id)}
                disabled={connectingProvider !== null}
                className="w-full p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-[#FF3B30] transition-all flex items-center justify-between text-left group hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-heading font-bold text-[#111111] group-hover:text-[#FF3B30]">
                      {prov.name}
                    </span>
                    <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                      {prov.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6E6259] mt-0.5 block">{prov.desc}</span>
                </div>

                {connectingProvider === prov.id ? (
                  <RefreshCw className="w-5 h-5 text-[#FF3B30] animate-spin" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-zinc-400 group-hover:text-[#FF3B30]" />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-200 text-[11px] font-mono text-[#6E6259] text-center">
          Protected by Algorand Non-Custodial Smart Contract Protocols
        </div>

      </div>
    </div>
  );
}
