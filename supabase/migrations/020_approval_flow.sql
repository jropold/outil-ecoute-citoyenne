-- 020: Users need admin approval to access the app

-- Change default: new users are inactive until admin approves
ALTER TABLE profiles ALTER COLUMN is_active SET DEFAULT false;

-- Update trigger: admin is auto-approved, others need approval
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE
      WHEN NEW.email = 'jeremy.ropauld@gmail.com' THEN 'admin'::user_role
      ELSE 'benevole'::user_role
    END,
    CASE
      WHEN NEW.email = 'jeremy.ropauld@gmail.com' THEN true
      ELSE false
    END
  );
  RETURN NEW;
END;
$$;

-- Set existing admin as active
UPDATE profiles SET is_active = true WHERE email = 'jeremy.ropauld@gmail.com';
