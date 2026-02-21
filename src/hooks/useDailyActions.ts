import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { DailyAction, Quartier, Database } from '../types/database';

export function useDailyActions() {
  const demo = useDemo();
  const [actions, setActions] = useState<DailyAction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActions = useCallback(async () => {
    if (demo?.isDemo) {
      setActions(demo.dailyActions || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_actions')
      .select('*')
      .eq('action_date', today)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setActions(data || []);
    setLoading(false);
  }, [demo?.isDemo, demo?.dailyActions]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const createAction = async (action: {
    name: string;
    geometry: unknown;
    notes?: string;
    created_by: string;
  }) => {
    if (demo?.isDemo) {
      // Auto-create quartier with same name + geometry
      const quartierId = `quartier-${uuidv4()}`;
      const newQuartier: Quartier = {
        id: quartierId,
        name: action.name,
        geometry: action.geometry as Quartier['geometry'],
        total_doors_estimate: 0,
        created_at: new Date().toISOString(),
      };
      demo.addQuartier?.(newQuartier);

      const newAction: DailyAction = {
        id: `action-${Date.now()}`,
        name: action.name,
        quartier_id: quartierId,
        geometry: action.geometry as DailyAction['geometry'],
        action_date: new Date().toISOString().split('T')[0],
        status: 'active',
        notes: action.notes || null,
        created_by: action.created_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      demo.addDailyAction?.(newAction);
      setActions(prev => [newAction, ...prev]);
      return newAction;
    }

    // Supabase: create quartier first, then action linked to it
    const { data: quartierData, error: quartierError } = await supabase
      .from('quartiers')
      .insert({
        name: action.name,
        geometry: action.geometry,
        total_doors_estimate: 0,
      } as Database['public']['Tables']['quartiers']['Insert'])
      .select()
      .single();
    if (quartierError) throw quartierError;

    const { data, error } = await supabase
      .from('daily_actions')
      .insert({
        name: action.name,
        quartier_id: quartierData.id,
        geometry: action.geometry,
        notes: action.notes,
        created_by: action.created_by,
      } as Database['public']['Tables']['daily_actions']['Insert'])
      .select()
      .single();
    if (error) throw error;
    setActions(prev => [data, ...prev]);
    return data;
  };

  const completeAction = async (actionId: string) => {
    if (demo?.isDemo) {
      demo.updateDailyAction?.(actionId, 'completed');
      setActions(prev => prev.filter(a => a.id !== actionId));
      return;
    }

    await supabase
      .from('daily_actions')
      .update({ status: 'completed' } as Database['public']['Tables']['daily_actions']['Update'])
      .eq('id', actionId);
    setActions(prev => prev.filter(a => a.id !== actionId));
  };

  const cancelAction = async (actionId: string) => {
    if (demo?.isDemo) {
      demo.updateDailyAction?.(actionId, 'cancelled');
      setActions(prev => prev.filter(a => a.id !== actionId));
      return;
    }

    await supabase
      .from('daily_actions')
      .update({ status: 'cancelled' } as Database['public']['Tables']['daily_actions']['Update'])
      .eq('id', actionId);
    setActions(prev => prev.filter(a => a.id !== actionId));
  };

  return { actions, loading, fetchActions, createAction, completeAction, cancelAction };
}
