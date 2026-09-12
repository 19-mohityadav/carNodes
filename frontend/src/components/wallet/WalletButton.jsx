import { useWallet } from '../../context/WalletContext';
import { shortAddress } from '../../utils/format';
import { Wallet } from 'lucide-react';
import { SwissButton } from '../ui/SwissButton';

export function WalletButton({ size = 'md', className = '' }) {
  const { account, isConnected, connect, disconnect, connecting } = useWallet();

  if (isConnected) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="font-mono text-sm font-bold px-4 py-2 border-2 border-swiss-black bg-swiss-muted flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          {shortAddress(account)}
        </div>
        <button
          onClick={disconnect}
          className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 hover:text-swiss-accent transition-colors duration-150"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <SwissButton
      onClick={connect}
      loading={connecting}
      size={size}
      className={className}
    >
      <Wallet className="inline w-4 h-4 mr-2" />
      Connect Wallet
    </SwissButton>
  );
}
