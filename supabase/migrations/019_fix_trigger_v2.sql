-- 019: Fix trigger - simplify and set search_path

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE
      WHEN NEW.email = 'jeremy.ropauld@gmail.com' THEN 'admin'::user_role
      ELSE 'benevole'::user_role
    END
  );
  RETURN NEW;
END;
$$;

-- Grant usage to ensure the function can insert
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT INSERT ON public.profiles TO supabase_auth_admin;
