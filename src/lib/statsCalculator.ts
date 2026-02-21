import type { Visit } from '../types/database';

export function calculateSupportRate(visits: Visit[]): number {
  const contacted = visits.filter((v) => v.status !== 'absent');
  if (contacted.length === 0) return 0;
  const sympathisants = contacted.filter((v) => v.status === 'sympathisant').length;
  return Math.round((sympathisants / contacted.length) * 100 * 10) / 10;
}

export function calculateCoverageRate(
  totalVisits: number,
  totalDoorsEstimate: number
): number {
  if (totalDoorsEstimate === 0) return 0;
  return Math.round((totalVisits / totalDoorsEstimate) * 100 * 10) / 10;
}

export function groupByStatus(visits: Visit[]) {
  return {
    sympathisant: visits.filter((v) => v.status === 'sympathisant').length,
    indecis: visits.filter((v) => v.status === 'indecis').length,
    opposant: visits.filter((v) => v.status === 'opposant').length,
    absent: visits.filter((v) => v.status === 'absent').length,
  };
}

export function groupByTopic(visits: Visit[]): { topic: string; count: number }[] {
  const map = new Map<string, number>();
  for (const v of visits) {
    if (v.topic) {
      map.set(v.topic, (map.get(v.topic) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}
