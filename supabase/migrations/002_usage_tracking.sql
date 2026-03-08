-- Usage tracking table
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL, -- Format: 'YYYY-MM'
  usage_count INTEGER DEFAULT 0 NOT NULL,
  plan_limit INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Index for fast lookups
CREATE INDEX idx_user_usage_user_month ON user_usage(user_id, month);

-- RLS policies
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Users can only read their own usage
CREATE POLICY "Users can read own usage"
  ON user_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert/update (API routes)
CREATE POLICY "Service role can manage usage"
  ON user_usage
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_month TEXT,
  p_plan_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  current_usage INTEGER,
  limit_reached BOOLEAN
) AS $$
DECLARE
  v_usage INTEGER;
BEGIN
  -- Insert or update usage
  INSERT INTO user_usage (user_id, month, usage_count, plan_limit)
  VALUES (p_user_id, p_month, 1, p_plan_limit)
  ON CONFLICT (user_id, month)
  DO UPDATE SET 
    usage_count = user_usage.usage_count + 1,
    updated_at = NOW();

  -- Get current usage
  SELECT usage_count INTO v_usage
  FROM user_usage
  WHERE user_id = p_user_id AND month = p_month;

  RETURN QUERY SELECT v_usage, v_usage >= p_plan_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current month usage
CREATE OR REPLACE FUNCTION get_current_usage(p_user_id UUID)
RETURNS TABLE (
  usage_count INTEGER,
  plan_limit INTEGER,
  percentage INTEGER
) AS $$
DECLARE
  v_month TEXT;
BEGIN
  v_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  RETURN QUERY
  SELECT 
    COALESCE(u.usage_count, 0)::INTEGER,
    COALESCE(u.plan_limit, 100)::INTEGER,
    CASE 
      WHEN COALESCE(u.plan_limit, 100) = 0 THEN 0
      ELSE (COALESCE(u.usage_count, 0)::FLOAT / COALESCE(u.plan_limit, 100)::FLOAT * 100)::INTEGER
    END
  FROM user_usage u
  WHERE u.user_id = p_user_id AND u.month = v_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
