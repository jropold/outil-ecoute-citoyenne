import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { Quartier } from '../types/database';

interface UseQuartiersOptions {
  onlyFromActions?: boolean;
}

export function useQuartiers(options?: UseQuartiersOptions) {
  const demo = useDemo();
  const [quartiers, setQuartiers] = useState<Quartier[]>([]);
  const [loading, setLoading] = useState(true);
  const onlyFromActions = options?.onlyFromActions ?? false;

  useEffect(() => {
    if (demo?.isDemo) {
      let result = demo.quartiers;
      if (onlyFromActions) {
        const actionQuartierIds = new Set(
          (demo.dailyActions || [])
            .filter(a => a.quartier_id)
            .map(a => a.quartier_id!)
        );
        result = result.filter(q => actionQuartierIds.has(q.id));
      }
      setQuartiers(result);
      setLoading(false);
      return;
    }

    async function fetch() {
      if (onlyFromActions) {
        const { data } = await supabase
          .from('quartiers')
          .select('*, daily_actions!inner(quartier_id)')
          .order('name');
        // Deduplicate (a quartier may be linked to multiple actions)
        const seen = new Set<string>();
        const unique: Quartier[] = [];
        for (const row of data || []) {
          if (!seen.has(row.id)) {
            seen.add(row.id);
            const { daily_actions: _, ...quartier } = row;
            unique.push(quartier as Quartier);
          }
        }
        setQuartiers(unique);
      } else {
        const { data } = await supabase
          .from('quartiers')
          .select('*')
          .order('name');
        setQuartiers(data || []);
      }
      setLoading(false);
    }
    fetch();
  }, [demo?.isDemo, demo?.quartiers, demo?.dailyActions, onlyFromActions]);

  return { quartiers, loading };
}
