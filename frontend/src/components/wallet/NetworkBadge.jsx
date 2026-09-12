import { AlertTriangle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export function NetworkBadge() {
  const { chainId, isCorrectNetwork, ensureSepolia } = useWallet();

  if (isCorrectNetwork) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-swiss-black bg-swiss-black text-swiss-white text-xs font-bold uppercase tracking-widest">
        <span className="w-1.5 h-1.5 bg-swiss-white" />
        Sepolia
      </span>
    );
  }

  return (
    <button
      onClick={ensureSepolia}
      title="Click to switch to Sepolia"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-swiss-accent bg-swiss-accent text-swiss-white text-xs font-bold uppercase tracking-widest hover:bg-swiss-black hover:border-swiss-black transition-all duration-150"
    >
      <AlertTriangle className="w-3 h-3" />
      Wrong Network
    </button>
  );
}
