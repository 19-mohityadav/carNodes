// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockINR
 * @notice Mock INR token (mINR) for demoing vehicle purchases in ₹ (e.g. ₹7,50,000 mINR).
 */
contract MockINR is ERC20, Ownable {
    constructor() ERC20("Mock Indian Rupee", "mINR") Ownable(msg.sender) {
        // Mint 10,000,000 mINR to the deployer for testing & liquidity
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }

    /**
     * @notice Faucet function for testing and demo purposes
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
