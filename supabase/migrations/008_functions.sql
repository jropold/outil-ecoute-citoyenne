-- Global KPIs function
CREATE OR REPLACE FUNCTION get_global_kpis()
RETURNS TABLE (
  total_doors_knocked BIGINT,
  total_sympathisants BIGINT,
  total_indecis BIGINT,
  total_opposants BIGINT,
  total_absents BIGINT,
  support_rate NUMERIC,
  coverage_rate NUMERIC,
  sympathisant_indecis_ratio NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH visit_counts AS (
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE v.status = 'sympathisant') AS symp,
      COUNT(*) FILTER (WHERE v.status = 'indecis') AS ind,
      COUNT(*) FILTER (WHERE v.status = 'opposant') AS opp,
      COUNT(*) FILTER (WHERE v.status = 'absent') AS abs
    FROM visits v
  ),
  SELECT
    vc.total,
    vc.symp,
    vc.ind,
    vc.opp,
    vc.abs,
    CASE WHEN (vc.symp + vc.ind + vc.opp) > 0
      THEN ROUND(vc.symp::NUMERIC / (vc.symp + vc.ind + vc.opp) * 100, 1)
      ELSE 0
    END,
    CASE WHEN vc.total > 0
      THEN ROUND((vc.symp + vc.ind + vc.opp)::NUMERIC / vc.total * 100, 1)
      ELSE 0
    END,
    CASE WHEN vc.ind > 0
      THEN ROUND(vc.symp::NUMERIC / vc.ind, 2)
      ELSE 0
    END
  FROM visit_counts vc;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Quartier stats function
CREATE OR REPLACE FUNCTION get_quartier_stats()
RETURNS TABLE (
  quartier_id UUID,
  quartier_name TEXT,
  total_visits BIGINT,
  sympathisants BIGINT,
  indecis BIGINT,
  opposants BIGINT,
  absents BIGINT,
  support_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    q.id,
    q.name,
    COUNT(v.id),
    COUNT(v.id) FILTER (WHERE v.status = 'sympathisant'),
    COUNT(v.id) FILTER (WHERE v.status = 'indecis'),
    COUNT(v.id) FILTER (WHERE v.status = 'opposant'),
    COUNT(v.id) FILTER (WHERE v.status = 'absent'),
    CASE WHEN COUNT(v.id) FILTER (WHERE v.status IN ('sympathisant', 'indecis', 'opposant')) > 0
      THEN ROUND(
        COUNT(v.id) FILTER (WHERE v.status = 'sympathisant')::NUMERIC /
        COUNT(v.id) FILTER (WHERE v.status IN ('sympathisant', 'indecis', 'opposant')) * 100, 1
      )
      ELSE 0
    END
  FROM quartiers q
  LEFT JOIN visits v ON v.quartier_id = q.id
  GROUP BY q.id, q.name
  ORDER BY q.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Top topics function
CREATE OR REPLACE FUNCTION get_top_topics(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  topic TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT v.topic, COUNT(*) AS cnt
  FROM visits v
  WHERE v.topic IS NOT NULL AND v.topic != ''
  GROUP BY v.topic
  ORDER BY cnt DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Daily visits function
CREATE OR REPLACE FUNCTION get_daily_visits(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  visit_date DATE,
  count BIGINT,
  sympathisants BIGINT,
  indecis BIGINT,
  opposants BIGINT,
  absents BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.created_at::DATE,
    COUNT(*),
    COUNT(*) FILTER (WHERE v.status = 'sympathisant'),
    COUNT(*) FILTER (WHERE v.status = 'indecis'),
    COUNT(*) FILTER (WHERE v.status = 'opposant'),
    COUNT(*) FILTER (WHERE v.status = 'absent')
  FROM visits v
  WHERE v.created_at >= now() - (days_back || ' days')::INTERVAL
  GROUP BY v.created_at::DATE
  ORDER BY v.created_at::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
