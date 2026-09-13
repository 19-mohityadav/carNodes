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
    createdAt: 1726153460,
    fundedAt: 1726153470,
    transferRequestedAt: 1726154000,
    authorityApprovedAt: 1726154500,
    txHashes: {
      created: '0x09760f48966526993460f3df7addbfecd2cd4f1e79b10323d2f80d9d72fa3a3f',
      funded: '0x39c21cf43d3fdf76be67450d22d68231470fc8992e50cd29770c81e377b5d4e9',
      transferRequested: '0xfbacc09881921593275848174ecaa91282f0a4893fa2f50ce18a572aba46a5fd',
      authorityApproved: '0x5d7af784023ab5a42548ecfba2bbb97e81e75caedeec8b5703810b9b1d2b4eb7',
    },
  },
];

export const MOCK_TRANSACTIONS = [
  {
    txHash: '0xa49effb9e3b3fac0478b7ea82bed5ce9d9e2c560aa491e1d69e8dccf34640dde',
    blockNumber: 11689658,
    timestamp: 1726153431,
    event: 'VehiclePassportDeployed',
    vehicleId: '1',
    from: '0xAeA9091619a754FC458fb3530628C036051C3f30',
    to: '0xec5b401ECe64d130B6Cc83c4916137990009Eaf5',
    description: 'Vehicle Passport Created — Maruti Suzuki Swift VXI',
  },
  {
    txHash: '0x5d7af784023ab5a42548ecfba2bbb97e81e75caedeec8b5703810b9b1d2b4eb7',
    blockNumber: 11690191,
    timestamp: 1726154500,
    event: 'VehicleVerified',
    vehicleId: '1',
    from: '0xAeA9091619a754FC458fb3530628C036051C3f30',
    to: '0xD585f8daDdB3F438aCE2A5b4e86f47e11825fF30',
    description: 'Authority Verified — RTO National Registry',
  },
  {
    txHash: '0x09760f48966526993460f3df7addbfecd2cd4f1e79b10323d2f80d9d72fa3a3f',
    blockNumber: 11689660,
    timestamp: 1726153460,
    event: 'EscrowCreated',
    vehicleId: '1',
    from: '0xAeA9091619a754FC458fb3530628C036051C3f30',
    to: '0xB9d64e71bc01C8b09F19fF258dE21E0ebDb78EE2',
    description: 'Escrow Created — Purchase initiated',
  },
  {
    txHash: '0x39c21cf43d3fdf76be67450d22d68231470fc8992e50cd29770c81e377b5d4e9',
    blockNumber: 11689664,
    timestamp: 1726153470,
    event: 'EscrowFunded',
    vehicleId: '1',
    from: '0xAeA9091619a754FC458fb3530628C036051C3f30',
    to: '0x1aE2E1190f4e026f125111fA80882cCFE50EEC1C',
    description: 'Escrow Funded — ₹8,50,000 MockINR locked',
  },
  {
    txHash: '0x226d2025b0e5c1dd9faa34afc04d7fadcd915b4b25e154060345f0741e1296b3',
    blockNumber: 11689662,
    timestamp: 1726153450,
    event: 'OwnershipTransferRequested',
    vehicleId: '1',
    from: '0xAeA9091619a754FC458fb3530628C036051C3f30',
    to: '0xec5b401ECe64d130B6Cc83c4916137990009Eaf5',
    description: 'Ownership Transfer Requested — Awaiting Authority',
  },
];

export function getEscrowById(id) {
  return MOCK_ESCROWS.find(e => e.escrowId === String(id));
}
