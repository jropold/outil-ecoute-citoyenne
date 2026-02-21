-- 017: Fix RLS recursive policies (profiles subquery causes 500 errors)
-- App is private (authenticated team members only), role checks done in frontend.

-- profiles
DROP POLICY IF EXISTS "Coordinateurs can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Coordinateurs can update profiles" ON profiles;
DROP POLICY IF EXISTS "Responsables can view profiles in their sectors" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;

CREATE POLICY "Authenticated users can view all profiles" ON profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- quartiers
DROP POLICY IF EXISTS "Coordinateurs can manage quartiers" ON quartiers;
DROP POLICY IF EXISTS "Authenticated users can manage quartiers" ON quartiers;

CREATE POLICY "Authenticated users can manage quartiers" ON quartiers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- sectors
DROP POLICY IF EXISTS "Coordinateurs can manage sectors" ON sectors;
DROP POLICY IF EXISTS "Authenticated can manage sectors" ON sectors;
DROP POLICY IF EXISTS "Auth manage sectors" ON sectors;

CREATE POLICY "Auth manage sectors" ON sectors
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- visits
DROP POLICY IF EXISTS "Coordinateurs can manage all visits" ON visits;
DROP POLICY IF EXISTS "Benevoles see own visits" ON visits;
DROP POLICY IF EXISTS "Authenticated can manage visits" ON visits;
DROP POLICY IF EXISTS "Auth manage visits" ON visits;

CREATE POLICY "Auth manage visits" ON visits
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- sector_assignments
DROP POLICY IF EXISTS "Coordinateurs can manage assignments" ON sector_assignments;
DROP POLICY IF EXISTS "Authenticated can manage sector_assignments" ON sector_assignments;
DROP POLICY IF EXISTS "Auth manage sector_assignments" ON sector_assignments;

CREATE POLICY "Auth manage sector_assignments" ON sector_assignments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- daily_actions
DROP POLICY IF EXISTS "Coordinateurs peuvent gérer les actions" ON daily_actions;
DROP POLICY IF EXISTS "Admin peut gérer les actions" ON daily_actions;
DROP POLICY IF EXISTS "Authenticated can manage daily_actions" ON daily_actions;
DROP POLICY IF EXISTS "Auth manage daily_actions" ON daily_actions;

CREATE POLICY "Auth manage daily_actions" ON daily_actions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- action_sectors
DROP POLICY IF EXISTS "Coordinateurs can manage action sectors" ON action_sectors;
DROP POLICY IF EXISTS "Admin peut gérer les secteurs d'action" ON action_sectors;
DROP POLICY IF EXISTS "Authenticated can manage action_sectors" ON action_sectors;
DROP POLICY IF EXISTS "Auth manage action_sectors" ON action_sectors;

CREATE POLICY "Auth manage action_sectors" ON action_sectors
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- action_groups
DROP POLICY IF EXISTS "Coordinateurs can manage action groups" ON action_groups;
DROP POLICY IF EXISTS "Admin peut gérer les groupes d'action" ON action_groups;
DROP POLICY IF EXISTS "Authenticated can manage action_groups" ON action_groups;
DROP POLICY IF EXISTS "Auth manage action_groups" ON action_groups;

CREATE POLICY "Auth manage action_groups" ON action_groups
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- action_group_members
DROP POLICY IF EXISTS "Coordinateurs can manage group members" ON action_group_members;
DROP POLICY IF EXISTS "Admin peut gérer les membres de groupe" ON action_group_members;
DROP POLICY IF EXISTS "Authenticated can manage action_group_members" ON action_group_members;
DROP POLICY IF EXISTS "Auth manage action_group_members" ON action_group_members;

CREATE POLICY "Auth manage action_group_members" ON action_group_members
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
