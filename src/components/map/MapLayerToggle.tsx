interface MapLayerToggleProps {
  showMarkers: boolean;
  showHeatmap: boolean;
  showLocation: boolean;
  onToggleMarkers: () => void;
  onToggleHeatmap: () => void;
  onToggleLocation: () => void;
}

export function MapLayerToggle({ showMarkers, showHeatmap, showLocation, onToggleMarkers, onToggleHeatmap, onToggleLocation }: MapLayerToggleProps) {
  return (
    <div className="absolute top-2 left-2 md:top-4 md:left-4 z-[1000] bg-white/95 backdrop-blur rounded-lg shadow-lg p-2.5 md:p-3">
      <h4 className="text-xs font-bold text-[#1B2A4A] mb-2 uppercase tracking-wide">Couches</h4>
      <label className="flex items-center gap-2 cursor-pointer mb-1.5">
        <input
          type="checkbox"
          checked={showLocation}
          onChange={onToggleLocation}
          className="w-3.5 h-3.5 rounded border-gray-300 text-[#3B82F6] accent-[#3B82F6]"
        />
        <span className="text-xs text-gray-700 font-medium">Ma position</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer mb-1.5">
        <input
          type="checkbox"
          checked={showMarkers}
          onChange={onToggleMarkers}
          className="w-3.5 h-3.5 rounded border-gray-300 text-[#1B2A4A] accent-[#1B2A4A]"
        />
        <span className="text-xs text-gray-700 font-medium">Marqueurs visites</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showHeatmap}
          onChange={onToggleHeatmap}
          className="w-3.5 h-3.5 rounded border-gray-300 text-[#1B2A4A] accent-[#1B2A4A]"
        />
        <span className="text-xs text-gray-700 font-medium">Carte de chaleur</span>
      </label>
    </div>
  );
}
