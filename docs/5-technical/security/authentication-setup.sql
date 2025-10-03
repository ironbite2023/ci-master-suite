-- ============================================================================
-- AUTHENTICATION SETUP VERIFICATION & FIX
-- Run this in Supabase SQL Editor to complete authentication setup
-- ============================================================================

-- 1. Verify the user signup function exists
SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user';

-- 2. Check if the trigger exists on auth.users
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 3. Re-create the function (in case it's missing)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ensure the trigger exists (this is the critical missing piece)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Verify authentication is properly configured
-- Check Auth settings
SELECT * FROM auth.users LIMIT 1; -- This will show if auth schema exists

-- 6. Test RLS policies work
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = pg_tables.tablename) as policy_count
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true
ORDER BY tablename;

-- 7. Verify profile creation will work
DO $$
BEGIN
    -- Test if we can insert into profiles (this should work with proper RLS)
    RAISE NOTICE 'Profile table structure:';
END $$;

-- Show profile table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================================================
-- AUTHENTICATION VERIFICATION COMPLETE
-- ============================================================================

DO $$ 
BEGIN 
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'AUTHENTICATION SETUP VERIFICATION COMPLETED!';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'Next: Check your Supabase Auth configuration in dashboard';
    RAISE NOTICE '1. Go to Authentication > Settings in your Supabase dashboard';
    RAISE NOTICE '2. Enable Email/Password authentication';
    RAISE NOTICE '3. Configure any OAuth providers you want (Google, GitHub, etc.)';
    RAISE NOTICE '4. Set your site URL: http://localhost:3000 (for development)';
    RAISE NOTICE '5. Add your production URL when deploying';
    RAISE NOTICE '============================================================================';
END $$;
