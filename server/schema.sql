-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS gamified_todo;
USE gamified_todo;

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  reminders   JSON,
  difficulty  ENUM('easy','medium','hard') DEFAULT 'easy',
  completed   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress (single-user, one row)
CREATE TABLE IF NOT EXISTS user_progress (
  id                  INT PRIMARY KEY DEFAULT 1,
  xp                  INT DEFAULT 0,
  crystals            INT DEFAULT 0,
  streak              INT DEFAULT 0,
  last_completed_date DATE DEFAULT NULL
);

-- Shop purchases & equipment
CREATE TABLE IF NOT EXISTS user_shop (
  id              INT PRIMARY KEY DEFAULT 1,
  purchased_items JSON,
  equipped_items  JSON
);

-- Seed default rows so GET endpoints always return data
INSERT IGNORE INTO user_progress (id, xp, crystals, streak)
  VALUES (1, 0, 0, 0);

INSERT IGNORE INTO user_shop (id, purchased_items, equipped_items)
  VALUES (1, '[]', '{"tshirt": null, "trousers": null}');
