-- Sector assignments
CREATE TABLE sector_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(sector_id, volunteer_id)
);

CREATE INDEX idx_assignments_sector ON sector_assignments(sector_id);
CREATE INDEX idx_assignments_volunteer ON sector_assignments(volunteer_id);
