# carNodes --- Implementation Phases

## Phase 0 --- Project Setup

### Goal

Create a clean monorepo structure.

``` text
carNodes/
├── backend/
├── blockchain/
└── frontend/
```

### Tasks

-   Configure Git.
-   Configure `.gitignore`.
-   Configure environment variables.
-   Install frontend/backend/blockchain dependencies.
-   Confirm Hardhat compilation.

### Done when

All three applications start independently.

------------------------------------------------------------------------

## Phase 1 --- Smart Contract Foundation

### Goal

Build the core vehicle ownership layer.

### Contracts

1.  `VehiclePassport.sol`
2.  `VehicleRegistry.sol`
3.  `MockINR.sol`

### Tasks

-   Define vehicle structure.
-   Implement vehicle registration.
-   Implement verification.
-   Implement evidence CID/hash.
-   Implement ownership.
-   Implement role permissions.
-   Add events.
-   Write unit tests.

### Demo

Authority registers and verifies one demo vehicle.

------------------------------------------------------------------------

## Phase 2 --- Sepolia Deployment

### Goal

Deploy the blockchain layer publicly on a testnet.

### Tasks

-   Configure Alchemy Sepolia RPC.
-   Configure test wallet.
-   Deploy contracts.
-   Save addresses.
-   Export ABIs.
-   Verify contracts on Etherscan if time permits.

### Done when

Every contract has a Sepolia address.

------------------------------------------------------------------------

## Phase 3 --- Vehicle Passport

### Goal

Build the first complete blockchain feature.

### User flow

``` text
Vehicle Form
    ↓
Backend validation
    ↓
Document upload
    ↓
IPFS
    ↓
CID/hash
    ↓
VehiclePassport.registerVehicle()
    ↓
VehicleRegistered event
    ↓
Digital Passport UI
```

### UI

-   Vehicle details.
-   Verification status.
-   Risk score.
-   Evidence.
-   Owner.
-   Blockchain transaction.
-   Etherscan link.

------------------------------------------------------------------------

## Phase 4 --- Authority Verification

### Goal

Make verification permissioned.

### Tasks

-   Authority role.
-   Verification dashboard.
-   Approve/reject workflow.
-   On-chain verification transaction.
-   Verification history.

### Demo

A judge can see that only an authorized authority can verify a vehicle.

------------------------------------------------------------------------

## Phase 5 --- Marketplace

### Goal

Allow verified vehicles to be listed.

### Tasks

-   Listing creation.
-   Search/filter.
-   Vehicle passport preview.
-   Price.
-   Seller wallet.
-   Verification badge.
-   Risk summary.

### Rule

Unverified vehicles cannot be listed.

------------------------------------------------------------------------

## Phase 6 --- Escrow

### Goal

Protect buyer and seller during settlement.

### Contract

`VehicleEscrow.sol`

### Flow

``` text
Buyer
 ↓
Create Escrow
 ↓
Approve MockINR
 ↓
Fund Escrow
 ↓
Seller confirms
 ↓
Authority approves transfer
 ↓
Ownership transferred
 ↓
Escrow releases funds
```

### Demo

Show the escrow state changing live.

------------------------------------------------------------------------

## Phase 7 --- AI Risk Layer

### Goal

Add intelligence without making AI the source of truth.

### AI tasks

-   Document inconsistency detection.
-   Risk score explanation.
-   Vehicle comparison.
-   Price recommendation.
-   Buyer Q&A.

### Rule

AI recommendations are advisory. Blockchain verification and authority
approval remain authoritative.

------------------------------------------------------------------------

## Phase 8 --- x402-Compatible Verification Services

### Goal

Demonstrate pay-per-use verification.

### Example services

-   RC verification.
-   Insurance verification.
-   Inspection.
-   Valuation.
-   Fraud/risk report.

### Flow

``` text
Buyer/AI Agent
      ↓
Request service
      ↓
Price
      ↓
Payment
      ↓
Provider
      ↓
Verification result
      ↓
Evidence CID/hash
      ↓
Vehicle Passport
```

For the hackathon, a mocked x402-compatible service is acceptable if a
full payment protocol integration would consume too much time.

------------------------------------------------------------------------

## Phase 9 --- Backend Indexing

### Goal

Make the app fast without replacing blockchain truth.

### Tasks

-   Listen for contract events.
-   Store indexed events in PostgreSQL.
-   Build vehicle search endpoints.
-   Link listing IDs to blockchain vehicle IDs.
-   Store transaction hashes.

------------------------------------------------------------------------

## Phase 10 --- Demo Polish

### Must-have screens

1.  Landing page
2.  Connect wallet
3.  Marketplace
4.  Vehicle details
5.  Digital Vehicle Passport
6.  Authority dashboard
7.  Create listing
8.  Purchase
9.  Escrow status
10. Ownership transfer
11. AI risk analysis
12. Blockchain transaction history

### Judge Demo Script

``` text
1. Connect wallet.
2. Open verified vehicle.
3. Show passport.
4. Show verification evidence.
5. Show blockchain transaction.
6. Buyer starts purchase.
7. Funds enter escrow.
8. Authority approves transfer.
9. Ownership changes.
10. Escrow releases funds.
11. Open Etherscan and prove the transaction.
```

------------------------------------------------------------------------

## Priority If Time Is Limited

### P0 --- Must finish

-   VehiclePassport
-   VehicleRegistry
-   Sepolia deployment
-   Wallet connection
-   Vehicle registration
-   Verification
-   Ownership history

### P1 --- Strong demo

-   Marketplace
-   Escrow
-   MockINR
-   Etherscan links

### P2 --- Innovation

-   AI risk analysis
-   IPFS evidence
-   x402-compatible verification

### P3 --- Future

-   Real RTO APIs
-   Finance APIs
-   Insurance APIs
-   Image/video inspection
-   Cross-border passport
-   Autonomous agent-to-agent commerce

The original proposal explicitly describes a hackathon-ready MVP with
mock verification services and a testnet, followed by scalability from
pilot to city, state, and national deployments.
fileciteturn1file0L95-L110
