-- Membres de campagne (personnes globales réutilisables)
CREATE TABLE campaign_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Autre',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE campaign_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_members_select" ON campaign_members
  FOR SELECT USING (true);

CREATE POLICY "campaign_members_insert" ON campaign_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coordinateur_terrain', 'direction_campagne')
    )
  );

CREATE POLICY "campaign_members_update" ON campaign_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coordinateur_terrain', 'direction_campagne')
    )
  );

CREATE POLICY "campaign_members_delete" ON campaign_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coordinateur_terrain', 'direction_campagne')
    )
  );
