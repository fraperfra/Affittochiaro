-- Affittochiaro Database Schema
-- Migration: 001_initial_schema
-- Description: Creates all core tables for the rental platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geolocation queries

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
CREATE INDEX idx_users_status ON users(status);

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

    -- Employment
    occupation VARCHAR(100),
    employment_type VARCHAR(30) CHECK (employment_type IN ('permanent', 'fixed_term', 'freelance', 'internship', 'student', 'retired', 'unemployed')),
    employer VARCHAR(255),
    annual_income DECIMAL(12,2),
    income_visible BOOLEAN DEFAULT TRUE,
    employment_start_date DATE,

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    has_video BOOLEAN DEFAULT FALSE,
    video_url TEXT,
    video_duration INTEGER,
    video_uploaded_at TIMESTAMP WITH TIME ZONE,

    -- Profile metrics
    profile_completeness INTEGER DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0,

    -- Current location
    current_city VARCHAR(100),
    current_street VARCHAR(255),
    current_province VARCHAR(50),
    current_postal_code VARCHAR(10),

    -- Status
    available_from DATE,
    profile_views INTEGER DEFAULT 0,
    applications_sent INTEGER DEFAULT 0,
    matches_received INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_tenant_user UNIQUE (user_id)
);

CREATE INDEX idx_tenant_profiles_user_id ON tenant_profiles(user_id);
CREATE INDEX idx_tenant_profiles_city ON tenant_profiles(current_city);
CREATE INDEX idx_tenant_profiles_verified ON tenant_profiles(is_verified);
CREATE INDEX idx_tenant_profiles_employment ON tenant_profiles(employment_type);
CREATE INDEX idx_tenant_profiles_completeness ON tenant_profiles(profile_completeness DESC);

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
    furnished VARCHAR(20) DEFAULT 'indifferent' CHECK (furnished IN ('yes', 'no', 'indifferent')),
    smoking_allowed BOOLEAN,
    parking_required BOOLEAN,
    available_from DATE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_tenant_preferences UNIQUE (tenant_id)
);

CREATE INDEX idx_tenant_preferences_tenant ON tenant_preferences(tenant_id);
CREATE INDEX idx_tenant_preferences_budget ON tenant_preferences(max_budget);

-- ============================================================
-- TENANT DOCUMENTS
-- ============================================================

CREATE TABLE tenant_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('identity_card', 'fiscal_code', 'payslip', 'employment_contract', 'bank_statement', 'tax_return', 'guarantee', 'reference_letter', 'other')),
    name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    rejection_reason TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id)
);

CREATE INDEX idx_tenant_documents_tenant ON tenant_documents(tenant_id);
CREATE INDEX idx_tenant_documents_status ON tenant_documents(status);
CREATE INDEX idx_tenant_documents_type ON tenant_documents(type);

-- ============================================================
-- AGENCY PROFILES
-- ============================================================

CREATE TABLE agency_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,

    -- Business info
    vat_number VARCHAR(20) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    website TEXT,

    -- Address
    street VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(50),
    postal_code VARCHAR(10),

    -- Subscription
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'base', 'professional', 'enterprise')),
    credits INTEGER DEFAULT 5,
    credits_used_this_month INTEGER DEFAULT 0,
    plan_start_date DATE,
    plan_expires_at DATE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),

    -- Stats
    listings_count INTEGER DEFAULT 0,
    active_listings_count INTEGER DEFAULT 0,
    tenants_unlocked INTEGER DEFAULT 0,
    matches_count INTEGER DEFAULT 0,

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_agency_user UNIQUE (user_id)
);

CREATE INDEX idx_agency_profiles_user_id ON agency_profiles(user_id);
CREATE INDEX idx_agency_profiles_city ON agency_profiles(city);
CREATE INDEX idx_agency_profiles_plan ON agency_profiles(plan);
CREATE INDEX idx_agency_profiles_vat ON agency_profiles(vat_number);
CREATE INDEX idx_agency_profiles_stripe ON agency_profiles(stripe_customer_id);

