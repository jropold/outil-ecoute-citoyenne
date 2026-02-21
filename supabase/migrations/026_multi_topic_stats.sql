-- Migration 026: Update get_top_topics to handle comma-separated multi-topics
CREATE OR REPLACE FUNCTION get_top_topics(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(topic TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    trim(t.val) AS topic,
    count(*)::BIGINT AS count
  FROM visits v,
    unnest(string_to_array(v.topic, ',')) AS t(val)
  WHERE v.topic IS NOT NULL AND trim(t.val) != ''
  GROUP BY trim(t.val)
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;
