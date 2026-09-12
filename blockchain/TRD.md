# carNodes --- Technical Requirements Document (TRD)

## 1. Architecture

``` text
React + Vite + Tailwind
        |
        | REST / JSON
        v
Node.js + Express
        |
   +----+---------+----------------+
   |              |                |
PostgreSQL       IPFS         AI/Policy Engine
   |              |                |
   +--------------+----------------+
                  |
            Ethers.js / RPC
                  |
              Alchemy
                  |
         Ethereum Sepolia
                  |
       +----------+----------+
       |          |          |
 VehiclePassport Registry  Escrow
       |          |          |
       +----------+----------+
                  |
               MockINR
```

> The original hackathon concept specifies Algorand + AlgoKit. For this
> implementation, the blockchain layer is intentionally adapted to
> Solidity + Hardhat + Ethers.js + Alchemy + Ethereum Sepolia, as
> required for the project implementation.

## 2. Technology Stack

### Frontend

-   React.js
-   Vite
-   Tailwind CSS
-   Ethers.js
-   MetaMask/browser wallet

### Backend

-   Node.js
-   Express.js
-   REST APIs
-   PostgreSQL
-   Optional background jobs

### Blockchain

-   Solidity 0.8.x
-   Hardhat 3
-   Ethers.js
-   Ethereum Sepolia
-   Alchemy RPC
-   OpenZeppelin contracts where applicable

### Storage

-   PostgreSQL for application data.
-   IPFS for documents/evidence.
-   Blockchain for proofs, ownership, verification states, and
    settlement state.

### AI

-   Document/risk analysis.
-   Vehicle search assistant.
-   Price analysis.
-   Buyer/seller assistance.

## 3. Smart Contract Architecture

### 3.1 VehiclePassport.sol

Purpose: represent the vehicle's persistent digital passport.

Responsibilities: - Mint/create a passport for an approved vehicle. -
Store vehicle ID and immutable/reference metadata. - Store
document/evidence hash or CID. - Track verification status. - Track risk
score/status. - Track current owner. - Emit passport and verification
events.

Suggested data:

``` solidity
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
```

Suggested functions: - `registerVehicle(...)` - `verifyVehicle(...)` -
`updateRiskScore(...)` - `addEvidence(...)` - `getVehicle(...)` -
`getVehicleById(...)` - `transferPassport(...)`

### 3.2 VehicleRegistry.sol

Purpose: maintain the authoritative application-level registry.

Responsibilities: - Register verified vehicle passport addresses/IDs. -
Maintain approved authority/verifier roles. - Prevent duplicate vehicle
registration. - Track vehicle status. - Initiate/approve ownership
transfers. - Emit registry events.

Suggested functions: - `registerVehicle(...)` - `approveVehicle(...)` -
`requestOwnershipTransfer(...)` - `approveOwnershipTransfer(...)` -
`rejectOwnershipTransfer(...)` - `getVehicleStatus(...)` -
`isAuthorizedVerifier(...)`

### 3.3 VehicleEscrow.sol

Purpose: secure the financial settlement of vehicle purchases.

Responsibilities: - Create escrow. - Accept test token/native payment. -
Lock funds. - Track buyer/seller/vehicle. - Track authority approval. -
Release funds after conditions are satisfied. - Refund according to
defined failure/dispute states.

Suggested state machine:

``` text
Created
  |
Funded
  |
TransferRequested
  |
AuthorityApproved
  |
Completed
  |
FundsReleased
```

Failure path:

``` text
Created/Funded
      |
    Refund
```

Suggested functions: - `createEscrow(...)` - `fundEscrow(...)` -
`requestTransfer(...)` - `approveTransfer(...)` - `releaseFunds(...)` -
`refund(...)` - `getEscrow(...)`

### 3.4 MockINR.sol

Purpose: hackathon-only test currency.

Use an ERC-20 test token to simulate INR-denominated settlement.

Responsibilities: - Mint test tokens to demo wallets. - Allow buyers to
approve escrow. - Escrow transfers MockINR.

Do not present MockINR as real INR or real payment infrastructure.

## 4. Contract Interaction Rules

### Frontend reads

Use Ethers.js provider:

``` text
Browser
  -> Alchemy/Wallet Provider
  -> Contract
  -> Read state
```

### Frontend writes

Use wallet signer:

``` text
Browser
  -> MetaMask
  -> User signs transaction
  -> Sepolia
  -> Contract
```

### Backend

Backend may: - index events, - maintain searchable metadata, - prepare
transactions, - validate business rules.

Backend must not impersonate a user's wallet or expose private keys.

## 5. Event Design

Every important state change should emit an event.

Examples:

