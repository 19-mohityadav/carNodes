-- CarNodes Database Schema
-- Enable pgcrypto for gen_random_uuid() if required by PostgreSQL version
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables (in correct dependency order) for clean initialization if needed
DROP TABLE IF EXISTS ownership_transfers CASCADE;
DROP TABLE IF EXISTS vehicle_documents CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('BUYER', 'SELLER', 'AUTHORITY')),
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vehicles Table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vin VARCHAR(50) UNIQUE NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    description TEXT,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verification_notes TEXT,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    listing_status VARCHAR(20) NOT NULL DEFAULT 'UNLISTED' CHECK (listing_status IN ('UNLISTED', 'LISTED', 'SOLD')),
    passport_ipfs_cid VARCHAR(255) DEFAULT NULL,
    blockchain_token_id VARCHAR(255) DEFAULT NULL,
    blockchain_tx_hash VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Vehicle Documents Table
CREATE TABLE vehicle_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('RC', 'INSURANCE', 'POLLUTION', 'INVOICE', 'IDENTITY', 'OTHER')),
    file_name VARCHAR(255) NOT NULL,
    ipfs_cid VARCHAR(255) DEFAULT NULL,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ownership Transfers Table
CREATE TABLE ownership_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    tx_hash VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimized querying
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_reg_num ON vehicles(registration_number);
CREATE INDEX idx_vehicles_listing_status ON vehicles(listing_status);
CREATE INDEX idx_vehicles_verification_status ON vehicles(verification_status);
CREATE INDEX idx_vehicles_seller_id ON vehicles(seller_id);
CREATE INDEX idx_vehicles_current_owner_id ON vehicles(current_owner_id);
CREATE INDEX idx_vehicle_documents_vehicle_id ON vehicle_documents(vehicle_id);
CREATE INDEX idx_ownership_transfers_vehicle_id ON ownership_transfers(vehicle_id);
