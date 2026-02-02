const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    host: process.env.DB_HOST || 'affittochiaro-dev.cjwkuo8ww30k.eu-north-1.rds.amazonaws.com',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'affittochiaro',
    user: process.env.DB_USER || 'affittochiaro_admin',
    password: process.env.DB_PASSWORD || 'AffittoChiaro2024Dev!',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!');

    // Get migration file from command line argument or use default
    const migrationArg = process.argv[2] || 'migrations/003_notification_system.sql';
    const sqlPath = path.join(__dirname, migrationArg);

    console.log(`Running migration: ${migrationArg}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await client.query(sql);
    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Error running migration:', error.message);
    if (error.detail) console.error('Detail:', error.detail);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