``` solidity
event VehicleRegistered(
    uint256 indexed vehicleId,
    address indexed owner,
    bytes32 indexed vinHash
);

event VehicleVerified(
    uint256 indexed vehicleId,
    address indexed verifier
);

event EvidenceAdded(
    uint256 indexed vehicleId,
    string cid
);

event OwnershipTransferRequested(
    uint256 indexed vehicleId,
    address indexed from,
    address indexed to
);

event OwnershipTransferred(
    uint256 indexed vehicleId,
    address indexed from,
    address indexed to
);

event EscrowCreated(
    uint256 indexed escrowId,
    uint256 indexed vehicleId,
    address indexed buyer
);

event EscrowFunded(
    uint256 indexed escrowId,
    uint256 amount
);

event EscrowReleased(
    uint256 indexed escrowId,
    address indexed seller,
    uint256 amount
);
```

## 6. Roles

Recommended role model:

``` text
ADMIN
  |
  +-- AUTHORITY / RTO
  |
  +-- VERIFICATION_PROVIDER
  |
  +-- SELLER
  |
  +-- BUYER
```

Only authorized roles should perform sensitive operations.

Use OpenZeppelin `AccessControl` or an equivalent role system.

## 7. Data Ownership

### Blockchain

Source of truth for: - passport ownership, - verification status, -
evidence commitments, - transfer events, - escrow state, - settlement
events.

### PostgreSQL

Source of truth for: - users, - profiles, - listings, - search
indexes, - AI results, - service catalog, - application workflow
metadata.

### IPFS

Source of truth for: - document files, - inspection evidence, -
images, - larger verification artifacts.

Blockchain stores the CID/hash that proves integrity.

## 8. API Boundaries

Example backend routes:

``` text
POST   /api/vehicles
GET    /api/vehicles/:id
POST   /api/vehicles/:id/verification
POST   /api/vehicles/:id/evidence

GET    /api/listings
POST   /api/listings
GET    /api/listings/:id

POST   /api/escrow
GET    /api/escrow/:id

POST   /api/verification/request
GET    /api/verification/:id

POST   /api/ai/risk-analysis
POST   /api/ai/search
```

## 9. Blockchain Configuration

Environment variables:

``` env
SEPOLIA_RPC_URL=
PRIVATE_KEY=
CONTRACT_VEHICLE_PASSPORT=
CONTRACT_VEHICLE_REGISTRY=
CONTRACT_VEHICLE_ESCROW=
CONTRACT_MOCK_INR=
```

Never commit `.env`.

## 10. Deployment

Compile:

``` bash
npx hardhat compile
```

Deploy:

``` bash
npx hardhat run scripts/deploy.ts --network sepolia
```

Save addresses:

``` text
blockchain/deployedAddresses.json
```

Export ABIs to:

``` text
frontend/src/contracts/
```

## 11. Current Deployment

The current hackathon implementation has deployed:

``` text
VehiclePassport:
0x0127B65691119643B0C233D9F324be7e51d90A44 (Verified on Etherscan)

VehicleRegistry:
0x36f1323951f9C8F9B2EBF2f71B777d7330764006 (Verified on Etherscan)

VehicleEscrow:
0x20c56b1cf38BE7CDaB9B18348eFc729D32DfB317 (Verified on Etherscan)

MockINR:
0x9843aEd0A2535fFfa5f751f74BbB329949f5fD1d (Verified on Etherscan)
```

## 12. Security Requirements

-   `.env` and private keys must never enter Git.
-   Use a dedicated hackathon/test wallet.
-   Never use mainnet funds.
-   Validate all inputs.
-   Protect role-restricted functions.
-   Prevent duplicate VIN hashes.
-   Prevent unauthorized ownership transfer.
-   Use checks-effects-interactions for ETH/token transfers.
-   Use SafeERC20 for ERC-20 interactions where appropriate.
-   Add reentrancy protection to escrow functions where required.
-   Emit events for every important state transition.
-   Do not store raw sensitive documents on-chain.

## 13. Testing Requirements

Unit tests: - vehicle registration, - duplicate registration
rejection, - authority verification, - unauthorized verification
rejection, - evidence update, - ownership transfer, - escrow creation, -
escrow funding, - authority approval, - release, - refund, -
unauthorized release rejection.

Integration tests: - frontend wallet -\> contract, - backend event
indexing, - IPFS CID -\> blockchain evidence, - marketplace -\>
escrow, - transfer -\> passport owner update.

## 14. Technical Acceptance Criteria

The MVP is technically complete when: - all contracts compile; - tests
pass; - contracts are deployed to Sepolia; - frontend can read contract
state; - wallet can sign a vehicle transaction; - verification events
appear on-chain; - escrow can lock/release MockINR; - ownership changes
after successful transfer; - blockchain addresses and transaction hashes
can be displayed in the UI.

The source concept calls for blockchain-backed RWA records, ownership
events, escrow, IPFS evidence, PostgreSQL application data, and AI
services. fileciteturn1file0L53-L74
