-- ========================================
-- 🏗️ CREATE SCHEMAS FOR MULTI-APP ARCHITECTURE
-- ========================================

-- Create schemas for different applications
CREATE SCHEMA IF NOT EXISTS academies;
CREATE SCHEMA IF NOT EXISTS financial;
CREATE SCHEMA IF NOT EXISTS shared;

-- Set search path to include all schemas
ALTER DATABASE postgres SET search_path TO academies, financial, shared, public;

-- ========================================
-- 📊 SHARED SCHEMA - Cross-app shared tables
-- ========================================

-- Database connections registry
CREATE TABLE IF NOT EXISTS shared.database_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_name VARCHAR(100) NOT NULL UNIQUE,
    app_schema VARCHAR(50) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INTEGER DEFAULT 5432,
    database_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_encrypted TEXT NOT NULL, -- Will be encrypted
    supabase_url VARCHAR(255),
    supabase_anon_key TEXT,
    supabase_service_key TEXT,
    api_endpoints JSONB DEFAULT '{}',
    connection_config JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'testing')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Global system settings
CREATE TABLE IF NOT EXISTS shared.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_category VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(setting_category, setting_key)
);

-- Cross-app audit log
CREATE TABLE IF NOT EXISTS shared.cross_app_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_schema VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    user_role VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 🎓 ACADEMIES SCHEMA - Move existing tables
-- ========================================

-- User profiles (moved from public)
CREATE TABLE IF NOT EXISTS academies.user_profiles_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'coach', 'parent', 'player', 'board_member', 'marketing', 'sponsor')),
    phone_number VARCHAR(20),
    address TEXT,
    profile_photo TEXT,
    date_of_birth DATE,
    emergency_contact JSONB,
    language_preference VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    
    -- Sponsor specific fields
    company_name VARCHAR(255),
    website_url VARCHAR(255),
    package_type VARCHAR(50) CHECK (package_type IN ('bronze', 'silver', 'gold', 'custom')),
    logo TEXT,
    
    -- Player specific fields
    jersey_number INTEGER,
    position VARCHAR(50),
    team_id UUID,
    
    -- Parent specific fields
    occupation VARCHAR(100),
    
    -- Coach specific fields
    certification_level VARCHAR(50),
    specialization VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams
CREATE TABLE IF NOT EXISTS academies.teams_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    age_group VARCHAR(50),
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'mixed')),
    season VARCHAR(50),
    coach_id UUID REFERENCES academies.user_profiles_sa2025(id),
    assistant_coach_id UUID REFERENCES academies.user_profiles_sa2025(id),
    max_players INTEGER DEFAULT 25,
    current_players INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player profiles (extended)
CREATE TABLE IF NOT EXISTS academies.player_profiles_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES academies.user_profiles_sa2025(id) ON DELETE CASCADE,
    player_number INTEGER,
    team_id UUID REFERENCES academies.teams_sa2025(id),
    position VARCHAR(50),
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    medical_info JSONB,
    dietary_restrictions TEXT,
    equipment_size JSONB,
    registration_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent profiles
CREATE TABLE IF NOT EXISTS academies.parent_profiles_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES academies.user_profiles_sa2025(id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    workplace VARCHAR(255),
    emergency_contact_relationship VARCHAR(50),
    can_transport BOOLEAN DEFAULT FALSE,
    volunteer_interests TEXT[],
    communication_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player-Parent relationships
CREATE TABLE IF NOT EXISTS academies.player_parent_links_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES academies.player_profiles_sa2025(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES academies.parent_profiles_sa2025(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('father', 'mother', 'guardian', 'emergency_contact')),
    is_primary BOOLEAN DEFAULT FALSE,
    can_pickup BOOLEAN DEFAULT TRUE,
    financial_responsibility BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, parent_id, relationship_type)
);

-- Coach profiles
CREATE TABLE IF NOT EXISTS academies.coach_profiles_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES academies.user_profiles_sa2025(id) ON DELETE CASCADE,
    certification_level VARCHAR(50),
    certification_expiry DATE,
    specialization VARCHAR(100),
    experience_years INTEGER,
    background_check_date DATE,
    first_aid_certified BOOLEAN DEFAULT FALSE,
    languages_spoken VARCHAR(100)[],
    coaching_philosophy TEXT,
    availability JSONB,
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations
CREATE TABLE IF NOT EXISTS academies.locations_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Greece',
    coordinates POINT,
    facility_type VARCHAR(50) CHECK (facility_type IN ('indoor', 'outdoor', 'mixed')),
    capacity INTEGER,
    amenities TEXT[],
    contact_info JSONB,
    rental_cost DECIMAL(10,2),
    availability_schedule JSONB,
    active_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events and scheduling
