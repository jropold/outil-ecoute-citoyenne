import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { ActionSector, Database } from '../types/database';

export function useActionSectors(actionId: string | null) {
  const demo = useDemo();
  const [sectors, setSectors] = useState<ActionSector[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSectors = useCallback(async () => {
    if (!actionId) {
      setSectors([]);
      setLoading(false);
      return;
    }

    if (demo?.isDemo) {
      setSectors((demo.actionSectors || []).filter(s => s.action_id === actionId));
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from('action_sectors')
      .select('*')
      .eq('action_id', actionId)
      .order('created_at', { ascending: true });
    setSectors(data || []);
    setLoading(false);
  }, [actionId, demo?.isDemo, demo?.actionSectors]);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const createSector = async (sector: { name: string; geometry: unknown; responsible_id?: string | null }) => {
    if (!actionId) return null;

    if (demo?.isDemo) {
      const newSector: ActionSector = {
        id: `sector-${uuidv4()}`,
        action_id: actionId,
        name: sector.name,
        geometry: sector.geometry as ActionSector['geometry'],
        responsible_id: sector.responsible_id || null,
        created_at: new Date().toISOString(),
      };
      demo.addActionSector?.(newSector);
      setSectors(prev => [...prev, newSector]);
      return newSector;
    }

    const { data, error } = await supabase
      .from('action_sectors')
      .insert({
        action_id: actionId,
        ...sector,
      } as Database['public']['Tables']['action_sectors']['Insert'])
      .select()
      .single();
    if (error) throw error;
    setSectors(prev => [...prev, data]);
    return data;
  };

  const deleteSector = async (sectorId: string) => {
    if (demo?.isDemo) {
      demo.removeActionSector?.(sectorId);
      setSectors(prev => prev.filter(s => s.id !== sectorId));
      return;
    }

    await supabase.from('action_sectors').delete().eq('id', sectorId);
    setSectors(prev => prev.filter(s => s.id !== sectorId));
  };

  return { sectors, loading, fetchSectors, createSector, deleteSector };
}
