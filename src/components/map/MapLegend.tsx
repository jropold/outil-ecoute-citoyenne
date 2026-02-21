import { COLORS } from '../../config/constants';

interface MapLegendProps {
  hasActionZone?: boolean;
  showVisitMarkers?: boolean;
}

export function MapLegend({ hasActionZone, showVisitMarkers }: MapLegendProps) {
  return (
    <div className="absolute bottom-18 right-2 md:bottom-4 md:right-4 z-[1000] bg-white/95 backdrop-blur rounded-lg shadow-lg p-2.5 md:p-3 min-w-[140px] md:min-w-[160px]">
      <h4 className="text-xs font-bold text-[#1B2A4A] mb-2 uppercase tracking-wide">Taux de réponse</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded-sm border-2" style={{ backgroundColor: `${COLORS.couvert}40`, borderColor: COLORS.couvert }} />
          <span className="text-xs text-gray-700 font-medium">Bon (&gt;60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded-sm border-2" style={{ backgroundColor: `${COLORS.partiellement}40`, borderColor: COLORS.partiellement }} />
          <span className="text-xs text-gray-700 font-medium">Moyen (20-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded-sm border-2" style={{ backgroundColor: `${COLORS.nonCouvert}40`, borderColor: COLORS.nonCouvert }} />
          <span className="text-xs text-gray-700 font-medium">Faible (&lt;20%)</span>
        </div>
        {hasActionZone && (
          <>
            <hr className="border-gray-200" />
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-3 rounded-sm border-2 border-dashed"
                style={{ backgroundColor: `${COLORS.actionZone}20`, borderColor: COLORS.actionZone }}
              />
              <span className="text-xs font-bold" style={{ color: COLORS.actionZone }}>Action du jour</span>
            </div>
          </>
        )}
        {showVisitMarkers && (
          <>
            <hr className="border-gray-200" />
            <h4 className="text-xs font-bold text-[#1B2A4A] uppercase tracking-wide">Visites</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.sympathisant }} />
              <span className="text-xs text-gray-700">Sympathisant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.indecis }} />
              <span className="text-xs text-gray-700">Indécis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.opposant }} />
              <span className="text-xs text-gray-700">Opposant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.absent }} />
              <span className="text-xs text-gray-700">Absent</span>
            </div>
          </>
        )}
      </div>
      <p className="text-[10px] text-gray-400 mt-2 leading-tight">Réponses / portes frappées par quartier</p>
    </div>
  );
}
