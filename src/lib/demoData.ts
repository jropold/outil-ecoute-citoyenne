import type { Profile, Quartier, Sector, Visit, DailyAction, ActionSector, ActionGroup, ActionGroupMember, CampaignMember, ActionMember } from '../types/database';
import type { GlobalKPIs, QuartierStats, DailyVisits, TopicCount } from '../types/models';

// Helpers
const today = new Date().toISOString().split('T')[0];
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};
const timeAgo = (hours: number) => {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};

// --- Quartiers avec géométrie GeoJSON réelle (Saint-Louis, La Réunion) ---
export const demoQuartiers: Quartier[] = [
  {
    id: 'q-centre-ville',
    name: 'Centre-Ville',
    geometry: { type: 'Polygon', coordinates: [[
      [55.408, -21.268], [55.414, -21.268], [55.414, -21.273], [55.408, -21.273], [55.408, -21.268]
    ]]},
    total_doors_estimate: 450,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-riviere',
    name: 'La Rivière',
    geometry: { type: 'Polygon', coordinates: [[
      [55.395, -21.275], [55.405, -21.275], [55.405, -21.282], [55.395, -21.282], [55.395, -21.275]
    ]]},
    total_doors_estimate: 320,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-bois-olives',
    name: 'Bois de Nèfles / Les Olives',
    geometry: { type: 'Polygon', coordinates: [[
      [55.400, -21.260], [55.412, -21.260], [55.412, -21.267], [55.400, -21.267], [55.400, -21.260]
    ]]},
    total_doors_estimate: 280,
    created_at: '2025-01-15T00:00:00Z',
  },
];

// --- Demo user ---
export const demoProfile: Profile = {
  id: 'demo-user-001',
  email: 'jeremy.ropauld@teamjmd.re',
  full_name: 'Jérémy ROPAULD (Démo)',
  phone: '+262 692 00 00 00',
  role: 'admin',
  is_active: true,
  can_create_visits: true,
  avatar_url: null,
  created_at: '2025-01-15T00:00:00Z',
  updated_at: '2025-01-15T00:00:00Z',
};

// --- Sectors (vide) ---
export const demoSectors: Sector[] = [];

// --- Team members ---
export const demoUsers: Profile[] = [
  demoProfile,
  { id: 'demo-user-002', email: 'juliana@teamjmd.re', full_name: 'Juliana M\'Doihoma', phone: null, role: 'direction_campagne', is_active: true, can_create_visits: true, avatar_url: null, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'demo-user-003', email: 'thomas@teamjmd.re', full_name: 'Thomas Rivière', phone: '+262 692 11 22 33', role: 'coordinateur_terrain', is_active: true, can_create_visits: true, avatar_url: null, created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: 'demo-user-004', email: 'aisha@teamjmd.re', full_name: 'Aïsha Payet', phone: null, role: 'responsable_quartier', is_active: true, can_create_visits: true, avatar_url: null, created_at: '2025-01-20T00:00:00Z', updated_at: '2025-01-20T00:00:00Z' },
  { id: 'demo-user-005', email: 'lucas@teamjmd.re', full_name: 'Lucas Hoarau', phone: null, role: 'benevole', is_active: true, can_create_visits: false, avatar_url: null, created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: 'demo-user-006', email: 'sophie@teamjmd.re', full_name: 'Sophie Grondin', phone: null, role: 'benevole', is_active: false, can_create_visits: false, avatar_url: null, created_at: '2025-01-05T00:00:00Z', updated_at: '2025-02-10T00:00:00Z' },
];

// --- Campaign members ---
export const demoCampaignMembers: CampaignMember[] = [
  { id: 'cm-001', first_name: 'Juliana', last_name: 'M\'Doihoma', role: 'Maire', created_at: '2025-01-01T00:00:00Z' },
  { id: 'cm-002', first_name: 'Thomas', last_name: 'Rivière', role: 'Référent', created_at: '2025-01-10T00:00:00Z' },
  { id: 'cm-003', first_name: 'Aïsha', last_name: 'Payet', role: 'Ambassadeur de quartier', created_at: '2025-01-20T00:00:00Z' },
  { id: 'cm-004', first_name: 'Patrick', last_name: 'Fontaine', role: 'Élu', created_at: '2025-01-22T00:00:00Z' },
  { id: 'cm-005', first_name: 'Marie', last_name: 'Dijoux', role: 'Référent', created_at: '2025-02-01T00:00:00Z' },
];

