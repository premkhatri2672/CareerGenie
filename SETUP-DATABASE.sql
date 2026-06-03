-- ─── STEP 1: CREATE PROFILES TABLE ───
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  is_premium boolean DEFAULT false,
  analyses_count integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
DROP POLICY IF EXISTS "Users can view and edit own profile" ON public.profiles;
CREATE POLICY "Users can view and edit own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- ─── STEP 2: CREATE AUTOMATIC PROFILE TRIGGER ───
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─── STEP 3: CREATE ANALYSES TABLE ───
CREATE TABLE IF NOT EXISTS public.analyses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_transition text,
  score integer DEFAULT 0,
  missing_skills text,  -- Stored as JSON string
  roadmap text,         -- Stored as JSON string
  courses text,         -- Stored as JSON string
  raw_resume text,
  roadmap_levels text,         -- Level-specific roadmap stored as JSON string
  courses_levels text,         -- Level-specific courses stored as JSON string
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on analyses
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for analyses
DROP POLICY IF EXISTS "Users can manage their own analyses" ON public.analyses;
CREATE POLICY "Users can manage their own analyses" ON public.analyses
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_user ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created ON public.analyses(created_at);
