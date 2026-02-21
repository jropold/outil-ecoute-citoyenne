import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { DailyAction, Quartier, Database } from '../types/database';

export function useDailyActions() {
  const demo = useDemo();
  const [actions, setActions] = useState<DailyAction[]>([]);
  const [allActions, setAllActions] = useState<DailyAction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActions = useCallback(async () => {
    if (demo?.isDemo) {
      const today = new Date().toISOString().split('T')[0];
      setActions((demo.dailyActions || []).filter(a => a.status === 'active' && a.action_date === today));
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

  const fetchAllActions = useCallback(async () => {
    if (demo?.isDemo) {
      setAllActions((demo.dailyActions || []).filter(a => a.status === 'active' || a.status === 'completed'));
      return;
    }

    const { data } = await supabase
      .from('daily_actions')
      .select('*')
      .in('status', ['active', 'completed'])
      .order('action_date', { ascending: false });
    setAllActions(data || []);
  }, [demo?.isDemo, demo?.dailyActions]);

  useEffect(() => {
    fetchActions();
    fetchAllActions();
  }, [fetchActions, fetchAllActions]);

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

    // Supabase: find existing quartier or create one
    let quartierData: { id: string };
    const { data: existing } = await supabase
      .from('quartiers')
      .select('id')
      .eq('name', action.name)
      .single();

    if (existing) {
      quartierData = existing;
    } else {
      const { data: created, error: quartierError } = await supabase
        .from('quartiers')
        .insert({
          name: action.name,
          geometry: action.geometry,
          total_doors_estimate: 0,
        } as Database['public']['Tables']['quartiers']['Insert'])
        .select()
        .single();
      if (quartierError) throw quartierError;
      quartierData = created;
    }

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
    // Refresh allActions to include the newly completed action
    fetchAllActions();
  };

  const cancelAction = async (actionId: string) => {
    if (demo?.isDemo) {
      demo.updateDailyAction?.(actionId, 'cancelled');
      setActions(prev => prev.filter(a => a.id !== actionId));
      setAllActions(prev => prev.filter(a => a.id !== actionId));
      return;
    }

    await supabase
      .from('daily_actions')
      .update({ status: 'cancelled' } as Database['public']['Tables']['daily_actions']['Update'])
      .eq('id', actionId);
    setActions(prev => prev.filter(a => a.id !== actionId));
    setAllActions(prev => prev.filter(a => a.id !== actionId));
  };

  const deleteAction = async (actionId: string, deleteVisits: boolean) => {
    if (demo?.isDemo) {
      demo.removeDailyAction?.(actionId, deleteVisits);
      setActions(prev => prev.filter(a => a.id !== actionId));
      setAllActions(prev => prev.filter(a => a.id !== actionId));
      return;
    }

    // Optionally delete linked visits first
    if (deleteVisits) {
      await supabase.from('visits').delete().eq('action_id', actionId);
    }
    // Delete action — cascades to sectors/groups/members, SET NULL on visits
    const { error } = await supabase.from('daily_actions').delete().eq('id', actionId);
    if (error) throw error;
    setActions(prev => prev.filter(a => a.id !== actionId));
    setAllActions(prev => prev.filter(a => a.id !== actionId));
  };

  return { actions, allActions, loading, fetchActions, fetchAllActions, createAction, completeAction, cancelAction, deleteAction };
}
