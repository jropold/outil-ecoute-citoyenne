import { GeoJSON, Popup } from 'react-leaflet';
import { COLORS } from '../../config/constants';
import type { DailyAction } from '../../types/database';
import type { Feature, Geometry } from 'geojson';
import type { PathOptions } from 'leaflet';

interface ActionZoneLayerProps {
  actions: DailyAction[];
}

export function ActionZoneLayer({ actions }: ActionZoneLayerProps) {
  if (actions.length === 0) return null;

  return (
    <>
      {actions.map((action) => {
        if (!action.geometry || Object.keys(action.geometry as object).length === 0) return null;

        const geoData: Feature<Geometry> = {
          type: 'Feature',
          geometry: action.geometry as unknown as Geometry,
          properties: { name: action.name },
        };

        const style: PathOptions = {
          fillColor: COLORS.actionZone,
          fillOpacity: 0.18,
          color: COLORS.actionZone,
          weight: 4,
          opacity: 1,
          dashArray: '12, 8',
        };

        return (
          <GeoJSON key={action.id} data={geoData} style={style}>
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
              </div>
            </Popup>
          </GeoJSON>
        );
      })}
    </>
  );
}
