// Deployed contract addresses on Ethereum Sepolia
// Verified Contracts
export const CONTRACT_ADDRESSES = {
  VehiclePassport: import.meta.env.VITE_PASSPORT_CONTRACT_ADDRESS || '0xec5b401ECe64d130B6Cc83c4916137990009Eaf5',
  VehicleRegistry: import.meta.env.VITE_REGISTRY_CONTRACT_ADDRESS || '0xD585f8daDdB3F438aCE2A5b4e86f47e11825fF30',
  VehicleEscrow:   import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS   || '0xB9d64e71bc01C8b09F19fF258dE21E0ebDb78EE2',
  MockINR:         import.meta.env.VITE_MOCKINR_CONTRACT_ADDRESS  || '0x1aE2E1190f4e026f125111fA80882cCFE50EEC1C',
};

export const SEPOLIA_CHAIN_ID = 11155111;
export const ETHERSCAN_BASE = 'https://sepolia.etherscan.io';

