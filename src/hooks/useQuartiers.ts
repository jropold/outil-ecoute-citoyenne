import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { Quartier } from '../types/database';

export function useQuartiers() {
  const demo = useDemo();
  const [quartiers, setQuartiers] = useState<Quartier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (demo?.isDemo) {
      setQuartiers(demo.quartiers);
      setLoading(false);
      return;
    }

    async function fetch() {
      const { data } = await supabase
        .from('quartiers')
        .select('*')
        .order('name');
      setQuartiers(data || []);
      setLoading(false);
    }
    fetch();
  }, [demo?.isDemo, demo?.quartiers]);

  return { quartiers, loading };
}
