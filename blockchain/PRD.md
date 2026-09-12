# carNodes --- Product Requirements Document (PRD)

## 1. Product Overview

**carNodes** is a trusted used-vehicle marketplace that combines
authority verification, a digital vehicle passport, AI-assisted
verification, blockchain-backed ownership history, and escrow-based
settlement.

The MVP is designed for a hackathon. It does not replace RTO systems; it
creates a trusted digital coordination and audit layer around existing
verification processes.

## 2. Problem

Used-vehicle transactions are fragmented and trust-heavy. Buyers must
verify ownership, documents, accident history, insurance, finance
status, and condition. Sellers face delayed settlement and ownership
transfer. Authorities and service providers work with fragmented
records.

## 3. Goals

-   Verify vehicle and owner information before listing.
-   Create a tamper-resistant digital vehicle passport.
-   Represent a verified vehicle as an RWA-style on-chain asset.
-   Maintain transparent ownership and verification history.
-   Provide a marketplace for verified vehicles.
-   Use escrow so funds are released only when transaction conditions
    are met.
-   Enable paid verification/data services through an x402-compatible
    service layer.
-   Use AI agents for search, document/risk analysis, price comparison,
    and buyer/seller assistance.
-   Keep sensitive documents off-chain while anchoring their integrity
    on-chain.

## 4. Non-Goals for Hackathon MVP

-   Direct production RTO integration.
-   Real bank/finance integration.
-   Real insurance-provider APIs.
-   Legal replacement of registration certificates.
-   Storing personal documents directly on a public blockchain.
-   Production-grade autonomous financial agents.

## 5. Target Users

### Buyer

Needs trustworthy vehicle information, ownership history, risk
indicators, verification evidence, and secure payment.

### Seller

Needs trusted listing creation, easier buyer verification, secure
payment, and digital transfer tracking.

### Authority/RTO Role

Can verify vehicle/owner information and approve or reject transfer
requests.

### Verification Provider

Can provide inspection, insurance, valuation, or other verification
services.

### Admin

Manages roles, service providers, disputes, platform moderation, and
demo configuration.

## 6. Core User Journeys

### 6.1 Vehicle Registration

1.  Seller/authority enters vehicle details.
2.  Backend validates required fields.
3.  Documents are uploaded to IPFS/off-chain storage.
4.  Hashes/CIDs are generated.
5.  Authorized verifier approves the vehicle.
6.  Vehicle passport is created on-chain.
7.  Vehicle receives a unique vehicle ID.
8.  Vehicle becomes eligible for marketplace listing.

### 6.2 Marketplace Listing

1.  Seller selects a verified vehicle.
2.  Adds asking price and listing metadata.
3.  Backend checks that the vehicle is verified.
4.  Listing becomes visible.
5.  Buyer can inspect passport, risk summary, history, and verification
    proofs.

### 6.3 Buyer Verification

1.  Buyer opens vehicle passport.
2.  Frontend reads on-chain vehicle state.
3.  Backend/AI retrieves non-sensitive metadata and verification
    evidence.
4.  Buyer sees risk score, verification status, ownership history, and
    document integrity.
5.  Buyer may request paid verification.

### 6.4 Purchase + Escrow

1.  Buyer initiates purchase.
2.  Buyer deposits test funds into escrow.
3.  Escrow records buyer, seller, vehicle, amount, and state.
4.  Seller confirms transfer.
5.  Authority approves ownership transfer.
6.  Escrow releases funds.
7.  Vehicle ownership is updated.
8.  Ownership event is permanently recorded.

### 6.5 Verification Service

1.  Buyer/AI agent requests a verification service.
2.  Service price is displayed.
3.  Payment is made through the x402-compatible service flow.
4.  Provider returns verification evidence.
5.  Evidence hash/CID is anchored to the vehicle record.

## 7. Functional Requirements

### Authentication

-   User registration/login.
-   Role-based access: buyer, seller, authority, provider, admin.
-   Wallet connection for blockchain actions.

### Vehicle

-   Create vehicle.
-   Verify vehicle.
-   View vehicle passport.
-   View current owner.
-   View ownership history.
-   Add verification records.
-   Add risk/fraud assessment.
-   Transfer ownership through approved workflow.

### Marketplace

-   Create listing.
-   Search/filter vehicles.
-   View listing.
-   Make purchase request.
-   Track transaction state.

### Escrow

-   Create escrow.
-   Deposit test funds.
-   Confirm seller transfer.
-   Authority approval.
-   Release/refund according to state.
-   Display transaction state.

### AI

-   Vehicle search assistant.
-   Document inconsistency detection.
-   Risk/fraud analysis.
-   Price comparison/recommendation.
-   Buyer Q&A.
-   Optional negotiation assistant.

### Verification

-   Request inspection/verification.
-   Record provider result.
-   Store evidence off-chain.
-   Anchor evidence hash on-chain.

## 8. Blockchain Requirements

Blockchain should store only data that benefits from immutability,
transparency, ownership, or verification.

### Store on-chain

-   Vehicle ID.
-   VIN hash, not raw VIN where privacy is important.
-   Vehicle passport/RWA token ID.
-   Current owner wallet.
-   Verification status.
-   Authority/verifier address.
-   Document/evidence hashes or IPFS CIDs.
-   Risk score and risk classification, if appropriate for the demo.
-   Ownership transfer events.
-   Verification events.
-   Escrow state.
-   Escrow buyer/seller/vehicle references.
-   Payment amount and settlement state.
-   Contract configuration and authorized roles.

### Keep off-chain

-   Raw Aadhaar/PAN/RC scans.
-   Personal phone/email/address.
-   Full insurance documents.
-   Large images/videos.
-   AI prompts/responses.
-   Detailed inspection reports.
-   Marketplace search indexes.
-   Authentication/session data.

## 9. Success Criteria

The hackathon MVP is successful when a judge can:

1.  Connect a wallet.
2.  See a verified vehicle.
3.  Open its digital passport.
4.  See an immutable verification/ownership history.
5.  Create or view a marketplace listing.
6.  Start a purchase.
7.  See funds move into escrow.
8.  Complete authority-approved transfer.
9.  See ownership change on-chain.
10. Open Sepolia Etherscan and verify the transactions.

## 10. Security/Product Rules

-   Never store private keys in frontend code.
-   Never put sensitive identity documents directly on-chain.
-   Only authorized verifier/authority roles can approve vehicles.
-   Escrow must use explicit state transitions.
-   Ownership transfer must require required approvals.
-   Every critical blockchain action emits an event.
-   Backend must not be trusted as the source of immutable ownership
    state; blockchain is authoritative for on-chain state.

## 11. Hackathon Demo Scope

Prioritize:

1.  Vehicle Passport
2.  Authority Verification
3.  Ownership History
4.  Marketplace Listing
5.  Escrow
6.  Ownership Transfer
7.  AI risk summary
8.  Verification-service payment demonstration

The uploaded concept explicitly positions carNodes around
authority-verified vehicle RWAs, digital passports, AI agents, x402
verification, escrow, transparent ownership history, and digital
ownership transfer. fileciteturn1file0L33-L51
