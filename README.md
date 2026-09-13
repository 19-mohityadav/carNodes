# carNodes 🚗🔗

**A trusted vehicle marketplace where every car is authority-verified, minted as an on-chain asset, and issued a Digital Vehicle Passport before it's ever listed for sale.**

Team: **SmartAgents**
- Mohit Yadav (Team Leader) — CSE (IoT, CS, BCT), AEC, 3rd yr
- Sanjay Sharma — CSE, AEC, 3rd yr
- Roshan Kumar — CSE, AEC, 3rd yr
- Subhojit Gope — CSE, AEC, 3rd yr

---

## 📌 Problem Statement

Buying and selling used vehicles today is **fragmented and trust-heavy**. Buyers must manually verify ownership, documents, accident history, insurance, and finance status, while sellers face slow, paperwork-heavy ownership-transfer processes.

**Affected stakeholders:**
- **Buyers** — risk of fraud, hidden defects, fake documents, unclear ownership
- **Sellers** — difficult negotiations, delayed payments, complicated transfer procedures
- **Government / RTO Authorities** — manual verification, paperwork, fragmented records
- **Inspection / Insurance / Finance Providers** — disconnected systems, repeated verification requests

> 💡 **5.9M+ used cars** changed hands in India in FY25 — yet fragmented verification and ownership-transfer processes still make high-value vehicle transactions slow, risky, and trust-dependent.

---

## ✅ Solution

**carNodes** solves this by verifying the vehicle, owner, and documents *before* a car is ever listed — then representing that verified vehicle as an on-chain asset with a permanent, tamper-resistant history.

**How it works:**
- Verifies the vehicle, owner, and documents before listing
- Maintains a tamper-resistant vehicle history on-chain
- Uses AI agents to check vehicle details, compare prices, and assist buyers
- Uses **x402 pay-per-use payments** for on-demand verification services
- Uses **smart contract escrow** to keep buyer and seller funds safe until transfer is complete
- Gives authorities a digital dashboard to manage and approve ownership transfers

### Key Features
- 🏛️ Government-Verified Vehicle Asset (minted only after authority approval)
- 📄 Digital Vehicle Passport (on-chain ownership + verification history)
- 🤖 AI Buyer & Seller Agents
- 💸 x402 Pay-per-Verification (no fixed subscriptions)
- 🔍 AI Fraud & Risk Detection
- 🔒 Secure Smart Contract Escrow
- 🕓 Transparent Ownership History
- 🔄 Digital Ownership Transfer Workflow

---

## 🔄 User Flow

```
1. Landing Page          → Buyer | Seller | Authority
2. Role-Based Login      → Buyer / Seller / Authority Dashboard
3. Seller Registers Car  → Vehicle Details + Documents Uploaded
4. Authority Verification→ AI Pre-check → Authority Approval
5. Vehicle NFT Minted    → Verified → On-Chain Asset → Listed
6. Buyer Purchase        → AI Search → x402 → Negotiate → Escrow
7. Ownership Transfer    → Approval → NFT Transfer → Passport Updated
```

**Verified Vehicle → Secure Transaction → Authority-Approved Transfer → New Owner**

---

## 🏗️ Technical Architecture

```
Users (Buyer/Seller/Authority)
        │
        ▼
Frontend (React.js + Vite + Tailwind CSS)
        │
        ▼
Backend (Node.js + Express.js + REST APIs)
        │
        ├──────────────► AI + x402 Layer
        │                 - Buyer/Seller Agents
        │                 - Vehicle Verification
        │                 - x402 Pay-per-Use
        │
        ▼
Blockchain Layer (Ethereum)
   - Vehicle NFT (ERC-721) Registry
   - Escrow Smart Contracts
   - Payments & Ownership Transfer Events
        │
        ▼
Storage
   - PostgreSQL → users, listings, transactions, metadata
   - IPFS → vehicle documents & verification evidence
```

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js, REST APIs |
| **Blockchain** | Ethereum, Solidity Smart Contracts (ERC-721 Vehicle NFTs), Escrow Contracts |
| **Dev Tooling** | Hardhat / Truffle, MetaMask (wallet integration) |
| **AI** | LLM API for vehicle search & assistance, Document & Risk Analysis for fraud detection |
| **Payments** | x402 — pay-per-use verification/data services for AI agents |
| **Storage** | PostgreSQL (users, listings, transactions), IPFS (documents & verification evidence) |

