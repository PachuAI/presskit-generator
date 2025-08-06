# 9. DATABASE SCHEMA

### PostgreSQL Schema (Supabase)

#### Core Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Auth integration
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    
    -- Profile info
    artist_name TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    
    -- Subscription
    subscription_status TEXT NOT NULL DEFAULT 'free' 
        CHECK (subscription_status IN ('free', 'pro', 'enterprise')),
    presskit_limit INTEGER NOT NULL DEFAULT 3,
    
    -- Social media (JSONB for flexibility)
    social_media JSONB DEFAULT '{}',
    
    -- Contact info
    contact_email TEXT,
    phone TEXT,
    location TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Press kits table
CREATE TABLE presskits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Basic info
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL, -- Snapshot at creation
    template_type TEXT NOT NULL DEFAULT 'basic'
        CHECK (template_type IN ('basic', 'electronic', 'band', 'solo')),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    public_slug TEXT UNIQUE, -- Only when published
    
    -- Content (JSONB for flexibility)
    content_data JSONB NOT NULL DEFAULT '{}',
    
    -- Analytics
    view_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_slug CHECK (
        (is_public = FALSE AND public_slug IS NULL) OR
        (is_public = TRUE AND public_slug IS NOT NULL)
    )
);

-- Templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL
        CHECK (type IN ('basic', 'electronic', 'band', 'solo')),
    description TEXT NOT NULL,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Template configuration (JSONB)
    config JSONB NOT NULL,
    
    -- Version control
    version TEXT NOT NULL DEFAULT '1.0.0',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Subscription details
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    plan TEXT NOT NULL 
        CHECK (plan IN ('free', 'pro', 'enterprise')),
    
    -- Mercado Pago integration
    mp_preapproval_id TEXT,
    mp_payer_id TEXT,
    
    -- Billing periods
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Features (JSONB for flexibility)
    features JSONB NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    canceled_at TIMESTAMPTZ
);

-- Export history table
CREATE TABLE export_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    presskit_id UUID NOT NULL REFERENCES presskits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Export details
    export_type TEXT NOT NULL 
        CHECK (export_type IN ('pdf', 'web', 'social')),
    format_details JSONB DEFAULT '{}',
    
    -- File info
    file_url TEXT,
    file_size BIGINT, -- bytes
    generation_time_ms INTEGER,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'failed')),
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- Can be anonymous
    presskit_id UUID REFERENCES presskits(id) ON DELETE SET NULL,
    
    -- Event details
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    
    -- Session tracking
    session_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment records table
CREATE TABLE payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    -- Mercado Pago data
    mp_payment_id TEXT NOT NULL,
    mp_status TEXT NOT NULL,
    mp_webhook_data JSONB NOT NULL,
    
    -- Payment details
    amount INTEGER NOT NULL, -- in cents
    currency TEXT NOT NULL DEFAULT 'ARS',
    payment_method TEXT,
    
    -- Timestamps
    processed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat sessions table (for AI chat feature)
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Session data
    messages JSONB NOT NULL DEFAULT '[]',
    context JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'abandoned')),
    
    -- Generated presskit (when complete)
    generated_presskit_id UUID REFERENCES presskits(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```

#### Indexes for Performance

```sql
-- User profiles indexes
CREATE INDEX idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_subscription_status ON user_profiles(subscription_status);

-- Press kits indexes
CREATE INDEX idx_presskits_user_id ON presskits(user_id);
CREATE INDEX idx_presskits_status ON presskits(status);
CREATE INDEX idx_presskits_public_slug ON presskits(public_slug) WHERE public_slug IS NOT NULL;
CREATE INDEX idx_presskits_is_public ON presskits(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_presskits_created_at ON presskits(created_at);

-- Templates indexes
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_is_premium ON templates(is_premium);
CREATE INDEX idx_templates_is_active ON templates(is_active) WHERE is_active = TRUE;

-- Analytics indexes
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_presskit_id ON analytics_events(presskit_id);
CREATE INDEX idx_analytics_events_type_created ON analytics_events(event_type, created_at);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Export history indexes
CREATE INDEX idx_export_history_user_id ON export_history(user_id);
CREATE INDEX idx_export_history_presskit_id ON export_history(presskit_id);
CREATE INDEX idx_export_history_status ON export_history(status);
```

#### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE presskits ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = auth_user_id);

-- Press kits policies
CREATE POLICY "Users can view their own presskits"
ON presskits FOR SELECT
USING (auth.uid() = (SELECT auth_user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Anyone can view public presskits"
ON presskits FOR SELECT
USING (is_public = TRUE AND status = 'published');

CREATE POLICY "Users can manage their own presskits"
ON presskits FOR ALL
USING (auth.uid() = (SELECT auth_user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Enforce presskit limits"
ON presskits FOR INSERT
WITH CHECK (
    (SELECT COUNT(*) FROM presskits WHERE user_id = NEW.user_id) < 
    (SELECT presskit_limit FROM user_profiles WHERE id = NEW.user_id)
);

-- Export history policies
CREATE POLICY "Users can view their own exports"
ON export_history FOR SELECT
USING (auth.uid() = (SELECT auth_user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Users can create exports for their presskits"
ON export_history FOR INSERT
WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM user_profiles WHERE id = user_id) AND
    user_id = (SELECT user_id FROM presskits WHERE id = presskit_id)
);

-- Templates are public read-only
CREATE POLICY "Templates are publicly readable"
ON templates FOR SELECT
TO PUBLIC
USING (is_active = TRUE);
```

#### Database Functions & Triggers

```sql
-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presskits_updated_at BEFORE UPDATE ON presskits 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(base_title TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
    counter INTEGER := 0;
    base_slug TEXT;
BEGIN
    -- Create base slug from title
    base_slug := LOWER(TRIM(REGEXP_REPLACE(base_title, '[^a-zA-Z0-9\s]', '', 'g')));
    base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
    base_slug := TRIM(base_slug, '-');
    
    -- Start with base slug
    slug := base_slug;
    
    -- Check for uniqueness and append counter if needed
    WHILE EXISTS (SELECT 1 FROM presskits WHERE public_slug = slug) LOOP
        counter := counter + 1;
        slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Function to update subscription features
CREATE OR REPLACE FUNCTION update_subscription_features()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user profile based on subscription
    UPDATE user_profiles 
    SET 
        subscription_status = NEW.plan,
        presskit_limit = CASE 
            WHEN NEW.plan = 'free' THEN 3
            WHEN NEW.plan = 'pro' THEN 25
            WHEN NEW.plan = 'enterprise' THEN 100
            ELSE 3
        END
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscription_features_trigger 
AFTER INSERT OR UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_subscription_features();
```

---
