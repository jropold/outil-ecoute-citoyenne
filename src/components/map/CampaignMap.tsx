import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import { MAP_CENTER, MAP_ZOOM, MAP_MIN_ZOOM, MAP_MAX_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../config/map';
import { QuartierLayer } from './QuartierLayer';
import { ActionZoneLayer } from './ActionZoneLayer';
import { DrawControl } from './DrawControl';
import { MapLegend } from './MapLegend';
import { VisitHeatmapLayer } from './VisitHeatmapLayer';
import { VisitMarkersLayer } from './VisitMarkersLayer';
import { FitBoundsToAction } from './FitBoundsToAction';
import { MapLayerToggle } from './MapLayerToggle';
import { useQuartiers } from '../../hooks/useQuartiers';
import { useStats } from '../../hooks/useStats';
import { useVisits } from '../../hooks/useVisits';
import type { DailyAction } from '../../types/database';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CampaignMapProps {
  activeActions?: DailyAction[];
  drawMode?: boolean;
  drawnGeometry?: GeoJSON.Geometry | null;
  onPolygonDrawn?: (geojson: GeoJSON.Geometry) => void;
  onDrawCancel?: () => void;
}

export function CampaignMap({ activeActions = [], drawMode = false, drawnGeometry, onPolygonDrawn, onDrawCancel }: CampaignMapProps) {
  const { quartiers, loading: quartiersLoading } = useQuartiers();
  const { quartierStats, loading: statsLoading } = useStats();
  const { visits, loading: visitsLoading } = useVisits();
  const [showMarkers, setShowMarkers] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Convert GeoJSON [lng, lat] → Leaflet [lat, lng] for preview polygon
  const previewPositions = useMemo<LatLngExpression[] | null>(() => {
    if (!drawnGeometry || drawMode) return null;
    if (drawnGeometry.type !== 'Polygon') return null;
    const ring = (drawnGeometry as GeoJSON.Polygon).coordinates[0];
    if (!ring || ring.length < 3) return null;
    return ring.map(([lng, lat]) => [lat, lng] as LatLngExpression);
  }, [drawnGeometry, drawMode]);

  if (quartiersLoading || statsLoading || visitsLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1B2A4A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)] rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <QuartierLayer quartiers={quartiers} stats={quartierStats} />
        <ActionZoneLayer actions={activeActions} />
        <VisitMarkersLayer visits={visits} visible={showMarkers} />
        <VisitHeatmapLayer visits={visits} visible={showHeatmap} />
        <FitBoundsToAction actions={activeActions} />
        {onPolygonDrawn && (
          <DrawControl enabled={drawMode} onPolygonCreated={onPolygonDrawn} onCancel={onDrawCancel} />
        )}
        {/* Preview of drawn zone before action creation */}
        {previewPositions && (
          <Polygon
            positions={previewPositions}
            pathOptions={{
              color: '#E91E8C',
              weight: 3,
              dashArray: '12, 8',
              fillColor: '#E91E8C',
              fillOpacity: 0.18,
            }}
          />
        )}
      </MapContainer>
      <MapLayerToggle
        showMarkers={showMarkers}
        showHeatmap={showHeatmap}
        onToggleMarkers={() => setShowMarkers((v) => !v)}
        onToggleHeatmap={() => setShowHeatmap((v) => !v)}
      />
      <MapLegend hasActionZone={activeActions.length > 0} showVisitMarkers={showMarkers} />
    </div>
  );
}