// --- Daily actions ---
export const demoDailyActions: DailyAction[] = [
  {
    id: 'action-001',
    name: 'Porte-à-porte Centre-Ville',
    quartier_id: 'q-centre-ville',
    geometry: { type: 'Polygon', coordinates: [[
      [55.408, -21.268], [55.414, -21.268], [55.414, -21.273], [55.408, -21.273], [55.408, -21.268]
    ]]},
    action_date: today,
    status: 'active',
    notes: 'Focus rue des Commerces et quartier Mairie',
    created_by: 'demo-user-001',
    created_at: timeAgo(3),
    updated_at: timeAgo(3),
  },
  {
    id: 'action-002',
    name: 'Porte-à-porte La Rivière',
    quartier_id: 'q-riviere',
    geometry: { type: 'Polygon', coordinates: [[
      [55.395, -21.275], [55.405, -21.275], [55.405, -21.282], [55.395, -21.282], [55.395, -21.275]
    ]]},
    action_date: daysAgo(2),
    status: 'completed',
    notes: 'Bon accueil général',
    created_by: 'demo-user-001',
    created_at: daysAgo(2) + 'T08:00:00Z',
    updated_at: daysAgo(2) + 'T17:00:00Z',
  },
];

// --- Action sectors ---
export const demoActionSectors: ActionSector[] = [
  {
    id: 'as-001',
    action_id: 'action-001',
    name: 'Secteur Mairie',
    geometry: { type: 'Polygon', coordinates: [[
      [55.408, -21.268], [55.411, -21.268], [55.411, -21.271], [55.408, -21.271], [55.408, -21.268]
    ]]},
    responsible_id: 'demo-user-003',
    created_at: timeAgo(3),
  },
  {
    id: 'as-002',
    action_id: 'action-001',
    name: 'Secteur Commerces',
    geometry: { type: 'Polygon', coordinates: [[
      [55.411, -21.268], [55.414, -21.268], [55.414, -21.273], [55.411, -21.273], [55.411, -21.268]
    ]]},
    responsible_id: 'demo-user-004',
    created_at: timeAgo(3),
  },
];

// --- Action groups ---
export const demoActionGroups: ActionGroup[] = [
  { id: 'ag-001', action_sector_id: 'as-001', name: 'Groupe A', responsible_id: 'demo-user-003', note_taker_id: 'demo-user-001', created_at: timeAgo(3) },
  { id: 'ag-002', action_sector_id: 'as-001', name: 'Groupe B', responsible_id: 'demo-user-004', note_taker_id: null, created_at: timeAgo(3) },
  { id: 'ag-003', action_sector_id: 'as-002', name: 'Groupe C', responsible_id: 'demo-user-002', note_taker_id: 'demo-user-005', created_at: timeAgo(3) },
];

// --- Action group members ---
export const demoActionGroupMembers: ActionGroupMember[] = [
  { id: 'agm-001', group_id: 'ag-001', volunteer_id: 'demo-user-001', created_at: timeAgo(3) },
  { id: 'agm-002', group_id: 'ag-001', volunteer_id: 'demo-user-003', created_at: timeAgo(3) },
  { id: 'agm-003', group_id: 'ag-002', volunteer_id: 'demo-user-004', created_at: timeAgo(3) },
  { id: 'agm-004', group_id: 'ag-002', volunteer_id: 'demo-user-005', created_at: timeAgo(3) },
  { id: 'agm-005', group_id: 'ag-003', volunteer_id: 'demo-user-002', created_at: timeAgo(3) },
];

// --- Action members (junction) ---
export const demoActionMembers: ActionMember[] = [
  { id: 'am-001', action_id: 'action-001', member_id: 'cm-001', created_at: timeAgo(3) },
  { id: 'am-002', action_id: 'action-001', member_id: 'cm-002', created_at: timeAgo(3) },
  { id: 'am-003', action_id: 'action-001', member_id: 'cm-003', created_at: timeAgo(3) },
  { id: 'am-004', action_id: 'action-001', member_id: 'cm-005', created_at: timeAgo(3) },
];