---

## 👛 Wallet Roles

| Role | Wallet Purpose |
|---|---|
| **Seller** | Receives the minted Vehicle NFT after authority approval; receives payment once ownership transfers |
| **Authority** | Signs off on verification and triggers minting; does not hold the asset |
| **Buyer** | Sends payment into escrow; receives the Vehicle NFT once the transfer completes |
| **Escrow Contract** | Not a personal wallet — a smart contract that holds funds and only releases them once ownership transfer is confirmed |

---

## 🌟 Innovation + Impact

**Unique Value:**
- Authority-verified vehicle asset before marketplace listing
- Digital Vehicle Passport for trusted ownership and history
- AI agents for vehicle search, verification, pricing, and negotiation
- x402 pay-per-use verification instead of fixed subscriptions
- Smart contract escrow for safer transactions and transfer tracking

**Target Users:**
- Vehicle Buyers — safer, more transparent purchases
- Vehicle Sellers — trusted listings, faster transactions
- Government / RTO Authorities — easier verification and transfer management
- Inspection, Insurance & Verification Providers — paid access to services via x402

**Expected Impact:**
- Reduces vehicle fraud, improves transparency, and builds trust in second-hand vehicle transactions
- Makes the used-vehicle market more efficient by lowering verification costs and speeding up transactions
- Reduces manual paperwork and improves traceability of ownership transfers with a transparent digital audit trail
- Combines on-chain assets + AI agents + x402 + smart contracts into practical infrastructure for trusted, semi-autonomous commerce

---

## 🔧 Feasibility

- Built with proven technologies — Ethereum, x402, React, Node.js, PostgreSQL, IPFS
- Designed as a digital coordination layer around **existing** RTO/vehicle verification processes, not a replacement for them
- Permissioned verification — only authorized authorities can verify and mint vehicle assets
- Hackathon-ready MVP — implementable with mock verification services and a test network

### Scalability
- **Pilot → City → State → National** — the same architecture scales from a small marketplace to a nationwide network
- Modular infrastructure — verification, AI agents, x402 services, and blockchain components scale independently
- Open service ecosystem — new inspection, insurance, valuation, and verification providers can join without changing the core platform

---

## 🚀 Future Scope

- Direct RTO/API integration for automated ownership and registration verification
- Bank & finance integration for instant loan and hypothecation checks
- Insurance integration for real-time policy verification and transfer
- AI-powered vehicle inspection using images/video to detect damage and inconsistencies
- Cross-border vehicle transactions with standardized digital vehicle passports
- Migration to Ethereum L2s (e.g., Polygon, Arbitrum) to reduce gas costs at scale
- Agent-to-agent vehicle commerce, where buyer and seller AI agents negotiate and transact autonomously

---

## 🎯 Conclusion

The goal of carNodes is **not** to replace existing RTO and administrative systems, but to build a trusted digital layer around them. carNodes moves vehicle transactions from fragmented paperwork and uncertainty toward **verified, transparent, and blockchain-backed ownership**.

---

## 📂 Project Structure (suggested)

```
carnodes/
├── frontend/           # React + Vite + Tailwind app
├── backend/            # Node.js + Express REST API
├── contracts/          # Solidity smart contracts (Vehicle NFT, Escrow)
├── ai-agents/          # Buyer/seller AI agent logic, x402 integration
├── docs/               # Pitch deck, diagrams, documentation
└── README.md
```

## 🏁 Getting Started (placeholder — update with actual setup steps)

```bash
# Clone the repository
git clone <repo-url>
cd carnodes

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Configure environment variables (.env)
# - RPC provider URL, contract addresses, DB connection string, IPFS keys

# Run backend
npm run dev

# Run frontend
npm run dev
```

---

## 📜 License

*(Add your license here — MIT, Apache 2.0, etc.)*
