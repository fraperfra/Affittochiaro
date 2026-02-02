-- Migration: 002_notifications_update
-- Aggiorna tabella notifications con schema avanzato per multi-channel

-- Drop vecchia tabella notifications se esiste
DROP TABLE IF EXISTS notifications CASCADE;

-- Crea tipo enum per notification type
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'match_found',
        'trial_expiring',
        'document_reminder',
        'application_received',
        'application_accepted',
        'application_rejected',
        'profile_viewed',
        'new_listing_match',
        'credits_low',
        'subscription_expiring',
        'welcome',
        'verification_complete',
        'system'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crea tipo enum per notification status
DO $$ BEGIN
    CREATE TYPE notification_status AS ENUM (
        'pending',
        'sent',
        'failed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crea nuova tabella notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Tipo notifica
    type notification_type NOT NULL,

    -- Canali di invio (configurazione per questa notifica)
    channels JSONB NOT NULL DEFAULT '{"whatsapp": false, "email": true, "push": false}',

    -- Stato invio
    status notification_status NOT NULL DEFAULT 'pending',

    -- Timestamp invio
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,

    -- IDs messaggi esterni per tracking
    whatsapp_message_id VARCHAR(255),
    email_message_id VARCHAR(255),
    push_message_id VARCHAR(255),

    -- Retry logic
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,

    -- Contenuto notifica
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,

    -- Metadata specifici per tipo notifica
    metadata JSONB DEFAULT '{}',

    -- Tracking lettura
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice composito per query user + type + status
CREATE INDEX idx_notifications_user_type_status
    ON notifications(user_id, type, status);

-- Indice per analytics su sent_at
CREATE INDEX idx_notifications_sent_at
    ON notifications(sent_at DESC)
    WHERE sent_at IS NOT NULL;

-- Indice per retry logic
CREATE INDEX idx_notifications_retry
    ON notifications(status, retry_count, next_retry_at)
    WHERE status IN ('pending', 'failed');

-- Indice per notifiche non lette per utente
CREATE INDEX idx_notifications_unread
    ON notifications(user_id, created_at DESC)
    WHERE is_read = FALSE;

-- Indice per scheduled notifications
CREATE INDEX idx_notifications_scheduled
    ON notifications(scheduled_at)
    WHERE status = 'pending';

-- Trigger per updated_at
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commenti
COMMENT ON TABLE notifications IS 'Notifiche multi-canale con supporto WhatsApp, Email, Push';
COMMENT ON COLUMN notifications.channels IS 'Canali abilitati: {"whatsapp": bool, "email": bool, "push": bool}';
COMMENT ON COLUMN notifications.metadata IS 'Parametri specifici per tipo notifica (es: listing_id, tenant_name, etc)';
COMMENT ON COLUMN notifications.retry_count IS 'Numero tentativi di invio falliti';
