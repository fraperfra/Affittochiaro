const { Client } = require('pg');

async function checkDatabase() {
  const client = new Client({
    host: 'affittochiaro-dev.cjwkuo8ww30k.eu-north-1.rds.amazonaws.com',
    port: 5432,
    database: 'affittochiaro',
    user: 'affittochiaro_admin',
    password: 'AffittoChiaro2024Dev!',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('=== DATABASE AFFITTOCHIARO - STATO ===\n');

    // List all tables
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('TABELLE CREATE (' + tables.rows.length + '):');
    tables.rows.forEach(t => console.log('  ✓ ' + t.table_name));

    // Check notifications table specifically
    console.log('\n--- DETTAGLIO TABELLA NOTIFICATIONS ---');
    const notifCols = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'notifications'
      ORDER BY ordinal_position
    `);

    notifCols.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const def = col.column_default ? ` DEFAULT ${col.column_default.substring(0, 30)}` : '';
      console.log(`  ${col.column_name}: ${col.data_type} ${nullable}${def}`);
    });

    // Check indexes on notifications
    console.log('\n--- INDICI SU NOTIFICATIONS ---');
    const indexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'notifications'
    `);
    indexes.rows.forEach(idx => console.log('  ✓ ' + idx.indexname));

    // Check enum types
    console.log('\n--- TIPI ENUM ---');
    const enums = await client.query(`
      SELECT t.typname, array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      GROUP BY t.typname
    `);
    enums.rows.forEach(e => {
      console.log(`  ${e.typname}: ${e.values.join(', ')}`);
    });

  } catch (error) {
    console.error('Errore:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();
