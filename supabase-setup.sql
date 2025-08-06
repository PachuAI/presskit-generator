-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    artist_name TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'enterprise')),
    presskit_limit INTEGER NOT NULL DEFAULT 3,
    social_media JSONB DEFAULT '{}',
    contact_email TEXT,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE
    ON user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = auth_user_id);

-- Create function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (auth_user_id, email, artist_name, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'artist_name', 'Artist'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
    );
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create presskits table
CREATE TABLE presskits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    template_type TEXT NOT NULL DEFAULT 'basic' CHECK (template_type IN ('basic', 'electronic', 'band', 'solo')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    public_slug TEXT UNIQUE,
    content_data JSONB NOT NULL DEFAULT '{}',
    view_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Create templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('basic', 'electronic', 'band', 'solo')),
    description TEXT,
    config_data JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    presskit_id UUID REFERENCES presskits(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'download', 'share')),
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create export_history table
CREATE TABLE export_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    presskit_id UUID NOT NULL REFERENCES presskits(id) ON DELETE CASCADE,
    export_format TEXT NOT NULL CHECK (export_format IN ('pdf', 'zip', 'json')),
    file_size INTEGER,
    export_status TEXT NOT NULL DEFAULT 'pending' CHECK (export_status IN ('pending', 'completed', 'failed')),
    download_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Add RLS to all new tables
ALTER TABLE presskits ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for presskits
CREATE POLICY "Users can view their own presskits" ON presskits
    FOR SELECT USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own presskits" ON presskits
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own presskits" ON presskits
    FOR UPDATE USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Anyone can view public presskits" ON presskits
    FOR SELECT USING (is_public = TRUE AND status = 'published');

-- Enforce presskit limits by subscription
CREATE POLICY "Enforce presskit limits" ON presskits FOR INSERT
WITH CHECK (
    (SELECT COUNT(*) FROM presskits WHERE user_id = NEW.user_id) < 
    (SELECT presskit_limit FROM user_profiles WHERE id = NEW.user_id)
);

-- RLS policies for templates (public read)
CREATE POLICY "Anyone can view active templates" ON templates
    FOR SELECT USING (is_active = TRUE);

-- RLS policies for analytics_events
CREATE POLICY "Users can view their presskit analytics" ON analytics_events
    FOR SELECT USING (presskit_id IN (
        SELECT id FROM presskits WHERE user_id IN (
            SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
        )
    ));

-- RLS policies for export_history
CREATE POLICY "Users can view their own export history" ON export_history
    FOR SELECT USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own exports" ON export_history
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

-- Add triggers for updated_at on new tables
CREATE TRIGGER update_presskits_updated_at BEFORE UPDATE
    ON presskits FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE
    ON templates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_slug(base_title TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Create base slug from title
    base_slug := lower(regexp_replace(base_title, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    final_slug := base_slug;
    
    -- Check if slug exists and increment counter if needed
    WHILE EXISTS (SELECT 1 FROM presskits WHERE public_slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Create performance indexes
-- User profiles indexes
CREATE INDEX idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
CREATE INDEX idx_user_profiles_subscription_status ON user_profiles(subscription_status);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Presskits indexes
CREATE INDEX idx_presskits_user_id ON presskits(user_id);
CREATE INDEX idx_presskits_status ON presskits(status);
CREATE INDEX idx_presskits_public_slug ON presskits(public_slug) WHERE public_slug IS NOT NULL;
CREATE INDEX idx_presskits_is_public ON presskits(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_presskits_template_type ON presskits(template_type);

-- Analytics indexes
CREATE INDEX idx_analytics_events_presskit_id ON analytics_events(presskit_id);
CREATE INDEX idx_analytics_events_type_created ON analytics_events(event_type, created_at);

-- Export history indexes
CREATE INDEX idx_export_history_user_id ON export_history(user_id);
CREATE INDEX idx_export_history_presskit_id ON export_history(presskit_id);

-- Templates indexes
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_is_active ON templates(is_active) WHERE is_active = TRUE;

-- Insert default templates
INSERT INTO templates (name, type, description, config_data) VALUES
('Básico', 'basic', 'Template simple y limpio para principiantes', '{
  "sections": ["bio", "photos", "contact", "social"],
  "color_scheme": "minimal",
  "layout": "single_column"
}'),
('Electrónico DJ', 'electronic', 'Optimizado para DJs y productores electrónicos', '{
  "sections": ["bio", "photos", "mixes", "releases", "social", "contact"],
  "color_scheme": "dark_neon",
  "layout": "grid"
}'),
('Banda Musical', 'band', 'Diseñado para grupos y bandas musicales', '{
  "sections": ["bio", "members", "photos", "discography", "tours", "contact"],
  "color_scheme": "vibrant",
  "layout": "magazine"
}'),
('Artista Solista', 'solo', 'Perfecto para cantautores y artistas individuales', '{
  "sections": ["bio", "photos", "discography", "videos", "press", "contact"],
  "color_scheme": "elegant",
  "layout": "portfolio"
}');