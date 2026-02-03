-- Softworks Tycoon - Supabase Database Schema
-- Copy and paste this entire file into your Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

-- Users table (linked to Firebase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  photo_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  has_migrated BOOLEAN DEFAULT FALSE,
  has_seen_migration_popup BOOLEAN DEFAULT FALSE
);

-- Companies table (AI companies owned by users)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_sandbox BOOLEAN DEFAULT FALSE,
  cash BIGINT DEFAULT 25000,
  week INTEGER DEFAULT 1,
  year INTEGER DEFAULT 2025,
  research_pts INTEGER DEFAULT 0,
  reputation INTEGER DEFAULT 0,
  employees_count INTEGER DEFAULT 1,
  employees_morale INTEGER DEFAULT 100,
  purchased_items JSONB DEFAULT '[]'::jsonb,
  unlocked_techs JSONB DEFAULT '[]'::jsonb,
  tutorial_step INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Hardware table (GPU/compute purchases)
CREATE TABLE IF NOT EXISTS hardware (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  type_id TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Models/Products table (AI models)
CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'text', 'image', 'video', 'audio', 'custom', 'agi'
  version NUMERIC DEFAULT 1.0,
  quality INTEGER DEFAULT 50,
  weeks_left NUMERIC DEFAULT 0,
  released BOOLEAN DEFAULT FALSE,
  is_staged BOOLEAN DEFAULT FALSE,
  is_updating BOOLEAN DEFAULT FALSE,
  trait TEXT, -- 'dreamer', 'sentient', 'chaos', 'logic', 'mimic'
  description TEXT,
  revenue INTEGER DEFAULT 0,
  hype INTEGER DEFAULT 0,
  is_open_source BOOLEAN DEFAULT FALSE,
  capabilities JSONB DEFAULT '[]'::jsonb,
  contracts JSONB DEFAULT '[]'::jsonb,
  api_config JSONB DEFAULT '{"active": false, "price": 0, "limit": 100}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Plans table (created by AI companies)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  perks JSONB DEFAULT '[]'::jsonb,
  rate_limit INTEGER DEFAULT 100,
  early_access BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Models table (rival AI models)
CREATE TABLE IF NOT EXISTS market_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  quality INTEGER NOT NULL,
  type TEXT NOT NULL,
  version TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table (user reviews of models)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard table (cached rankings)
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  total_revenue BIGINT DEFAULT 0,
  avg_quality INTEGER DEFAULT 0,
  model_count INTEGER DEFAULT 0,
  reputation INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Broadcasts table
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0, -- Higher priority = more important
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update Logs table
CREATE TABLE IF NOT EXISTS update_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  changelog TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Status table (for downtime mode)
CREATE TABLE IF NOT EXISTS site_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_down BOOLEAN DEFAULT FALSE,
  message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site status
INSERT INTO site_status (is_down, message) 
VALUES (FALSE, NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_hardware_company_id ON hardware(company_id);
CREATE INDEX IF NOT EXISTS idx_models_company_id ON models(company_id);
CREATE INDEX IF NOT EXISTS idx_models_released ON models(released);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_company_id ON subscription_plans(company_id);
CREATE INDEX IF NOT EXISTS idx_reviews_model_id ON reviews(model_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(rank);
CREATE INDEX IF NOT EXISTS idx_broadcasts_active ON broadcasts(is_active);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hardware ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_status ENABLE ROW LEVEL SECURITY;

-- Users: Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Companies: Users can CRUD their own companies
CREATE POLICY "Users can view own companies" ON companies
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can create companies" ON companies
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can update own companies" ON companies
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can delete own companies" ON companies
  FOR DELETE USING (user_id IN (
    SELECT id FROM users WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Hardware: Users can CRUD hardware for their companies
CREATE POLICY "Users can manage own hardware" ON hardware
  FOR ALL USING (company_id IN (
    SELECT c.id FROM companies c
    JOIN users u ON c.user_id = u.id
    WHERE u.firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Models: Users can CRUD models for their companies, everyone can view released models
CREATE POLICY "Users can manage own models" ON models
  FOR ALL USING (company_id IN (
    SELECT c.id FROM companies c
    JOIN users u ON c.user_id = u.id
    WHERE u.firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Anyone can view released models" ON models
  FOR SELECT USING (released = true);

-- Subscription Plans: Users can manage their plans, anyone can view active plans
CREATE POLICY "Users can manage own subscription plans" ON subscription_plans
  FOR ALL USING (company_id IN (
    SELECT c.id FROM companies c
    JOIN users u ON c.user_id = u.id
    WHERE u.firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Market Models: Everyone can read, only service role can write
CREATE POLICY "Anyone can view market models" ON market_models
  FOR SELECT USING (true);

-- Reviews: Users can create reviews, everyone can read
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Leaderboard: Everyone can read
CREATE POLICY "Anyone can view leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- Broadcasts: Everyone can read active broadcasts
CREATE POLICY "Anyone can view active broadcasts" ON broadcasts
  FOR SELECT USING (is_active = true);

-- Update Logs: Everyone can read
CREATE POLICY "Anyone can view update logs" ON update_logs
  FOR SELECT USING (true);

-- Site Status: Everyone can read
CREATE POLICY "Anyone can view site status" ON site_status
  FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broadcasts_updated_at BEFORE UPDATE ON broadcasts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_status_updated_at BEFORE UPDATE ON site_status
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS void AS $$
BEGIN
  -- Clear existing leaderboard
  TRUNCATE leaderboard;
  
  -- Recalculate and insert new rankings
  INSERT INTO leaderboard (company_id, company_name, total_revenue, avg_quality, model_count, reputation, rank)
  SELECT 
    c.id,
    c.name,
    COALESCE(SUM(m.revenue), 0) as total_revenue,
    COALESCE(AVG(m.quality)::INTEGER, 0) as avg_quality,
    COUNT(m.id) as model_count,
    c.reputation,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(m.revenue), 0) DESC, c.reputation DESC) as rank
  FROM companies c
  LEFT JOIN models m ON c.id = m.company_id AND m.released = true
  GROUP BY c.id, c.name, c.reputation;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMPLETED
-- ============================================

-- Schema setup complete!
-- Next steps:
-- 1. Go to your Supabase dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- 5. Your database is ready!
