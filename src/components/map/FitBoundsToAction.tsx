import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import type { DailyAction } from '../../types/database';

interface FitBoundsToActionProps {
  actions: DailyAction[];
}

export function FitBoundsToAction({ actions }: FitBoundsToActionProps) {
  const map = useMap();
  const fittedIdsRef = useRef<string>('');

  useEffect(() => {
    const ids = actions.map((a) => a.id).sort().join(',');
    if (!ids || ids === fittedIdsRef.current) return;

    const allPoints: [number, number][] = [];

    for (const action of actions) {
      const geom = action.geometry as GeoJSON.Geometry | null;
      if (!geom || !('coordinates' in geom)) continue;

      try {
        if (geom.type === 'Polygon') {
          const ring = (geom as GeoJSON.Polygon).coordinates[0];
          if (!ring || ring.length < 3) continue;
          for (const [lng, lat] of ring) {
            allPoints.push([lat, lng]);
          }
        } else if (geom.type === 'MultiPolygon') {
          for (const polygon of (geom as GeoJSON.MultiPolygon).coordinates) {
            const ring = polygon[0];
            if (!ring || ring.length < 3) continue;
            for (const [lng, lat] of ring) {
              allPoints.push([lat, lng]);
            }
          }
        }
      } catch {
        // Skip actions with invalid geometry (e.g. demo `geometry: {}`)
      }
    }

    fittedIdsRef.current = ids;

    if (allPoints.length === 0) return;
    map.fitBounds(allPoints as LatLngBoundsExpression, {
      padding: [50, 50],
      maxZoom: 16,
    });
  }, [actions, map]);

  return null;
}
