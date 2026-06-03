-- Run in Supabase SQL Editor (dashboard.supabase.co/project/wgrwtqkqgydphqvrdayn/sql)
-- Enable Row Level Security (RLS) after

CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  is_premium boolean DEFAULT false,
  analyses_count integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
END;
$$ language plpgsql security definer;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Test users (or signup)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at) VALUES 
(uuid_generate_v4(), 'test@example.com', crypt('password', gen_salt('bf')), now());

-- Analyses table
CREATE TABLE analyses (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  skills jsonb NOT NULL,  -- [{"skill": "JS", "score": 92}, ...]
  target_skills jsonb,    -- [{"skill": "JS", "target": 95}, ...]
  avg_score numeric(5,2),
  role_transition text,
  roadmap_levels text,         -- Level-specific roadmap stored as JSON string
  courses_levels text,         -- Level-specific courses stored as JSON string
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text DEFAULT 'completed'
);

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses" ON analyses
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_analyses_user ON analyses(user_id);
CREATE INDEX idx_analyses_created ON analyses(created_at);

