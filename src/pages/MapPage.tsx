import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignMap } from '../components/map/CampaignMap';
import { CreateActionPanel } from '../components/map/CreateActionPanel';
import { Button } from '../components/ui/Button';
import { useDailyActions } from '../hooks/useDailyActions';
import { useAuth } from '../hooks/useAuth';

const ADMIN_ROLES = ['admin'];

export default function MapPage() {
  const { actions, completeAction, cancelAction } = useDailyActions();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const isAdmin = profile ? ADMIN_ROLES.includes(profile.role) : false;

  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [drawnGeometry, setDrawnGeometry] = useState<GeoJSON.Geometry | null>(null);

  const handlePolygonDrawn = useCallback((geojson: GeoJSON.Geometry) => {
    setDrawnGeometry(geojson);
    setDrawMode(false);
  }, []);

  const handleCreated = () => {
    setShowCreatePanel(false);
    setDrawMode(false);
    setDrawnGeometry(null);
  };

  const handleCancel = () => {
    setShowCreatePanel(false);
    setDrawMode(false);
    setDrawnGeometry(null);
  };

  const handleDrawCancel = useCallback(() => {
    setDrawMode(false);
    setDrawnGeometry(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Carte de campagne</h1>
          <p className="text-gray-500 text-sm mt-1">Couverture terrain par quartier — Saint-Louis</p>
        </div>

        {isAdmin && !showCreatePanel && (
          <Button variant="accent" onClick={() => setShowCreatePanel(true)}>
            + Nouvelle action du jour
          </Button>
        )}
      </div>

      {/* Active actions banner */}
      {actions.length > 0 && (
        <div className="space-y-2">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#E91E8C]/10 border border-[#E91E8C]/30 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-3 h-3 bg-[#E91E8C] rounded-full animate-pulse shrink-0" />
                <span className="text-sm font-semibold text-[#E91E8C] truncate">
                  {action.name}
                </span>
                {action.notes && (
                  <span className="text-sm text-gray-500 hidden sm:inline truncate">— {action.notes}</span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => navigate(`/actions/${action.id}`)}
                  className="text-xs px-2 py-1 rounded bg-[#1B2A4A]/10 text-[#1B2A4A] hover:bg-[#1B2A4A]/20 font-medium"
                  title="Gérer l'action"
                >
                  Gérer
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => completeAction(action.id)}
                      className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 font-medium"
                      title="Marquer comme terminée"
                    >
                      Terminée
                    </button>
                    <button
                      onClick={() => cancelAction(action.id)}
                      className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 font-medium"
                      title="Annuler l'action"
                    >
                      Annuler
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Create action panel */}
        {showCreatePanel && (
          <div className="lg:w-80 shrink-0">
            <CreateActionPanel
              drawnGeometry={drawnGeometry}
              onDrawModeChange={setDrawMode}
              drawMode={drawMode}
              onCreated={handleCreated}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Map */}
        <div className="flex-1">
          <CampaignMap
            activeActions={actions}
            drawMode={drawMode}
            drawnGeometry={drawnGeometry}
            onPolygonDrawn={handlePolygonDrawn}
            onDrawCancel={handleDrawCancel}
          />
        </div>
      </div>
    </div>
  );
}
