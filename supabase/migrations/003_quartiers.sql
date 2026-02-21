-- Quartiers table
CREATE TABLE quartiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  geometry JSONB NOT NULL DEFAULT '{}',
  total_doors_estimate INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the 19 quartiers of Saint-Louis
INSERT INTO quartiers (name, total_doors_estimate) VALUES
  ('Centre-Ville', 2500),
  ('Le Gol', 1800),
  ('Bois-de-Nèfles', 1500),
  ('La Rivière', 2200),
  ('Les Makes', 800),
  ('Cilaos', 900),
  ('La Ouaki', 600),
  ('Le Ouaki', 600),
  ('Plateau du Gol', 1200),
  ('Les Canots', 700),
  ('Le Ruisseau', 500),
  ('Bel Air', 1100),
  ('Roches Maigres', 950),
  ('Le Gol Les Hauts', 750),
  ('Ilet du Gol', 400),
  ('Grand Fond', 350),
  ('Tapage', 650),
  ('Crève Coeur', 550),
  ('Bois de Nèfles Cocos', 450);
