# carNodes --- Blockchain Scope & Smart Contract Specification

## 1. Why Blockchain?

Blockchain is used only where it provides a meaningful advantage:

-   immutable vehicle history;
-   transparent ownership;
-   authority-verification proof;
-   tamper-evident documents;
-   escrow state;
-   settlement audit trail.

The application database remains responsible for normal
marketplace/search data.

## 2. On-Chain vs Off-Chain

  Data                    Location          Reason
  ----------------------- ----------------- --------------------------------
  Vehicle ID              Blockchain        Stable reference
  VIN hash                Blockchain        Proof without exposing raw VIN
  Raw VIN                 Backend           Privacy/search
  Owner wallet            Blockchain        Ownership proof
  Owner profile           PostgreSQL        Privacy
  Verification status     Blockchain        Trust-critical
  Authority wallet        Blockchain        Accountability
  Document CID/hash       Blockchain        Integrity proof
  Raw documents           IPFS              Large/off-chain data
  Risk score              Blockchain        Optional auditable signal
  Detailed AI report      PostgreSQL/IPFS   Large mutable data
  Listing price           PostgreSQL        Frequently changes
  Purchase settlement     Blockchain        Trust-critical
  Escrow state            Blockchain        Financial state
  Search/filter indexes   PostgreSQL        Performance
  User sessions           Backend           Never on-chain

## 3. Contract Set

### VehiclePassport.sol

Digital vehicle identity and history.

### VehicleRegistry.sol

Authority/registry layer and transfer workflow.

### VehicleEscrow.sol

Buyer/seller settlement.

### MockINR.sol

Test ERC-20 token for hackathon payments.

## 4. Vehicle Passport Model

Recommended:

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

### Metadata CID

The CID can point to JSON:

``` json
{
  "make": "Tata",
  "model": "Nexon",
  "year": 2025,
  "fuelType": "Petrol",
  "documentEvidence": [
    "ipfs://..."
  ]
}
```

Do not place sensitive personal information in this JSON.

## 5. Verification Model

``` text
Created
  ↓
PendingVerification
  ↓
Verified
  ↓
Listed
```

Alternative failure state:

``` text
PendingVerification
       ↓
    Rejected
```

Only authorized verifiers can move a vehicle to `Verified`.

## 6. Ownership Transfer Model

``` text
Current Owner
     |
     | transfer request
     v
Pending Transfer
     |
     | authority approval
     v
New Owner
```

Every successful transfer must emit:

``` solidity
OwnershipTransferred(
    vehicleId,
    oldOwner,
    newOwner
);
```

## 7. Escrow Model

``` text
CREATED
   ↓
FUNDED
   ↓
TRANSFER_REQUESTED
   ↓
AUTHORITY_APPROVED
   ↓
COMPLETED
   ↓
RELEASED
```

Failure:

``` text
FUNDED
   ↓
REFUNDED
```

Escrow should reject invalid state transitions.

## 8. Fraud/Risk Model

AI can calculate:

``` text
Risk Score: 0–100
```

Example:

``` text
0–20    Low Risk
21–50   Medium Risk
51–75   High Risk
76–100  Critical Risk
```

Possible signals: - document mismatch; - suspicious ownership changes; -
inconsistent mileage; - accident evidence; - insurance inconsistency; -
duplicate vehicle identifiers; - suspicious listing behavior.

The score is a decision-support signal, not legal proof.

## 9. IPFS Integrity Pattern

``` text
Document
   ↓
Upload to IPFS
   ↓
CID
   ↓
Store CID on blockchain
```

Later:

``` text
Blockchain CID
      ↓
Retrieve IPFS file
      ↓
Compare expected evidence
      ↓
Integrity confirmed
```

## 10. x402 Service Layer

x402 should be treated as a service/payment layer, not the vehicle
ownership database.

Example:

``` text
AI Agent
  ↓
"Verify insurance"
  ↓
Verification API
  ↓
Payment requirement
  ↓
Buyer pays
  ↓
Provider returns result
  ↓
Evidence stored
  ↓
Evidence CID anchored to passport
```

For an MVP, mock the provider and demonstrate the complete request →
payment → result → proof flow.

## 11. Events as Audit Trail

Minimum events:

