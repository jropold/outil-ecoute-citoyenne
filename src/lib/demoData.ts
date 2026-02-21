import type { Profile, Quartier, Sector, ActionSector, ActionGroup, ActionGroupMember } from '../types/database';
import type { GlobalKPIs, QuartierStats, DailyVisits, TopicCount } from '../types/models';

// --- Quartiers (vide — créés dynamiquement via les actions) ---
export const demoQuartiers: Quartier[] = [];

// --- Demo user ---
export const demoProfile: Profile = {
  id: 'demo-user-001',
  email: 'jeremy.ropauld@teamjmd.re',
  full_name: 'Jérémy ROPAULD (Démo)',
  phone: '+262 692 00 00 00',
  role: 'admin',
  is_active: true,
  avatar_url: null,
  created_at: '2025-01-15T00:00:00Z',
  updated_at: '2025-01-15T00:00:00Z',
};

// --- Sectors (vide) ---
export const demoSectors: Sector[] = [];

// --- Team members ---
export const demoUsers: Profile[] = [
  demoProfile,
  { id: 'demo-user-002', email: 'juliana@teamjmd.re', full_name: 'Juliana M\'Doihoma', phone: null, role: 'direction_campagne', is_active: true, avatar_url: null, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'demo-user-003', email: 'thomas@teamjmd.re', full_name: 'Thomas Rivière', phone: null, role: 'responsable_quartier', is_active: true, avatar_url: null, created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: 'demo-user-004', email: 'aisha@teamjmd.re', full_name: 'Aïsha Payet', phone: null, role: 'benevole', is_active: true, avatar_url: null, created_at: '2025-01-20T00:00:00Z', updated_at: '2025-01-20T00:00:00Z' },
  { id: 'demo-user-005', email: 'lucas@teamjmd.re', full_name: 'Lucas Hoarau', phone: null, role: 'benevole', is_active: true, avatar_url: null, created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: 'demo-user-006', email: 'sophie@teamjmd.re', full_name: 'Sophie Grondin', phone: null, role: 'benevole', is_active: false, avatar_url: null, created_at: '2025-01-05T00:00:00Z', updated_at: '2025-02-10T00:00:00Z' },
];

// --- Visits (vide — à remplir sur le terrain) ---
export const demoVisits: never[] = [];

// --- KPIs (tout à zéro) ---
export const demoKPIs: GlobalKPIs = {
  total_doors_knocked: 0,
  total_sympathisants: 0,
  total_indecis: 0,
  total_opposants: 0,
  total_absents: 0,
  support_rate: 0,
  coverage_rate: 0,
  sympathisant_indecis_ratio: 0,
};

// --- Quartier stats (vide) ---
export const demoQuartierStats: QuartierStats[] = [];

// --- Daily visits (vide) ---
export const demoDailyVisits: DailyVisits[] = [];

// --- Top topics (vide) ---
export const demoTopTopics: TopicCount[] = [];

// --- Daily actions (vide — à créer par l'admin) ---
export const demoDailyActions: never[] = [];

// --- Action sectors (vide) ---
export const demoActionSectors: ActionSector[] = [];

// --- Action groups (vide) ---
export const demoActionGroups: ActionGroup[] = [];

// --- Action group members (vide) ---
export const demoActionGroupMembers: ActionGroupMember[] = [];
