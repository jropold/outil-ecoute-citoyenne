import { useCallback } from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../config/constants';
import type { DailyAction } from '../../types/database';
import type { Feature, Geometry } from 'geojson';
import type { PathOptions, LeafletMouseEvent } from 'leaflet';

interface ActionZoneLayerProps {
  actions: DailyAction[];
  allActions?: DailyAction[];
}

const activeStyle: PathOptions = {
  fillColor: COLORS.actionZone,
  fillOpacity: 0.18,
  color: COLORS.actionZone,
  weight: 4,
  opacity: 1,
  dashArray: '12, 8',
};

const completedStyle: PathOptions = {
  fillColor: '#6B7280',
  fillOpacity: 0.08,
  color: '#9CA3AF',
  weight: 2,
  opacity: 0.7,
};

export function ActionZoneLayer({ actions, allActions = [] }: ActionZoneLayerProps) {
  const navigate = useNavigate();

  const handleClick = useCallback((actionId: string) => {
    return (_e: LeafletMouseEvent) => {
      navigate(`/actions/${actionId}`);
    };
  }, [navigate]);

  // Historical (completed) zones — exclude currently active ones
  const activeIds = new Set(actions.map(a => a.id));
  const historicalActions = allActions.filter(a => a.status === 'completed' && !activeIds.has(a.id));

  return (
    <>
      {/* Render historical zones first (behind active) */}
      {historicalActions.map((action) => {
        if (!action.geometry || Object.keys(action.geometry as object).length === 0) return null;

        const geoData: Feature<Geometry> = {
          type: 'Feature',
          geometry: action.geometry as unknown as Geometry,
          properties: { name: action.name },
        };

        return (
          <GeoJSON
            key={`hist-${action.id}`}
            data={geoData}
            style={completedStyle}
            eventHandlers={{ click: handleClick(action.id) }}
          >
            <Popup>
              <div className="text-center min-w-[180px]">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-500">
                  Action terminée
                </div>
                <h3 className="font-bold text-[#1B2A4A] text-lg leading-tight">{action.name}</h3>
                {action.notes && (
                  <p className="text-sm text-gray-500 mt-1">{action.notes}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(action.action_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <button
                  className="mt-2 text-xs font-medium text-[#1B2A4A] underline hover:text-[#E91E8C]"
                  onClick={() => navigate(`/actions/${action.id}`)}
                >
                  Voir les détails
                </button>
              </div>
            </Popup>
          </GeoJSON>
        );
      })}

      {/* Render active zones on top */}
      {actions.map((action) => {
        if (!action.geometry || Object.keys(action.geometry as object).length === 0) return null;

        const geoData: Feature<Geometry> = {
          type: 'Feature',
          geometry: action.geometry as unknown as Geometry,
          properties: { name: action.name },
        };

        return (
          <GeoJSON
            key={action.id}
            data={geoData}
            style={activeStyle}
            eventHandlers={{ click: handleClick(action.id) }}
          >
            <Popup>
              <div className="text-center min-w-[180px]">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: COLORS.actionZone }}>
                  Action du jour
                </div>
                <h3 className="font-bold text-[#1B2A4A] text-lg leading-tight">{action.name}</h3>
                {action.notes && (
                  <p className="text-sm text-gray-500 mt-1">{action.notes}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(action.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <button
                  className="mt-2 text-xs font-medium text-[#1B2A4A] underline hover:text-[#E91E8C]"
                  onClick={() => navigate(`/actions/${action.id}`)}
                >
                  Voir les détails
                </button>
              </div>
            </Popup>
          </GeoJSON>
        );
      })}
    </>
  );
}
