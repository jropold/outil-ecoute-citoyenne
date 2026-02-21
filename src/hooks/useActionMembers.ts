import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import { useCampaignMembers } from './useCampaignMembers';
import type { ActionMember, CampaignMember } from '../types/database';

export function useActionMembers(actionId: string | null) {
  const demo = useDemo();
  const { members: allCampaignMembers } = useCampaignMembers();
  const [actionMembers, setActionMembers] = useState<ActionMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActionMembers = useCallback(async () => {
    if (!actionId) {
      setActionMembers([]);
      setLoading(false);
      return;
    }

    if (demo?.isDemo) {
      setActionMembers((demo.actionMembers || []).filter(am => am.action_id === actionId));
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from('action_members')
      .select('*')
      .eq('action_id', actionId)
      .order('created_at', { ascending: true });
    setActionMembers(data || []);
    setLoading(false);
  }, [actionId, demo?.isDemo, demo?.actionMembers]);

  useEffect(() => {
    fetchActionMembers();
  }, [fetchActionMembers]);

  const memberDetails: CampaignMember[] = useMemo(() => {
    const memberIds = actionMembers.map(am => am.member_id);
    return allCampaignMembers.filter(m => memberIds.includes(m.id));
  }, [actionMembers, allCampaignMembers]);

  const addMemberToAction = async (memberId: string): Promise<ActionMember> => {
    if (!actionId) throw new Error('No action selected');

    if (demo?.isDemo) {
      const newAm: ActionMember = {
        id: `am-${uuidv4()}`,
        action_id: actionId,
        member_id: memberId,
        created_at: new Date().toISOString(),
      };
      demo.addActionMember?.(newAm);
      setActionMembers(prev => [...prev, newAm]);
      return newAm;
    }

    const { data, error } = await supabase
      .from('action_members')
      .insert({ action_id: actionId, member_id: memberId })
      .select()
      .single();
    if (error) throw error;
    setActionMembers(prev => [...prev, data]);
    return data;
  };

  const removeMemberFromAction = async (amId: string) => {
    if (demo?.isDemo) {
      demo.removeActionMember?.(amId);
      setActionMembers(prev => prev.filter(am => am.id !== amId));
      return;
    }

    await supabase.from('action_members').delete().eq('id', amId);
    setActionMembers(prev => prev.filter(am => am.id !== amId));
  };

  return { actionMembers, memberDetails, loading, addMemberToAction, removeMemberFromAction };
}
