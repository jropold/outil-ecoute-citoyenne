-- 013: Action groups and group members

CREATE TABLE action_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_sector_id UUID NOT NULL REFERENCES action_sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  responsible_id UUID REFERENCES profiles(id),
  note_taker_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_action_groups_sector ON action_groups(action_sector_id);

CREATE TABLE action_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES action_groups(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, volunteer_id)
);

CREATE INDEX idx_action_group_members_group ON action_group_members(group_id);
CREATE INDEX idx_action_group_members_volunteer ON action_group_members(volunteer_id);

-- RLS
ALTER TABLE action_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view action groups"
  ON action_groups FOR SELECT USING (true);

CREATE POLICY "Coordinateurs can manage action groups"
  ON action_groups FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('coordinateur_terrain', 'direction_campagne')
    )
  );

CREATE POLICY "Everyone can view group members"
  ON action_group_members FOR SELECT USING (true);

CREATE POLICY "Coordinateurs can manage group members"
  ON action_group_members FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('coordinateur_terrain', 'direction_campagne')
    )
  );

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE action_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE action_group_members;