// --- Visits (réalistes, multi-topics, contacts, etc.) ---
export const demoVisits: Visit[] = [
  // Today — Centre-Ville action
  { id: 'v-001', volunteer_id: 'demo-user-001', sector_id: null, quartier_id: 'q-centre-ville', status: 'sympathisant', topic: 'Sécurité,Emploi', comment: 'Très enthousiaste pour le projet de Juliana. Veut s\'impliquer.', latitude: -21.2695, longitude: 55.4105, needs_followup: true, offline_id: null, created_at: timeAgo(1), contact_first_name: 'Marie', contact_last_name: 'Payet', contact_address: '12 rue des Lilas', contact_phone: '+262 692 12 34 56', has_consent: true, household_voters: 3, action_id: 'action-001', action_group_id: 'ag-001', conducted_by_member_id: 'cm-002' },
  { id: 'v-002', volunteer_id: 'demo-user-001', sector_id: null, quartier_id: 'q-centre-ville', status: 'indecis', topic: 'Voirie,Transport', comment: 'Attend des propositions concrètes sur les routes.', latitude: -21.2700, longitude: 55.4110, needs_followup: true, offline_id: null, created_at: timeAgo(1.5), contact_first_name: 'Jean', contact_last_name: 'Rivière', contact_address: '8 rue du Commerce', contact_phone: null, has_consent: true, household_voters: 2, action_id: 'action-001', action_group_id: 'ag-001', conducted_by_member_id: null },
  { id: 'v-003', volunteer_id: 'demo-user-003', sector_id: null, quartier_id: 'q-centre-ville', status: 'sympathisant', topic: 'Jeunesse,Emploi', comment: null, latitude: -21.2710, longitude: 55.4100, needs_followup: false, offline_id: null, created_at: timeAgo(2), contact_first_name: null, contact_last_name: null, contact_address: null, contact_phone: null, has_consent: false, household_voters: null, action_id: 'action-001', action_group_id: 'ag-002', conducted_by_member_id: 'cm-003' },
  { id: 'v-004', volunteer_id: 'demo-user-004', sector_id: null, quartier_id: 'q-centre-ville', status: 'absent', topic: null, comment: null, latitude: -21.2690, longitude: 55.4120, needs_followup: false, offline_id: null, created_at: timeAgo(2.5), contact_first_name: null, contact_last_name: null, contact_address: null, contact_phone: null, has_consent: false, household_voters: null, action_id: 'action-001', action_group_id: 'ag-003', conducted_by_member_id: null },
  { id: 'v-005', volunteer_id: 'demo-user-002', sector_id: null, quartier_id: 'q-centre-ville', status: 'opposant', topic: 'Fiscalité', comment: 'Mécontent des impôts locaux, ne changera pas d\'avis.', latitude: -21.2705, longitude: 55.4095, needs_followup: false, offline_id: null, created_at: timeAgo(3), contact_first_name: null, contact_last_name: null, contact_address: null, contact_phone: null, has_consent: false, household_voters: null, action_id: 'action-001', action_group_id: 'ag-003', conducted_by_member_id: 'cm-001' },
  { id: 'v-006', volunteer_id: 'demo-user-001', sector_id: null, quartier_id: 'q-centre-ville', status: 'sympathisant', topic: 'Santé,Logement', comment: 'Souhaite un nouveau centre de santé dans le quartier.', latitude: -21.2715, longitude: 55.4115, needs_followup: true, offline_id: null, created_at: timeAgo(3.5), contact_first_name: 'Fatima', contact_last_name: 'Abdou', contact_address: '45 chemin du Stade', contact_phone: '+262 692 55 66 77', has_consent: true, household_voters: 4, action_id: 'action-001', action_group_id: 'ag-001', conducted_by_member_id: 'cm-002' },

  // 2 days ago — La Rivière action (completed)
  { id: 'v-007', volunteer_id: 'demo-user-001', sector_id: null, quartier_id: 'q-riviere', status: 'sympathisant', topic: 'Propreté,Voirie', comment: 'Demande nettoyage du ravin.', latitude: -21.2780, longitude: 55.3990, needs_followup: false, offline_id: null, created_at: daysAgo(2) + 'T10:30:00Z', contact_first_name: 'Paul', contact_last_name: 'Grondin', contact_address: '3 chemin de la Rivière', contact_phone: null, has_consent: true, household_voters: 2, action_id: 'action-002', action_group_id: null, conducted_by_member_id: null },
  { id: 'v-008', volunteer_id: 'demo-user-003', sector_id: null, quartier_id: 'q-riviere', status: 'sympathisant', topic: 'Éducation', comment: 'Veut plus de places en crèche.', latitude: -21.2775, longitude: 55.4010, needs_followup: false, offline_id: null, created_at: daysAgo(2) + 'T11:00:00Z', contact_first_name: 'Nadia', contact_last_name: 'Morel', contact_address: null, contact_phone: null, has_consent: true, household_voters: null, action_id: 'action-002', action_group_id: null, conducted_by_member_id: 'cm-005' },
  { id: 'v-009', volunteer_id: 'demo-user-004', sector_id: null, quartier_id: 'q-riviere', status: 'indecis', topic: 'Emploi,Jeunesse', comment: null, latitude: -21.2790, longitude: 55.4000, needs_followup: true, offline_id: null, created_at: daysAgo(2) + 'T11:30:00Z', contact_first_name: null, contact_last_name: null, contact_address: null, contact_phone: null, has_consent: false, household_voters: null, action_id: 'action-002', action_group_id: null, conducted_by_member_id: null },
  { id: 'v-010', volunteer_id: 'demo-user-001', sector_id: null, quartier_id: 'q-riviere', status: 'absent', topic: null, comment: null, latitude: -21.2770, longitude: 55.3985, needs_followup: false, offline_id: null, created_at: daysAgo(2) + 'T14:00:00Z', contact_first_name: null, contact_last_name: null, contact_address: null, contact_phone: null, has_consent: false, household_voters: null, action_id: 'action-002', action_group_id: null, conducted_by_member_id: null },
  { id: 'v-011', volunteer_id: 'demo-user-003', sector_id: null, quartier_id: 'q-riviere', status: 'sympathisant', topic: 'Sécurité', comment: 'Eclairage insuffisant le soir.', latitude: -21.2785, longitude: 55.3995, needs_followup: false, offline_id: null, created_at: daysAgo(2) + 'T14:30:00Z', contact_first_name: 'Jacques', contact_last_name: 'Hoareau', contact_address: '17 allée des Filaos', contact_phone: '+262 692 88 99 00', has_consent: true, household_voters: 1, action_id: 'action-002', action_group_id: null, conducted_by_member_id: 'cm-002' },

  // Earlier visits (3-7 days ago) — Bois de Nèfles / sans action
  { id: 'v-012', volunteer_id: 'demo-user-001', sector_id: null, quartier_id: 'q-bois-olives', status: 'sympathisant', topic: 'Logement', comment: 'Problème de logement social.', latitude: -21.2635, longitude: 55.4050, needs_followup: true, offline_id: null, created_at: daysAgo(4) + 'T09:00:00Z', contact_first_name: 'Lucie', contact_last_name: 'Boyer', contact_address: '22 impasse des Bois', contact_phone: null, has_consent: true, household_voters: 5, action_id: null, action_group_id: null, conducted_by_member_id: null },
  { id: 'v-013', volunteer_id: 'demo-user-004', sector_id: null, quartier_id: 'q-bois-olives', status: 'indecis', topic: 'Transport,Voirie', comment: 'Bus trop rares dans le quartier.', latitude: -21.2640, longitude: 55.4060, needs_followup: false, offline_id: null, created_at: daysAgo(4) + 'T09:30:00Z', contact_first_name: null, contact_last_name: null, contact_address: null, contact_phone: null, has_consent: false, household_voters: null, action_id: null, action_group_id: null, conducted_by_member_id: null },
  { id: 'v-014', volunteer_id: 'demo-user-001', sector_id: null, quartier_id: 'q-bois-olives', status: 'sympathisant', topic: 'Emploi', comment: null, latitude: -21.2645, longitude: 55.4070, needs_followup: false, offline_id: null, created_at: daysAgo(5) + 'T10:00:00Z', contact_first_name: null, contact_last_name: null, contact_address: null, contact_phone: null, has_consent: false, household_voters: null, action_id: null, action_group_id: null, conducted_by_member_id: null },
  { id: 'v-015', volunteer_id: 'demo-user-003', sector_id: null, quartier_id: 'q-centre-ville', status: 'sympathisant', topic: 'Sécurité,Propreté', comment: 'Veut plus de caméras et de propreté en centre-ville.', latitude: -21.2698, longitude: 55.4108, needs_followup: false, offline_id: null, created_at: daysAgo(5) + 'T15:00:00Z', contact_first_name: 'Henri', contact_last_name: 'Lebon', contact_address: '5 place de la Mairie', contact_phone: null, has_consent: true, household_voters: 2, action_id: null, action_group_id: null, conducted_by_member_id: null },
  { id: 'v-016', volunteer_id: 'demo-user-001', sector_id: null, quartier_id: 'q-riviere', status: 'opposant', topic: 'Autre', comment: 'Ne veut pas de changement.', latitude: -21.2778, longitude: 55.4005, needs_followup: false, offline_id: null, created_at: daysAgo(6) + 'T11:00:00Z', contact_first_name: null, contact_last_name: null, contact_address: null, contact_phone: null, has_consent: false, household_voters: null, action_id: null, action_group_id: null, conducted_by_member_id: null },
  { id: 'v-017', volunteer_id: 'demo-user-004', sector_id: null, quartier_id: 'q-centre-ville', status: 'absent', topic: null, comment: null, latitude: -21.2702, longitude: 55.4112, needs_followup: false, offline_id: null, created_at: daysAgo(6) + 'T14:00:00Z', contact_first_name: null, contact_last_name: null, contact_address: null, contact_phone: null, has_consent: false, household_voters: null, action_id: null, action_group_id: null, conducted_by_member_id: null },
  { id: 'v-018', volunteer_id: 'demo-user-001', sector_id: null, quartier_id: 'q-bois-olives', status: 'sympathisant', topic: 'Jeunesse,Éducation', comment: 'Manque d\'activités pour les jeunes.', latitude: -21.2632, longitude: 55.4055, needs_followup: true, offline_id: null, created_at: daysAgo(7) + 'T09:00:00Z', contact_first_name: 'Claire', contact_last_name: 'Dijoux', contact_address: '11 rue des Lataniers', contact_phone: '+262 692 33 44 55', has_consent: true, household_voters: 3, action_id: null, action_group_id: null, conducted_by_member_id: null },
];

