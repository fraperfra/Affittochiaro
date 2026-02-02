const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    host: 'affittochiaro-dev.cjwkuo8ww30k.eu-north-1.rds.amazonaws.com',
    port: 5432,
    database: 'affittochiaro',
    user: 'affittochiaro_admin',
    password: 'AffittoChiaro2024Dev!',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!');

    const sqlPath = path.join(__dirname, 'migrations/002_notifications_update.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration 002_notifications_update...');
    await client.query(sql);
    console.log('Migration completed successfully!');

    // Verify table structure
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'notifications'
      ORDER BY ordinal_position
    `);

    console.log('\nNotifications table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

  } catch (error) {
    console.error('Error running migration:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
