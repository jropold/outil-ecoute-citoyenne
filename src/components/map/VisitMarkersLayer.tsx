import { useMemo } from 'react';
import { CircleMarker, Popup } from 'react-leaflet';
import { COLORS } from '../../config/constants';
import type { Visit } from '../../types/database';

interface VisitMarkersLayerProps {
  visits: Visit[];
  visible: boolean;
}

const STATUS_COLORS: Record<Visit['status'], string> = {
  sympathisant: COLORS.sympathisant,
  indecis: COLORS.indecis,
  opposant: COLORS.opposant,
  absent: COLORS.absent,
};

const STATUS_LABELS: Record<Visit['status'], string> = {
  sympathisant: 'Sympathisant',
  indecis: 'Indécis',
  opposant: 'Opposant',
  absent: 'Absent',
};

export function VisitMarkersLayer({ visits, visible }: VisitMarkersLayerProps) {
  const geoVisits = useMemo(
    () => visits.filter((v) => v.latitude != null && v.longitude != null),
    [visits]
  );

  if (!visible) return null;

  return (
    <>
      {geoVisits.map((visit) => (
        <CircleMarker
          key={visit.id}
          center={[visit.latitude!, visit.longitude!]}
          radius={6}
          pathOptions={{
            color: STATUS_COLORS[visit.status],
            fillColor: STATUS_COLORS[visit.status],
            fillOpacity: 0.8,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm space-y-1 min-w-[140px]">
              <span
                className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold"
                style={{ backgroundColor: STATUS_COLORS[visit.status] }}
              >
                {STATUS_LABELS[visit.status]}
              </span>
              {visit.topic && (
                <p className="text-gray-600">{visit.topic}</p>
              )}
              {visit.has_consent && (visit.contact_first_name || visit.contact_last_name) && (
                <p className="font-medium text-gray-800">
                  {[visit.contact_first_name, visit.contact_last_name].filter(Boolean).join(' ')}
                </p>
              )}
              <p className="text-xs text-gray-400">
                {new Date(visit.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}
