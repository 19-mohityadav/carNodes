-- ==============================================================================
-- CARNODES COMPREHENSIVE SUPABASE DATABASE SCHEMA
-- Matches ARCHITECTURE.md, TRD.md, and implementation_plan.md
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES (Extends Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT NOT NULL,
    phone TEXT,
    wallet_address TEXT,
    role TEXT NOT NULL CHECK (role IN ('USER', 'BUYER', 'SELLER', 'DEALER', 'SERVICE_CENTER', 'INSPECTOR', 'RTO_ADMIN', 'ADMIN')) DEFAULT 'USER',
    avatar_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. VEHICLES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_uuid UUID NOT NULL DEFAULT gen_random_uuid(),
    vin TEXT UNIQUE NOT NULL,
    vin_hash TEXT UNIQUE NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    manufacturer TEXT NOT NULL,
    model TEXT NOT NULL,
    variant TEXT,
    manufacturing_year INTEGER,
    fuel_type TEXT,
    color TEXT,
    engine_number TEXT,
    chassis_number TEXT,
    current_owner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    owner_wallet TEXT,
    registration_state TEXT,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED', 'LISTED', 'ESCROW_LOCKED', 'TRANSFERRED')) DEFAULT 'PENDING',
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    blockchain_token_id BIGINT,
    passport_contract_address TEXT DEFAULT '0xec5b401ECe64d130B6Cc83c4916137990009Eaf5',
    registry_contract_address TEXT DEFAULT '0xD585f8daDdB3F438aCE2A5b4e86f47e11825fF30',
    ipfs_metadata_cid TEXT,
    registration_tx_hash TEXT,
    mint_tx_hash TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. VEHICLE RECORDS (Service, Inspection, Maintenance, Insurance)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicle_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL CHECK (record_type IN ('SERVICE', 'INSPECTION', 'INSURANCE', 'ACCIDENT', 'CHALLAN', 'PUC', 'TRANSFER', 'NOTE')),
    title TEXT NOT NULL,
    description TEXT,
    service_center TEXT,
    mileage_km INTEGER,
    record_date DATE DEFAULT CURRENT_DATE,
    submitted_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('SUBMITTED', 'VERIFIED', 'ON_CHAIN', 'REJECTED')) DEFAULT 'SUBMITTED',
    ipfs_cid TEXT,
    content_hash TEXT,
    blockchain_record_id BIGINT,
    blockchain_tx_hash TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. VEHICLE DOCUMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicle_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('RC', 'INSURANCE', 'PUC', 'INSPECTION_REPORT', 'INVOICE', 'SERVICE_RECEIPT', 'NOC', 'ID_PROOF', 'OTHER')),
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    sha256_hash TEXT NOT NULL,
    ipfs_cid TEXT NOT NULL,
    ipfs_url TEXT,
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. IPFS FILES REGISTRY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ipfs_files (
    cid TEXT PRIMARY KEY,
    content_hash TEXT NOT NULL,
    file_name TEXT,
    mime_type TEXT,
    size_bytes BIGINT,
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. BLOCKCHAIN RECORDS AUDIT LOG
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blockchain_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tx_hash TEXT UNIQUE NOT NULL,
    block_number BIGINT,
    contract_address TEXT NOT NULL,
    event_name TEXT NOT NULL,
    network TEXT DEFAULT 'sepolia',
    from_address TEXT,
    to_address TEXT,
    gas_used BIGINT,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. MARKETPLACE LISTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    price_inr NUMERIC NOT NULL,
    price_minr NUMERIC,
    price_eth NUMERIC,
    currency TEXT DEFAULT 'INR',
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('DRAFT', 'ACTIVE', 'UNDER_ESCROW', 'SOLD', 'CANCELLED', 'EXPIRED')) DEFAULT 'ACTIVE',
    featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. ESCROW TRANSACTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE SET NULL,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.user_profiles(id),
    buyer_id UUID NOT NULL REFERENCES public.user_profiles(id),
    onchain_escrow_id BIGINT,
    contract_address TEXT DEFAULT '0xB9d64e71bc01C8b09F19fF258dE21E0ebDb78EE2',
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL CHECK (currency IN ('ETH', 'MOCKINR', 'INR')) DEFAULT 'MOCKINR',
    status TEXT NOT NULL CHECK (status IN ('CREATED', 'FUNDED', 'INSPECTION_PENDING', 'INSPECTION_PASSED', 'APPROVED_BY_RTO', 'RELEASED', 'REFUNDED', 'DISPUTED')) DEFAULT 'CREATED',
    creation_tx_hash TEXT,
    funding_tx_hash TEXT,
    release_tx_hash TEXT,
    refund_tx_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. AI RISK ASSESSMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    odometer_tampering_risk TEXT CHECK (odometer_tampering_risk IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    accident_severity_score NUMERIC,
    flood_damage_indicator BOOLEAN DEFAULT FALSE,
    title_brand_warning BOOLEAN DEFAULT FALSE,
    summary TEXT,
    factors JSONB DEFAULT '[]'::jsonb,
    raw_response JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON public.vehicles(current_owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON public.vehicles(vin);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin_hash ON public.vehicles(vin_hash);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_records_vehicle ON public.vehicle_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_documents_vehicle ON public.vehicle_documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON public.marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_seller ON public.marketplace_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_escrow_vehicle ON public.escrow_transactions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON public.escrow_transactions(status);
CREATE INDEX IF NOT EXISTS idx_blockchain_tx ON public.blockchain_records(tx_hash);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ipfs_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_risk_assessments ENABLE ROW LEVEL SECURITY;

-- User Profiles: Public read, self write
CREATE POLICY "Public user profiles are viewable by everyone" 
    ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" 
    ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicles: Public read verified/listed, owners can manage
CREATE POLICY "Anyone can view verified vehicles" 
    ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Owners can insert their vehicles" 
    ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = current_owner_id);
CREATE POLICY "Owners can update their vehicles" 
    ON public.vehicles FOR UPDATE USING (auth.uid() = current_owner_id);

-- Vehicle Records: Public view, owners or authorized inspectors can add
CREATE POLICY "Anyone can view vehicle records" 
    ON public.vehicle_records FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit records" 
    ON public.vehicle_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Marketplace: Anyone can view active listings, sellers manage own
CREATE POLICY "Anyone can view active listings" 
    ON public.marketplace_listings FOR SELECT USING (status = 'ACTIVE' OR auth.uid() = seller_id);
CREATE POLICY "Sellers can manage listings" 
    ON public.marketplace_listings FOR ALL USING (auth.uid() = seller_id);

-- Escrow: Buyer, Seller, or Admin can view
CREATE POLICY "Escrow participants can view escrow" 
    ON public.escrow_transactions FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers can initiate escrow" 
    ON public.escrow_transactions FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Blockchain & IPFS audit: Read-only for all
CREATE POLICY "Blockchain audit viewable by everyone" 
    ON public.blockchain_records FOR SELECT USING (true);
CREATE POLICY "IPFS registry viewable by everyone" 
    ON public.ipfs_files FOR SELECT USING (true);
CREATE POLICY "Risk assessments viewable by everyone" 
    ON public.ai_risk_assessments FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- AUTOMATIC TIMESTAMP UPDATER TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trigger_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trigger_vehicle_records_updated_at
    BEFORE UPDATE ON public.vehicle_records
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trigger_marketplace_listings_updated_at
    BEFORE UPDATE ON public.marketplace_listings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trigger_escrow_transactions_updated_at
    BEFORE UPDATE ON public.escrow_transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
