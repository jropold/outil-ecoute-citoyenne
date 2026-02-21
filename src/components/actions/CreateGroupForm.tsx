import { useState } from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import type { Profile } from '../../types/database';

interface CreateGroupFormProps {
  users: Profile[];
  onSubmit: (data: { name: string; responsible_id: string | null; note_taker_id: string | null }) => Promise<void>;
  onCancel: () => void;
}

export function CreateGroupForm({ users, onSubmit, onCancel }: CreateGroupFormProps) {
  const [name, setName] = useState('');
  const [responsibleId, setResponsibleId] = useState('');
  const [noteTakerId, setNoteTakerId] = useState('');
  const [loading, setLoading] = useState(false);

  const activeUsers = users.filter(u => u.is_active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        responsible_id: responsibleId || null,
        note_taker_id: noteTakerId || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-semibold text-[#1B2A4A]">Nouveau groupe</h4>

      <div>
        <label htmlFor="group-name" className="block text-xs font-medium text-gray-700 mb-1">Nom du groupe</label>
        <input
          id="group-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          placeholder="Ex: Équipe Delta"
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

      <Select
        label="Preneur de notes"
        value={noteTakerId}
        onChange={(e) => setNoteTakerId(e.target.value)}
        options={activeUsers.map(u => ({ value: u.id, label: u.full_name }))}
        placeholder="Sélectionner (optionnel)"
      />

      <div className="flex gap-2">
        <Button type="submit" variant="accent" size="sm" loading={loading} disabled={!name.trim()}>
          Créer
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
