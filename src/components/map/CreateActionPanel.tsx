import { useState } from 'react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { useDailyActions } from '../../hooks/useDailyActions';
import { useQuartiers } from '../../hooks/useQuartiers';

interface CreateActionPanelProps {
  drawnGeometry: GeoJSON.Geometry | null;
  onDrawModeChange: (enabled: boolean) => void;
  drawMode: boolean;
  onCreated: () => void;
  onCancel: () => void;
}

export function CreateActionPanel({
  drawnGeometry,
  onDrawModeChange,
  drawMode,
  onCreated,
  onCancel,
}: CreateActionPanelProps) {
  const { user } = useAuth();
  const { createAction } = useDailyActions();
  const { addToast } = useToast();
  const { quartiers } = useQuartiers();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawnGeometry || !user) {
      addToast('Veuillez dessiner la zone sur la carte', 'error');
      return;
    }
    if (!name.trim()) {
      addToast('Veuillez nommer la zone', 'error');
      return;
    }

    setLoading(true);
    try {
      await createAction({
        name: name.trim(),
        geometry: drawnGeometry,
        notes: notes.trim() || undefined,
        created_by: user.id,
      });
      addToast('Action du jour créée !', 'success');
      onCreated();
    } catch (err) {
      addToast('Erreur : ' + (err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-[#E91E8C]/30 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-[#E91E8C] rounded-full animate-pulse" />
        <h2 className="text-lg font-bold text-[#1B2A4A]">Nouvelle action du jour</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="action-zone-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la zone (= quartier)
          </label>
          <input
            id="action-zone-name"
            type="text"
            list="quartiers-list"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Centre-Ville Nord"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C] focus:border-[#E91E8C] text-sm"
            autoComplete="off"
          />
          <datalist id="quartiers-list">
            {quartiers.map((q) => (
              <option key={q.id} value={q.name} />
            ))}
          </datalist>
          <p className="text-xs text-gray-500 mt-1">
            Ce nom sera aussi utilisé comme nom de quartier pour les visites. Tapez pour chercher un quartier existant ou créez-en un nouveau.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C] focus:border-[#E91E8C] text-sm"
            placeholder="Instructions pour les bénévoles..."
          />
        </div>

        {/* Draw zone button */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zone de l'action</label>
          {!drawMode ? (
            <Button
              type="button"
              variant={drawnGeometry ? 'outline' : 'accent'}
              className="w-full"
              onClick={() => onDrawModeChange(true)}
            >
              {drawnGeometry ? 'Redessiner la zone' : 'Dessiner la zone sur la carte'}
            </Button>
          ) : (
            <div className="bg-[#E91E8C]/10 border border-[#E91E8C]/30 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-[#E91E8C] mb-1">Mode dessin actif</p>
              <p className="text-xs text-gray-500">Cliquez sur la carte pour tracer le contour de la zone, puis fermez le polygone en cliquant sur le premier point.</p>
            </div>
          )}
          {drawnGeometry && !drawMode && (
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Zone dessinée
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="accent"
            className="flex-1"
            loading={loading}
            disabled={!drawnGeometry || !name.trim()}
          >
            Créer l'action
          </Button>
        </div>
      </form>
    </div>
  );
}
