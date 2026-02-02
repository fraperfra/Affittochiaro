-- Affittochiaro Database Schema (Simplified - No PostGIS)
-- Migration: 001_initial_schema_simple

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cognito_sub VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('tenant', 'agency', 'admin')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(50),
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cognito_sub ON users(cognito_sub);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- TENANT PROFILES
-- ============================================================

CREATE TABLE tenant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL DEFAULT '',
    last_name VARCHAR(100) NOT NULL DEFAULT '',
    avatar_url TEXT,
    date_of_birth DATE,
    bio TEXT,
    occupation VARCHAR(100),
    employment_type VARCHAR(30) CHECK (employment_type IN ('permanent', 'fixed_term', 'freelance', 'internship', 'student', 'retired', 'unemployed')),
    employer VARCHAR(255),
    annual_income DECIMAL(12,2),
    income_visible BOOLEAN DEFAULT TRUE,
    employment_start_date DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    has_video BOOLEAN DEFAULT FALSE,
    video_url TEXT,
    profile_completeness INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    reviews_count INTEGER DEFAULT 0,
    current_city VARCHAR(100),
    current_province VARCHAR(50),
    available_from DATE,
    profile_views INTEGER DEFAULT 0,
    applications_sent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_tenant_user UNIQUE (user_id)
);

CREATE INDEX idx_tenant_profiles_user_id ON tenant_profiles(user_id);
CREATE INDEX idx_tenant_profiles_city ON tenant_profiles(current_city);

-- ============================================================
-- TENANT PREFERENCES
-- ============================================================

CREATE TABLE tenant_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    max_budget DECIMAL(10,2),
    min_rooms INTEGER,
    max_rooms INTEGER,
    preferred_cities TEXT[] DEFAULT '{}',
    has_pets BOOLEAN DEFAULT FALSE,
    pet_type VARCHAR(50),
    furnished VARCHAR(20) DEFAULT 'indifferent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_tenant_preferences UNIQUE (tenant_id)
);

-- ============================================================
-- TENANT DOCUMENTS
-- ============================================================

CREATE TABLE tenant_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tenant_documents_tenant ON tenant_documents(tenant_id);

-- ============================================================
-- AGENCY PROFILES
-- ============================================================

CREATE TABLE agency_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,
    vat_number VARCHAR(20) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    website TEXT,
    street VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(50),
    postal_code VARCHAR(10),
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'base', 'professional', 'enterprise')),
    credits INTEGER DEFAULT 5,
    credits_used_this_month INTEGER DEFAULT 0,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    listings_count INTEGER DEFAULT 0,
    active_listings_count INTEGER DEFAULT 0,
    tenants_unlocked INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2),
    reviews_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_agency_user UNIQUE (user_id)
);

CREATE INDEX idx_agency_profiles_user_id ON agency_profiles(user_id);
CREATE INDEX idx_agency_profiles_city ON agency_profiles(city);

-- ============================================================
-- LISTINGS
-- ============================================================

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agency_profiles(id) ON DELETE CASCADE,
    external_id VARCHAR(255),
    external_source VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    property_type VARCHAR(30) NOT NULL,
    street VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(50),
    postal_code VARCHAR(10),
    zone VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    price DECIMAL(10,2) NOT NULL,
    expenses DECIMAL(10,2),
    deposit DECIMAL(10,2),
    rooms INTEGER NOT NULL,
    bathrooms INTEGER DEFAULT 1,
    square_meters INTEGER NOT NULL,
    floor INTEGER,
    total_floors INTEGER,
    features JSONB DEFAULT '[]',
    furnished VARCHAR(20),
    available_from DATE,
    pets_allowed BOOLEAN DEFAULT FALSE,
    smoking_allowed BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    saved_count INTEGER DEFAULT 0,
    status VARCHAR(30) DEFAULT 'draft',
    is_highlighted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_listings_agency ON listings(agency_id);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_status ON listings(status);

-- ============================================================
-- LISTING IMAGES
-- ============================================================

CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    position INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_listing_images_listing ON listing_images(listing_id);

-- ============================================================
-- APPLICATIONS
-- ============================================================

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(30) DEFAULT 'pending',
    match_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_application UNIQUE (listing_id, tenant_id)
);

CREATE INDEX idx_applications_listing ON applications(listing_id);
CREATE INDEX idx_applications_tenant ON applications(tenant_id);

-- ============================================================
-- CREDIT TRANSACTIONS
-- ============================================================

CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agency_profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    related_tenant_id UUID REFERENCES tenant_profiles(id),
    stripe_payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_agency ON credit_transactions(agency_id);

-- ============================================================
-- UNLOCKED TENANTS
-- ============================================================

CREATE TABLE unlocked_tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agency_profiles(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    credits_cost INTEGER NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_unlock UNIQUE (agency_id, tenant_id)
);

CREATE INDEX idx_unlocked_tenants_agency ON unlocked_tenants(agency_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);

-- ============================================================
-- NOTIFICATION PREFERENCES
-- ============================================================

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_new_matches BOOLEAN DEFAULT TRUE,
    email_applications BOOLEAN DEFAULT TRUE,
    email_marketing BOOLEAN DEFAULT FALSE,
    push_new_matches BOOLEAN DEFAULT TRUE,
    push_applications BOOLEAN DEFAULT TRUE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    whatsapp_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- ============================================================
-- MATCH SCORES
-- ============================================================

CREATE TABLE match_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    budget_score DECIMAL(5,2),
    location_score DECIMAL(5,2),
    total_score DECIMAL(5,2) NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_match_score UNIQUE (tenant_id, listing_id)
);

CREATE INDEX idx_match_scores_tenant ON match_scores(tenant_id);
CREATE INDEX idx_match_scores_listing ON match_scores(listing_id);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_profiles_updated_at BEFORE UPDATE ON tenant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agency_profiles_updated_at BEFORE UPDATE ON agency_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
