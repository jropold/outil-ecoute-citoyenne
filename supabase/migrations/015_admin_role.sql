-- 015: Add admin role (enum only — must be in its own transaction)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin' BEFORE 'direction_campagne';
