-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quartiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_assignments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Coordinateurs can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('coordinateur_terrain', 'direction_campagne')
    )
  );

CREATE POLICY "Responsables can view profiles in their sectors"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'responsable_quartier'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Coordinateurs can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'coordinateur_terrain'
    )
  );

-- Quartiers policies (everyone can read)
CREATE POLICY "Authenticated users can view quartiers"
  ON quartiers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coordinateurs can manage quartiers"
  ON quartiers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('coordinateur_terrain', 'direction_campagne')
    )
  );

-- Sectors policies
CREATE POLICY "Authenticated users can view sectors"
  ON sectors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coordinateurs can manage sectors"
  ON sectors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'coordinateur_terrain'
    )
  );

-- Visits policies
CREATE POLICY "Benevoles see own visits"
  ON visits FOR SELECT
  USING (
    auth.uid() = volunteer_id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('coordinateur_terrain', 'direction_campagne', 'responsable_quartier')
    )
  );

CREATE POLICY "Benevoles can insert visits"
  ON visits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Benevoles can update own visits"
  ON visits FOR UPDATE
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Coordinateurs can manage all visits"
  ON visits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'coordinateur_terrain'
    )
  );

-- Sector assignments policies
CREATE POLICY "Authenticated users can view assignments"
  ON sector_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coordinateurs can manage assignments"
  ON sector_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('coordinateur_terrain', 'responsable_quartier')
    )
  );
