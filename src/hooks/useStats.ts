import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { GlobalKPIs, QuartierStats, DailyVisits, TopicCount } from '../types/models';

export function useStats() {
  const demo = useDemo();
  const [kpis, setKpis] = useState<GlobalKPIs | null>(null);
  const [quartierStats, setQuartierStats] = useState<QuartierStats[]>([]);
  const [dailyVisits, setDailyVisits] = useState<DailyVisits[]>([]);
  const [topTopics, setTopTopics] = useState<TopicCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (demo?.isDemo) {
      setKpis(demo.kpis);
      setQuartierStats(demo.quartierStats);
      setDailyVisits(demo.dailyVisits);
      setTopTopics(demo.topTopics);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [kpiRes, quartierRes, dailyRes, topicRes] = await Promise.all([
        supabase.rpc('get_global_kpis'),
        supabase.rpc('get_quartier_stats'),
        supabase.rpc('get_daily_visits', { days_back: 30 }),
        supabase.rpc('get_top_topics', { limit_count: 5 }),
      ]);

      if (kpiRes.data && kpiRes.data.length > 0) {
        setKpis(kpiRes.data[0] as unknown as GlobalKPIs);
      }
      if (quartierRes.data) setQuartierStats(quartierRes.data as unknown as QuartierStats[]);
      if (dailyRes.data) setDailyVisits(dailyRes.data as unknown as DailyVisits[]);
      if (topicRes.data) setTopTopics(topicRes.data as unknown as TopicCount[]);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, [demo?.isDemo, demo?.kpis, demo?.quartierStats, demo?.dailyVisits, demo?.topTopics]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { kpis, quartierStats, dailyVisits, topTopics, loading, refetch: fetchStats };
}
