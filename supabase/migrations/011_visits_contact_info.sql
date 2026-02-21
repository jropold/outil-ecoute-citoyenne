-- 011: Add citizen contact info and household voters to visits
-- Requires consent toggle before storing personal data

ALTER TABLE visits
  ADD COLUMN contact_first_name TEXT,
  ADD COLUMN contact_last_name TEXT,
  ADD COLUMN contact_address TEXT,
  ADD COLUMN contact_phone TEXT,
  ADD COLUMN has_consent BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN household_voters INTEGER;

-- Index for searching contacts
CREATE INDEX idx_visits_contact_name ON visits (contact_last_name, contact_first_name)
  WHERE contact_last_name IS NOT NULL;
