import { openDB } from 'idb';
import type { OfflineVisit } from '../types/models';

const DB_NAME = 'ecoute-citoyenne';
const DB_VERSION = 2;
const STORE_NAME = 'offline-visits';

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'offline_id' });
      store.createIndex('by-synced', 'synced');
    },
  });
}

export async function saveOfflineVisit(visit: OfflineVisit): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, visit);
}

export async function getOfflineVisits(): Promise<OfflineVisit[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function removeOfflineVisit(offlineId: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, offlineId);
}

export async function countPendingVisits(): Promise<number> {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME) as OfflineVisit[];
  return all.filter((v) => !v.synced).length;
}

export async function clearOfflineVisits(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
