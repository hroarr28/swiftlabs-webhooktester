#!/usr/bin/env node

/**
 * Deploy database schema to Supabase
 * Reads migration files and executes them using Supabase REST API
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Load environment variables
config({ path: resolve(projectRoot, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSql(sql, description) {
  console.log(`\n📝 Executing: ${description}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
    
    if (error) {
      // Try direct execution via pg_meta
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql_string: sql })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      console.log(`✅ ${description} - Success`);
      return;
    }
    
    console.log(`✅ ${description} - Success`);
  } catch (err) {
    console.error(`❌ ${description} - Failed`);
    console.error(err.message);
    throw err;
  }
}

async function deploySchema() {
  console.log('🚀 Deploying Webhook Tester schema to Supabase...\n');
  console.log(`📡 Supabase URL: ${supabaseUrl}`);
  
  try {
    // Read migration files
    const baseMigration = readFileSync(
      resolve(projectRoot, 'supabase/migration.sql'), 
      'utf8'
    );
    
    const webhookMigration = readFileSync(
      resolve(projectRoot, 'supabase/migrations/001_webhook_schema.sql'), 
      'utf8'
    );
    
    // Execute base migration first
    await executeSql(baseMigration, 'Base schema (profiles table)');
    
    // Execute webhook-specific migration
    await executeSql(webhookMigration, 'Webhook Tester schema');
    
    console.log('\n✅ Schema deployment complete!\n');
    console.log('Next steps:');
    console.log('1. Test signup flow: npm run dev');
    console.log('2. Create test endpoint');
    console.log('3. Send test webhook');
    console.log('4. Test Stripe checkout (test mode)');
    
  } catch (error) {
    console.error('\n❌ Schema deployment failed:', error.message);
    process.exit(1);
  }
}

deploySchema();
