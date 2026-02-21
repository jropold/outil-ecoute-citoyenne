import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { Sector } from '../types/database';

export function useSectors(quartierId?: string) {
  const demo = useDemo();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSectors = useCallback(async () => {
    if (demo?.isDemo) {
      let filtered = demo.sectors;
      if (quartierId) filtered = filtered.filter(s => s.quartier_id === quartierId);
      setSectors(filtered);
      setLoading(false);
      return;
    }

    setLoading(true);
    let query = supabase.from('sectors').select('*').order('name');
    if (quartierId) {
      query = query.eq('quartier_id', quartierId);
    }
    const { data } = await query;
    setSectors(data || []);
    setLoading(false);
  }, [quartierId, demo?.isDemo, demo?.sectors]);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  return { sectors, loading, refetch: fetchSectors };
}
