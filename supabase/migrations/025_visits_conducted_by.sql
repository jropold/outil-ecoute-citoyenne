-- Colonne "mené par" sur les visites
ALTER TABLE visits ADD COLUMN conducted_by_member_id UUID REFERENCES campaign_members(id) ON DELETE SET NULL;