-- ============================================================
-- LISTINGS
-- ============================================================

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agency_profiles(id) ON DELETE CASCADE,
    external_id VARCHAR(255),
    external_source VARCHAR(50) CHECK (external_source IN ('immobiliare_it', 'casa_it', 'native')),

    -- Basic info
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    property_type VARCHAR(30) NOT NULL CHECK (property_type IN ('apartment', 'studio', 'loft', 'villa', 'house', 'room', 'office', 'commercial')),

    -- Location
    street VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(50),
    postal_code VARCHAR(10),
    zone VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    location GEOGRAPHY(POINT, 4326), -- PostGIS for geo queries

    -- Details
    price DECIMAL(10,2) NOT NULL,
    expenses DECIMAL(10,2),
    deposit DECIMAL(10,2),
    rooms INTEGER NOT NULL,
    bathrooms INTEGER DEFAULT 1,
    square_meters INTEGER NOT NULL,
    floor INTEGER,
    total_floors INTEGER,

    -- Features (stored as JSONB for flexibility)
    features JSONB DEFAULT '[]',
    furnished VARCHAR(20) CHECK (furnished IN ('yes', 'no', 'partial')),
    heating_type VARCHAR(30),
    energy_class VARCHAR(5),

    -- Availability
    available_from DATE,
    min_contract_duration INTEGER, -- months

    -- Preferences
    pets_allowed BOOLEAN DEFAULT FALSE,
    smoking_allowed BOOLEAN DEFAULT FALSE,
    students_allowed BOOLEAN DEFAULT TRUE,
    couples_allowed BOOLEAN DEFAULT TRUE,

    -- Stats
    views INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    saved_count INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'active', 'paused', 'rented', 'expired', 'rejected')),
    is_highlighted BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT unique_external_listing UNIQUE (external_id, external_source)
);

CREATE INDEX idx_listings_agency ON listings(agency_id);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_property_type ON listings(property_type);
CREATE INDEX idx_listings_rooms ON listings(rooms);
CREATE INDEX idx_listings_external ON listings(external_id, external_source);
CREATE INDEX idx_listings_created ON listings(created_at DESC);
CREATE INDEX idx_listings_location ON listings USING GIST(location);

-- Trigger to update location from lat/lng
CREATE OR REPLACE FUNCTION update_listing_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listing_location_trigger
    BEFORE INSERT OR UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_listing_location();

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
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
    match_score DECIMAL(5,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT unique_application UNIQUE (listing_id, tenant_id)
);

CREATE INDEX idx_applications_listing ON applications(listing_id);
CREATE INDEX idx_applications_tenant ON applications(tenant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created ON applications(created_at DESC);

-- ============================================================
-- CREDIT TRANSACTIONS
-- ============================================================

CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agency_profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund', 'subscription')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    related_tenant_id UUID REFERENCES tenant_profiles(id),
    stripe_payment_id VARCHAR(255),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_agency ON credit_transactions(agency_id);
CREATE INDEX idx_credit_transactions_created ON credit_transactions(created_at DESC);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);

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
CREATE INDEX idx_unlocked_tenants_tenant ON unlocked_tenants(tenant_id);

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

    -- Delivery tracking
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
    push_sent BOOLEAN DEFAULT FALSE,
    push_sent_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================================
-- NOTIFICATION PREFERENCES
-- ============================================================

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Email preferences
    email_profile_views BOOLEAN DEFAULT TRUE,
    email_new_matches BOOLEAN DEFAULT TRUE,
    email_applications BOOLEAN DEFAULT TRUE,
    email_documents BOOLEAN DEFAULT TRUE,
    email_marketing BOOLEAN DEFAULT FALSE,

    -- Push preferences
    push_profile_views BOOLEAN DEFAULT TRUE,
    push_new_matches BOOLEAN DEFAULT TRUE,
    push_applications BOOLEAN DEFAULT TRUE,
    push_documents BOOLEAN DEFAULT TRUE,

    -- WhatsApp preferences
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    whatsapp_number VARCHAR(50),
    whatsapp_applications BOOLEAN DEFAULT TRUE,
    whatsapp_matches BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- ============================================================
-- MATCHING SCORES (Pre-calculated for performance)
-- ============================================================

