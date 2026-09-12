import { ethers } from 'ethers';
import { SEPOLIA_CHAIN_ID } from '../contracts/addresses';

/**
 * Returns a read-only provider using the injected wallet or Alchemy fallback.
 * TODO: Replace ALCHEMY_KEY with your Alchemy Sepolia RPC URL via VITE_ALCHEMY_URL
 */
export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  // Fallback to public RPC — for demo read-only access
  const rpcUrl = import.meta.env.VITE_ALCHEMY_URL || 'https://rpc.sepolia.org';
  return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Returns a wallet signer from the injected browser wallet.
 * Throws if MetaMask is not available.
 */
export async function getSigner() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install it to use carNodes.');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.getSigner();
}

/**
 * Requests account access from the browser wallet.
 * Returns the first account address.
 */
export async function requestAccounts() {
  if (!window.ethereum) throw new Error('MetaMask not found');
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return accounts;
}

/**
 * Returns current connected accounts without prompting.
 */
export async function getAccounts() {
  if (!window.ethereum) return [];
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts;
}

/**
 * Returns the current chain ID as a number.
 */
export async function getChainId() {
  if (!window.ethereum) return null;
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  return parseInt(chainId, 16);
}

/**
 * Prompts the user to switch to Sepolia testnet.
 */
export async function switchToSepolia() {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
  });
}
