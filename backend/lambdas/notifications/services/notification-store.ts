import { Pool, PoolConfig } from "pg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationStoreConfig {
  host: string;
  database: string;
  user: string;
  password: string;
  port?: number;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferences: {
    whatsapp: boolean;
    email: boolean;
    frequency: "realtime" | "daily_digest" | "weekly";
    typesEnabled: Record<string, boolean>;
  };
}

interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  channels: string[];
  results: Array<{
    channel: string;
    status: string;
    messageId?: string;
    error?: string;
    latencyMs: number;
  }>;
  overallStatus: string;
  createdAt: string;
  retryCount: number;
}

// ─── Notification Store ───────────────────────────────────────────────────────

export class NotificationStore {
  private pool: Pool;

  constructor(config: NotificationStoreConfig) {
    const poolConfig: PoolConfig = {
      host: config.host,
      database: config.database,
      user: config.user,
      password: config.password,
      port: config.port || 5432,
      max: 10, // Max connessioni nel pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: { rejectUnauthorized: false }, // RDS richiede SSL
    };

    this.pool = new Pool(poolConfig);

    this.pool.on("error", (err) => {
      console.error("[NotificationStore] Pool error:", err);
    });
  }

  // ─── Users ──────────────────────────────────────────────────────────────────

  /**
   * Fetch utente per ID con preferences
   */
  async getUserById(userId: string): Promise<UserRecord | null> {
    const query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        COALESCE(np.channel_whatsapp, true) AS pref_whatsapp,
        COALESCE(np.channel_email, true) AS pref_email,
        COALESCE(np.frequency, 'realtime') AS pref_frequency,
        COALESCE(np.types_enabled, '{}') AS pref_types_enabled
      FROM users u
      LEFT JOIN notification_preferences np ON np.user_id = u.id
      WHERE u.id = $1
    `;

    const result = await this.pool.query(query, [userId]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      preferences: {
        whatsapp: row.pref_whatsapp,
        email: row.pref_email,
        frequency: row.pref_frequency,
        typesEnabled: row.pref_types_enabled,
      },
    };
  }

  // ─── Notifications ──────────────────────────────────────────────────────────

  /**
   * Salva un record di notifica nel database
   */
  async saveNotification(record: NotificationRecord): Promise<void> {
    const query = `
      INSERT INTO notifications (
        id, user_id, type, channels, results, status, created_at, retry_count
      ) VALUES (
        $1, $2, $3, $4, $5, $6::notification_status, $7, $8
      )
      ON CONFLICT (id) DO UPDATE SET
        results = EXCLUDED.results,
        status = EXCLUDED.status,
        retry_count = EXCLUDED.retry_count
    `;

    await this.pool.query(query, [
      record.id,
      record.userId,
      record.type,
      JSON.stringify(record.channels),
      JSON.stringify(record.results),
      record.overallStatus,
      record.createdAt,
      record.retryCount,
    ]);
  }

  /**
   * Fetch notifica per ID (utile per retry e monitoring)
   */
  async getNotificationById(notificationId: string): Promise<NotificationRecord | null> {
    const query = `
      SELECT id, user_id, type, channels, results, status, created_at, retry_count
      FROM notifications
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [notificationId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      channels: row.channels,
      results: row.results,
      overallStatus: row.status,
      createdAt: row.created_at,
      retryCount: row.retry_count,
    };
  }