// --- KPIs calculés à partir des visites ---
function computeKPIs(visits: Visit[]): GlobalKPIs {
  const total = visits.length;
  const symp = visits.filter(v => v.status === 'sympathisant').length;
  const ind = visits.filter(v => v.status === 'indecis').length;
  const opp = visits.filter(v => v.status === 'opposant').length;
  const abs = visits.filter(v => v.status === 'absent').length;
  const contacts = symp + ind + opp;
  return {
    total_doors_knocked: total,
    total_sympathisants: symp,
    total_indecis: ind,
    total_opposants: opp,
    total_absents: abs,
    support_rate: contacts > 0 ? Math.round((symp / contacts) * 100) : 0,
    coverage_rate: total > 0 ? Math.round(((total - abs) / total) * 100) : 0,
    sympathisant_indecis_ratio: ind > 0 ? Math.round((symp / ind) * 10) / 10 : 0,
  };
}

function computeQuartierStats(visits: Visit[], quartiers: Quartier[]): QuartierStats[] {
  return quartiers.map(q => {
    const qVisits = visits.filter(v => v.quartier_id === q.id);
    const symp = qVisits.filter(v => v.status === 'sympathisant').length;
    const ind = qVisits.filter(v => v.status === 'indecis').length;
    const opp = qVisits.filter(v => v.status === 'opposant').length;
    const abs = qVisits.filter(v => v.status === 'absent').length;
    const contacts = symp + ind + opp;
    return {
      quartier_id: q.id,
      quartier_name: q.name,
      total_visits: qVisits.length,
      sympathisants: symp,
      indecis: ind,
      opposants: opp,
      absents: abs,
      support_rate: contacts > 0 ? Math.round((symp / contacts) * 100) : 0,
    };
  });
}

