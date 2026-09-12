const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const db = require('../db');

/**
 * Load deployed smart contract addresses from deployedAddresses.json or env
 */
function getDeployedAddresses() {
  const possiblePaths = [
    path.join(__dirname, '..', '..', '..', 'blockchain', 'deployedAddresses.json'),
    path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'contracts', 'deployedAddresses.json')
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data;
      } catch (err) {
        // Fall back to next check
      }
    }
  }

  return {
    deployer: process.env.DEPLOYER_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    contracts: {
      VehiclePassport: process.env.VEHICLE_PASSPORT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      VehicleRegistry: process.env.VEHICLE_REGISTRY_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      VehicleEscrow: process.env.VEHICLE_ESCROW_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      MockINR: process.env.MOCK_INR_ADDRESS || '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
    },
    deployedAt: new Date().toISOString()
  };
}

/**
 * Check blockchain RPC connection and network status
 */
async function getNetworkInfo() {
  const rpcUrl = process.env.RPC_URL || process.env.SEPOLIA_RPC_URL || 'http://127.0.0.1:8545';
  const deploymentInfo = getDeployedAddresses();

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, { staticNetwork: true });
    const network = await Promise.race([
      provider.getNetwork(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('RPC Timeout')), 2000))
    ]);

    return {
      connected: true,
      rpcUrl,
      chainId: network.chainId.toString(),
      networkName: network.name,
      contracts: deploymentInfo.contracts,
      deployer: deploymentInfo.deployer
    };
  } catch (error) {
    return {
      connected: false,
      rpcUrl,
      error: error.message,
      contracts: deploymentInfo.contracts,
      deployer: deploymentInfo.deployer,
      note: 'Contracts are compiled & deployed. Simulated sync mode active.'
    };
  }
}

/**
 * Sync vehicle blockchain metadata (token ID, tx hash, IPFS CID) in database
 */
async function syncVehicleOnChain(vehicleId, { txHash, tokenId, ipfsCid }) {
  const query = `
    UPDATE vehicles
    SET 
      blockchain_tx_hash = COALESCE($1, blockchain_tx_hash),
      blockchain_token_id = COALESCE($2, blockchain_token_id),
      passport_ipfs_cid = COALESCE($3, passport_ipfs_cid),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
  `;

  const result = await db.query(query, [
    txHash || null,
    tokenId ? tokenId.toString() : null,
    ipfsCid || null,
    vehicleId
  ]);

  return result.rows[0];
}

module.exports = {
  getDeployedAddresses,
  getNetworkInfo,
  syncVehicleOnChain
};
