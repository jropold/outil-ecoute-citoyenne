import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  demoProfile, demoVisits, demoQuartiers, demoSectors, demoKPIs,
  demoQuartierStats, demoDailyVisits, demoTopTopics, demoUsers,
  demoDailyActions, demoActionSectors, demoActionGroups, demoActionGroupMembers,
} from '../lib/demoData';
import type { Profile, Quartier, Sector, Visit, DailyAction, ActionSector, ActionGroup, ActionGroupMember } from '../types/database';
import type { GlobalKPIs, QuartierStats, DailyVisits, TopicCount } from '../types/models';

export interface DemoContextType {
  isDemo: boolean;
  enterDemo: () => void;
  exitDemo: () => void;
  profile: Profile;
  visits: Visit[];
  addVisit: (visit: Visit) => void;
  quartiers: Quartier[];
  addQuartier: (quartier: Quartier) => void;
  sectors: Sector[];
  kpis: GlobalKPIs;
  quartierStats: QuartierStats[];
  dailyVisits: DailyVisits[];
  topTopics: TopicCount[];
  users: Profile[];
  dailyActions: DailyAction[];
  addDailyAction: (action: DailyAction) => void;
  updateDailyAction: (actionId: string, status: 'completed' | 'cancelled') => void;
  // Action hierarchy
  actionSectors: ActionSector[];
  addActionSector: (sector: ActionSector) => void;
  removeActionSector: (sectorId: string) => void;
  actionGroups: ActionGroup[];
  addActionGroup: (group: ActionGroup) => void;
  groupMembers: ActionGroupMember[];
  addGroupMember: (member: ActionGroupMember) => void;
  removeGroupMember: (memberId: string) => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function useDemo() {
  return useContext(DemoContext);
}

export function useDemoRequired() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemoRequired must be used within DemoProvider');
  return ctx;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(() => localStorage.getItem('demo-mode') === 'true');
  const [visits, setVisits] = useState<Visit[]>(demoVisits);
  const [quartiers, setQuartiers] = useState<Quartier[]>(demoQuartiers);
  const [dailyActions, setDailyActions] = useState<DailyAction[]>(demoDailyActions);
  const [actionSectors, setActionSectors] = useState<ActionSector[]>(demoActionSectors);
  const [actionGroups, setActionGroups] = useState<ActionGroup[]>(demoActionGroups);
  const [groupMembers, setGroupMembers] = useState<ActionGroupMember[]>(demoActionGroupMembers);

  const enterDemo = useCallback(() => {
    localStorage.setItem('demo-mode', 'true');
    setIsDemo(true);
  }, []);

  const exitDemo = useCallback(() => {
    localStorage.removeItem('demo-mode');
    setIsDemo(false);
  }, []);

  const addVisit = useCallback((visit: Visit) => {
    setVisits(prev => [visit, ...prev]);
  }, []);

  const addQuartier = useCallback((quartier: Quartier) => {
    setQuartiers(prev => [...prev, quartier]);
  }, []);

  const addDailyAction = useCallback((action: DailyAction) => {
    setDailyActions(prev => [action, ...prev]);
  }, []);

  const updateDailyAction = useCallback((actionId: string, status: 'completed' | 'cancelled') => {
    setDailyActions(prev => prev.map(a =>
      a.id === actionId ? { ...a, status } : a
    ).filter(a => a.status === 'active'));
  }, []);

  // Action sectors
  const addActionSector = useCallback((sector: ActionSector) => {
    setActionSectors(prev => [...prev, sector]);
  }, []);

  const removeActionSector = useCallback((sectorId: string) => {
    setActionSectors(prev => prev.filter(s => s.id !== sectorId));
    // Cascade: remove groups and members of this sector
    setActionGroups(prev => {
      const removed = prev.filter(g => g.action_sector_id === sectorId);
      const removedIds = removed.map(g => g.id);
      setGroupMembers(mPrev => mPrev.filter(m => !removedIds.includes(m.group_id)));
      return prev.filter(g => g.action_sector_id !== sectorId);
    });
  }, []);

  // Action groups
  const addActionGroup = useCallback((group: ActionGroup) => {
    setActionGroups(prev => [...prev, group]);
  }, []);

  // Group members
  const addGroupMember = useCallback((member: ActionGroupMember) => {
    setGroupMembers(prev => [...prev, member]);
  }, []);

  const removeGroupMember = useCallback((memberId: string) => {
    setGroupMembers(prev => prev.filter(m => m.id !== memberId));
  }, []);

  return (
    <DemoContext.Provider value={{
      isDemo,
      enterDemo,
      exitDemo,
      profile: demoProfile,
      visits,
      addVisit,
      quartiers,
      addQuartier,
      sectors: demoSectors,
      kpis: demoKPIs,
      quartierStats: demoQuartierStats,
      dailyVisits: demoDailyVisits,
      topTopics: demoTopTopics,
      users: demoUsers,
      dailyActions,
      addDailyAction,
      updateDailyAction,
      actionSectors,
      addActionSector,
      removeActionSector,
      actionGroups,
      addActionGroup,
      groupMembers,
      addGroupMember,
      removeGroupMember,
    }}>
      {children}
    </DemoContext.Provider>
  );
}
