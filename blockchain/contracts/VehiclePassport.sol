// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VehiclePassport
 * @notice ERC-721 Digital Vehicle Passport representing persistent vehicle identity and history.
 * Matches BLOCKCHAIN.md Section 4 & TRD.md Section 3.1.
 */
contract VehiclePassport is ERC721, Ownable {
    uint256 private nextTokenId = 1;
    address public registry;

    struct Vehicle {
        uint256 vehicleId;
        bytes32 vinHash;
        string metadataCID;
        address owner;
        address verifier;
        uint8 riskScore;
        bool verified;
        uint256 createdAt;
    }

    mapping(uint256 => Vehicle) public vehicles;
    mapping(bytes32 => uint256) public vinHashToTokenId;

    // --- Events (TRD.md Section 5 & BLOCKCHAIN.md Section 11) ---
    event PassportMinted(
        uint256 indexed vehicleId,
        address indexed owner,
        bytes32 indexed vinHash,
        string metadataCID,
        uint256 timestamp
    );

    event EvidenceAdded(
        uint256 indexed vehicleId,
        string cid,
        address indexed provider,
        uint256 timestamp
    );

    event RiskScoreUpdated(
        uint256 indexed vehicleId,
        uint8 oldScore,
        uint8 newScore,
        uint256 timestamp
    );

    event RegistryUpdated(address indexed oldRegistry, address indexed newRegistry);

    modifier onlyRegistryOrOwner() {
        require(
            msg.sender == registry || msg.sender == owner(),
            "Only registry or owner authorized"
        );
        _;
    }

    constructor() ERC721("VehiclePassport", "VPASS") Ownable(msg.sender) {}

    function setRegistry(address _registry) external onlyOwner {
        require(_registry != address(0), "Invalid registry address");
        emit RegistryUpdated(registry, _registry);
        registry = _registry;
    }

    /**
     * @notice Mint digital passport NFT for an approved vehicle
     */
    function mintPassport(
        address to,
        bytes32 vinHash,
        string memory metadataCID,
        address verifier,
        uint8 riskScore
    ) external onlyRegistryOrOwner returns (uint256) {
        require(to != address(0), "Invalid owner address");
        require(vinHash != bytes32(0), "Invalid VIN hash");
        require(vinHashToTokenId[vinHash] == 0, "Passport already exists for this VIN");

        uint256 tokenId = nextTokenId++;

        _safeMint(to, tokenId);

        vehicles[tokenId] = Vehicle({
            vehicleId: tokenId,
            vinHash: vinHash,
            metadataCID: metadataCID,
            owner: to,
            verifier: verifier,
            riskScore: riskScore,
            verified: true,
            createdAt: block.timestamp
        });

        vinHashToTokenId[vinHash] = tokenId;

        emit PassportMinted(tokenId, to, vinHash, metadataCID, block.timestamp);
        return tokenId;
    }

    /**
     * @notice Anchor new verification evidence or inspection report CID (Phase 8 x402 / verification)
     */
    function addEvidence(uint256 tokenId, string memory evidenceCID) external {
        require(_ownerOf(tokenId) != address(0), "Nonexistent passport");
        require(bytes(evidenceCID).length > 0, "Invalid CID");
        require(
            msg.sender == ownerOf(tokenId) ||
                msg.sender == vehicles[tokenId].verifier ||
                msg.sender == registry ||
                msg.sender == owner(),
            "Not authorized to add evidence"
        );

        emit EvidenceAdded(tokenId, evidenceCID, msg.sender, block.timestamp);
    }

    /**
     * @notice Update AI risk score when new vehicle data is analyzed
     */
    function updateRiskScore(uint256 tokenId, uint8 newScore) external {
        require(_ownerOf(tokenId) != address(0), "Nonexistent passport");
        require(
            msg.sender == vehicles[tokenId].verifier ||
                msg.sender == registry ||
                msg.sender == owner(),
            "Not authorized to update risk score"
        );

        uint8 oldScore = vehicles[tokenId].riskScore;
        vehicles[tokenId].riskScore = newScore;

        emit RiskScoreUpdated(tokenId, oldScore, newScore, block.timestamp);
    }

    /**
     * @notice Returns standard token URI pointing to IPFS metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory cid = vehicles[tokenId].metadataCID;
        return string.concat("ipfs://", cid);
    }

    /**
     * @notice Fetch complete vehicle passport details
     */
    function getVehicle(uint256 tokenId) external view returns (Vehicle memory) {
        _requireOwned(tokenId);
        Vehicle memory v = vehicles[tokenId];
        v.owner = ownerOf(tokenId); // Ensure owner reflects current ERC721 ownership
        return v;
    }

    /**
     * @notice Backward-compatible helper to query by vehicleId
     */
    function getVehicleById(uint256 vehicleId) external view returns (Vehicle memory) {
        return this.getVehicle(vehicleId);
    }
}
