-- Sectors table
CREATE TYPE sector_status AS ENUM ('non_couvert', 'partiellement_couvert', 'couvert');

CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quartier_id UUID NOT NULL REFERENCES quartiers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  geometry JSONB NOT NULL DEFAULT '{}',
  estimated_doors INTEGER NOT NULL DEFAULT 0,
  status sector_status NOT NULL DEFAULT 'non_couvert',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sectors_quartier ON sectors(quartier_id);

CREATE TRIGGER sectors_updated_at
  BEFORE UPDATE ON sectors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
