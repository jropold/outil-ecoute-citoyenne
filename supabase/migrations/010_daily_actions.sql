-- Actions du jour (porte-à-porte planifié)
CREATE TABLE daily_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quartier_id UUID REFERENCES quartiers(id) ON DELETE SET NULL,
  geometry JSONB NOT NULL,
  action_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_daily_actions_date ON daily_actions(action_date DESC);
CREATE INDEX idx_daily_actions_status ON daily_actions(status);

CREATE TRIGGER daily_actions_updated_at
  BEFORE UPDATE ON daily_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE daily_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tous peuvent voir les actions"
  ON daily_actions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coordinateurs peuvent gérer les actions"
  ON daily_actions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('coordinateur_terrain', 'direction_campagne')
    )
  );

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE daily_actions;
