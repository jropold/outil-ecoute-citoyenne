import { GeoJSON, Popup } from 'react-leaflet';
import { COLORS } from '../../config/constants';
import type { Quartier } from '../../types/database';
import type { QuartierStats } from '../../types/models';
import type { Feature, Geometry } from 'geojson';
import type { PathOptions } from 'leaflet';

interface QuartierLayerProps {
  quartiers: Quartier[];
  stats: QuartierStats[];
}

function getResponseRate(stats: QuartierStats | undefined): number {
  if (!stats || stats.total_visits === 0) return 0;
  const contacted = stats.sympathisants + stats.indecis + stats.opposants;
  return contacted / stats.total_visits;
}

function getCoverageColor(stats: QuartierStats | undefined): string {
  const rate = getResponseRate(stats);
  if (!stats || stats.total_visits === 0) return COLORS.nonCouvert;
  if (rate >= 0.6) return COLORS.couvert;
  if (rate >= 0.2) return COLORS.partiellement;
  return COLORS.nonCouvert;
}

function getCoverageLabel(stats: QuartierStats | undefined): string {
  if (!stats || stats.total_visits === 0) return 'Non visité';
  const pct = Math.round(getResponseRate(stats) * 100);
  if (pct >= 60) return `Bon taux (${pct}%)`;
  if (pct >= 20) return `Moyen (${pct}%)`;
  return `Faible (${pct}%)`;
}

export function QuartierLayer({ quartiers, stats }: QuartierLayerProps) {
  const quartiersWithGeometry = quartiers.filter(
    (q) => q.geometry && typeof q.geometry === 'object' && Object.keys(q.geometry as object).length > 0
  );

  if (quartiersWithGeometry.length === 0) {
    return null;
  }

  return (
    <>
      {quartiersWithGeometry.map((quartier) => {
        const qStats = stats.find((s) => s.quartier_id === quartier.id);
        const color = getCoverageColor(qStats);
        const coverageLabel = getCoverageLabel(qStats);

        const geoData: Feature<Geometry> = {
          type: 'Feature',
          geometry: quartier.geometry as unknown as Geometry,
          properties: { name: quartier.name },
        };

        const style: PathOptions = {
          fillColor: color,
          fillOpacity: 0.35,
          color: color,
          weight: 3,
          opacity: 1,
        };

        return (
          <GeoJSON key={quartier.id} data={geoData} style={style}>
            <Popup>
              <div className="min-w-[220px]">
                <h3 className="font-bold text-[#1B2A4A] text-base mb-1">{quartier.name}</h3>
                <div
                  className="inline-block text-xs font-semibold text-white px-2 py-0.5 rounded-full mb-2"
                  style={{ backgroundColor: color }}
                >
                  {coverageLabel}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Portes frappées :</span>
                    <span className="font-semibold">{qStats?.total_visits ?? 0}</span>
                  </div>
                  {qStats && qStats.total_visits > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Réponses :</span>
                      <span className="font-semibold">{qStats.sympathisants + qStats.indecis + qStats.opposants} ({Math.round(getResponseRate(qStats) * 100)}%)</span>
                    </div>
                  )}
                  {qStats && qStats.total_visits > 0 && (
                    <>
                      <hr className="my-1.5" />
                      <div className="flex justify-between">
                        <span className="text-green-600">Sympathisants :</span>
                        <span className="font-semibold">{qStats.sympathisants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-600">Indécis :</span>
                        <span className="font-semibold">{qStats.indecis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">Opposants :</span>
                        <span className="font-semibold">{qStats.opposants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Absents :</span>
                        <span className="font-semibold">{qStats.absents}</span>
                      </div>
                      <hr className="my-1.5" />
                      <div className="flex justify-between">
                        <span className="text-[#1B2A4A] font-medium">Taux soutien :</span>
                        <span className="font-bold text-[#E91E8C]">{qStats.support_rate}%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Popup>
          </GeoJSON>
        );
      })}
    </>
  );
}
