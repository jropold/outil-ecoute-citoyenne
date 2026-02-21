import { useState } from 'react';
import { COLORS } from '../../config/constants';

interface MapLegendProps {
  hasActionZone?: boolean;
  hasHistoricalZone?: boolean;
  showVisitMarkers?: boolean;
}

export function MapLegend({ hasActionZone, hasHistoricalZone, showVisitMarkers }: MapLegendProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="absolute bottom-18 right-2 md:bottom-4 md:right-4 z-[1000]">
      {/* Mobile: collapsed toggle button */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="md:hidden flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-lg shadow-lg px-2.5 py-2 text-xs font-bold text-[#1B2A4A] uppercase tracking-wide"
          aria-label="Afficher la légende"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Légende
        </button>
      )}

      {/* Desktop: always visible / Mobile: visible when expanded */}
      <div className={`${expanded ? 'block' : 'hidden'} md:block bg-white/95 backdrop-blur rounded-lg shadow-lg p-2.5 md:p-3 min-w-[140px] md:min-w-[160px]`}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between md:hidden mb-1">
          <h4 className="text-xs font-bold text-[#1B2A4A] uppercase tracking-wide">Légende</h4>
          <button
            onClick={() => setExpanded(false)}
            className="p-0.5 rounded hover:bg-gray-100 text-gray-400"
            aria-label="Masquer la légende"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

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
          {(hasActionZone || hasHistoricalZone) && (
            <>
              <hr className="border-gray-200" />
              {hasActionZone && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-3 rounded-sm border-2 border-dashed"
                    style={{ backgroundColor: `${COLORS.actionZone}20`, borderColor: COLORS.actionZone }}
                  />
                  <span className="text-xs font-bold" style={{ color: COLORS.actionZone }}>Action du jour</span>
                </div>
              )}
              {hasHistoricalZone && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-3 rounded-sm border-2"
                    style={{ backgroundColor: '#6B728014', borderColor: '#9CA3AF' }}
                  />
                  <span className="text-xs font-medium text-gray-500">Action terminée</span>
                </div>
              )}
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
    </div>
  );
}