CREATE TABLE IF NOT EXISTS academies.events_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('training', 'match', 'tournament', 'meeting', 'social', 'fundraiser')),
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    location_id UUID REFERENCES academies.locations_sa2025(id),
    team_id UUID REFERENCES academies.teams_sa2025(id),
    coach_id UUID REFERENCES academies.coach_profiles_sa2025(id),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule JSONB,
    created_by UUID REFERENCES academies.user_profiles_sa2025(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store products
CREATE TABLE IF NOT EXISTS academies.products_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    cost DECIMAL(10,2) CHECK (cost >= 0),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    images TEXT[],
    specifications JSONB,
    dimensions JSONB,
    weight DECIMAL(8,2),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    tax_rate DECIMAL(5,4) DEFAULT 0.24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product categories
CREATE TABLE IF NOT EXISTS academies.product_categories_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id UUID REFERENCES academies.product_categories_sa2025(id),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 💰 FINANCIAL SCHEMA - Financial operations
-- ========================================

-- Payment records
CREATE TABLE IF NOT EXISTS financial.payments_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academy_id UUID, -- Reference to academy in academies schema
    player_id UUID, -- Reference to player in academies schema
    parent_id UUID, -- Reference to parent in academies schema
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('subscription', 'registration', 'equipment', 'tournament', 'camp', 'store_purchase', 'penalty', 'refund')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'paypal', 'stripe', 'other')),
    transaction_id VARCHAR(255),
    external_payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    payment_date TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    receipt_url TEXT,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    processed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS financial.invoices_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academy_id UUID,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    player_id UUID,
    parent_id UUID,
    invoice_type VARCHAR(50) NOT NULL CHECK (invoice_type IN ('monthly', 'registration', 'equipment', 'tournament', 'camp', 'penalty', 'custom')),
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    payment_terms INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled')),
    description TEXT,
    line_items JSONB DEFAULT '[]',
    discount_amount DECIMAL(10,2) DEFAULT 0,
    discount_reason TEXT,
    notes TEXT,
    terms_conditions TEXT,
    pdf_url TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial transactions
CREATE TABLE IF NOT EXISTS financial.transactions_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academy_id UUID,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer', 'adjustment')),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    description TEXT NOT NULL,
    reference_id UUID, -- Can reference invoices, payments, etc.
    reference_type VARCHAR(50),
    account VARCHAR(100),
    payment_method VARCHAR(50),
    transaction_date DATE DEFAULT CURRENT_DATE,
    reconciled BOOLEAN DEFAULT FALSE,
    reconciled_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    attachments TEXT[],
    created_by UUID,
    approved_by UUID,
    approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fee structures
CREATE TABLE IF NOT EXISTS financial.fee_structures_sa2025 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academy_id UUID,
    name VARCHAR(100) NOT NULL,
    fee_type VARCHAR(50) NOT NULL CHECK (fee_type IN ('monthly', 'seasonal', 'annual', 'one_time')),
    age_group VARCHAR(50),
    team_category VARCHAR(50),
    base_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    discount_rules JSONB DEFAULT '[]',
    late_fee_amount DECIMAL(10,2) DEFAULT 0,
    late_fee_days INTEGER DEFAULT 7,
    early_bird_discount DECIMAL(5,2) DEFAULT 0,
    early_bird_deadline DATE,
    family_discount_percent DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 🔐 ROW LEVEL SECURITY SETUP
-- ========================================

-- Enable RLS on all tables
ALTER TABLE shared.database_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared.cross_app_audit_log ENABLE ROW LEVEL SECURITY;

ALTER TABLE academies.user_profiles_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies.teams_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies.player_profiles_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies.parent_profiles_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies.player_parent_links_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies.coach_profiles_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies.locations_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies.events_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies.products_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies.product_categories_sa2025 ENABLE ROW LEVEL SECURITY;

