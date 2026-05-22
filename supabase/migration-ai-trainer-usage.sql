-- AI Trainer daily usage tracking
CREATE TABLE IF NOT EXISTS ai_trainer_usage (
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);
