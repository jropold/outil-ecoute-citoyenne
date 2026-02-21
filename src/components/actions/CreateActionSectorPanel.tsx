import { useState } from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import type { Profile } from '../../types/database';

interface CreateActionSectorPanelProps {
  users: Profile[];
  onSubmit: (data: { name: string; geometry: unknown; responsible_id: string | null }) => Promise<void>;
  onCancel: () => void;
}

export function CreateActionSectorPanel({ users, onSubmit, onCancel }: CreateActionSectorPanelProps) {
  const [name, setName] = useState('');
  const [responsibleId, setResponsibleId] = useState('');
  const [loading, setLoading] = useState(false);

  const activeUsers = users.filter(u => u.is_active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        geometry: {},
        responsible_id: responsibleId || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-semibold text-[#1B2A4A]">Nouveau secteur</h4>

      <div>
        <label htmlFor="sector-name" className="block text-xs font-medium text-gray-700 mb-1">Nom du secteur</label>
        <input
          id="sector-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          placeholder="Ex: Secteur Est"
          required
        />
      </div>

      <Select
        label="Responsable"
        value={responsibleId}
        onChange={(e) => setResponsibleId(e.target.value)}
        options={activeUsers.map(u => ({ value: u.id, label: u.full_name }))}
        placeholder="Sélectionner (optionnel)"
      />

      <div className="flex gap-2">
        <Button type="submit" variant="accent" size="sm" loading={loading} disabled={!name.trim()}>
          Créer le secteur
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
