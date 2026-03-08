#!/usr/bin/env node

/**
 * Check database schema status
 * Shows what tables exist and what needs to be created
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Load environment variables from .env.local
const envFile = readFileSync(resolve(projectRoot, '.env.local'), 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const requiredTables = [
  'profiles',
  'endpoints',
  'requests',
  'request_forwards',
  'subscriptions',
  'usage_tracking'
];

async function checkTable(tableName) {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    if (error) {
      // Table doesn't exist or RLS blocking
      if (error.code === '42P01') {
        return { exists: false, error: 'Table does not exist' };
      }
      // RLS might be blocking, but table exists
      return { exists: true, error: error.message };
    }
    
    return { exists: true, error: null };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

async function checkDatabase() {
  console.log('🔍 Checking Webhook Tester database schema...\n');
  console.log(`📡 Supabase URL: ${supabaseUrl}\n`);
  
  let allExist = true;
  
  for (const table of requiredTables) {
    const result = await checkTable(table);
    
    if (result.exists) {
      console.log(`✅ ${table.padEnd(20)} - exists`);
    } else {
      console.log(`❌ ${table.padEnd(20)} - missing`);
      allExist = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allExist) {
    console.log('✅ Database schema is complete!\n');
    console.log('You can now test the application:');
    console.log('1. Visit http://localhost:3000');
    console.log('2. Sign up for an account');
    console.log('3. Create a webhook endpoint');
  } else {
    console.log('⚠️  Database schema is incomplete!\n');
    console.log('To deploy the schema, run ONE of these options:\n');
    console.log('Option 1: Manual (Recommended)');
    console.log('  1. Go to https://supabase.com/dashboard');
    console.log('  2. Select your project');
    console.log('  3. Go to SQL Editor');
    console.log('  4. Copy/paste supabase/migration.sql and run');
    console.log('  5. Copy/paste supabase/migrations/001_webhook_schema.sql and run\n');
    console.log('Option 2: Automated (requires psql)');
    console.log('  chmod +x scripts/deploy-schema.sh');
    console.log('  ./scripts/deploy-schema.sh');
  }
}

checkDatabase().catch(console.error);
