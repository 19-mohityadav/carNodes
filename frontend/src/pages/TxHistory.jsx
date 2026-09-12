import { useState } from 'react';
import { MOCK_TRANSACTIONS } from '../mock/transactions';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { shortAddress, formatDate, formatDateTime, etherscanTx } from '../utils/format';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import { ExternalLink, Filter, Search } from 'lucide-react';

export default function TxHistory() {
  const [filterEvent, setFilterEvent] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const EVENT_TYPES = ['ALL', 'VehicleRegistered', 'VehicleVerified', 'EscrowCreated', 'EscrowFunded', 'OwnershipTransferRequested'];

  const filtered = MOCK_TRANSACTIONS.filter(tx => {
    const matchesEvent = filterEvent === 'ALL' || tx.event === filterEvent;
    const matchesSearch =
      !searchQuery ||
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.from && tx.from.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesEvent && matchesSearch;
  });

  return (
    <div className="bg-swiss-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b-2 border-swiss-black pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <SectionLabel number="11" label="ETHEREUM SEPOLIA BLOCKCHAIN AUDIT" className="mb-2" />
            <SwissHeading level={1} className="text-4xl sm:text-5xl">
              Transaction <span className="text-swiss-accent">Ledger</span>
            </SwissHeading>
            <p className="mt-2 text-sm text-swiss-black/70 font-medium">
              Verifiable log of all smart contract state transitions, token mints, and escrow settlements.
            </p>
          </div>

          <div className="border-2 border-swiss-black p-4 bg-swiss-muted font-mono text-xs">
            <span className="text-swiss-black/50 block text-[10px] uppercase">Active Network</span>
            <span className="font-bold text-swiss-black">Ethereum Sepolia (Chain ID 11155111)</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="border-2 border-swiss-black mb-8 p-4 bg-swiss-muted flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Event Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {EVENT_TYPES.map(evt => (
              <button
                key={evt}
                onClick={() => setFilterEvent(evt)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  filterEvent === evt
                    ? 'bg-swiss-black text-swiss-white'
                    : 'bg-swiss-white text-swiss-black hover:bg-swiss-black hover:text-swiss-white border border-swiss-black'
                }`}
              >
                {evt === 'ALL' ? 'All Events' : evt}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hash or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 border-2 border-swiss-black bg-swiss-white text-xs font-mono outline-none focus:border-swiss-accent"
              />
              <Search className="w-3.5 h-3.5 text-swiss-black/40 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="border-2 border-swiss-black overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-swiss-black bg-swiss-black text-swiss-white text-[10px] uppercase tracking-widest">
                <th className="p-4">Tx Hash</th>
                <th className="p-4">Block</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Description</th>
                <th className="p-4">Initiator / From</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Etherscan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-swiss-black/15 bg-swiss-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-swiss-black/50 font-sans uppercase font-bold text-xs">
                    No transactions matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx, idx) => (
                  <tr
                    key={tx.txHash + idx}
                    className="hover:bg-swiss-muted transition-colors"
                  >
                    <td className="p-4 font-bold text-swiss-black break-all">
                      {shortAddress(tx.txHash)}
                    </td>
                    <td className="p-4 text-swiss-black/60">
                      #{tx.blockNumber}
                    </td>
                    <td className="p-4 font-sans font-bold">
                      <span className={`px-2 py-1 text-[11px] uppercase tracking-wider ${
                        tx.event === 'VehicleVerified' ? 'bg-swiss-black text-swiss-white' :
                        tx.event === 'EscrowFunded' ? 'bg-swiss-accent text-swiss-white' :
                        'bg-swiss-muted border border-swiss-black text-swiss-black'
                      }`}>
                        {tx.event}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-swiss-black font-medium">
                      {tx.description}
                    </td>
                    <td className="p-4 text-swiss-black/70 break-all">
                      {tx.from ? shortAddress(tx.from) : '—'}
                    </td>
                    <td className="p-4 text-swiss-black/50 text-[11px]">
                      {formatDateTime(tx.timestamp)}
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={etherscanTx(tx.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-swiss-accent hover:underline font-sans font-bold uppercase text-[11px]"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
