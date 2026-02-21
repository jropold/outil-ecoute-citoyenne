import type { Profile, Quartier, Sector, Visit, DailyAction, ActionSector, ActionGroup, ActionGroupMember, CampaignMember, ActionMember } from '../types/database';
import type { GlobalKPIs, QuartierStats, DailyVisits, TopicCount } from '../types/models';

// ───── Helpers ─────
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
const dateTimeAt = (daysBack: number, hour: number, min: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

// Simple seeded random pour des données déterministes
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ───── Quartiers de Saint-Louis (97450) avec zones GeoJSON approximatives ─────
export const demoQuartiers: Quartier[] = [
  {
    id: 'q-centre-ville',
    name: 'Centre-Ville',
    geometry: { type: 'Polygon', coordinates: [[[55.407, -21.267], [55.415, -21.267], [55.415, -21.274], [55.407, -21.274], [55.407, -21.267]]] },
    total_doors_estimate: 1200,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-riviere',
    name: 'La Rivière Saint-Louis',
    geometry: { type: 'Polygon', coordinates: [[[55.390, -21.274], [55.405, -21.274], [55.405, -21.285], [55.390, -21.285], [55.390, -21.274]]] },
    total_doors_estimate: 900,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-bois-olives',
    name: 'Bois de Nèfles / Les Olives',
    geometry: { type: 'Polygon', coordinates: [[[55.398, -21.258], [55.413, -21.258], [55.413, -21.266], [55.398, -21.266], [55.398, -21.258]]] },
    total_doors_estimate: 800,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-le-gol',
    name: 'Le Gol',
    geometry: { type: 'Polygon', coordinates: [[[55.415, -21.270], [55.428, -21.270], [55.428, -21.280], [55.415, -21.280], [55.415, -21.270]]] },
    total_doors_estimate: 700,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-ouaki',
    name: 'Le Ouaki',
    geometry: { type: 'Polygon', coordinates: [[[55.400, -21.285], [55.415, -21.285], [55.415, -21.295], [55.400, -21.295], [55.400, -21.285]]] },
    total_doors_estimate: 650,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-plateau-gol',
    name: 'Plateau du Gol',
    geometry: { type: 'Polygon', coordinates: [[[55.420, -21.260], [55.435, -21.260], [55.435, -21.270], [55.420, -21.270], [55.420, -21.260]]] },
    total_doors_estimate: 550,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-les-cocos',
    name: 'Les Cocos',
    geometry: { type: 'Polygon', coordinates: [[[55.385, -21.260], [55.398, -21.260], [55.398, -21.270], [55.385, -21.270], [55.385, -21.260]]] },
    total_doors_estimate: 500,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-la-chapelle',
    name: 'La Chapelle',
    geometry: { type: 'Polygon', coordinates: [[[55.405, -21.248], [55.418, -21.248], [55.418, -21.258], [55.405, -21.258], [55.405, -21.248]]] },
    total_doors_estimate: 400,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-makes',
    name: 'Les Makes',
    geometry: { type: 'Polygon', coordinates: [[[55.370, -21.195], [55.385, -21.195], [55.385, -21.210], [55.370, -21.210], [55.370, -21.195]]] },
    total_doors_estimate: 350,
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'q-tapage',
    name: 'Tapage / Bel Air',
    geometry: { type: 'Polygon', coordinates: [[[55.410, -21.255], [55.422, -21.255], [55.422, -21.263], [55.410, -21.263], [55.410, -21.255]]] },
    total_doors_estimate: 600,
    created_at: '2025-01-15T00:00:00Z',
  },
];

// ───── Demo user ─────
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

export const demoSectors: Sector[] = [];

// ───── Équipe ─────
export const demoUsers: Profile[] = [
  demoProfile,
  { id: 'demo-user-002', email: 'juliana@teamjmd.re', full_name: 'Juliana M\'Doihoma', phone: null, role: 'direction_campagne', is_active: true, can_create_visits: true, avatar_url: null, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'demo-user-003', email: 'thomas@teamjmd.re', full_name: 'Thomas Rivière', phone: '+262 692 11 22 33', role: 'coordinateur_terrain', is_active: true, can_create_visits: true, avatar_url: null, created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: 'demo-user-004', email: 'aisha@teamjmd.re', full_name: 'Aïsha Payet', phone: null, role: 'responsable_quartier', is_active: true, can_create_visits: true, avatar_url: null, created_at: '2025-01-20T00:00:00Z', updated_at: '2025-01-20T00:00:00Z' },
  { id: 'demo-user-005', email: 'lucas@teamjmd.re', full_name: 'Lucas Hoarau', phone: null, role: 'benevole', is_active: true, can_create_visits: false, avatar_url: null, created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: 'demo-user-006', email: 'sophie@teamjmd.re', full_name: 'Sophie Grondin', phone: null, role: 'benevole', is_active: true, can_create_visits: true, avatar_url: null, created_at: '2025-01-05T00:00:00Z', updated_at: '2025-02-10T00:00:00Z' },
  { id: 'demo-user-007', email: 'marc@teamjmd.re', full_name: 'Marc Dijoux', phone: '+262 692 44 55 66', role: 'benevole', is_active: true, can_create_visits: true, avatar_url: null, created_at: '2025-02-05T00:00:00Z', updated_at: '2025-02-05T00:00:00Z' },
  { id: 'demo-user-008', email: 'nadia@teamjmd.re', full_name: 'Nadia Fontaine', phone: null, role: 'responsable_quartier', is_active: true, can_create_visits: true, avatar_url: null, created_at: '2025-02-08T00:00:00Z', updated_at: '2025-02-08T00:00:00Z' },
  { id: 'demo-user-009', email: 'eric@teamjmd.re', full_name: 'Éric Morel', phone: null, role: 'benevole', is_active: false, can_create_visits: false, avatar_url: null, created_at: '2025-01-25T00:00:00Z', updated_at: '2025-02-15T00:00:00Z' },
];

// ───── Membres de campagne ─────
export const demoCampaignMembers: CampaignMember[] = [
  { id: 'cm-001', first_name: 'Juliana', last_name: 'M\'Doihoma', role: 'Maire', created_at: '2025-01-01T00:00:00Z' },
  { id: 'cm-002', first_name: 'Thomas', last_name: 'Rivière', role: 'Référent', created_at: '2025-01-10T00:00:00Z' },
  { id: 'cm-003', first_name: 'Aïsha', last_name: 'Payet', role: 'Ambassadeur de quartier', created_at: '2025-01-20T00:00:00Z' },
  { id: 'cm-004', first_name: 'Patrick', last_name: 'Fontaine', role: 'Élu', created_at: '2025-01-22T00:00:00Z' },
  { id: 'cm-005', first_name: 'Marie', last_name: 'Dijoux', role: 'Référent', created_at: '2025-02-01T00:00:00Z' },
  { id: 'cm-006', first_name: 'Yannick', last_name: 'Hoareau', role: 'Ambassadeur de quartier', created_at: '2025-02-03T00:00:00Z' },
  { id: 'cm-007', first_name: 'Sandrine', last_name: 'Lebon', role: 'Référent', created_at: '2025-02-05T00:00:00Z' },
  { id: 'cm-008', first_name: 'David', last_name: 'Grondin', role: 'Élu', created_at: '2025-02-07T00:00:00Z' },
];

// ───── Actions — 1 par quartier (actives aujourd'hui ou completed récemment) ─────
export const demoDailyActions: DailyAction[] = [
  // Actives aujourd'hui
  { id: 'action-cv', name: 'Porte-à-porte Centre-Ville', quartier_id: 'q-centre-ville', geometry: demoQuartiers[0].geometry, action_date: today, status: 'active', notes: 'Focus rues commerçantes et quartier Mairie', created_by: 'demo-user-001', created_at: timeAgo(4), updated_at: timeAgo(4) },
  { id: 'action-gol', name: 'Porte-à-porte Le Gol', quartier_id: 'q-le-gol', geometry: demoQuartiers[3].geometry, action_date: today, status: 'active', notes: 'Secteur résidentiel côté usine', created_by: 'demo-user-001', created_at: timeAgo(3), updated_at: timeAgo(3) },
  { id: 'action-ouaki', name: 'Porte-à-porte Le Ouaki', quartier_id: 'q-ouaki', geometry: demoQuartiers[4].geometry, action_date: today, status: 'active', notes: null, created_by: 'demo-user-003', created_at: timeAgo(3), updated_at: timeAgo(3) },
  // Completed récemment
  { id: 'action-riv', name: 'Porte-à-porte La Rivière', quartier_id: 'q-riviere', geometry: demoQuartiers[1].geometry, action_date: daysAgo(1), status: 'completed', notes: 'Bon accueil, beaucoup de sympathisants', created_by: 'demo-user-001', created_at: daysAgo(1) + 'T07:00:00Z', updated_at: daysAgo(1) + 'T17:00:00Z' },
  { id: 'action-bdn', name: 'Porte-à-porte Bois de Nèfles', quartier_id: 'q-bois-olives', geometry: demoQuartiers[2].geometry, action_date: daysAgo(2), status: 'completed', notes: 'Zone bien couverte', created_by: 'demo-user-003', created_at: daysAgo(2) + 'T07:30:00Z', updated_at: daysAgo(2) + 'T16:00:00Z' },
  { id: 'action-pg', name: 'Porte-à-porte Plateau du Gol', quartier_id: 'q-plateau-gol', geometry: demoQuartiers[5].geometry, action_date: daysAgo(3), status: 'completed', notes: 'Quartier calme, peu d\'opposants', created_by: 'demo-user-001', created_at: daysAgo(3) + 'T08:00:00Z', updated_at: daysAgo(3) + 'T15:00:00Z' },
  { id: 'action-cocos', name: 'Porte-à-porte Les Cocos', quartier_id: 'q-les-cocos', geometry: demoQuartiers[6].geometry, action_date: daysAgo(4), status: 'completed', notes: null, created_by: 'demo-user-004', created_at: daysAgo(4) + 'T08:00:00Z', updated_at: daysAgo(4) + 'T16:00:00Z' },
  { id: 'action-chapelle', name: 'Porte-à-porte La Chapelle', quartier_id: 'q-la-chapelle', geometry: demoQuartiers[7].geometry, action_date: daysAgo(5), status: 'completed', notes: 'Zone en hauteur, accès difficile', created_by: 'demo-user-001', created_at: daysAgo(5) + 'T08:00:00Z', updated_at: daysAgo(5) + 'T14:00:00Z' },
  { id: 'action-makes', name: 'Porte-à-porte Les Makes', quartier_id: 'q-makes', geometry: demoQuartiers[8].geometry, action_date: daysAgo(7), status: 'completed', notes: 'Population isolée mais réceptive', created_by: 'demo-user-003', created_at: daysAgo(7) + 'T09:00:00Z', updated_at: daysAgo(7) + 'T13:00:00Z' },
  { id: 'action-tapage', name: 'Porte-à-porte Tapage / Bel Air', quartier_id: 'q-tapage', geometry: demoQuartiers[9].geometry, action_date: daysAgo(6), status: 'completed', notes: 'Beaucoup d\'indécis, à retravailler', created_by: 'demo-user-004', created_at: daysAgo(6) + 'T07:00:00Z', updated_at: daysAgo(6) + 'T16:30:00Z' },
];

// Map action -> quartier pour quick lookup
const actionQuartierMap: Record<string, string> = {};
for (const a of demoDailyActions) { if (a.quartier_id) actionQuartierMap[a.id] = a.quartier_id; }

// ───── Action sectors ─────
export const demoActionSectors: ActionSector[] = [
  { id: 'as-cv1', action_id: 'action-cv', name: 'Secteur Mairie', geometry: { type: 'Polygon', coordinates: [[[55.407, -21.267], [55.411, -21.267], [55.411, -21.271], [55.407, -21.271], [55.407, -21.267]]] }, responsible_id: 'demo-user-003', created_at: timeAgo(4) },
  { id: 'as-cv2', action_id: 'action-cv', name: 'Secteur Commerces', geometry: { type: 'Polygon', coordinates: [[[55.411, -21.267], [55.415, -21.267], [55.415, -21.274], [55.411, -21.274], [55.411, -21.267]]] }, responsible_id: 'demo-user-004', created_at: timeAgo(4) },
  { id: 'as-gol1', action_id: 'action-gol', name: 'Secteur Nord', geometry: { type: 'Polygon', coordinates: [[[55.415, -21.270], [55.422, -21.270], [55.422, -21.275], [55.415, -21.275], [55.415, -21.270]]] }, responsible_id: 'demo-user-008', created_at: timeAgo(3) },
  { id: 'as-gol2', action_id: 'action-gol', name: 'Secteur Sud', geometry: { type: 'Polygon', coordinates: [[[55.415, -21.275], [55.428, -21.275], [55.428, -21.280], [55.415, -21.280], [55.415, -21.275]]] }, responsible_id: 'demo-user-006', created_at: timeAgo(3) },
  { id: 'as-ouaki1', action_id: 'action-ouaki', name: 'Secteur Est', geometry: { type: 'Polygon', coordinates: [[[55.407, -21.285], [55.415, -21.285], [55.415, -21.295], [55.407, -21.295], [55.407, -21.285]]] }, responsible_id: 'demo-user-007', created_at: timeAgo(3) },
];

// ───── Action groups ─────
export const demoActionGroups: ActionGroup[] = [
  { id: 'ag-cv1a', action_sector_id: 'as-cv1', name: 'Groupe Alpha', responsible_id: 'demo-user-003', note_taker_id: 'demo-user-001', created_at: timeAgo(4) },
  { id: 'ag-cv1b', action_sector_id: 'as-cv1', name: 'Groupe Beta', responsible_id: 'demo-user-005', note_taker_id: null, created_at: timeAgo(4) },
  { id: 'ag-cv2a', action_sector_id: 'as-cv2', name: 'Groupe Gamma', responsible_id: 'demo-user-004', note_taker_id: 'demo-user-006', created_at: timeAgo(4) },
  { id: 'ag-gol1a', action_sector_id: 'as-gol1', name: 'Groupe Delta', responsible_id: 'demo-user-008', note_taker_id: 'demo-user-007', created_at: timeAgo(3) },
  { id: 'ag-ouaki1a', action_sector_id: 'as-ouaki1', name: 'Groupe Epsilon', responsible_id: 'demo-user-007', note_taker_id: null, created_at: timeAgo(3) },
];

// ───── Action group members ─────
export const demoActionGroupMembers: ActionGroupMember[] = [
  { id: 'agm-01', group_id: 'ag-cv1a', volunteer_id: 'demo-user-001', created_at: timeAgo(4) },
  { id: 'agm-02', group_id: 'ag-cv1a', volunteer_id: 'demo-user-003', created_at: timeAgo(4) },
  { id: 'agm-03', group_id: 'ag-cv1b', volunteer_id: 'demo-user-005', created_at: timeAgo(4) },
  { id: 'agm-04', group_id: 'ag-cv1b', volunteer_id: 'demo-user-007', created_at: timeAgo(4) },
  { id: 'agm-05', group_id: 'ag-cv2a', volunteer_id: 'demo-user-004', created_at: timeAgo(4) },
  { id: 'agm-06', group_id: 'ag-cv2a', volunteer_id: 'demo-user-006', created_at: timeAgo(4) },
  { id: 'agm-07', group_id: 'ag-gol1a', volunteer_id: 'demo-user-008', created_at: timeAgo(3) },
  { id: 'agm-08', group_id: 'ag-gol1a', volunteer_id: 'demo-user-007', created_at: timeAgo(3) },
  { id: 'agm-09', group_id: 'ag-ouaki1a', volunteer_id: 'demo-user-007', created_at: timeAgo(3) },
  { id: 'agm-10', group_id: 'ag-ouaki1a', volunteer_id: 'demo-user-002', created_at: timeAgo(3) },
];

// ───── Action members (junction campaign member ↔ action) ─────
export const demoActionMembers: ActionMember[] = [
  { id: 'am-01', action_id: 'action-cv', member_id: 'cm-001', created_at: timeAgo(4) },
  { id: 'am-02', action_id: 'action-cv', member_id: 'cm-002', created_at: timeAgo(4) },
  { id: 'am-03', action_id: 'action-cv', member_id: 'cm-003', created_at: timeAgo(4) },
  { id: 'am-04', action_id: 'action-cv', member_id: 'cm-005', created_at: timeAgo(4) },
  { id: 'am-05', action_id: 'action-gol', member_id: 'cm-006', created_at: timeAgo(3) },
  { id: 'am-06', action_id: 'action-gol', member_id: 'cm-008', created_at: timeAgo(3) },
  { id: 'am-07', action_id: 'action-ouaki', member_id: 'cm-007', created_at: timeAgo(3) },
  { id: 'am-08', action_id: 'action-ouaki', member_id: 'cm-004', created_at: timeAgo(3) },
  { id: 'am-09', action_id: 'action-riv', member_id: 'cm-002', created_at: daysAgo(1) + 'T07:00:00Z' },
  { id: 'am-10', action_id: 'action-bdn', member_id: 'cm-003', created_at: daysAgo(2) + 'T07:30:00Z' },
];

// ───── Génération massive de visites ─────

const volunteerIds = ['demo-user-001', 'demo-user-002', 'demo-user-003', 'demo-user-004', 'demo-user-005', 'demo-user-006', 'demo-user-007', 'demo-user-008'];
const campaignMemberIds = demoCampaignMembers.map(m => m.id);
const statuses: Visit['status'][] = ['sympathisant', 'sympathisant', 'sympathisant', 'indecis', 'indecis', 'opposant', 'absent', 'absent'];
const topics = ['Sécurité', 'Emploi', 'Voirie', 'Jeunesse', 'Fiscalité', 'Propreté', 'Transport', 'Logement', 'Santé', 'Éducation', 'Autre'];
const firstNames = ['Marie', 'Jean', 'Fatima', 'Paul', 'Nadia', 'Henri', 'Claire', 'Jacques', 'Lucie', 'David', 'Sophie', 'Yannick', 'Sandrine', 'Patrick', 'Anne', 'Michel', 'Françoise', 'Alain', 'Véronique', 'Christian', 'Monique', 'Éric', 'Sylvie', 'Thierry', 'Catherine'];
const lastNames = ['Payet', 'Rivière', 'Abdou', 'Grondin', 'Morel', 'Lebon', 'Dijoux', 'Hoareau', 'Boyer', 'Fontaine', 'Nativel', 'Hoarau', 'Sery', 'Maillot', 'Bègue', 'Vidot', 'Cadet', 'Lauret', 'Robert', 'Picard'];
const streets = ['rue des Lilas', 'rue du Commerce', 'chemin du Stade', 'allée des Filaos', 'impasse des Bois', 'rue des Lataniers', 'rue de la Gare', 'chemin de la Rivière', 'rue Victor Hugo', 'rue Marius et Ary Leblond', 'rue Auguste de Villèle', 'impasse Bourbon', 'chemin du Gol', 'rue Jean Jaurès', 'rue Suffren'];
const comments = [
  'Très réceptif, veut s\'engager.', 'Attend des propositions concrètes.', 'Problème d\'éclairage la nuit.',
  'Demande un arrêt de bus plus proche.', 'Satisfait des actions en cours.', 'Inquiet pour l\'emploi des jeunes.',
  'Souhaite plus de propreté dans le quartier.', 'Pas intéressé par la politique.', 'Connaît déjà Juliana, très favorable.',
  'Veut une école maternelle dans le quartier.', 'Se plaint des nids de poule sur la route.', 'Problème de logement social.',
  'A besoin d\'aide pour ses démarches administratives.', 'Voisinage bruyant, demande plus de sécurité.',
  'Favorable mais ne votera que si les promesses sont tenues.', 'Ancien sympathisant, déçu par la dernière mandature.',
  null, null, null, null, null, null, null, null,
];

// Quartier bounds for random coords
const quartierBounds: Record<string, { lat: [number, number]; lng: [number, number] }> = {};
for (const q of demoQuartiers) {
  const coords = (q.geometry as { coordinates: number[][][] }).coordinates[0];
  const lats = coords.map(c => c[1]);
  const lngs = coords.map(c => c[0]);
  quartierBounds[q.id] = {
    lat: [Math.min(...lats), Math.max(...lats)],
    lng: [Math.min(...lngs), Math.max(...lngs)],
  };
}

// Config per action: which day, how many visits
// Plusieurs passes par quartier pour simuler des passages sur plusieurs jours (~150-200 visites/quartier)
const actionConfig: { actionId: string; quartierId: string; daysBack: number; count: number; groupIds: (string | null)[] }[] = [
  // Centre-Ville — ~200 visites (action active + historique)
  { actionId: 'action-cv', quartierId: 'q-centre-ville', daysBack: 0, count: 55, groupIds: ['ag-cv1a', 'ag-cv1b', 'ag-cv2a'] },
  { actionId: 'action-cv', quartierId: 'q-centre-ville', daysBack: 3, count: 50, groupIds: [null] },
  { actionId: 'action-cv', quartierId: 'q-centre-ville', daysBack: 8, count: 50, groupIds: [null] },
  { actionId: 'action-cv', quartierId: 'q-centre-ville', daysBack: 12, count: 45, groupIds: [null] },
  // Le Gol — ~180
  { actionId: 'action-gol', quartierId: 'q-le-gol', daysBack: 0, count: 45, groupIds: ['ag-gol1a', null] },
  { actionId: 'action-gol', quartierId: 'q-le-gol', daysBack: 4, count: 50, groupIds: [null] },
  { actionId: 'action-gol', quartierId: 'q-le-gol', daysBack: 9, count: 45, groupIds: [null] },
  { actionId: 'action-gol', quartierId: 'q-le-gol', daysBack: 14, count: 40, groupIds: [null] },
  // Le Ouaki — ~160
  { actionId: 'action-ouaki', quartierId: 'q-ouaki', daysBack: 0, count: 40, groupIds: ['ag-ouaki1a', null] },
  { actionId: 'action-ouaki', quartierId: 'q-ouaki', daysBack: 5, count: 45, groupIds: [null] },
  { actionId: 'action-ouaki', quartierId: 'q-ouaki', daysBack: 10, count: 40, groupIds: [null] },
  { actionId: 'action-ouaki', quartierId: 'q-ouaki', daysBack: 15, count: 35, groupIds: [null] },
  // La Rivière — ~180
  { actionId: 'action-riv', quartierId: 'q-riviere', daysBack: 1, count: 55, groupIds: [null] },
  { actionId: 'action-riv', quartierId: 'q-riviere', daysBack: 6, count: 45, groupIds: [null] },
  { actionId: 'action-riv', quartierId: 'q-riviere', daysBack: 11, count: 45, groupIds: [null] },
  { actionId: 'action-riv', quartierId: 'q-riviere', daysBack: 16, count: 35, groupIds: [null] },
  // Bois de Nèfles — ~170
  { actionId: 'action-bdn', quartierId: 'q-bois-olives', daysBack: 2, count: 50, groupIds: [null] },
  { actionId: 'action-bdn', quartierId: 'q-bois-olives', daysBack: 7, count: 45, groupIds: [null] },
  { actionId: 'action-bdn', quartierId: 'q-bois-olives', daysBack: 13, count: 40, groupIds: [null] },
  { actionId: 'action-bdn', quartierId: 'q-bois-olives', daysBack: 18, count: 35, groupIds: [null] },
  // Plateau du Gol — ~150
  { actionId: 'action-pg', quartierId: 'q-plateau-gol', daysBack: 3, count: 45, groupIds: [null] },
  { actionId: 'action-pg', quartierId: 'q-plateau-gol', daysBack: 8, count: 40, groupIds: [null] },
  { actionId: 'action-pg', quartierId: 'q-plateau-gol', daysBack: 14, count: 35, groupIds: [null] },
  { actionId: 'action-pg', quartierId: 'q-plateau-gol', daysBack: 20, count: 30, groupIds: [null] },
  // Les Cocos — ~140
  { actionId: 'action-cocos', quartierId: 'q-les-cocos', daysBack: 4, count: 40, groupIds: [null] },
  { actionId: 'action-cocos', quartierId: 'q-les-cocos', daysBack: 9, count: 40, groupIds: [null] },
  { actionId: 'action-cocos', quartierId: 'q-les-cocos', daysBack: 15, count: 35, groupIds: [null] },
  { actionId: 'action-cocos', quartierId: 'q-les-cocos', daysBack: 21, count: 25, groupIds: [null] },
  // La Chapelle — ~130
  { actionId: 'action-chapelle', quartierId: 'q-la-chapelle', daysBack: 5, count: 40, groupIds: [null] },
  { actionId: 'action-chapelle', quartierId: 'q-la-chapelle', daysBack: 10, count: 35, groupIds: [null] },
  { actionId: 'action-chapelle', quartierId: 'q-la-chapelle', daysBack: 17, count: 30, groupIds: [null] },
  { actionId: 'action-chapelle', quartierId: 'q-la-chapelle', daysBack: 22, count: 25, groupIds: [null] },
  // Tapage / Bel Air — ~160
  { actionId: 'action-tapage', quartierId: 'q-tapage', daysBack: 6, count: 50, groupIds: [null] },
  { actionId: 'action-tapage', quartierId: 'q-tapage', daysBack: 11, count: 45, groupIds: [null] },
  { actionId: 'action-tapage', quartierId: 'q-tapage', daysBack: 16, count: 35, groupIds: [null] },
  { actionId: 'action-tapage', quartierId: 'q-tapage', daysBack: 19, count: 30, groupIds: [null] },
  // Les Makes — ~120
  { actionId: 'action-makes', quartierId: 'q-makes', daysBack: 7, count: 35, groupIds: [null] },
  { actionId: 'action-makes', quartierId: 'q-makes', daysBack: 12, count: 35, groupIds: [null] },
  { actionId: 'action-makes', quartierId: 'q-makes', daysBack: 18, count: 30, groupIds: [null] },
  { actionId: 'action-makes', quartierId: 'q-makes', daysBack: 23, count: 20, groupIds: [null] },
];

function generateVisits(): Visit[] {
  const rng = seededRandom(42);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const allVisits: Visit[] = [];
  let idx = 0;

  for (const cfg of actionConfig) {
    const bounds = quartierBounds[cfg.quartierId];
    for (let i = 0; i < cfg.count; i++) {
      idx++;
      const status = pick(statuses);
      const isAbsent = status === 'absent';

      // 1-3 topics for non-absent
      let topic: string | null = null;
      if (!isAbsent) {
        const numTopics = rng() < 0.3 ? 1 : rng() < 0.7 ? 2 : 3;
        const picked: string[] = [];
        while (picked.length < numTopics) {
          const t = pick(topics);
          if (!picked.includes(t)) picked.push(t);
        }
        topic = picked.join(',');
      }

      // Consent + contact for ~40% of non-absent
      const hasConsent = !isAbsent && rng() < 0.4;
      const firstName = hasConsent ? pick(firstNames) : null;
      const lastName = hasConsent ? pick(lastNames) : null;
      const address = hasConsent && rng() < 0.7 ? `${Math.floor(rng() * 80 + 1)} ${pick(streets)}` : null;
      const phone = hasConsent && rng() < 0.3 ? `+262 692 ${String(Math.floor(rng() * 90 + 10))} ${String(Math.floor(rng() * 90 + 10))} ${String(Math.floor(rng() * 90 + 10))}` : null;

      // Household voters for sympathisants
      let householdVoters: number | null = null;
      if (status === 'sympathisant') {
        householdVoters = rng() < 0.4 ? null : Math.floor(rng() * 5 + 1);
      }

      // Conducted by
      const conductedBy = !isAbsent && rng() < 0.5 ? pick(campaignMemberIds) : null;

      // Hour distribution: 8h-18h
      const hour = Math.floor(rng() * 10 + 8);
      const minute = Math.floor(rng() * 60);

      const lat = bounds.lat[0] + rng() * (bounds.lat[1] - bounds.lat[0]);
      const lng = bounds.lng[0] + rng() * (bounds.lng[1] - bounds.lng[0]);

      allVisits.push({
        id: `v-${String(idx).padStart(4, '0')}`,
        volunteer_id: pick(volunteerIds),
        sector_id: null,
        quartier_id: cfg.quartierId,
        status,
        topic,
        comment: !isAbsent ? pick(comments) : null,
        latitude: Math.round(lat * 100000) / 100000,
        longitude: Math.round(lng * 100000) / 100000,
        needs_followup: !isAbsent && rng() < 0.2,
        offline_id: null,
        created_at: dateTimeAt(cfg.daysBack, hour, minute),
        contact_first_name: firstName,
        contact_last_name: lastName,
        contact_address: address,
        contact_phone: phone,
        has_consent: hasConsent,
        household_voters: householdVoters,
        action_id: cfg.actionId,
        action_group_id: pick(cfg.groupIds),
        conducted_by_member_id: conductedBy,
      });
    }
  }

  // Sort by created_at desc
  allVisits.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return allVisits;
}

export const demoVisits: Visit[] = generateVisits();

// ───── Stats dynamiques ─────
export function computeKPIs(visits: Visit[]): GlobalKPIs {
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

export function computeQuartierStats(visits: Visit[], quartiers: Quartier[]): QuartierStats[] {
  return quartiers.map(q => {
    const qv = visits.filter(v => v.quartier_id === q.id);
    const symp = qv.filter(v => v.status === 'sympathisant').length;
    const ind = qv.filter(v => v.status === 'indecis').length;
    const opp = qv.filter(v => v.status === 'opposant').length;
    const abs = qv.filter(v => v.status === 'absent').length;
    const contacts = symp + ind + opp;
    return {
      quartier_id: q.id,
      quartier_name: q.name,
      total_visits: qv.length,
      sympathisants: symp,
      indecis: ind,
      opposants: opp,
      absents: abs,
      support_rate: contacts > 0 ? Math.round((symp / contacts) * 100) : 0,
    };
  });
}

export function computeDailyVisits(visits: Visit[]): DailyVisits[] {
  const byDay = new Map<string, DailyVisits>();
  for (const v of visits) {
    const date = v.created_at.split('T')[0];
    const e = byDay.get(date) || { visit_date: date, count: 0, sympathisants: 0, indecis: 0, opposants: 0, absents: 0 };
    e.count++;
    if (v.status === 'sympathisant') e.sympathisants++;
    else if (v.status === 'indecis') e.indecis++;
    else if (v.status === 'opposant') e.opposants++;
    else if (v.status === 'absent') e.absents++;
    byDay.set(date, e);
  }
  return Array.from(byDay.values()).sort((a, b) => a.visit_date.localeCompare(b.visit_date));
}

export function computeTopTopics(visits: Visit[]): TopicCount[] {
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

// Exports pré-calculés (utilisés comme fallback)
export const demoKPIs: GlobalKPIs = computeKPIs(demoVisits);
export const demoQuartierStats: QuartierStats[] = computeQuartierStats(demoVisits, demoQuartiers);
export const demoDailyVisits: DailyVisits[] = computeDailyVisits(demoVisits);
export const demoTopTopics: TopicCount[] = computeTopTopics(demoVisits);