  /**
   * Conta notifiche inviate oggi per un utente (usato dal rate limiter)
   */
  async countTodayNotifications(userId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) AS count
      FROM notifications
      WHERE user_id = $1
        AND created_at >= CURRENT_DATE
        AND status IN ('sent', 'partial')
    `;

    const result = await this.pool.query(query, [userId]);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Fetch notifiche fallite per retry (usato dal retry Lambda)
   */
  async getFailedNotificationsForRetry(maxRetries: number = 3): Promise<NotificationRecord[]> {
    const query = `
      SELECT id, user_id, type, channels, results, status, created_at, retry_count
      FROM notifications
      WHERE status IN ('failed', 'partial')
        AND retry_count < $1
        AND created_at >= NOW() - INTERVAL '24 hours'
      ORDER BY created_at ASC
      LIMIT 100
    `;

    const result = await this.pool.query(query, [maxRetries]);
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      type: row.type,
      channels: row.channels,
      results: row.results,
      overallStatus: row.status,
      createdAt: row.created_at,
      retryCount: row.retry_count,
    }));
  }

  /**
   * Aggiorna retry count e status
   */
  async updateNotificationRetry(
    notificationId: string,
    retryCount: number,
    newStatus: "pending" | "sent" | "failed",
    results?: Array<{ channel: string; status: string; messageId?: string; error?: string; latencyMs: number }>
  ): Promise<void> {
    const query = `
      UPDATE notifications
      SET retry_count = $2,
          status = $3::notification_status,
          results = COALESCE($4, results),
          updated_at = NOW()
      WHERE id = $1
    `;

    await this.pool.query(query, [
      notificationId,
      retryCount,
      newStatus,
      results ? JSON.stringify(results) : null,
    ]);
  }

  // ─── Preferences ────────────────────────────────────────────────────────────

  /**
   * Aggiorna le preferenze di notifica dell'utente
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<{
      channelWhatsapp: boolean;
      channelEmail: boolean;
      frequency: string;
      typesEnabled: Record<string, boolean>;
    }>
  ): Promise<void> {
    const upsertQuery = `
      INSERT INTO notification_preferences (user_id, channel_whatsapp, channel_email, frequency, types_enabled, updated_at)
      VALUES ($1,
        COALESCE($2, true),
        COALESCE($3, true),
        COALESCE($4, 'realtime'),
        COALESCE($5, '{}'),
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        channel_whatsapp = COALESCE($2, notification_preferences.channel_whatsapp),
        channel_email = COALESCE($3, notification_preferences.channel_email),
        frequency = COALESCE($4, notification_preferences.frequency),
        types_enabled = COALESCE($5, notification_preferences.types_enabled),
        updated_at = NOW()
    `;

    await this.pool.query(upsertQuery, [
      userId,
      preferences.channelWhatsapp ?? null,
      preferences.channelEmail ?? null,
      preferences.frequency ?? null,
      preferences.typesEnabled ? JSON.stringify(preferences.typesEnabled) : null,
    ]);
  }

  /**
   * Fetch preferenze utente
   */
  async getPreferences(userId: string): Promise<{
    channelWhatsapp: boolean;
    channelEmail: boolean;
    frequency: string;
    typesEnabled: Record<string, boolean>;
  } | null> {
    const query = `
      SELECT channel_whatsapp, channel_email, frequency, types_enabled
      FROM notification_preferences
      WHERE user_id = $1
    `;

    const result = await this.pool.query(query, [userId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      channelWhatsapp: row.channel_whatsapp,
      channelEmail: row.channel_email,
      frequency: row.frequency,
      typesEnabled: row.types_enabled,
    };
  }

  // ─── Analytics ──────────────────────────────────────────────────────────────

  /**
   * Stats di notifica per monitoring dashboard
   */
  async getNotificationStats(days: number = 7): Promise<{
    totalSent: number;
    totalFailed: number;
    byChannel: Record<string, { sent: number; failed: number }>;
    byType: Record<string, number>;
    avgLatencyMs: number;
  }> {
    const query = `
      SELECT
        status,
        type,
        channels,
        results
      FROM notifications
      WHERE created_at >= NOW() - INTERVAL '1 day' * $1
    `;

    const result = await this.pool.query(query, [days]);

    let totalSent = 0;
    let totalFailed = 0;
    let totalLatency = 0;
    let latencyCount = 0;
    const byChannel: Record<string, { sent: number; failed: number }> = {
      whatsapp: { sent: 0, failed: 0 },
      email: { sent: 0, failed: 0 },
    };
    const byType: Record<string, number> = {};

    for (const row of result.rows) {
      if (row.status === "sent") totalSent++;
      else totalFailed++;

      byType[row.type] = (byType[row.type] || 0) + 1;

      for (const r of row.results || []) {
        if (r.status === "sent") byChannel[r.channel].sent++;
        else byChannel[r.channel].failed++;

        if (r.latencyMs) {
          totalLatency += r.latencyMs;
          latencyCount++;
        }
      }
    }

    return {
      totalSent,
      totalFailed,
      byChannel,
      byType,
      avgLatencyMs: latencyCount > 0 ? Math.round(totalLatency / latencyCount) : 0,
    };
  }

  /**
   * Statistiche giornaliere per grafici
   */
  async getDailyStats(days: number = 30): Promise<Array<{
    date: string;
    sent: number;
    failed: number;
  }>> {
    const query = `
      SELECT
        DATE(created_at) as date,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM notifications
      WHERE created_at >= NOW() - INTERVAL '1 day' * $1
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const result = await this.pool.query(query, [days]);
    return result.rows.map((row) => ({
      date: row.date.toISOString().split("T")[0],
      sent: parseInt(row.sent, 10),
      failed: parseInt(row.failed, 10),
    }));
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  /**
   * Elimina notifiche vecchie (retention 90 giorni)
   */
  async cleanupOldNotifications(retentionDays: number = 90): Promise<number> {
    const query = `
      DELETE FROM notifications
      WHERE created_at < NOW() - INTERVAL '1 day' * $1
      RETURNING id
    `;

    const result = await this.pool.query(query, [retentionDays]);
    return result.rowCount || 0;
  }

  /**
   * Chiudi pool connessioni
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}
