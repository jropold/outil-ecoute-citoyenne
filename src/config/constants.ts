export const APP_NAME = 'Écoute Citoyenne';
export const CAMPAIGN_NAME = '#TeamJMD';
export const CANDIDATE_NAME = 'Juliana M\'Doihoma';
export const CITY = 'Saint-Louis';

export const COLORS = {
  primary: '#1B2A4A',
  accent: '#E91E8C',
  sympathisant: '#22C55E',
  indecis: '#F59E0B',
  opposant: '#EF4444',
  absent: '#9CA3AF',
  couvert: '#7C3AED',       // violet — couvert, bien distinct du paysage
  partiellement: '#F59E0B', // orange — partiellement couvert
  nonCouvert: '#DC2626',    // rouge vif — non couvert
  actionZone: '#E91E8C',    // rose accent — zone d'action du jour
} as const;

export const VISIT_STATUS = ['sympathisant', 'indecis', 'opposant', 'absent'] as const;
export type VisitStatus = typeof VISIT_STATUS[number];

export const VISIT_TOPICS = [
  'Sécurité',
  'Emploi',
  'Voirie',
  'Jeunesse',
  'Fiscalité',
  'Propreté',
  'Transport',
  'Logement',
  'Santé',
  'Éducation',
  'Autre',
] as const;
export type VisitTopic = typeof VISIT_TOPICS[number];

export const SECTOR_STATUS = ['non_couvert', 'partiellement_couvert', 'couvert'] as const;
export type SectorStatus = typeof SECTOR_STATUS[number];

export const USER_ROLES = [
  'admin',
  'direction_campagne',
  'coordinateur_terrain',
  'responsable_quartier',
  'benevole',
] as const;
export type UserRole = typeof USER_ROLES[number];

export const CAMPAIGN_MEMBER_ROLES = ['Référent', 'Élu', 'Ambassadeur de quartier', 'Maire', 'Autre'] as const;
export type CampaignMemberRole = typeof CAMPAIGN_MEMBER_ROLES[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrateur',
  direction_campagne: 'Direction de campagne',
  coordinateur_terrain: 'Coordinateur terrain',
  responsable_quartier: 'Responsable quartier',
  benevole: 'Bénévole',
};
