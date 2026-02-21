-- 015: Add admin role

-- Add 'admin' to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin' BEFORE 'direction_campagne';

-- Update handle_new_user() : auto-assign admin role for jeremy.ropauld@teamjmd.re
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE
      WHEN NEW.email = 'jeremy.ropauld@teamjmd.re' THEN 'admin'::user_role
      ELSE 'benevole'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- RLS: Add 'admin' alongside existing roles
-- ==========================================

-- profiles: "Coordinateurs can view all profiles" → add admin
DROP POLICY IF EXISTS "Coordinateurs can view all profiles" ON profiles;
CREATE POLICY "Coordinateurs can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'coordinateur_terrain', 'direction_campagne')
    )
  );

-- profiles: "Coordinateurs can update profiles" → add admin
DROP POLICY IF EXISTS "Coordinateurs can update profiles" ON profiles;
CREATE POLICY "Coordinateurs can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'coordinateur_terrain')
    )
  );

-- quartiers: "Coordinateurs can manage quartiers" → add admin
DROP POLICY IF EXISTS "Coordinateurs can manage quartiers" ON quartiers;
CREATE POLICY "Coordinateurs can manage quartiers"
  ON quartiers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'coordinateur_terrain', 'direction_campagne')
    )
  );

-- sectors: "Coordinateurs can manage sectors" → add admin
DROP POLICY IF EXISTS "Coordinateurs can manage sectors" ON sectors;
CREATE POLICY "Coordinateurs can manage sectors"
  ON sectors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'coordinateur_terrain')
    )
  );

-- visits: "Benevoles see own visits" → add admin
DROP POLICY IF EXISTS "Benevoles see own visits" ON visits;
CREATE POLICY "Benevoles see own visits"
  ON visits FOR SELECT
  USING (
    auth.uid() = volunteer_id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'coordinateur_terrain', 'direction_campagne', 'responsable_quartier')
    )
  );

-- visits: "Coordinateurs can manage all visits" → add admin
DROP POLICY IF EXISTS "Coordinateurs can manage all visits" ON visits;
CREATE POLICY "Coordinateurs can manage all visits"
  ON visits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'coordinateur_terrain')
    )
  );

-- sector_assignments: "Coordinateurs can manage assignments" → add admin
DROP POLICY IF EXISTS "Coordinateurs can manage assignments" ON sector_assignments;
CREATE POLICY "Coordinateurs can manage assignments"
  ON sector_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'coordinateur_terrain', 'responsable_quartier')
    )
  );

-- ==========================================
-- RLS: Restrict daily_actions/action_sectors/groups/members to admin only
-- ==========================================

-- daily_actions: replace coordinator policy with admin-only
DROP POLICY IF EXISTS "Coordinateurs peuvent gérer les actions" ON daily_actions;
CREATE POLICY "Admin peut gérer les actions"
  ON daily_actions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- action_sectors: replace coordinator policy with admin-only
DROP POLICY IF EXISTS "Coordinateurs can manage action sectors" ON action_sectors;
CREATE POLICY "Admin peut gérer les secteurs d'action"
  ON action_sectors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- action_groups: replace coordinator policy with admin-only
DROP POLICY IF EXISTS "Coordinateurs can manage action groups" ON action_groups;
CREATE POLICY "Admin peut gérer les groupes d'action"
  ON action_groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- action_group_members: replace coordinator policy with admin-only
DROP POLICY IF EXISTS "Coordinateurs can manage group members" ON action_group_members;
CREATE POLICY "Admin peut gérer les membres de groupe"
  ON action_group_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );
