// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./VehiclePassport.sol";
import "./VehicleRegistry.sol";

/**
 * @title VehicleEscrow
 * @notice Trustless escrow for vehicle purchases supporting both native ETH and MockINR token settlement.
 * Matches BLOCKCHAIN.md Section 7, 12, 14 & TRD.md Section 3.3, 3.4.
 */
contract VehicleEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Status {
        Created,
        Funded,
        TransferPending,
        Completed,
        Refunded,
        Cancelled,
        Disputed
    }

    struct Escrow {
        uint256 escrowId;
        uint256 tokenId;
        string vin;
        address payable buyer;
        address payable seller;
        address paymentToken; // address(0) for native ETH, or MockINR address
        uint256 amount;
        Status status;
        uint256 createdAt;
        uint256 fundedAt;
        uint256 completedAt;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public nextEscrowId = 1;

    VehiclePassport public immutable passport;
    VehicleRegistry public immutable registry;
    address public rtoAuthority;

    // --- Events (TRD.md Section 5 & BLOCKCHAIN.md Section 11) ---
    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller,
        address paymentToken,
        uint256 amount,
        uint256 timestamp
    );

    event EscrowFunded(
        uint256 indexed escrowId,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );

    event TransferApproved(
        uint256 indexed escrowId,
        string vin,
        uint256 indexed tokenId,
        address indexed rtoAuthority,
        uint256 timestamp
    );

    event EscrowReleased(
        uint256 indexed escrowId,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 amount,
        uint256 timestamp
    );

    event EscrowRefunded(
        uint256 indexed escrowId,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );

    event EscrowCancelled(
        uint256 indexed escrowId,
        address indexed cancelledBy,
        uint256 timestamp
    );

    event EscrowDisputed(
        uint256 indexed escrowId,
        address indexed disputedBy,
        string reason,
        uint256 timestamp
    );

    event DisputeResolved(
        uint256 indexed escrowId,
        bool releasedToSeller,
        address indexed resolvedBy,
        uint256 timestamp
    );

    event RTOAuthorityUpdated(address indexed oldRTO, address indexed newRTO);

    modifier onlyRTO() {
        require(msg.sender == rtoAuthority, "Only RTO authorized");
        _;
    }

    constructor(address _passport, address _registry) {
        require(_passport != address(0), "Invalid passport address");
        require(_registry != address(0), "Invalid registry address");

        passport = VehiclePassport(_passport);
        registry = VehicleRegistry(_registry);
        rtoAuthority = msg.sender;
    }

    function setRTOAuthority(address newRTO) external onlyRTO {
        require(newRTO != address(0), "Invalid RTO address");
        emit RTOAuthorityUpdated(rtoAuthority, newRTO);
        rtoAuthority = newRTO;
    }

    /**
     * @notice Create escrow with MockINR ERC-20 token
     */
    function createTokenEscrow(
        uint256 tokenId,
        string memory vin,
        address payable seller,
        address paymentToken,
        uint256 amount
    ) public returns (uint256) {
        require(paymentToken != address(0), "Payment token cannot be zero address");
        require(seller != address(0), "Invalid seller");
        require(msg.sender != seller, "Buyer cannot be seller");
        require(passport.ownerOf(tokenId) == seller, "Seller does not own token");
        require(amount > 0, "Amount must be > 0");

        uint256 escrowId = nextEscrowId++;

        escrows[escrowId] = Escrow({
            escrowId: escrowId,
            tokenId: tokenId,
            vin: vin,
            buyer: payable(msg.sender),
            seller: seller,
            paymentToken: paymentToken,
            amount: amount,
            status: Status.Created,
            createdAt: block.timestamp,
            fundedAt: 0,
            completedAt: 0
        });

        emit EscrowCreated(
            escrowId,
            tokenId,
            msg.sender,
            seller,
            paymentToken,
            amount,
            block.timestamp
        );

        return escrowId;
    }

    /**
     * @notice Create escrow with native ETH
     */
    function createEscrow(
        uint256 tokenId,
        string memory vin,
        address payable seller,
        uint256 amount
    ) external returns (uint256) {
        require(seller != address(0), "Invalid seller");
        require(msg.sender != seller, "Buyer cannot be seller");
        require(passport.ownerOf(tokenId) == seller, "Seller does not own token");
        require(amount > 0, "Amount must be > 0");

        uint256 escrowId = nextEscrowId++;

        escrows[escrowId] = Escrow({
            escrowId: escrowId,
            tokenId: tokenId,
            vin: vin,
            buyer: payable(msg.sender),
            seller: seller,
            paymentToken: address(0),
            amount: amount,
            status: Status.Created,
            createdAt: block.timestamp,
            fundedAt: 0,
            completedAt: 0
        });

        emit EscrowCreated(
            escrowId,
            tokenId,
            msg.sender,
            seller,
            address(0),
            amount,
            block.timestamp
        );

        return escrowId;
    }

    /**
     * @notice Fund escrow with either native ETH or MockINR ERC-20
     */
    function fundEscrow(uint256 escrowId) external payable nonReentrant {
        Escrow storage e = escrows[escrowId];
        require(e.status == Status.Created, "Escrow not in Created state");
        require(msg.sender == e.buyer, "Only buyer can fund escrow");

        if (e.paymentToken == address(0)) {
            // Native ETH payment
            require(msg.value == e.amount, "Incorrect ETH deposit amount");
        } else {
            // ERC-20 (MockINR) payment
            require(msg.value == 0, "Do not send ETH for token escrow");
            IERC20(e.paymentToken).safeTransferFrom(msg.sender, address(this), e.amount);
        }

        e.status = Status.Funded;
        e.fundedAt = block.timestamp;

        emit EscrowFunded(escrowId, msg.sender, e.amount, block.timestamp);
    }

    /**
     * @notice RTO authority verifies regulatory requirements and approves transfer
     */
    function approveTransfer(uint256 escrowId) external onlyRTO {
        Escrow storage e = escrows[escrowId];
        require(e.status == Status.Funded, "Escrow must be funded");

        e.status = Status.TransferPending;

        emit TransferApproved(
            escrowId,
            e.vin,
            e.tokenId,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Release funds to seller and transfer Passport NFT + registry ownership to buyer
     */
    function releaseFunds(uint256 escrowId) public nonReentrant {
        Escrow storage e = escrows[escrowId];
        require(
            e.status == Status.TransferPending,
            "Transfer not approved by RTO"
        );
        require(
            msg.sender == e.buyer ||
                msg.sender == e.seller ||
                msg.sender == rtoAuthority,
            "Not authorized to complete transfer"
        );

        e.status = Status.Completed;
        e.completedAt = block.timestamp;

        // 1. Transfer Passport NFT from Seller to Buyer
        passport.safeTransferFrom(e.seller, e.buyer, e.tokenId);

        // 2. Update ownership in Vehicle Registry
        registry.updateOwner(e.vin, e.buyer);

        // 3. Release funds to Seller (ETH or MockINR)
        if (e.paymentToken == address(0)) {
            (bool sent, ) = e.seller.call{value: e.amount}("");
            require(sent, "Payment transfer to seller failed");
        } else {
            IERC20(e.paymentToken).safeTransfer(e.seller, e.amount);
        }

        emit EscrowReleased(
            escrowId,
            e.tokenId,
            e.seller,
            e.buyer,
            e.amount,
            block.timestamp
        );
    }

    /**
     * @notice Refund buyer if transaction cannot proceed (TRD.md Section 3.3)
     */
    function refund(uint256 escrowId) public nonReentrant {
        Escrow storage e = escrows[escrowId];
        require(
            e.status == Status.Funded || e.status == Status.Created,
            "Cannot refund in current state"
        );
        require(
            msg.sender == e.buyer ||
                msg.sender == e.seller ||
                msg.sender == rtoAuthority,
            "Not authorized to refund"
        );

        uint256 refundAmount = 0;
        if (e.status == Status.Funded) {
            refundAmount = e.amount;
            e.status = Status.Refunded;

            if (e.paymentToken == address(0)) {
                (bool refunded, ) = e.buyer.call{value: refundAmount}("");
                require(refunded, "ETH refund to buyer failed");
            } else {
                IERC20(e.paymentToken).safeTransfer(e.buyer, refundAmount);
            }

            emit EscrowRefunded(escrowId, e.buyer, refundAmount, block.timestamp);
        } else {
            e.status = Status.Cancelled;
            emit EscrowCancelled(escrowId, msg.sender, block.timestamp);
        }
    }

    /**
     * @notice Backward-compatible alias for refund
     */
    function cancelEscrow(uint256 escrowId) external {
        refund(escrowId);
    }

    /**
     * @notice Flag escrow as disputed for RTO intervention
     */
    function disputeEscrow(uint256 escrowId, string memory reason) external {
        Escrow storage e = escrows[escrowId];
        require(
            e.status == Status.Funded || e.status == Status.TransferPending,
            "Cannot dispute in current state"
        );
        require(
            msg.sender == e.buyer || msg.sender == e.seller,
            "Only buyer or seller can dispute"
        );

        e.status = Status.Disputed;

        emit EscrowDisputed(escrowId, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice RTO authority resolves dispute
     */
    function resolveDispute(
        uint256 escrowId,
        bool releaseToSeller
    ) external onlyRTO nonReentrant {
        Escrow storage e = escrows[escrowId];
        require(e.status == Status.Disputed, "Escrow not disputed");

        if (releaseToSeller) {
            e.status = Status.Completed;
            e.completedAt = block.timestamp;

            passport.safeTransferFrom(e.seller, e.buyer, e.tokenId);
            registry.updateOwner(e.vin, e.buyer);

            if (e.paymentToken == address(0)) {
                (bool sent, ) = e.seller.call{value: e.amount}("");
                require(sent, "ETH payment failed");
            } else {
                IERC20(e.paymentToken).safeTransfer(e.seller, e.amount);
            }

            emit EscrowReleased(
                escrowId,
                e.tokenId,
                e.seller,
                e.buyer,
                e.amount,
                block.timestamp
            );
        } else {
            e.status = Status.Refunded;

            if (e.paymentToken == address(0)) {
                (bool refunded, ) = e.buyer.call{value: e.amount}("");
                require(refunded, "ETH refund failed");
            } else {
                IERC20(e.paymentToken).safeTransfer(e.buyer, e.amount);
            }

            emit EscrowRefunded(escrowId, e.buyer, e.amount, block.timestamp);
        }

        emit DisputeResolved(escrowId, releaseToSeller, msg.sender, block.timestamp);
    }

    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        require(escrows[escrowId].escrowId > 0, "Escrow does not exist");
        return escrows[escrowId];
    }
}
