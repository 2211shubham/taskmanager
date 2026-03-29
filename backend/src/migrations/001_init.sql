-- Run once when the database is first created
CREATE TABLE IF NOT EXISTS tasks (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  completed  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for sorting by created_at (common query pattern)
CREATE INDEX IF NOT EXISTS idx_tasks_created_at
  ON tasks(created_at DESC);