import { ETHERSCAN_BASE } from '../contracts/addresses';

/**
 * Shortens an Ethereum address: 0x1234...abcd
 */
export function shortAddress(addr, chars = 4) {
  if (!addr) return '';
  return `${addr.slice(0, chars + 2)}...${addr.slice(-chars)}`;
}

/**
 * Formats a Unix timestamp (seconds) to a human-readable date string.
 */
export function formatDate(timestamp) {
  if (!timestamp) return '—';
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a Unix timestamp to date + time string.
 */
export function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  return new Date(Number(timestamp) * 1000).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Converts wei (BigInt) to a formatted INR string.
 * MockINR has 18 decimals like ETH.
 * e.g. 1000000000000000000n → "₹1.00"
 */
export function weiToINR(wei) {
  if (wei == null) return '₹0';
  const val = Number(BigInt(wei)) / 1e18;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val);
}

/**
 * Returns an Etherscan URL for a transaction hash.
 */
export function etherscanTx(hash) {
  return `${ETHERSCAN_BASE}/tx/${hash}`;
}

/**
 * Returns an Etherscan URL for an address.
 */
export function etherscanAddr(addr) {
  return `${ETHERSCAN_BASE}/address/${addr}`;
}

/**
 * Maps an escrow state integer to a human-readable label.
 */
export const ESCROW_STATES = {
  0: 'Created',
  1: 'Funded',
  2: 'Transfer Requested',
  3: 'Authority Approved',
  4: 'Completed',
  5: 'Funds Released',
  6: 'Refunded',
};

export function escrowStateLabel(state) {
  return ESCROW_STATES[Number(state)] ?? 'Unknown';
}

/**
 * Maps a risk score (0–100) to a risk label.
 */
export function riskLabel(score) {
  const s = Number(score);
  if (s <= 20) return { label: 'LOW RISK', color: 'text-black' };
  if (s <= 50) return { label: 'MODERATE', color: 'text-swiss-accent' };
  return { label: 'HIGH RISK', color: 'text-swiss-accent' };
}

/**
 * Truncates an IPFS CID for display.
 */
export function shortCID(cid, chars = 6) {
  if (!cid) return '—';
  return `${cid.slice(0, chars)}...${cid.slice(-chars)}`;
}
