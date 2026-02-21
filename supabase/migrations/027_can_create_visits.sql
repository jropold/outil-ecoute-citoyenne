-- Migration 027: Add can_create_visits permission column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS can_create_visits BOOLEAN DEFAULT false;

-- Grant permission to admin, coordinateur_terrain and direction_campagne
UPDATE profiles SET can_create_visits = true WHERE role IN ('admin', 'coordinateur_terrain', 'direction_campagne');

-- Update the handle_new_user trigger function to include can_create_visits
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_active, can_create_visits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'benevole'),
    false,
    CASE WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'benevole') IN ('admin', 'coordinateur_terrain', 'direction_campagne') THEN true ELSE false END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
