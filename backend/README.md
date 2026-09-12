# CarNodes Backend API

CarNodes is a trusted RWA (Real World Asset) vehicle marketplace where vehicles are verified before listing, vehicle document metadata is stored securely, and vehicle ownership can be transferred between buyers and sellers.

> **Note**: Blockchain (Ethereum Sepolia + Solidity) and IPFS file storage are intentionally deferred to the next implementation phase. The database schema and API responses include `blockchainStatus: "PENDING"`, `passport_ipfs_cid`, `blockchain_token_id`, and `blockchain_tx_hash` placeholders for seamless future integration.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Database**: PostgreSQL (with transaction & pessimistic row locking support)
- **Authentication**: JSON Web Tokens (JWT) + `bcryptjs` password hashing
- **Environment**: `dotenv`
- **Testing**: In-memory PostgreSQL (`pg-mem`) test suite

---

## 📁 Project Structure

```
backend/
├── db/
│   ├── schema.sql         # PostgreSQL schema definition
│   └── init.js            # Database initialization script
├── src/
│   ├── app.js             # Express application & middleware setup
│   ├── server.js          # Main entrypoint & server listener
│   ├── db.js              # PostgreSQL pool & pg-mem test connection module
│   ├── middleware/
│   │   ├── auth.js        # JWT authentication & role-based authorization
│   │   └── error.js       # Centralized error handler
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── vehicle.controller.js
│   │   └── document.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── vehicle.service.js
│   │   └── document.service.js
│   └── routes/
│       ├── auth.routes.js
│       ├── vehicle.routes.js
│       └── document.routes.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── test-api.js            # Automated 19-point API verification test suite
```

---

## 🔐 User Roles & Permissions

| Permission / Action | BUYER | SELLER | AUTHORITY |
| :--- | :---: | :---: | :---: |
| Register & Login | ✅ | ✅ | ✅ |
| View Marketplace & Vehicle Details | ✅ | ✅ | ✅ |
| Create Vehicle (`PENDING`, `UNLISTED`) | ❌ | ✅ | ✅ |
| Upload Document Metadata | ❌ | ✅ | ❌ |
| Verify / Reject Vehicle & Add Notes | ❌ | ❌ | ✅ |
| List Verified Vehicle for Sale | ❌ | ✅ | ❌ |
| Transfer Vehicle Ownership (DB Transfer) | ✅ | ❌ | ❌ |

---

## 🚀 Setup & Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carnodes
JWT_SECRET=carnodes_super_secret_jwt_key_hackathon_2026
CLIENT_URL=http://localhost:5173
```

### 3. Database Initialization (PostgreSQL)

Run the SQL script directly or execute the node initializer:

```bash
# Option A: Run via Node initializer
node db/init.js

# Option B: Run via psql
psql -U postgres -d carnodes -f db/schema.sql
```

---

## 💻 Running the Backend

```bash
# Development mode (with nodemon auto-reload)
npm run dev

# Production mode
npm start
```

---

## 🧪 Running Automated Tests

Run the complete 19-point test suite:

```bash
node test-api.js
```

---

## 🌐 API Reference

### Health Check

#### `GET /api/health`
- **Response (200 OK)**:
```json
{
  "success": true,
  "service": "CarNodes API",
  "status": "healthy",
  "time": "2026-09-12T12:00:00.000Z"
}
```

---

### Authentication APIs

#### `POST /api/auth/register`
- **Body**:
```json
{
  "name": "Mohit",
  "email": "mohit@example.com",
  "password": "password123",
  "role": "SELLER",
  "phone": "9876543210"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "c1f7b8a0-...",
      "name": "Mohit",
      "email": "mohit@example.com",
      "role": "SELLER",
      "phone": "9876543210",
      "created_at": "2026-09-12T12:00:00.000Z"
    },
    "token": "eyJhbGciOi..."
  }
}
```

#### `POST /api/auth/login`
- **Body**:
```json
{
  "email": "mohit@example.com",
  "password": "password123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOi..."
  }
}
```

---

### Vehicle APIs

#### `GET /api/vehicles`
- **Query Params**: `?status=LISTED` (optional), `?verified=true` (optional)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "data": {
    "vehicles": [ ... ]
  }
}
```

#### `GET /api/vehicles/:id`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Vehicle details retrieved successfully",
  "data": {
    "vehicle": {
      "id": "...",
      "vin": "CAR123456789",
      "registration_number": "WB12AB1234",
      "make": "Toyota",
      "model": "Fortuner",
      "year": 2024,
      "price": "3500000.00",
      "verification_status": "VERIFIED",
      "listing_status": "LISTED",
      "seller_name": "Mohit",
      "owner_name": "Mohit",
      "documents": [ ... ]
    }
  }
}
```

#### `POST /api/vehicles`
- **Headers**: `Authorization: Bearer <SELLER_TOKEN>`
- **Roles Allowed**: `SELLER`, `AUTHORITY`
- **Body**:
```json
{
  "vin": "CAR123456789",
  "registrationNumber": "WB12AB1234",
  "make": "Toyota",
  "model": "Fortuner",
  "year": 2024,
  "price": 3500000,
  "description": "Well maintained vehicle"
}
```

#### `PATCH /api/vehicles/:id/verify`
- **Headers**: `Authorization: Bearer <AUTHORITY_TOKEN>`
- **Roles Allowed**: `AUTHORITY`
- **Body**:
```json
{
  "verificationStatus": "VERIFIED",
  "notes": "Documents and physical inspection verified"
}
```

#### `PATCH /api/vehicles/:id/list`
- **Headers**: `Authorization: Bearer <SELLER_TOKEN>`
- **Roles Allowed**: `SELLER`
- **Body**:
```json
{
  "listingStatus": "LISTED"
}
```
*(Note: Vehicle must be VERIFIED before listing).*

#### `POST /api/vehicles/:id/transfer`
- **Headers**: `Authorization: Bearer <BUYER_TOKEN>`
- **Roles Allowed**: `BUYER`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Ownership transferred successfully in database. Blockchain synchronization pending.",
  "data": {
    "vehicle": {
      "id": "...",
      "current_owner_id": "<BUYER_ID>",
      "listing_status": "SOLD"
    },
    "transfer": {
      "id": "...",
      "from_user_id": "<SELLER_ID>",
      "to_user_id": "<BUYER_ID>",
      "status": "COMPLETED"
    },
    "blockchainStatus": "PENDING"
  }
}
```

---

### Document APIs

#### `POST /api/vehicles/:id/documents`
- **Headers**: `Authorization: Bearer <SELLER_TOKEN>`
- **Roles Allowed**: `SELLER`
- **Body**:
```json
{
  "documentType": "RC",
  "fileName": "vehicle-rc.pdf"
}
```

#### `GET /api/vehicles/:id/documents`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Roles Allowed**: `BUYER`, `SELLER`, `AUTHORITY`

---

## 📋 Current Limitations & Future Roadmap

- **Blockchain Integration (Phase 2)**: Smart contract execution on Ethereum Sepolia using Hardhat and Web3/Ethers.js will sync database transfers onto the blockchain.
- **IPFS Integration (Phase 2)**: Document CIDs and Vehicle Passports will be generated via Pinata/NFT.Storage or an IPFS node.
