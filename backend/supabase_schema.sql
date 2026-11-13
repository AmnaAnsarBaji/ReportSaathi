-- ==============================================================================
-- ReportSaathi Database Schema (Supabase PostgreSQL)
-- Minimum schema for user profiles and opt-in report history
-- ==============================================================================

-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Saved Reports Table (Strict Privacy Design)
-- Note: Raw uploaded files and extracted raw medical text are NEVER stored.
-- Only the structured educational summary and biomarker breakdown are saved.
CREATE TABLE IF NOT EXISTS public.saved_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    report_type TEXT NOT NULL,
    overall_status TEXT NOT NULL CHECK (overall_status IN ('normal', 'attention_needed', 'consult_doctor', 'inconclusive')),
    summary TEXT NOT NULL,
    key_findings JSONB DEFAULT '[]'::JSONB NOT NULL,
    metrics JSONB DEFAULT '[]'::JSONB NOT NULL,
    questions_for_doctor JSONB DEFAULT '[]'::JSONB NOT NULL,
    glossary JSONB DEFAULT '[]'::JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_saved_reports_user_id ON public.saved_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_created_at ON public.saved_reports(created_at DESC);

-- 4. Enable Row Level Security (RLS) on Both Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for `profiles`
-- Users can view only their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 6. RLS Policies for `saved_reports`
-- Users can view only their own saved reports
CREATE POLICY "Users can select their own saved reports"
    ON public.saved_reports
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert only reports belonging to their own user_id
CREATE POLICY "Users can insert their own saved reports"
    ON public.saved_reports
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own saved reports
CREATE POLICY "Users can delete their own saved reports"
    ON public.saved_reports
    FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Trigger to automatically create a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it already exists to allow idempotent re-running
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
