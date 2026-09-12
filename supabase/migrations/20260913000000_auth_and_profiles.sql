-- ==============================================================================
-- CARNODES AUTHENTICATION & AUTHORIZATION SCHEMA MIGRATION
-- Adds user_profiles, vehicles, escrow, auth triggers, auto-confirm & demo seeds
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES (Extends Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT NOT NULL,
    phone TEXT,
    wallet_address TEXT,
    role TEXT NOT NULL CHECK (role IN ('USER', 'BUYER', 'SELLER', 'DEALER', 'SERVICE_CENTER', 'INSPECTOR', 'RTO_ADMIN', 'AUTHORITY', 'ADMIN')) DEFAULT 'USER',
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
-- 3. VEHICLE RECORDS
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
-- 10. INDEXES
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
-- 11. ROW LEVEL SECURITY (RLS)
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

-- User Profiles policies
DROP POLICY IF EXISTS "Public user profiles are viewable by everyone" ON public.user_profiles;
CREATE POLICY "Public user profiles are viewable by everyone" 
    ON public.user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" 
    ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicles policies
DROP POLICY IF EXISTS "Anyone can view verified vehicles" ON public.vehicles;
CREATE POLICY "Anyone can view verified vehicles" 
    ON public.vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners can insert their vehicles" ON public.vehicles;
CREATE POLICY "Owners can insert their vehicles" 
    ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = current_owner_id);

DROP POLICY IF EXISTS "Owners can update their vehicles" ON public.vehicles;
CREATE POLICY "Owners can update their vehicles" 
    ON public.vehicles FOR UPDATE USING (auth.uid() = current_owner_id);

-- Vehicle Records policies
DROP POLICY IF EXISTS "Anyone can view vehicle records" ON public.vehicle_records;
CREATE POLICY "Anyone can view vehicle records" 
    ON public.vehicle_records FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can submit records" ON public.vehicle_records;
CREATE POLICY "Authenticated users can submit records" 
    ON public.vehicle_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Marketplace policies
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.marketplace_listings;
CREATE POLICY "Anyone can view active listings" 
    ON public.marketplace_listings FOR SELECT USING (status = 'ACTIVE' OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can manage listings" ON public.marketplace_listings;
CREATE POLICY "Sellers can manage listings" 
    ON public.marketplace_listings FOR ALL USING (auth.uid() = seller_id);

-- Escrow policies
DROP POLICY IF EXISTS "Escrow participants can view escrow" ON public.escrow_transactions;
CREATE POLICY "Escrow participants can view escrow" 
    ON public.escrow_transactions FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Buyers can initiate escrow" ON public.escrow_transactions;
CREATE POLICY "Buyers can initiate escrow" 
    ON public.escrow_transactions FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Audit and IPFS: Read-only for all
DROP POLICY IF EXISTS "Blockchain audit viewable by everyone" ON public.blockchain_records;
CREATE POLICY "Blockchain audit viewable by everyone" 
    ON public.blockchain_records FOR SELECT USING (true);

DROP POLICY IF EXISTS "IPFS registry viewable by everyone" ON public.ipfs_files;
CREATE POLICY "IPFS registry viewable by everyone" 
    ON public.ipfs_files FOR SELECT USING (true);

DROP POLICY IF EXISTS "Risk assessments viewable by everyone" ON public.ai_risk_assessments;
CREATE POLICY "Risk assessments viewable by everyone" 
    ON public.ai_risk_assessments FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- 12. AUTOMATIC TIMESTAMP UPDATER TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER trigger_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_vehicle_records_updated_at ON public.vehicle_records;
CREATE TRIGGER trigger_vehicle_records_updated_at
    BEFORE UPDATE ON public.vehicle_records
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_marketplace_listings_updated_at ON public.marketplace_listings;
CREATE TRIGGER trigger_marketplace_listings_updated_at
    BEFORE UPDATE ON public.marketplace_listings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_escrow_transactions_updated_at ON public.escrow_transactions;
CREATE TRIGGER trigger_escrow_transactions_updated_at
    BEFORE UPDATE ON public.escrow_transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 13. AUTH.USERS TRIGGERS (Automatic Profile Creation & Auto-Confirm)
-- ------------------------------------------------------------------------------

-- Auto-confirm newly registered users so verification emails don't block development/demo
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- Automatically populate public.user_profiles when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_role TEXT;
BEGIN
  extracted_role := UPPER(COALESCE(NEW.raw_user_meta_data->>'role', 'BUYER'));
  IF extracted_role NOT IN ('USER', 'BUYER', 'SELLER', 'DEALER', 'SERVICE_CENTER', 'INSPECTOR', 'RTO_ADMIN', 'AUTHORITY', 'ADMIN') THEN
    extracted_role := 'BUYER';
  END IF;

  INSERT INTO public.user_profiles (id, email, name, phone, wallet_address, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'wallet_address',
    extracted_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.user_profiles.name),
    phone = COALESCE(EXCLUDED.phone, public.user_profiles.phone),
    wallet_address = COALESCE(EXCLUDED.wallet_address, public.user_profiles.wallet_address),
    role = COALESCE(EXCLUDED.role, public.user_profiles.role),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 14. SEED DEMO USERS (Buyer, Seller, Authority)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  buyer_id UUID := '11111111-1111-1111-1111-111111111111';
  seller_id UUID := '22222222-2222-2222-2222-222222222222';
  authority_id UUID := '33333333-3333-3333-3333-333333333333';
  enc_pw TEXT;
BEGIN
  enc_pw := crypt('Buyer123!', gen_salt('bf'));
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'buyer@carnodes.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', buyer_id, 'authenticated', 'authenticated',
      'buyer@carnodes.com', enc_pw, NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Arjun Mehta (Demo Buyer)","phone":"+91 98201 48291","role":"BUYER","wallet_address":"0x71C7656EC7ab88b098defB751B7401B5f6d8976F"}',
      NOW(), NOW()
    );
  END IF;

  enc_pw := crypt('Seller123!', gen_salt('bf'));
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'seller@carnodes.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', seller_id, 'authenticated', 'authenticated',
      'seller@carnodes.com', enc_pw, NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Vikram Singhania (Apex Dealership)","phone":"+91 94102 98231","role":"SELLER","wallet_address":"0x3F89E1983021D4Bc00192A0b889dECF4711aA921"}',
      NOW(), NOW()
    );
  END IF;

  enc_pw := crypt('Authority123!', gen_salt('bf'));
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'authority@carnodes.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', authority_id, 'authenticated', 'authenticated',
      'authority@carnodes.com', enc_pw, NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Dr. Rajesh Sharma (RTO Inspector #409)","phone":"+91 11 2309 4912","role":"AUTHORITY","wallet_address":"0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"}',
      NOW(), NOW()
    );
  END IF;
END $$;
