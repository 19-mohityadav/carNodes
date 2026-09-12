// Minimal ABI stubs for frontend interaction
// TODO: Replace with full ABIs exported from blockchain/artifacts/ after `npx hardhat compile`

export const VehiclePassportABI = [
  "function registerVehicle(bytes32 vinHash, string calldata metadataCID) external returns (uint256)",
  "function verifyVehicle(uint256 vehicleId) external",
  "function updateRiskScore(uint256 vehicleId, uint8 score) external",
  "function addEvidence(uint256 vehicleId, string calldata cid) external",
  "function getVehicle(uint256 vehicleId) external view returns (tuple(uint256 vehicleId, bytes32 vinHash, string metadataCID, address owner, address verifier, uint8 riskScore, bool verified, uint256 createdAt))",
  "function transferPassport(uint256 vehicleId, address to) external",
  "event VehicleRegistered(uint256 indexed vehicleId, address indexed owner, bytes32 indexed vinHash)",
  "event VehicleVerified(uint256 indexed vehicleId, address indexed verifier)",
  "event EvidenceAdded(uint256 indexed vehicleId, string cid)",
  "event OwnershipTransferred(uint256 indexed vehicleId, address indexed from, address indexed to)",
];

export const VehicleRegistryABI = [
  "function registerVehicle(uint256 passportId) external",
  "function approveVehicle(uint256 vehicleId) external",
  "function requestOwnershipTransfer(uint256 vehicleId, address to) external",
  "function approveOwnershipTransfer(uint256 vehicleId) external",
  "function rejectOwnershipTransfer(uint256 vehicleId) external",
  "function getVehicleStatus(uint256 vehicleId) external view returns (uint8)",
  "function isAuthorizedVerifier(address account) external view returns (bool)",
  "event OwnershipTransferRequested(uint256 indexed vehicleId, address indexed from, address indexed to)",
];

export const VehicleEscrowABI = [
  "function createEscrow(uint256 vehicleId, address seller, uint256 amount) external returns (uint256)",
  "function fundEscrow(uint256 escrowId) external",
  "function requestTransfer(uint256 escrowId) external",
  "function approveTransfer(uint256 escrowId) external",
  "function releaseFunds(uint256 escrowId) external",
  "function refund(uint256 escrowId) external",
  "function getEscrow(uint256 escrowId) external view returns (tuple(uint256 escrowId, uint256 vehicleId, address buyer, address seller, uint256 amount, uint8 state))",
  "event EscrowCreated(uint256 indexed escrowId, uint256 indexed vehicleId, address indexed buyer)",
  "event EscrowFunded(uint256 indexed escrowId, uint256 amount)",
  "event EscrowReleased(uint256 indexed escrowId, address indexed seller, uint256 amount)",
];

export const MockINRABI = [
  "function mint(address to, uint256 amount) external",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
];
