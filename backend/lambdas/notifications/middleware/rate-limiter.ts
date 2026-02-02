import { Pool } from "pg";

interface RateLimitConfig {
  maxPerDay: number;
  maxPerHour: number;
  maxPerMinute: number;
}

/**
 * Rate Limiter per notifiche
 * Previene spam e uso eccessivo del sistema di notifiche
 */
class RateLimiter {
  private pool: Pool | null = null;
  private config: RateLimitConfig = {
    maxPerDay: 10,
    maxPerHour: 5,
    maxPerMinute: 2,
  };

  // In-memory cache per check veloci (fallback se DB non disponibile)
  private memoryCache: Map<string, { count: number; resetAt: number }> = new Map();

  /**
   * Inizializza connessione al database
   */
  private async getPool(): Promise<Pool> {
    if (!this.pool) {
      this.pool = new Pool({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 5432,
        ssl: { rejectUnauthorized: false },
        max: 5,
      });
    }
    return this.pool;
  }

  /**
   * Verifica se l'utente ha superato il rate limit
   * @returns true se rate limited, false se OK
   */
  async check(userId: string): Promise<boolean> {
    try {
      const pool = await this.getPool();

      // Query per contare notifiche nelle varie finestre temporali
      const query = `
        SELECT
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as day_count,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 hour') as hour_count,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 minute') as minute_count
        FROM notifications
        WHERE user_id = $1::uuid
      `;

      const result = await pool.query(query, [userId]);
      const { day_count, hour_count, minute_count } = result.rows[0];

      // Check limiti
      if (parseInt(day_count) >= this.config.maxPerDay) {
        console.log(`[RateLimiter] User ${userId} exceeded daily limit (${day_count}/${this.config.maxPerDay})`);
        return true;
      }

      if (parseInt(hour_count) >= this.config.maxPerHour) {
        console.log(`[RateLimiter] User ${userId} exceeded hourly limit (${hour_count}/${this.config.maxPerHour})`);
        return true;
      }

      if (parseInt(minute_count) >= this.config.maxPerMinute) {
        console.log(`[RateLimiter] User ${userId} exceeded minute limit (${minute_count}/${this.config.maxPerMinute})`);
        return true;
      }

      return false;
    } catch (error) {
      console.error("[RateLimiter] DB check failed, using memory fallback:", error);
      return this.checkMemory(userId);
    }
  }

  /**
   * Fallback: check in-memory se DB non disponibile
   */
  private checkMemory(userId: string): boolean {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const cached = this.memoryCache.get(userId);

    if (!cached || cached.resetAt < now) {
      // Reset o prima richiesta
      this.memoryCache.set(userId, { count: 1, resetAt: now + dayMs });
      return false;
    }

    if (cached.count >= this.config.maxPerDay) {
      return true;
    }

    cached.count++;
    return false;
  }

  /**
   * Incrementa contatore (chiamare dopo invio notifica)
   */
  async increment(userId: string): Promise<void> {
    // Il contatore viene incrementato automaticamente
    // quando si inserisce una nuova notifica nel DB
    // Questo metodo è per il cache in-memory
    const cached = this.memoryCache.get(userId);
    if (cached) {
      cached.count++;
    }
  }

  /**
   * Ottieni statistiche rate limit per utente
   */
  async getStats(userId: string): Promise<{
    dailyUsed: number;
    dailyLimit: number;
    hourlyUsed: number;
    hourlyLimit: number;
  }> {
    try {
      const pool = await this.getPool();
      const query = `
        SELECT
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as day_count,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 hour') as hour_count
        FROM notifications
        WHERE user_id = $1::uuid
      `;

      const result = await pool.query(query, [userId]);
      const { day_count, hour_count } = result.rows[0];

      return {
        dailyUsed: parseInt(day_count),
        dailyLimit: this.config.maxPerDay,
        hourlyUsed: parseInt(hour_count),
        hourlyLimit: this.config.maxPerHour,
      };
    } catch {
      return {
        dailyUsed: 0,
        dailyLimit: this.config.maxPerDay,
        hourlyUsed: 0,
        hourlyLimit: this.config.maxPerHour,
      };
    }
  }

  /**
   * Aggiorna configurazione limiti
   */
  setLimits(config: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Reset rate limit per utente (admin only)
   */
  async resetForUser(userId: string): Promise<void> {
    this.memoryCache.delete(userId);
    console.log(`[RateLimiter] Reset limits for user ${userId}`);
  }
}

// Singleton export
export const rateLimiter = new RateLimiter();
