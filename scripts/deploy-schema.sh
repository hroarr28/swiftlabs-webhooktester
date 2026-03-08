#!/bin/bash

# Deploy database schema to Supabase
# Usage: ./scripts/deploy-schema.sh

set -e

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Extract project ref from Supabase URL
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')

echo "🚀 Deploying Webhook Tester schema to Supabase..."
echo "📡 Project: $PROJECT_REF"
echo ""

# Supabase connection string
# Format: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
# We need the database password - this is set during project creation

echo "⚠️  This script requires your Supabase database password."
echo "Find it in: Supabase Dashboard → Project Settings → Database → Connection string"
echo ""
read -sp "Enter database password: " DB_PASSWORD
echo ""

CONNECTION_STRING="postgresql://postgres:$DB_PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"

echo ""
echo "📝 Running base migration..."
psql "$CONNECTION_STRING" -f supabase/migration.sql

echo ""
echo "📝 Running webhook schema migration..."
psql "$CONNECTION_STRING" -f supabase/migrations/001_webhook_schema.sql

echo ""
echo "✅ Schema deployment complete!"
echo ""
echo "Next steps:"
echo "1. Test signup flow: npm run dev"
echo "2. Create test endpoint"
echo "3. Send test webhook"
echo "4. Test Stripe checkout (test mode)"
