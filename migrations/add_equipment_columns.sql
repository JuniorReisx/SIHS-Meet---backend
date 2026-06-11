-- Execute no Supabase SQL Editor para adicionar os campos de equipamentos

ALTER TABLE meetings_confirmed
  ADD COLUMN IF NOT EXISTS equipment text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS other_equipment text;

ALTER TABLE meetings_pending
  ADD COLUMN IF NOT EXISTS equipment text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS other_equipment text;

ALTER TABLE meetings_denied
  ADD COLUMN IF NOT EXISTS equipment text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS other_equipment text;
