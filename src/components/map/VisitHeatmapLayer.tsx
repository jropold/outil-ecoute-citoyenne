import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import type { Visit } from '../../types/database';

interface VisitHeatmapLayerProps {
  visits: Visit[];
  visible: boolean;
}

export function VisitHeatmapLayer({ visits, visible }: VisitHeatmapLayerProps) {
  const map = useMap();
  const layerRef = useRef<L.HeatLayer | null>(null);

  // Create heat layer once
  useEffect(() => {
    const layer = L.heatLayer([], {
      radius: 20,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.2: '#22C55E',
        0.5: '#F59E0B',
        1.0: '#EF4444',
      },
    });
    layerRef.current = layer;

    return () => {
      layer.remove();
    };
  }, []);

  // Update data when visits change
  useEffect(() => {
    if (!layerRef.current) return;
    const points: L.HeatLatLngTuple[] = visits
      .filter((v) => v.latitude != null && v.longitude != null)
      .map((v) => [v.latitude!, v.longitude!]);
    layerRef.current.setLatLngs(points);
  }, [visits]);

  // Toggle visibility
  useEffect(() => {
    if (!layerRef.current) return;
    if (visible) {
      layerRef.current.addTo(map);
    } else {
      layerRef.current.remove();
    }
  }, [visible, map]);

  return null;
}
