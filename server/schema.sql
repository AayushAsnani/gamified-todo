-- ─── Drop old single-user tables ────────────────────────────────────────────
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS user_shop;

-- ─── Tasks (per-user) ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     VARCHAR(128) NOT NULL,
  title       VARCHAR(255) NOT NULL,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  reminders   JSON,
  difficulty  ENUM('easy','medium','hard') DEFAULT 'easy',
  completed   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tasks_user (user_id)
);

-- ─── User progress (per-user, upsert-friendly) ───────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  user_id             VARCHAR(128) PRIMARY KEY,
  xp                  INT DEFAULT 0,
  crystals            INT DEFAULT 0,
  streak              INT DEFAULT 0,
  last_completed_date DATE DEFAULT NULL
);

-- ─── Shop purchases & equipment (per-user, upsert-friendly) ─────────────────
CREATE TABLE IF NOT EXISTS user_shop (
  user_id         VARCHAR(128) PRIMARY KEY,
  purchased_items JSON,
  equipped_items  JSON
);
