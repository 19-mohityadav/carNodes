import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import {
  VehiclePassportABI,
  VehicleRegistryABI,
  VehicleEscrowABI,
  MockINRABI,
} from '../contracts/abis';

/**
 * Returns contract instances with a given provider or signer.
 * Pass a Signer for write operations; Provider for read-only.
 */
export function getContracts(signerOrProvider) {
  return {
    passport: new ethers.Contract(
      CONTRACT_ADDRESSES.VehiclePassport,
      VehiclePassportABI,
      signerOrProvider
    ),
    registry: new ethers.Contract(
      CONTRACT_ADDRESSES.VehicleRegistry,
      VehicleRegistryABI,
      signerOrProvider
    ),
    escrow: new ethers.Contract(
      CONTRACT_ADDRESSES.VehicleEscrow,
      VehicleEscrowABI,
      signerOrProvider
    ),
    mockINR: new ethers.Contract(
      CONTRACT_ADDRESSES.MockINR,
      MockINRABI,
      signerOrProvider
    ),
  };
}
