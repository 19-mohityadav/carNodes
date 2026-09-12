// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract VehiclePassport is ERC721 {
    uint256 private nextTokenId = 1;

    struct Vehicle {
        string vehicleId;
        string documentCID;
        bool verified;
        uint256 riskScore;
    }

    mapping(uint256 => Vehicle) public vehicles;

    constructor() ERC721("VehiclePassport", "VPASS") {}

    function mintPassport(
        address owner,
        string memory vehicleId,
        string memory documentCID,
        uint256 riskScore
    ) external returns (uint256) {
        uint256 tokenId = nextTokenId++;

        _safeMint(owner, tokenId);

        vehicles[tokenId] = Vehicle({
            vehicleId: vehicleId,
            documentCID: documentCID,
            verified: true,
            riskScore: riskScore
        });

        return tokenId;
    }
}
