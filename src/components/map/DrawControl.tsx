import { useEffect, useRef, useState, useCallback } from 'react';
import { useMap, Polyline, Polygon, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';

interface DrawControlProps {
  onPolygonCreated: (geojson: GeoJSON.Geometry) => void;
  onCancel?: () => void;
  enabled: boolean;
}

export function DrawControl({ onPolygonCreated, onCancel, enabled }: DrawControlProps) {
  const map = useMap();
  const [points, setPoints] = useState<[number, number][]>([]);
  const pointsRef = useRef<[number, number][]>([]);
  const callbackRef = useRef(onPolygonCreated);
  callbackRef.current = onPolygonCreated;
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Reset points when disabled
  useEffect(() => {
    if (!enabled) {
      setPoints([]);
      pointsRef.current = [];
    }
  }, [enabled]);

  // Prevent clicks on toolbar from propagating to the map
  useEffect(() => {
    const el = toolbarRef.current;
    if (el) {
      L.DomEvent.disableClickPropagation(el);
    }
  });

  // Change cursor when drawing
  useEffect(() => {
    const container = map.getContainer();
    if (enabled) {
      container.style.cursor = 'crosshair';
      map.doubleClickZoom.disable();
    } else {
      container.style.cursor = '';
      map.doubleClickZoom.enable();
    }
    return () => {
      container.style.cursor = '';
      map.doubleClickZoom.enable();
    };
  }, [map, enabled]);

  // Handle map clicks
  const handleClick = useCallback((e: LeafletMouseEvent) => {
    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    const updated = [...pointsRef.current, newPoint];
    pointsRef.current = updated;
    setPoints(updated);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, enabled, handleClick]);

  // Close polygon: click on first point or use the button
  const closePolygon = useCallback(() => {
    const pts = pointsRef.current;
    if (pts.length < 3) return;

    const coordinates = pts.map(([lat, lng]) => [lng, lat]);
    // Close the ring
    coordinates.push(coordinates[0]);

    const geojson: GeoJSON.Geometry = {
      type: 'Polygon',
      coordinates: [coordinates],
    };

    callbackRef.current(geojson);
    setPoints([]);
    pointsRef.current = [];
  }, []);

  const undoLast = useCallback(() => {
    const updated = pointsRef.current.slice(0, -1);
    pointsRef.current = updated;
    setPoints(updated);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Draw lines between points */}
      {points.length >= 2 && (
        <Polyline
          positions={points}
          pathOptions={{
            color: '#E91E8C',
            weight: 3,
            dashArray: '10, 6',
          }}
        />
      )}

      {/* Show preview closing line (last point to first) */}
      {points.length >= 3 && (
        <Polyline
          positions={[points[points.length - 1], points[0]]}
          pathOptions={{
            color: '#E91E8C',
            weight: 2,
            dashArray: '4, 8',
            opacity: 0.5,
          }}
        />
      )}

      {/* Show filled polygon preview */}
      {points.length >= 3 && (
        <Polygon
          positions={points}
          pathOptions={{
            color: '#E91E8C',
            weight: 0,
            fillOpacity: 0.12,
          }}
        />
      )}

      {/* Draw vertex markers */}
      {points.map((point, i) => (
        <CircleMarker
          key={i}
          center={point}
          radius={i === 0 && points.length >= 3 ? 8 : 5}
          pathOptions={{
            color: '#E91E8C',
            fillColor: i === 0 ? '#fff' : '#E91E8C',
            fillOpacity: 1,
            weight: 2,
          }}
          eventHandlers={
            i === 0 && points.length >= 3
              ? { click: (e) => { e.originalEvent.stopPropagation(); closePolygon(); } }
              : {}
          }
        />
      ))}

      {/* Toolbar overlay */}
      <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto' }}>
        <div
          ref={toolbarRef}
          className="leaflet-control bg-white rounded-lg shadow-lg p-3 m-2"
          style={{ pointerEvents: 'auto' }}
        >
          <p className="text-xs font-bold text-[#1B2A4A] mb-2">
            {points.length === 0 && 'Cliquez sur la carte pour tracer la zone'}
            {points.length === 1 && '1 point — continuez...'}
            {points.length === 2 && '2 points — encore 1 minimum'}
            {points.length >= 3 && `${points.length} points — fermez le polygone`}
          </p>
          <div className="flex gap-1 flex-wrap">
            {onCancel && (
              <button
                onClick={() => {
                  setPoints([]);
                  pointsRef.current = [];
                  onCancel();
                }}
                className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 font-medium"
              >
                Annuler
              </button>
            )}
            {points.length > 0 && (
              <button
                onClick={undoLast}
                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                Retirer dernier point
              </button>
            )}
            {points.length >= 3 && (
              <button
                onClick={closePolygon}
                className="text-xs px-2 py-1 rounded bg-[#E91E8C] text-white hover:bg-[#d11a7d] font-medium"
              >
                Valider la zone
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
