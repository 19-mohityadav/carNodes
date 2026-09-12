// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "./VehiclePassport.sol";

contract VehicleRegistry {
    struct Vehicle {
        uint256 tokenId;
        string vin;
        string registrationNumber;
        string documentCID;
        address owner;
        bool verified;
        uint256 riskScore;
        uint256 createdAt;
    }

    mapping(string => Vehicle) public vehicles;
    string[] public registeredVins;

    VehiclePassport public immutable passportContract;
    address public admin;
    address public escrowContract;

    // --- Vehicle History & Audit Trail Events ---
    event VehicleSubmitted(
        string indexed vin,
        string registrationNumber,
        address indexed owner,
        string documentCID,
        uint256 timestamp
    );

    event VehicleVerified(
        string indexed vin,
        uint256 riskScore,
        address indexed verifier,
        uint256 timestamp
    );

    event PassportMinted(
        string indexed vin,
        uint256 indexed tokenId,
        address indexed owner,
        uint256 timestamp
    );

    event InspectionRecorded(
        string indexed vin,
        uint256 indexed tokenId,
        string inspectionReportCID,
        address indexed inspector,
        uint256 timestamp
    );

    event VehicleOwnerUpdated(
        string indexed vin,
        uint256 indexed tokenId,
        address indexed newOwner,
        address previousOwner,
        uint256 timestamp
    );

    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    event EscrowContractSet(address indexed escrowContract);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only RTO/admin authorized");
        _;
    }

    constructor(address _passportContract) {
        require(_passportContract != address(0), "Invalid passport address");
        passportContract = VehiclePassport(_passportContract);
        admin = msg.sender;
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid new admin address");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    function setEscrowContract(address _escrow) external onlyAdmin {
        require(_escrow != address(0), "Invalid escrow address");
        escrowContract = _escrow;
        emit EscrowContractSet(_escrow);
    }

    /**
     * @notice Step 1: Seller submits vehicle details with bundled documents CID.
     */
    function registerVehicle(
        string memory vin,
        string memory registrationNumber,
        string memory documentCID
    ) external {
        require(bytes(vin).length > 0, "Invalid VIN");
        require(vehicles[vin].createdAt == 0, "Vehicle already registered");

        vehicles[vin] = Vehicle({
            tokenId: 0,
            vin: vin,
            registrationNumber: registrationNumber,
            documentCID: documentCID,
            owner: msg.sender,
            verified: false,
            riskScore: 0,
            createdAt: block.timestamp
        });

        registeredVins.push(vin);

        emit VehicleSubmitted(
            vin,
            registrationNumber,
            msg.sender,
            documentCID,
            block.timestamp
        );
    }

    /**
     * @notice Step 3 & 4: RTO / admin approves verification and records risk score.
     */
    function verifyVehicle(string memory vin, uint256 riskScore) external onlyAdmin {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(!v.verified, "Vehicle already verified");

        v.verified = true;
        v.riskScore = riskScore;

        emit VehicleVerified(vin, riskScore, msg.sender, block.timestamp);
    }

    /**
     * @notice Step 5: Mint NFT passport for the verified vehicle.
     */
    function mintPassport(string memory vin) external returns (uint256) {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(v.verified, "Vehicle not verified");
        require(v.tokenId == 0, "Passport already minted");
        require(
            msg.sender == v.owner || msg.sender == admin,
            "Not authorized to mint passport"
        );

        uint256 tokenId = passportContract.mintPassport(
            v.owner,
            v.vin,
            v.documentCID,
            v.riskScore
        );

        v.tokenId = tokenId;

        emit PassportMinted(vin, tokenId, v.owner, block.timestamp);
        return tokenId;
    }

    /**
     * @notice Record inspection or maintenance event for on-chain history
     */
    function recordInspection(string memory vin, string memory inspectionReportCID) external {
        Vehicle storage v = vehicles[vin];
        require(v.createdAt > 0, "Vehicle not registered");
        require(msg.sender == admin || msg.sender == v.owner, "Not authorized");

        emit InspectionRecorded(vin, v.tokenId, inspectionReportCID, msg.sender, block.timestamp);
    }

    /**
     * @notice Updates the owner in the registry (called by Escrow contract or Admin after successful transfer)
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

        emit VehicleOwnerUpdated(vin, v.tokenId, oldOwner, newOwner, block.timestamp);
    }

    function getVehicle(string memory vin) external view returns (Vehicle memory) {
        require(vehicles[vin].createdAt > 0, "Vehicle not registered");
        return vehicles[vin];
    }

    function getRegisteredVins() external view returns (string[] memory) {
        return registeredVins;
    }
}
