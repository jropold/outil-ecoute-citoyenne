-- 012: Action sectors - subdivide an action zone into sectors
CREATE TABLE action_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES daily_actions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  geometry JSONB NOT NULL DEFAULT '{}',
  responsible_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_action_sectors_action ON action_sectors(action_id);
CREATE INDEX idx_action_sectors_responsible ON action_sectors(responsible_id) WHERE responsible_id IS NOT NULL;

-- RLS
ALTER TABLE action_sectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view action sectors"
  ON action_sectors FOR SELECT USING (true);

CREATE POLICY "Coordinateurs can manage action sectors"
  ON action_sectors FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('coordinateur_terrain', 'direction_campagne')
    )
  );

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE action_sectors;
