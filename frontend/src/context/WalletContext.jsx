import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  requestAccounts,
  getAccounts,
  getChainId,
  switchToSepolia,
} from '../utils/ethers';
import { SEPOLIA_CHAIN_ID } from '../contracts/addresses';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isConnected = Boolean(account);
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  // Initialize on load — restore existing connection
  useEffect(() => {
    async function restore() {
      const accounts = await getAccounts();
      if (accounts.length > 0) {
        await initWallet(accounts[0]);
      }
    }
    restore();
  }, []);

  // Listen for wallet events
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (hexChainId) => {
      setChainId(parseInt(hexChainId, 16));
      window.location.reload(); // ethers.js recommends reload on chain change
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  async function initWallet(addr) {
    const prov = new ethers.BrowserProvider(window.ethereum);
    const sign = await prov.getSigner();
    const cId = await getChainId();
    setProvider(prov);
    setSigner(sign);
    setAccount(addr);
    setChainId(cId);
  }

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install it to use carNodes.');
      }
      const accounts = await requestAccounts();
      await initWallet(accounts[0]);
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setChainId(null);
  }, []);

  const ensureSepolia = useCallback(async () => {
    if (chainId !== SEPOLIA_CHAIN_ID) {
      await switchToSepolia();
    }
  }, [chainId]);

  return (
    <WalletContext.Provider value={{
      account,
      chainId,
      provider,
      signer,
      isConnected,
      isCorrectNetwork,
      connecting,
      error,
      connect,
      disconnect,
      ensureSepolia,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
