import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { SwissButton } from '../components/ui/SwissButton';
import { shortAddress } from '../utils/format';
import { Wallet, Shield, Check, ArrowRight, ExternalLink } from 'lucide-react';

export default function ConnectWallet() {
  const { account, isConnected, connect, connecting, chainId, isSepolia, switchToSepolia } = useWallet();
  const navigate = useNavigate();

  return (
    <div className="bg-swiss-white min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 swiss-noise">
      <div className="max-w-xl w-full border-4 border-swiss-black bg-swiss-white p-8 sm:p-12 relative shadow-2xl">
        {/* Geometric Accent Block */}
        <div className="w-12 h-12 bg-swiss-accent absolute -top-3 -left-3" />

        <div className="text-center mb-8">
          <SectionLabel number="12" label="WEB3 AUTHENTICATION GATEWAY" className="justify-center mb-3" />
          <SwissHeading level={1} className="text-4xl sm:text-5xl mb-4">
            Connect <span className="text-swiss-accent">Wallet</span>
          </SwissHeading>
          <p className="text-xs sm:text-sm text-swiss-black/70 max-w-md mx-auto leading-relaxed">
            Access the carNodes Decentralized Vehicle Registry. Sign cryptographic transactions, hold digital title NFTs, and execute atomic escrow settlements.
          </p>
        </div>

        {isConnected ? (
          <div className="border-2 border-swiss-black p-6 bg-swiss-muted flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-swiss-black/50">Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-swiss-black">
                <Check className="w-4 h-4 text-swiss-accent" /> Connected
              </span>
            </div>

            <div className="p-4 bg-swiss-white border border-swiss-black/20 font-mono text-xs">
              <div className="text-swiss-black/50 text-[10px] uppercase mb-1">Active Account</div>
              <div className="font-bold text-swiss-black break-all">{account}</div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-swiss-black/60">Target Network:</span>
              <span className="font-bold text-swiss-black">
                {isSepolia ? 'Sepolia Testnet (11155111) ✓' : `Chain ID: ${chainId} (Switch Required)`}
              </span>
            </div>

            {!isSepolia && (
              <SwissButton variant="accent" size="sm" onClick={switchToSepolia}>
                Switch to Ethereum Sepolia
              </SwissButton>
            )}

            <div className="pt-2">
              <SwissButton variant="primary" size="full" onClick={() => navigate('/marketplace')}>
                Enter Marketplace <ArrowRight className="inline w-4 h-4 ml-2" />
              </SwissButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Feature checklist */}
            <div className="border-2 border-swiss-black p-4 bg-swiss-muted divide-y divide-swiss-black/15 font-mono text-xs">
              <div className="py-2.5 flex items-center gap-3">
                <Shield className="w-4 h-4 text-swiss-accent flex-shrink-0" />
                <span className="font-sans font-bold text-swiss-black">ERC-721 Immutable Vehicle Passports</span>
              </div>
              <div className="py-2.5 flex items-center gap-3">
                <Shield className="w-4 h-4 text-swiss-accent flex-shrink-0" />
                <span className="font-sans font-bold text-swiss-black">Atomic Smart Contract Escrow Lock</span>
              </div>
              <div className="py-2.5 flex items-center gap-3">
                <Shield className="w-4 h-4 text-swiss-accent flex-shrink-0" />
                <span className="font-sans font-bold text-swiss-black">RTO Cryptographic Title Attestation</span>
              </div>
            </div>

            <SwissButton
              variant="accent"
              size="lg"
              loading={connecting}
              onClick={connect}
              className="w-full"
            >
              <Wallet className="inline w-5 h-5 mr-2" />
              Connect MetaMask Wallet
            </SwissButton>

            <div className="text-center">
              <span className="text-[11px] text-swiss-black/50">
                Requires MetaMask browser extension installed on Ethereum Sepolia testnet.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