``` solidity
VehicleRegistered
VehicleVerified
EvidenceAdded
RiskScoreUpdated
OwnershipTransferRequested
OwnershipTransferred
EscrowCreated
EscrowFunded
EscrowApproved
EscrowReleased
EscrowRefunded
```

The backend can index these events into PostgreSQL.

## 12. Security Controls

### Access Control

Use role-based authorization.

### Reentrancy

Protect escrow withdrawal/release paths where required.

### Token Safety

Use SafeERC20 for ERC-20 operations.

### Input Validation

Validate: - vehicle ID; - VIN hash; - addresses; - amounts; - CIDs; -
transfer state.

### Replay/Double Execution

Prevent: - duplicate vehicle IDs; - duplicate transfers; - double escrow
release; - double refund.

### Key Security

Private keys only exist in: - local environment for deployment; - secure
wallet for user signing.

Never put them in: - React source; - GitHub; - `.env` committed to Git.

## 13. Contract Interaction Architecture

``` text
Frontend
   |
   +---- read ----> Public RPC / Alchemy
   |
   +---- write ---> MetaMask
                       |
                       v
                    Sepolia
                       |
                Smart Contracts
```

Backend indexing:

``` text
Sepolia
   ↓
Contract Events
   ↓
Indexer/Backend
   ↓
PostgreSQL
   ↓
Frontend search/API
```

## 14. Hackathon Contract Checklist

### VehiclePassport

-   [x] register vehicle
-   [x] verify vehicle
-   [x] store evidence CID
-   [x] update risk score
-   [x] transfer ownership
-   [x] get vehicle
-   [x] events
-   [x] access control

### VehicleRegistry

-   [x] authorized verifier
-   [x] duplicate protection
-   [x] vehicle status
-   [x] transfer request
-   [x] authority approval
-   [x] events

### VehicleEscrow

-   [x] create
-   [x] fund
-   [x] transfer approval
-   [x] release
-   [x] refund
-   [x] state validation
-   [x] events

### MockINR

-   [x] ERC-20
-   [x] demo mint
-   [x] approve
-   [x] transferFrom
-   [x] test balances

## 15. What Should NOT Be Put on Blockchain

Never store: - Aadhaar number; - PAN number; - phone number; - email; -
home address; - raw government documents; - private keys; - passwords; -
complete medical/financial-style personal profiles; - large
photos/videos; - unrestricted AI conversations.

Use hashes/CIDs/references instead.

## 16. Current Deployed Contracts (Sepolia Verified)

``` text
Deployer Address:
0xAeA9091619a754FC458fb3530628C036051C3f30

VehiclePassport (ERC721 Identity & Passport):
0x0127B65691119643B0C233D9F324be7e51d90A44
Etherscan: https://sepolia.etherscan.io/address/0x0127B65691119643B0C233D9F324be7e51d90A44#code

VehicleRegistry (RTO Authority, Verification & Listings):
0x36f1323951f9C8F9B2EBF2f71B777d7330764006
Etherscan: https://sepolia.etherscan.io/address/0x36f1323951f9C8F9B2EBF2f71B777d7330764006#code

VehicleEscrow (Multi-Token ETH / MockINR Settlement & Transfer):
0x20c56b1cf38BE7CDaB9B18348eFc729D32DfB317
Etherscan: https://sepolia.etherscan.io/address/0x20c56b1cf38BE7CDaB9B18348eFc729D32DfB317#code

MockINR (ERC20 Test Currency):
0x9843aEd0A2535fFfa5f751f74BbB329949f5fD1d
Etherscan: https://sepolia.etherscan.io/address/0x9843aEd0A2535fFfa5f751f74BbB329949f5fD1d#code
```

## 17. Definition of Done

The blockchain implementation is demo-ready when:

1.  A vehicle can be registered.
2.  An authorized authority can verify it.
3.  A passport can be viewed from the frontend.
4.  Evidence can be linked using IPFS CID/hash.
5.  Ownership history is visible.
6.  A verified vehicle can be listed.
7.  Buyer funds can enter escrow.
8.  Authority can approve transfer.
9.  Ownership changes on-chain.
10. Escrow releases funds.
11. Events are visible on Sepolia.
12. Judges can verify transactions on Etherscan.

The concept's core innovation is the combination of authority-verified
vehicle RWAs, digital passports, AI agents, x402 pay-per-use services,
escrow, and transparent ownership history. fileciteturn1file0L76-L93
