-- 014: Link visits to actions and action groups
ALTER TABLE visits
  ADD COLUMN action_id UUID REFERENCES daily_actions(id),
  ADD COLUMN action_group_id UUID REFERENCES action_groups(id);

CREATE INDEX idx_visits_action ON visits(action_id) WHERE action_id IS NOT NULL;
CREATE INDEX idx_visits_action_group ON visits(action_group_id) WHERE action_group_id IS NOT NULL;
