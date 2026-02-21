import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import type { CampaignMember } from '../types/database';

export function useCampaignMembers() {
  const demo = useDemo();
  const [members, setMembers] = useState<CampaignMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (demo?.isDemo) {
      setMembers(demo.campaignMembers || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data } = await supabase
      .from('campaign_members')
      .select('*')
      .order('last_name', { ascending: true });
    setMembers(data || []);
    setLoading(false);
  }, [demo?.isDemo, demo?.campaignMembers]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const createMember = async (firstName: string, lastName: string, role: string): Promise<CampaignMember> => {
    if (demo?.isDemo) {
      const newMember: CampaignMember = {
        id: `cm-${uuidv4()}`,
        first_name: firstName,
        last_name: lastName,
        role,
        created_at: new Date().toISOString(),
      };
      demo.addCampaignMember?.(newMember);
      setMembers(prev => [...prev, newMember]);
      return newMember;
    }

    const { data, error } = await supabase
      .from('campaign_members')
      .insert({ first_name: firstName, last_name: lastName, role })
      .select()
      .single();
    if (error) throw error;
    setMembers(prev => [...prev, data]);
    return data;
  };

  const deleteMember = async (memberId: string) => {
    if (demo?.isDemo) {
      demo.removeCampaignMember?.(memberId);
      setMembers(prev => prev.filter(m => m.id !== memberId));
      return;
    }

    await supabase.from('campaign_members').delete().eq('id', memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  return { members, loading, fetchMembers, createMember, deleteMember };
}