CREATE TABLE match_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

    -- Individual scores (0-100)
    budget_score DECIMAL(5,2),
    location_score DECIMAL(5,2),
    income_ratio_score DECIMAL(5,2),
    employment_score DECIMAL(5,2),
    lifestyle_score DECIMAL(5,2),

    -- Overall weighted score
    total_score DECIMAL(5,2) NOT NULL,

    -- Weights used for calculation
    weights_version INTEGER DEFAULT 1,

    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_match_score UNIQUE (tenant_id, listing_id)
);

CREATE INDEX idx_match_scores_tenant ON match_scores(tenant_id);
CREATE INDEX idx_match_scores_listing ON match_scores(listing_id);
CREATE INDEX idx_match_scores_total ON match_scores(total_score DESC);

-- ============================================================
-- SCRAPED LISTINGS (Staging table)
-- ============================================================

CREATE TABLE scraped_listings_raw (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    raw_data JSONB NOT NULL,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,

    CONSTRAINT unique_scraped_listing UNIQUE (source, external_id)
);

CREATE INDEX idx_scraped_raw_source ON scraped_listings_raw(source);
CREATE INDEX idx_scraped_raw_processed ON scraped_listings_raw(processed);

-- ============================================================
-- SAVED LISTINGS (Tenant bookmarks)
-- ============================================================

CREATE TABLE saved_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_saved_listing UNIQUE (tenant_id, listing_id)
);

CREATE INDEX idx_saved_listings_tenant ON saved_listings(tenant_id);

-- ============================================================
-- AUDIT LOG (For compliance)
-- ============================================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- ============================================================
-- ADMIN PERMISSIONS
-- ============================================================

CREATE TABLE admin_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(50) NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),

    CONSTRAINT unique_admin_permission UNIQUE (user_id, permission)
);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_profiles_updated_at BEFORE UPDATE ON tenant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_preferences_updated_at BEFORE UPDATE ON tenant_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agency_profiles_updated_at BEFORE UPDATE ON agency_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AGENCY STATS TRIGGERS
-- ============================================================

-- Update agency listing counts
CREATE OR REPLACE FUNCTION update_agency_listing_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE agency_profiles SET
            listings_count = listings_count + 1,
            active_listings_count = active_listings_count + CASE WHEN NEW.status = 'active' THEN 1 ELSE 0 END
        WHERE id = NEW.agency_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status THEN
            UPDATE agency_profiles SET
                active_listings_count = active_listings_count +
                    CASE WHEN NEW.status = 'active' THEN 1 ELSE 0 END -
                    CASE WHEN OLD.status = 'active' THEN 1 ELSE 0 END
            WHERE id = NEW.agency_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE agency_profiles SET
            listings_count = listings_count - 1,
            active_listings_count = active_listings_count - CASE WHEN OLD.status = 'active' THEN 1 ELSE 0 END
        WHERE id = OLD.agency_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listing_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_agency_listing_stats();

-- Update listing application counts
CREATE OR REPLACE FUNCTION update_listing_application_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE listings SET applications_count = applications_count + 1 WHERE id = NEW.listing_id;
        UPDATE tenant_profiles SET applications_sent = applications_sent + 1 WHERE id = NEW.tenant_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE listings SET applications_count = applications_count - 1 WHERE id = OLD.listing_id;
        UPDATE tenant_profiles SET applications_sent = applications_sent - 1 WHERE id = OLD.tenant_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER application_stats_trigger
    AFTER INSERT OR DELETE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_listing_application_stats();

COMMENT ON TABLE users IS 'Core user accounts linked to Cognito';
COMMENT ON TABLE tenant_profiles IS 'Extended profiles for tenant users';
COMMENT ON TABLE agency_profiles IS 'Extended profiles for agency users with subscription info';
COMMENT ON TABLE listings IS 'Property listings posted by agencies or scraped from external sources';
COMMENT ON TABLE applications IS 'Tenant applications to listings';
COMMENT ON TABLE match_scores IS 'Pre-calculated compatibility scores between tenants and listings';
COMMENT ON TABLE credit_transactions IS 'History of credit purchases and usage by agencies';
