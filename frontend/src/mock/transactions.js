// Mock escrow and transaction history
// TODO: Replace with GET /api/escrow/:id and blockchain event indexing

export const MOCK_ESCROWS = [
  {
    escrowId: '1',
    vehicleId: '1',
    buyer: '0xaB1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c',
    seller: '0x742d35Cc6634C0532925a3b8D4C9b8B4C3d5e2f1',
    amount: '850000000000000000000000',
    state: 3, // Authority Approved
    createdAt: 1724100000,
    fundedAt: 1724103600,
    transferRequestedAt: 1724107200,
    authorityApprovedAt: 1724110800,
    txHashes: {
      created: '0x1234abcd5678efgh9012ijkl3456mnop7890qrst1234uvwx5678yzab9012cdef',
      funded: '0xabcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef9012',
      transferRequested: '0xefgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef9012abcd1234',
      authorityApproved: '0xijkl9012mnop3456qrst7890uvwx1234yzab5678cdef9012abcd1234efgh5678',
    },
  },
];

export const MOCK_TRANSACTIONS = [
  {
    txHash: '0xabc123def456789012345678901234567890abcdef1234567890abcdef123456',
    blockNumber: 6789012,
    timestamp: 1720000000,
    event: 'VehicleRegistered',
    vehicleId: '1',
    from: '0x0000000000000000000000000000000000000000',
    to: '0x742d35Cc6634C0532925a3b8D4C9b8B4C3d5e2f1',
    description: 'Vehicle Passport Created — Maruti Suzuki Swift VXI',
  },
  {
    txHash: '0xdef456abc123789012345678901234567890abcdef1234567890abcdef654321',
    blockNumber: 6789100,
    timestamp: 1720001000,
    event: 'VehicleVerified',
    vehicleId: '1',
    from: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    to: null,
    description: 'Authority Verified — RTO Karnataka',
  },
  {
    txHash: '0x1234abcd5678efgh9012ijkl3456mnop7890qrst1234uvwx5678yzab9012cdef',
    blockNumber: 6800000,
    timestamp: 1724100000,
    event: 'EscrowCreated',
    vehicleId: '1',
    from: '0xaB1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c',
    to: null,
    description: 'Escrow Created — Purchase initiated',
  },
  {
    txHash: '0xabcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef9012',
    blockNumber: 6800100,
    timestamp: 1724103600,
    event: 'EscrowFunded',
    vehicleId: '1',
    from: '0xaB1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c',
    to: null,
    description: 'Escrow Funded — ₹8,50,000 MockINR locked',
  },
  {
    txHash: '0xijkl9012mnop3456qrst7890uvwx1234yzab5678cdef9012abcd1234efgh5678',
    blockNumber: 6800500,
    timestamp: 1724110800,
    event: 'OwnershipTransferRequested',
    vehicleId: '1',
    from: '0x742d35Cc6634C0532925a3b8D4C9b8B4C3d5e2f1',
    to: '0xaB1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c',
    description: 'Ownership Transfer Requested — Awaiting Authority',
  },
];

export function getEscrowById(id) {
  return MOCK_ESCROWS.find(e => e.escrowId === String(id));
}
