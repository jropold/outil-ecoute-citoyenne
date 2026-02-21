import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { DailyAction } from '../types/database';

interface ActiveActionInfo {
  action: DailyAction | null;
  groupId: string | null;
  groupName: string | null;
}

export function useActiveAction(userId: string | null) {
  const demo = useDemo();
  const [activeInfo, setActiveInfo] = useState<ActiveActionInfo>({ action: null, groupId: null, groupName: null });
  const [loading, setLoading] = useState(true);

  const detect = useCallback(async () => {
    if (!userId) {
      setActiveInfo({ action: null, groupId: null, groupName: null });
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (demo?.isDemo) {
      const todayActions = (demo.dailyActions || []).filter(
        a => a.action_date === today && a.status === 'active'
      );
      if (todayActions.length === 0) {
        setActiveInfo({ action: null, groupId: null, groupName: null });
        setLoading(false);
        return;
      }

      // Check if user is a member of any group in any active action
      for (const action of todayActions) {
        const sectors = (demo.actionSectors || []).filter(s => s.action_id === action.id);
        for (const sector of sectors) {
          const groups = (demo.actionGroups || []).filter(g => g.action_sector_id === sector.id);
          for (const group of groups) {
            const isMember = (demo.groupMembers || []).some(
              m => m.group_id === group.id && m.volunteer_id === userId
            );
            const isResponsible = group.responsible_id === userId;
            const isNoteTaker = group.note_taker_id === userId;
            if (isMember || isResponsible || isNoteTaker) {
              setActiveInfo({ action, groupId: group.id, groupName: group.name });
              setLoading(false);
              return;
            }
          }
        }
        // User not in any group but action is active — still link to action
        setActiveInfo({ action, groupId: null, groupName: null });
      }
      setLoading(false);
      return;
    }

    // Supabase: find today's active actions
    setLoading(true);
    const { data: actions } = await supabase
      .from('daily_actions')
      .select('*')
      .eq('action_date', today)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (!actions || actions.length === 0) {
      setActiveInfo({ action: null, groupId: null, groupName: null });
      setLoading(false);
      return;
    }

    // Check group membership
    const { data: memberData } = await supabase
      .from('action_group_members')
      .select('group_id')
      .eq('volunteer_id', userId);

    if (memberData && memberData.length > 0) {
      const memberGroupIds = memberData.map(m => m.group_id);
      // Get groups the user is in
      const { data: groupData } = await supabase
        .from('action_groups')
        .select('id, name, action_sector_id')
        .in('id', memberGroupIds);

      if (groupData && groupData.length > 0) {
        // Get the sectors for these groups
        const sectorIds = [...new Set(groupData.map(g => g.action_sector_id))];
        const { data: sectorData } = await supabase
          .from('action_sectors')
          .select('id, action_id')
          .in('id', sectorIds);

        if (sectorData) {
          for (const sector of sectorData) {
            const matchAction = actions.find(a => a.id === sector.action_id);
            if (matchAction) {
              const matchGroup = groupData.find(g => g.action_sector_id === sector.id);
              if (matchGroup) {
                setActiveInfo({ action: matchAction, groupId: matchGroup.id, groupName: matchGroup.name });
                setLoading(false);
                return;
              }
            }
          }
        }
      }
    }

    // Fallback: first active action, no group
    setActiveInfo({ action: actions[0], groupId: null, groupName: null });
    setLoading(false);
  }, [userId, demo?.isDemo, demo?.dailyActions, demo?.actionSectors, demo?.actionGroups, demo?.groupMembers]);

  useEffect(() => {
    detect();
  }, [detect]);

  return { ...activeInfo, loading, refresh: detect };
}
