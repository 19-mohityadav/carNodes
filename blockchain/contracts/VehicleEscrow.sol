// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./VehiclePassport.sol";
import "./VehicleRegistry.sol";

/**
 * @title VehicleEscrow
 * @notice Trustless escrow for vehicle purchases backed by NFT ownership and RTO approval.
 */
contract VehicleEscrow is ReentrancyGuard {
    enum Status {
        Created,
        Funded,
        TransferPending,
        Completed,
        Cancelled,
        Disputed
    }

    struct Escrow {
        uint256 escrowId;
        uint256 tokenId;
        string vin;
        address payable buyer;
        address payable seller;
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

    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed tokenId,
        string vin,
        address indexed buyer,
        address seller,
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

    event EscrowCompleted(
        uint256 indexed escrowId,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller,
        uint256 amount,
        uint256 timestamp
    );

    event EscrowCancelled(
        uint256 indexed escrowId,
        address indexed cancelledBy,
        uint256 refundAmount,
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
     * @notice Buyer initiates an escrow to purchase a vehicle
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
            amount: amount,
            status: Status.Created,
            createdAt: block.timestamp,
            fundedAt: 0,
            completedAt: 0
        });

        emit EscrowCreated(
            escrowId,
            tokenId,
            vin,
            msg.sender,
            seller,
            amount,
            block.timestamp
        );

        return escrowId;
    }

    /**
     * @notice Buyer deposits funds into the escrow
     */
    function fundEscrow(uint256 escrowId) external payable nonReentrant {
        Escrow storage e = escrows[escrowId];
        require(e.status == Status.Created, "Escrow not in Created state");
        require(msg.sender == e.buyer, "Only buyer can fund escrow");
        require(msg.value == e.amount, "Incorrect deposit amount");

        e.status = Status.Funded;
        e.fundedAt = block.timestamp;

        emit EscrowFunded(escrowId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice RTO authority verifies documents and approves the ownership transfer
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
     * @notice Executes atomic NFT transfer to Buyer and releases escrow funds to Seller
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

        // 3. Release funds to Seller
        (bool sent, ) = e.seller.call{value: e.amount}("");
        require(sent, "Payment transfer to seller failed");

        emit EscrowCompleted(
            escrowId,
            e.tokenId,
            e.seller,
            e.buyer,
            e.amount,
            block.timestamp
        );
    }

    /**
     * @notice Cancellation before transfer approval (refunds buyer if funded)
     */
    function cancelEscrow(uint256 escrowId) external nonReentrant {
        Escrow storage e = escrows[escrowId];
        require(
            e.status == Status.Created || e.status == Status.Funded,
            "Cannot cancel at current stage"
        );
        require(
            msg.sender == e.buyer ||
                msg.sender == e.seller ||
                msg.sender == rtoAuthority,
            "Not authorized to cancel"
        );

        uint256 refundAmount = 0;
        if (e.status == Status.Funded) {
            refundAmount = e.amount;
        }

        e.status = Status.Cancelled;

        if (refundAmount > 0) {
            (bool refunded, ) = e.buyer.call{value: refundAmount}("");
            require(refunded, "Refund to buyer failed");
        }

        emit EscrowCancelled(escrowId, msg.sender, refundAmount, block.timestamp);
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
     * @notice RTO resolves dispute
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

            (bool sent, ) = e.seller.call{value: e.amount}("");
            require(sent, "Payment failed");
        } else {
            e.status = Status.Cancelled;
            (bool refunded, ) = e.buyer.call{value: e.amount}("");
            require(refunded, "Refund failed");
        }

        emit DisputeResolved(escrowId, releaseToSeller, msg.sender, block.timestamp);
    }

    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        require(escrows[escrowId].escrowId > 0, "Escrow does not exist");
        return escrows[escrowId];
    }
}
