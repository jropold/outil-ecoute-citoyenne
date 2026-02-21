export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

export function findQuartierByLocation(
  lat: number,
  lng: number,
  quartiers: { id: string; geometry: unknown }[]
): string | null {
  for (const q of quartiers) {
    const geo = q.geometry as GeoJSON.Feature | GeoJSON.Geometry | null;
    if (!geo) continue;

    const geometry = 'geometry' in geo ? geo.geometry : geo;
    if (!geometry) continue;

    if (geometry.type === 'Polygon') {
      const coords = geometry.coordinates[0] as [number, number][];
      // GeoJSON is [lng, lat], our point is [lat, lng]
      if (isPointInPolygon([lng, lat], coords)) {
        return q.id;
      }
    } else if (geometry.type === 'MultiPolygon') {
      for (const poly of geometry.coordinates) {
        const coords = poly[0] as [number, number][];
        if (isPointInPolygon([lng, lat], coords)) {
          return q.id;
        }
      }
    }
  }
  return null;
}

export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
