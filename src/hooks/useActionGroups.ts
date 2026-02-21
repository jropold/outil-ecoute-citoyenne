import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { ActionGroup, ActionGroupMember, Database } from '../types/database';

export function useActionGroups(sectorId: string | null) {
  const demo = useDemo();
  const [groups, setGroups] = useState<ActionGroup[]>([]);
  const [members, setMembers] = useState<ActionGroupMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    if (!sectorId) {
      setGroups([]);
      setMembers([]);
      setLoading(false);
      return;
    }

    if (demo?.isDemo) {
      const demoGroups = (demo.actionGroups || []).filter(g => g.action_sector_id === sectorId);
      setGroups(demoGroups);
      const groupIds = demoGroups.map(g => g.id);
      setMembers((demo.groupMembers || []).filter(m => groupIds.includes(m.group_id)));
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: groupData } = await supabase
      .from('action_groups')
      .select('*')
      .eq('action_sector_id', sectorId)
      .order('created_at', { ascending: true });
    setGroups(groupData || []);

    if (groupData && groupData.length > 0) {
      const groupIds = groupData.map(g => g.id);
      const { data: memberData } = await supabase
        .from('action_group_members')
        .select('*')
        .in('group_id', groupIds);
      setMembers(memberData || []);
    } else {
      setMembers([]);
    }
    setLoading(false);
  }, [sectorId, demo?.isDemo, demo?.actionGroups, demo?.groupMembers]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = async (group: { name: string; responsible_id?: string | null; note_taker_id?: string | null }) => {
    if (!sectorId) return null;

    if (demo?.isDemo) {
      const newGroup: ActionGroup = {
        id: `group-${uuidv4()}`,
        action_sector_id: sectorId,
        name: group.name,
        responsible_id: group.responsible_id || null,
        note_taker_id: group.note_taker_id || null,
        created_at: new Date().toISOString(),
      };
      demo.addActionGroup?.(newGroup);
      setGroups(prev => [...prev, newGroup]);
      return newGroup;
    }

    const { data, error } = await supabase
      .from('action_groups')
      .insert({
        action_sector_id: sectorId,
        ...group,
      } as Database['public']['Tables']['action_groups']['Insert'])
      .select()
      .single();
    if (error) throw error;
    setGroups(prev => [...prev, data]);
    return data;
  };

  const addMember = async (groupId: string, volunteerId: string) => {
    if (demo?.isDemo) {
      const newMember: ActionGroupMember = {
        id: `gm-${uuidv4()}`,
        group_id: groupId,
        volunteer_id: volunteerId,
        created_at: new Date().toISOString(),
      };
      demo.addGroupMember?.(newMember);
      setMembers(prev => [...prev, newMember]);
      return newMember;
    }

    const { data, error } = await supabase
      .from('action_group_members')
      .insert({ group_id: groupId, volunteer_id: volunteerId } as Database['public']['Tables']['action_group_members']['Insert'])
      .select()
      .single();
    if (error) throw error;
    setMembers(prev => [...prev, data]);
    return data;
  };

  const removeMember = async (memberId: string) => {
    if (demo?.isDemo) {
      demo.removeGroupMember?.(memberId);
      setMembers(prev => prev.filter(m => m.id !== memberId));
      return;
    }

    await supabase.from('action_group_members').delete().eq('id', memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  return { groups, members, loading, fetchGroups, createGroup, addMember, removeMember };
}
