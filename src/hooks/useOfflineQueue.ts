import { useState, useEffect, useCallback } from 'react';
import { getOfflineVisits, removeOfflineVisit, countPendingVisits } from '../lib/offlineStorage';
import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import type { OfflineVisit } from '../types/models';

export function useOfflineQueue() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshCount = useCallback(async () => {
    const count = await countPendingVisits();
    setPendingCount(count);
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  const syncOfflineVisits = useCallback(async () => {
    if (!isOnline || syncing) return;
    setSyncing(true);
    try {
      const offlineVisits = await getOfflineVisits();
      const pending = offlineVisits.filter((v: OfflineVisit) => !v.synced);

      for (const visit of pending) {
        const { offline_id, synced: _synced, ...visitData } = visit;
        try {
          await supabase.from('visits').upsert(
            { ...visitData, offline_id } as Database['public']['Tables']['visits']['Insert'],
            { onConflict: 'offline_id' }
          );
          await removeOfflineVisit(offline_id);
        } catch {
          // Will retry next sync
        }
      }
      await refreshCount();
    } finally {
      setSyncing(false);
    }
  }, [isOnline, syncing, refreshCount]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncOfflineVisits();
    }
  }, [isOnline, pendingCount, syncOfflineVisits]);

  return { pendingCount, isOnline, syncing, syncOfflineVisits, refreshCount };
}
