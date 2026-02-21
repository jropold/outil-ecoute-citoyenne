import { useState } from 'react';
import { Button } from '../ui/Button';
import type { Profile } from '../../types/database';

interface AssignGroupMemberProps {
  users: Profile[];
  existingMemberIds: string[];
  onAssign: (volunteerId: string) => Promise<void>;
  onCancel: () => void;
}

export function AssignGroupMember({ users, existingMemberIds, onAssign, onCancel }: AssignGroupMemberProps) {
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);

  const availableUsers = users.filter(
    u => u.is_active && !existingMemberIds.includes(u.id)
  );

  const handleAssign = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      await onAssign(selectedId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
      >
        <option value="">Choisir un bénévole...</option>
        {availableUsers.map(u => (
          <option key={u.id} value={u.id}>{u.full_name}</option>
        ))}
      </select>
      <Button variant="accent" size="sm" onClick={handleAssign} loading={loading} disabled={!selectedId}>
        Ajouter
      </Button>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        Annuler
      </Button>
    </div>
  );
}
