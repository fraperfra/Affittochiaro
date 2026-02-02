-- ============================================================================
-- MIGRAZIONE: Sistema Notifiche Dual-Channel (WhatsApp + Email)
-- Database: PostgreSQL (AWS RDS)
-- Versione: 003_notification_system
-- Nota: Adatta lo schema esistente per il nuovo sistema di notifiche
-- ============================================================================

-- ─── Enable UUID extension ──────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUM: Delivery Frequency (se non esiste) ───────────────────────────────

DO $$ BEGIN
  CREATE TYPE delivery_frequency AS ENUM (
    'realtime',
    'daily_digest',
    'weekly'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ─── TABLE: notification_preferences ────────────────────────────────────────
-- Preferenze personali di ogni utente per le notifiche.

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  channel_whatsapp  BOOLEAN NOT NULL DEFAULT TRUE,
  channel_email     BOOLEAN NOT NULL DEFAULT TRUE,
  frequency         delivery_frequency NOT NULL DEFAULT 'realtime',
  types_enabled     JSONB NOT NULL DEFAULT '{
    "match_found_owner": true,
    "match_found_tenant": true,
    "trial_expiring_agency": true,
    "document_reminder": true,
    "contract_signed": true,
    "welcome_onboarding": true
  }'::JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Aggiungi colonna results alla tabella notifications (se manca) ─────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'results'
  ) THEN
    ALTER TABLE notifications ADD COLUMN results JSONB NOT NULL DEFAULT '[]'::JSONB;
  END IF;
END $$;

-- ─── Aggiungi colonna overall_status (alias per status esistente) ───────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'overall_status'
  ) THEN
    -- overall_status è un alias view-based, usiamo status esistente
    -- Non aggiungere colonna duplicata
    NULL;
  END IF;
END $$;

-- ─── Indici notifications ───────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON notifications (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_status
  ON notifications (user_id, status);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON notifications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_retry
  ON notifications (status, retry_count, created_at)
  WHERE status = 'failed';

CREATE INDEX IF NOT EXISTS idx_notifications_daily_count
  ON notifications (user_id, created_at);

-- ─── TABLE: notification_delivery_log ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS notification_delivery_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  channel         VARCHAR(20) NOT NULL,               -- 'whatsapp' | 'email'
  status          VARCHAR(20) NOT NULL,               -- 'sent' | 'delivered' | 'read' | 'failed'
  provider_msg_id VARCHAR(100),
  error_message   TEXT,
  latency_ms      INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_log_notification_id
  ON notification_delivery_log (notification_id);

CREATE INDEX IF NOT EXISTS idx_delivery_log_channel_status
  ON notification_delivery_log (channel, status, created_at DESC);

-- ─── TABLE: email_tracking ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_tracking (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID REFERENCES notifications(id),
  user_email      VARCHAR(255) NOT NULL,
  event_type      VARCHAR(20) NOT NULL,               -- 'open' | 'click'
  click_url       TEXT,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_tracking_notification
  ON email_tracking (notification_id);

CREATE INDEX IF NOT EXISTS idx_email_tracking_email_event
  ON email_tracking (user_email, event_type, created_at DESC);

-- ─── TABLE: unsubscribes ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS unsubscribes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email      VARCHAR(255) NOT NULL,
  user_id         UUID REFERENCES users(id),
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unsubscribes_email
  ON unsubscribes (user_email);

-- ─── FUNCTION: auto-update updated_at ───────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_preferences_updated_at ON notification_preferences;

CREATE TRIGGER trg_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── VIEW: notification_stats_today ─────────────────────────────────────────

CREATE OR REPLACE VIEW v_notification_stats_today AS
SELECT
  n.user_id,
  u.role,
  COUNT(*) AS total_notifications,
  COUNT(*) FILTER (WHERE n.status = 'sent') AS sent,
  COUNT(*) FILTER (WHERE n.status = 'failed') AS failed,
  array_agg(DISTINCT n.type) AS notification_types
FROM notifications n
JOIN users u ON u.id = n.user_id
WHERE n.created_at >= CURRENT_DATE
GROUP BY n.user_id, u.role;

-- ─── VIEW: notification_stats_weekly ────────────────────────────────────────

CREATE OR REPLACE VIEW v_notification_stats_weekly AS
SELECT
  DATE(n.created_at) AS date,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE n.status = 'sent') AS sent,
  COUNT(*) FILTER (WHERE n.status = 'failed') AS failed
FROM notifications n
WHERE n.created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(n.created_at)
ORDER BY date DESC;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
