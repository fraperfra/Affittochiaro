import { Pool, PoolConfig } from 'pg';

let pool: Pool | null = null;

const config: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Lambda-optimized settings
  max: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
};

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(config);

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      pool = null;
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function execute(text: string, params?: any[]): Promise<number> {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result.rowCount || 0;
}

// Transaction helper
export async function withTransaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default { getPool, query, queryOne, execute, withTransaction };
