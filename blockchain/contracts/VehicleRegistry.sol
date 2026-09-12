// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "./VehiclePassport.sol";

/**
 * @title VehicleRegistry
 * @notice Authority, verification and ownership management layer.
 * Matches BLOCKCHAIN.md Section 5, 6, 14 & TRD.md Section 3.2.
 */
contract VehicleRegistry {
    enum VehicleStatus {
        Pending,
        Verified,
        Rejected,
        Listed
    }

    struct Vehicle {
        uint256 tokenId;
        string vin;
        bytes32 vinHash;
        string registrationNumber;
        string documentCID;
        address owner;
        address verifier;
        VehicleStatus status;
        uint8 riskScore;
        uint256 createdAt;
        address pendingOwner;
    }

    mapping(string => Vehicle) public vehicles;
    mapping(bytes32 => bool) public vinHashRegistered;
    string[] public registeredVins;

    VehiclePassport public immutable passportContract;
    address public admin;
    address public escrowContract;
    mapping(address => bool) public authorizedVerifiers;

    // --- Events (TRD.md Section 5 & BLOCKCHAIN.md Section 11) ---
    event VehicleRegistered(
        string indexed vin,
        bytes32 indexed vinHash,
        address indexed owner,
        string registrationNumber,
        string documentCID,
        uint256 timestamp
    );

    event VehicleVerified(
        string indexed vin,
        bytes32 indexed vinHash,
        address indexed verifier,
        uint8 riskScore,
        uint256 timestamp
    );

    event VehicleRejected(
        string indexed vin,
        address indexed verifier,
        string reason,
        uint256 timestamp
    );

    event VehicleStatusChanged(
        string indexed vin,
        VehicleStatus oldStatus,
        VehicleStatus newStatus,
        uint256 timestamp
    );

    event OwnershipTransferRequested(
        uint256 indexed vehicleId,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );

    event OwnershipTransferred(
        uint256 indexed vehicleId,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );

    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    event EscrowContractSet(address indexed escrowContract);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin authorized");
        _;
    }

    modifier onlyVerifier() {
        require(
            msg.sender == admin || authorizedVerifiers[msg.sender],
            "Only authorized verifier or admin"
        );
        _;
    }

    constructor(address _passportContract) {
        require(_passportContract != address(0), "Invalid passport address");
        passportContract = VehiclePassport(_passportContract);
        admin = msg.sender;
        authorizedVerifiers[msg.sender] = true;
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid new admin address");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    function addVerifier(address verifier) external onlyAdmin {
        require(verifier != address(0), "Invalid verifier");
        authorizedVerifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyAdmin {
        authorizedVerifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    function isAuthorizedVerifier(address account) external view returns (bool) {
        return account == admin || authorizedVerifiers[account];
    }

    function setEscrowContract(address _escrow) external onlyAdmin {
        require(_escrow != address(0), "Invalid escrow address");
        escrowContract = _escrow;
        emit EscrowContractSet(_escrow);
    }

    /**
     * @notice Step 1: Register vehicle with duplicate VIN hash protection
     */
    function registerVehicle(
        string memory vin,
        string memory registrationNumber,
        string memory documentCID
    ) external {
        require(bytes(vin).length > 0, "Invalid VIN");
        bytes32 vinHash = keccak256(abi.encodePacked(vin));
        require(!vinHashRegistered[vinHash], "VIN already registered");
        require(vehicles[vin].createdAt == 0, "Vehicle already exists");

        vehicles[vin] = Vehicle({
            tokenId: 0,
            vin: vin,
            vinHash: vinHash,
            registrationNumber: registrationNumber,
            documentCID: documentCID,
            owner: msg.sender,
            verifier: address(0),
            status: VehicleStatus.Pending,
            riskScore: 0,
            createdAt: block.timestamp,
            pendingOwner: address(0)
        });

        vinHashRegistered[vinHash] = true;
        registeredVins.push(vin);

        emit VehicleRegistered(
            vin,
            vinHash,
            msg.sender,
            registrationNumber,
            documentCID,
            block.timestamp
        );
    }

    /**
     * @notice Step 3: Authorized Verifier / RTO approves vehicle
     */
    function approveVehicle(string memory vin, uint8 riskScore) public onlyVerifier {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(v.status == VehicleStatus.Pending, "Vehicle not pending verification");

        v.status = VehicleStatus.Verified;
        v.verifier = msg.sender;
        v.riskScore = riskScore;

        emit VehicleVerified(vin, v.vinHash, msg.sender, riskScore, block.timestamp);
        emit VehicleStatusChanged(vin, VehicleStatus.Pending, VehicleStatus.Verified, block.timestamp);
    }

    /**
     * @notice Backward-compatible alias for approveVehicle
     */
    function verifyVehicle(string memory vin, uint256 riskScore) external onlyVerifier {
        approveVehicle(vin, uint8(riskScore));
    }

    /**
     * @notice Authorized Verifier rejects vehicle with reason
     */
    function rejectVehicle(string memory vin, string memory reason) external onlyVerifier {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(v.status == VehicleStatus.Pending, "Vehicle not in pending status");

        v.status = VehicleStatus.Rejected;
        v.verifier = msg.sender;

        emit VehicleRejected(vin, msg.sender, reason, block.timestamp);
        emit VehicleStatusChanged(vin, VehicleStatus.Pending, VehicleStatus.Rejected, block.timestamp);
    }

    /**
     * @notice Step 5: Mint Digital Vehicle Passport (ERC-721 NFT)
     */
    function mintPassport(string memory vin) external returns (uint256) {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(
            v.status == VehicleStatus.Verified || v.status == VehicleStatus.Listed,
            "Vehicle not verified"
        );
        require(v.tokenId == 0, "Passport already minted");
        require(
            msg.sender == v.owner || msg.sender == admin || authorizedVerifiers[msg.sender],
            "Not authorized to mint passport"
        );

        uint256 tokenId = passportContract.mintPassport(
            v.owner,
            v.vinHash,
            v.documentCID,
            v.verifier,
            v.riskScore
        );

        v.tokenId = tokenId;
        return tokenId;
    }

    /**
     * @notice Update marketplace listing state (Phase 5: unverified cannot be listed)
     */
    function setVehicleListed(string memory vin, bool listed) external {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(msg.sender == v.owner || msg.sender == admin, "Not authorized");

        if (listed) {
            require(v.status == VehicleStatus.Verified, "Only verified vehicles can be listed");
            v.status = VehicleStatus.Listed;
            emit VehicleStatusChanged(vin, VehicleStatus.Verified, VehicleStatus.Listed, block.timestamp);
        } else {
            require(v.status == VehicleStatus.Listed, "Vehicle is not listed");
            v.status = VehicleStatus.Verified;
            emit VehicleStatusChanged(vin, VehicleStatus.Listed, VehicleStatus.Verified, block.timestamp);
        }
    }

    /**
     * @notice Request ownership transfer (BLOCKCHAIN.md Section 6)
     */
    function requestOwnershipTransfer(string memory vin, address to) external {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(msg.sender == v.owner, "Only current owner can request transfer");
        require(to != address(0) && to != v.owner, "Invalid recipient");

        v.pendingOwner = to;
        emit OwnershipTransferRequested(v.tokenId, msg.sender, to, block.timestamp);
    }

    /**
     * @notice Authority approves requested ownership transfer (BLOCKCHAIN.md Section 6)
     */
    function approveOwnershipTransfer(string memory vin) external onlyVerifier {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(v.pendingOwner != address(0), "No transfer requested");

        address oldOwner = v.owner;
        address newOwner = v.pendingOwner;
        v.owner = newOwner;
        v.pendingOwner = address(0);

        if (v.tokenId > 0 && passportContract.ownerOf(v.tokenId) == oldOwner) {
            // Note: In ERC721, approval or escrow executes the safeTransferFrom
        }

        emit OwnershipTransferred(v.tokenId, oldOwner, newOwner, block.timestamp);
    }

    /**
     * @notice Authority rejects requested ownership transfer
     */
    function rejectOwnershipTransfer(string memory vin) external onlyVerifier {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(v.pendingOwner != address(0), "No transfer requested");

        v.pendingOwner = address(0);
    }

    /**
     * @notice Direct owner update called by authorized Escrow upon purchase settlement
     */
    function updateOwner(string memory vin, address newOwner) external {
        require(
            msg.sender == escrowContract || msg.sender == admin,
            "Not authorized to update owner"
        );
        require(newOwner != address(0), "Invalid new owner");

        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");

        address oldOwner = v.owner;
        v.owner = newOwner;
        v.pendingOwner = address(0);

        emit OwnershipTransferred(v.tokenId, oldOwner, newOwner, block.timestamp);
    }

    function getVehicle(string memory vin) external view returns (Vehicle memory) {
        require(vehicles[vin].createdAt > 0, "Vehicle not registered");
        return vehicles[vin];
    }

    function getVehicleStatus(string memory vin) external view returns (VehicleStatus) {
        require(vehicles[vin].createdAt > 0, "Vehicle not registered");
        return vehicles[vin].status;
    }

    function getRegisteredVins() external view returns (string[] memory) {
        return registeredVins;
    }
}
