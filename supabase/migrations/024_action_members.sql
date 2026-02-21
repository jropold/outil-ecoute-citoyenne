-- Table de jonction : membres assignés à une action
CREATE TABLE action_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES daily_actions(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES campaign_members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(action_id, member_id)
);

-- RLS
ALTER TABLE action_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "action_members_select" ON action_members
  FOR SELECT USING (true);

CREATE POLICY "action_members_insert" ON action_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coordinateur_terrain', 'direction_campagne')
    )
  );

CREATE POLICY "action_members_delete" ON action_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coordinateur_terrain', 'direction_campagne')
    )
  );
