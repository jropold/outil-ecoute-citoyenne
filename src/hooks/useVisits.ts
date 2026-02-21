import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { Visit, Database } from '../types/database';

interface UseVisitsOptions {
  quartierId?: string;
  volunteerId?: string;
  limit?: number;
}

export function useVisits(options: UseVisitsOptions = {}) {
  const demo = useDemo();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(async () => {
    if (demo?.isDemo) {
      let filtered = demo.visits;
      if (options.quartierId) filtered = filtered.filter(v => v.quartier_id === options.quartierId);
      if (options.volunteerId) filtered = filtered.filter(v => v.volunteer_id === options.volunteerId);
      if (options.limit) filtered = filtered.slice(0, options.limit);
      setVisits(filtered);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('visits')
        .select('*')
        .order('created_at', { ascending: false });

      if (options.quartierId) {
        query = query.eq('quartier_id', options.quartierId);
      }
      if (options.volunteerId) {
        query = query.eq('volunteer_id', options.volunteerId);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setVisits(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [options.quartierId, options.volunteerId, options.limit, demo?.isDemo, demo?.visits]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const createVisit = async (visit: Omit<Visit, 'id' | 'created_at'>) => {
    if (demo?.isDemo) {
      const newVisit: Visit = {
        ...visit,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      demo.addVisit(newVisit);
      setVisits((prev) => [newVisit, ...prev]);
      return newVisit;
    }

    const { data, error: insertError } = await supabase
      .from('visits')
      .insert(visit as Database['public']['Tables']['visits']['Insert'])
      .select()
      .single();
    if (insertError) throw insertError;
    setVisits((prev) => [data, ...prev]);
    return data;
  };

  return { visits, loading, error, fetchVisits, createVisit };
}
