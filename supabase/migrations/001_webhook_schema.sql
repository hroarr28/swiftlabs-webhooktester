-- Webhook Tester Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Endpoints: User-created webhook endpoints
CREATE TABLE endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL UNIQUE, -- e.g., "my-webhook-abc123"
  name VARCHAR(255) NOT NULL, -- User-friendly name
  description TEXT,
  custom_domain VARCHAR(255), -- Premium: custom.domain.com/webhook
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Index for fast lookups
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_endpoints_user_id ON endpoints(user_id);
CREATE INDEX idx_endpoints_slug ON endpoints(slug);
CREATE INDEX idx_endpoints_active ON endpoints(is_active) WHERE is_active = true;

-- Requests: Incoming webhook requests
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  
  -- Request details
  method VARCHAR(10) NOT NULL, -- GET, POST, PUT, DELETE, etc.
  path VARCHAR(2048), -- Full path including query params
  headers JSONB NOT NULL DEFAULT '{}', -- All headers as JSON
  body TEXT, -- Raw request body
  content_type VARCHAR(255), -- Content-Type header extracted
  query_params JSONB, -- Parsed query parameters
  
  -- Metadata
  ip_address INET, -- Client IP
  user_agent TEXT, -- Client user agent
  size_bytes INT, -- Request body size
  
  -- Status
  forwarded BOOLEAN DEFAULT false, -- Was this forwarded?
  forwarded_at TIMESTAMP WITH TIME ZONE, -- When forwarded
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for filtering and sorting
  CHECK (size_bytes >= 0)
);

CREATE INDEX idx_requests_endpoint_id ON requests(endpoint_id);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX idx_requests_method ON requests(method);
CREATE INDEX idx_requests_forwarded ON requests(forwarded);

-- Request Forwards: Rules for forwarding requests
CREATE TABLE request_forwards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  
  -- Forward configuration
  target_url VARCHAR(2048) NOT NULL, -- e.g., http://localhost:3000/webhook
  is_active BOOLEAN DEFAULT true,
  
  -- Optional filtering
  filter_method VARCHAR(10), -- Only forward specific HTTP methods
  filter_headers JSONB, -- Only forward if headers match
  
  -- Stats
  total_forwards INT DEFAULT 0,
  last_forwarded_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_request_forwards_endpoint_id ON request_forwards(endpoint_id);
CREATE INDEX idx_request_forwards_active ON request_forwards(is_active) WHERE is_active = true;

-- Subscriptions: User plan tracking
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'pro'
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'past_due'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);

-- Usage tracking: Request quotas
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint_id UUID REFERENCES endpoints(id) ON DELETE CASCADE,
  
  -- Counts
  requests_count INT NOT NULL DEFAULT 0,
  storage_bytes BIGINT NOT NULL DEFAULT 0, -- Total storage used by requests
  
  -- Period tracking
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One record per user per period
  CONSTRAINT unique_user_period UNIQUE (user_id, period_start)
);

CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_period ON usage_tracking(period_start, period_end);

-- Row Level Security Policies

-- Endpoints: Users can only see/manage their own endpoints
ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own endpoints"
  ON endpoints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own endpoints"
  ON endpoints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own endpoints"
  ON endpoints FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own endpoints"
  ON endpoints FOR DELETE
  USING (auth.uid() = user_id);

-- Requests: Users can see requests for their endpoints
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view requests for their endpoints"
  ON requests FOR SELECT
  USING (
    endpoint_id IN (
      SELECT id FROM endpoints WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert requests" -- Webhooks come from external sources
  ON requests FOR INSERT
  WITH CHECK (true);

-- Request Forwards: Users can manage forwards for their endpoints
ALTER TABLE request_forwards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view forwards for their endpoints"
  ON request_forwards FOR SELECT
  USING (
    endpoint_id IN (
      SELECT id FROM endpoints WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create forwards for their endpoints"
  ON request_forwards FOR INSERT
  WITH CHECK (
    endpoint_id IN (
      SELECT id FROM endpoints WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update forwards for their endpoints"
  ON request_forwards FOR UPDATE
  USING (
    endpoint_id IN (
      SELECT id FROM endpoints WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete forwards for their endpoints"
  ON request_forwards FOR DELETE
  USING (
    endpoint_id IN (
      SELECT id FROM endpoints WHERE user_id = auth.uid()
    )
  );

-- Subscriptions: Users can only see their own subscription
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Usage tracking: Users can view their own usage
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all usage"
  ON usage_tracking FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Functions

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_endpoints_updated_at
  BEFORE UPDATE ON endpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_request_forwards_updated_at
  BEFORE UPDATE ON request_forwards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Clean up old requests (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_requests()
RETURNS void AS $$
BEGIN
  -- Free plan: 7 days retention
  DELETE FROM requests
  WHERE created_at < NOW() - INTERVAL '7 days'
  AND endpoint_id IN (
    SELECT e.id FROM endpoints e
    JOIN subscriptions s ON s.user_id = e.user_id
    WHERE s.plan = 'free'
  );
  
  -- Pro plan: 30 days retention
  DELETE FROM requests
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND endpoint_id IN (
    SELECT e.id FROM endpoints e
    JOIN subscriptions s ON s.user_id = e.user_id
    WHERE s.plan = 'pro'
  );
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE endpoints IS 'User-created webhook endpoints with unique slugs';
COMMENT ON TABLE requests IS 'Incoming webhook requests captured by endpoints';
COMMENT ON TABLE request_forwards IS 'Rules for forwarding requests to external URLs';
COMMENT ON TABLE subscriptions IS 'User subscription and plan information';
COMMENT ON TABLE usage_tracking IS 'Monthly usage tracking for quota enforcement';
