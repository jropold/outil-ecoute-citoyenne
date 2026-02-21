-- Migration 016: Set visits FK to ON DELETE SET NULL
-- When an action is deleted, visits are preserved but their action_id/action_group_id become NULL

ALTER TABLE visits DROP CONSTRAINT visits_action_id_fkey;
ALTER TABLE visits ADD CONSTRAINT visits_action_id_fkey
  FOREIGN KEY (action_id) REFERENCES daily_actions(id) ON DELETE SET NULL;

ALTER TABLE visits DROP CONSTRAINT visits_action_group_id_fkey;
ALTER TABLE visits ADD CONSTRAINT visits_action_group_id_fkey
  FOREIGN KEY (action_group_id) REFERENCES action_groups(id) ON DELETE SET NULL;
