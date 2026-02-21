-- Visits table
CREATE TYPE visit_status AS ENUM ('sympathisant', 'indecis', 'opposant', 'absent');

CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sector_id UUID REFERENCES sectors(id) ON DELETE SET NULL,
  quartier_id UUID NOT NULL REFERENCES quartiers(id) ON DELETE CASCADE,
  status visit_status NOT NULL,
  topic TEXT,
  comment TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  needs_followup BOOLEAN NOT NULL DEFAULT false,
  offline_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_visits_volunteer ON visits(volunteer_id);
CREATE INDEX idx_visits_quartier ON visits(quartier_id);
CREATE INDEX idx_visits_sector ON visits(sector_id);
CREATE INDEX idx_visits_created ON visits(created_at DESC);
CREATE INDEX idx_visits_offline_id ON visits(offline_id) WHERE offline_id IS NOT NULL;