ALTER TABLE financial.payments_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.invoices_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.transactions_sa2025 ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.fee_structures_sa2025 ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 📝 BASIC RLS POLICIES
-- ========================================

-- Shared schema policies (admin only for database connections)
CREATE POLICY "Super admins can manage database connections" ON shared.database_connections
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM academies.user_profiles_sa2025 
            WHERE auth_user_id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Academies schema policies
CREATE POLICY "Users can view their own profile" ON academies.user_profiles_sa2025
    FOR SELECT TO authenticated
    USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON academies.user_profiles_sa2025
    FOR UPDATE TO authenticated
    USING (auth_user_id = auth.uid());

-- Financial schema policies (role-based access)
CREATE POLICY "Financial data access by role" ON financial.payments_sa2025
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM academies.user_profiles_sa2025 
            WHERE auth_user_id = auth.uid() 
            AND role IN ('admin', 'manager', 'parent')
        )
    );

-- ========================================
-- 🔄 FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON academies.user_profiles_sa2025
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON academies.teams_sa2025
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON financial.payments_sa2025
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function for cross-app audit logging
CREATE OR REPLACE FUNCTION log_cross_app_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO shared.cross_app_audit_log (
        app_schema,
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        user_id
    ) VALUES (
        TG_TABLE_SCHEMA,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
        auth.uid()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- ========================================
-- 🔧 INDEXES FOR PERFORMANCE
-- ========================================

-- Shared schema indexes
CREATE INDEX IF NOT EXISTS idx_database_connections_app_schema ON shared.database_connections(app_schema);
CREATE INDEX IF NOT EXISTS idx_system_settings_category_key ON shared.system_settings(setting_category, setting_key);
CREATE INDEX IF NOT EXISTS idx_audit_log_app_schema_table ON shared.cross_app_audit_log(app_schema, table_name);

-- Academies schema indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON academies.user_profiles_sa2025(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON academies.user_profiles_sa2025(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON academies.user_profiles_sa2025(email);
CREATE INDEX IF NOT EXISTS idx_teams_coach_id ON academies.teams_sa2025(coach_id);
CREATE INDEX IF NOT EXISTS idx_player_profiles_team_id ON academies.player_profiles_sa2025(team_id);
CREATE INDEX IF NOT EXISTS idx_events_date_time ON academies.events_sa2025(date_time);
CREATE INDEX IF NOT EXISTS idx_events_team_id ON academies.events_sa2025(team_id);

-- Financial schema indexes
CREATE INDEX IF NOT EXISTS idx_payments_player_id ON financial.payments_sa2025(player_id);
CREATE INDEX IF NOT EXISTS idx_payments_parent_id ON financial.payments_sa2025(parent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON financial.payments_sa2025(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON financial.payments_sa2025(payment_date);
CREATE INDEX IF NOT EXISTS idx_invoices_player_id ON financial.invoices_sa2025(player_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON financial.invoices_sa2025(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON financial.invoices_sa2025(due_date);

-- ========================================
-- 📊 INSERT DEFAULT DATA
-- ========================================

-- Default product categories
INSERT INTO academies.product_categories_sa2025 (name, description) VALUES
('Equipment', 'Sports equipment and gear'),
('Apparel', 'Clothing and uniforms'),
('Accessories', 'Additional sports accessories'),
('Nutrition', 'Sports nutrition and supplements')
ON CONFLICT (name) DO NOTHING;

-- Default system settings
INSERT INTO shared.system_settings (setting_category, setting_key, setting_value, description) VALUES
('app', 'multi_schema_enabled', 'true', 'Enable multi-schema architecture'),
('app', 'default_currency', '"EUR"', 'Default currency for financial operations'),
('app', 'default_timezone', '"Europe/Athens"', 'Default timezone for the application'),
('security', 'session_timeout', '3600', 'Session timeout in seconds'),
('financial', 'tax_rate', '0.24', 'Default tax rate for Greece'),
('financial', 'late_fee_days', '7', 'Days before late fee is applied')
ON CONFLICT (setting_category, setting_key) DO NOTHING;

COMMENT ON SCHEMA academies IS 'Schema for sports academy management - teams, players, coaches, events';
COMMENT ON SCHEMA financial IS 'Schema for financial operations - payments, invoices, transactions';
COMMENT ON SCHEMA shared IS 'Schema for shared resources across all applications';