import type { Profile, Quartier, Sector, Visit, SectorAssignment, ActionSector, ActionGroup, ActionGroupMember } from './database';

export type { Profile, Quartier, Sector, Visit, SectorAssignment, ActionSector, ActionGroup, ActionGroupMember };

export interface QuartierStats {
  quartier_id: string;
  quartier_name: string;
  total_visits: number;
  sympathisants: number;
  indecis: number;
  opposants: number;
  absents: number;
  support_rate: number;
}

export interface GlobalKPIs {
  total_doors_knocked: number;
  total_sympathisants: number;
  total_indecis: number;
  total_opposants: number;
  total_absents: number;
  support_rate: number;
  coverage_rate: number;
  sympathisant_indecis_ratio: number;
}

export interface DailyVisits {
  visit_date: string;
  count: number;
  sympathisants: number;
  indecis: number;
  opposants: number;
  absents: number;
}

export interface TopicCount {
  topic: string;
  count: number;
}

export interface OfflineVisit {
  offline_id: string;
  volunteer_id: string;
  sector_id: string | null;
  quartier_id: string;
  status: 'sympathisant' | 'indecis' | 'opposant' | 'absent';
  topic: string | null;
  comment: string | null;
  latitude: number | null;
  longitude: number | null;
  needs_followup: boolean;
  created_at: string;
  synced: boolean;
  contact_first_name: string | null;
  contact_last_name: string | null;
  contact_address: string | null;
  contact_phone: string | null;
  has_consent: boolean;
  household_voters: number | null;
  action_id: string | null;
  action_group_id: string | null;
}

export interface SectorWithDetails extends Sector {
  quartier?: Quartier;
  assignments?: (SectorAssignment & { volunteer?: Profile })[];
  visit_count?: number;
}

export interface ActionGroupWithMembers extends ActionGroup {
  members: (ActionGroupMember & { volunteer?: Profile })[];
  responsible?: Profile;
  note_taker?: Profile;
}

export interface ActionSectorWithGroups extends ActionSector {
  groups: ActionGroupWithMembers[];
  responsible?: Profile;
}