function computeDailyVisits(visits: Visit[]): DailyVisits[] {
  const byDay = new Map<string, DailyVisits>();
  for (const v of visits) {
    const date = v.created_at.split('T')[0];
    const entry = byDay.get(date) || { visit_date: date, count: 0, sympathisants: 0, indecis: 0, opposants: 0, absents: 0 };
    entry.count++;
    if (v.status === 'sympathisant') entry.sympathisants++;
    else if (v.status === 'indecis') entry.indecis++;
    else if (v.status === 'opposant') entry.opposants++;
    else if (v.status === 'absent') entry.absents++;
    byDay.set(date, entry);
  }
  return Array.from(byDay.values()).sort((a, b) => a.visit_date.localeCompare(b.visit_date));
}

function computeTopTopics(visits: Visit[]): TopicCount[] {
  const counts = new Map<string, number>();
  for (const v of visits) {
    if (!v.topic) continue;
    for (const t of v.topic.split(',')) {
      const trimmed = t.trim();
      if (trimmed) counts.set(trimmed, (counts.get(trimmed) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// Exports calculés
export const demoKPIs: GlobalKPIs = computeKPIs(demoVisits);
export const demoQuartierStats: QuartierStats[] = computeQuartierStats(demoVisits, demoQuartiers);
export const demoDailyVisits: DailyVisits[] = computeDailyVisits(demoVisits);
export const demoTopTopics: TopicCount[] = computeTopTopics(demoVisits);

// Re-export les fonctions pour recalcul dynamique dans DemoContext
export { computeKPIs, computeQuartierStats, computeDailyVisits, computeTopTopics };
