import { Badge } from '../ui/Badge';
import type { ActionGroup, ActionGroupMember, Profile } from '../../types/database';

interface ActionGroupCardProps {
  group: ActionGroup;
  members: ActionGroupMember[];
  users: Profile[];
  onAddMember?: (groupId: string) => void;
  onRemoveMember?: (memberId: string) => void;
  isAdmin?: boolean;
}

export function ActionGroupCard({ group, members, users, onAddMember, onRemoveMember, isAdmin }: ActionGroupCardProps) {
  const getUserName = (id: string | null) => {
    if (!id) return null;
    const user = users.find(u => u.id === id);
    return user?.full_name || 'Inconnu';
  };

  const groupMembers = members.filter(m => m.group_id === group.id);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-[#1B2A4A]">{group.name}</h4>
        <Badge variant="info">{groupMembers.length} membre{groupMembers.length > 1 ? 's' : ''}</Badge>
      </div>

      <div className="space-y-2 text-sm">
        {group.responsible_id && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-24 shrink-0">Responsable</span>
            <span className="font-medium text-[#1B2A4A]">{getUserName(group.responsible_id)}</span>
          </div>
        )}
        {group.note_taker_id && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-24 shrink-0">Notes</span>
            <span className="font-medium text-gray-700">{getUserName(group.note_taker_id)}</span>
          </div>
        )}
      </div>

      {groupMembers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Bénévoles</p>
          <div className="flex flex-wrap gap-1.5">
            {groupMembers.map(m => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                {getUserName(m.volunteer_id)}
                {isAdmin && onRemoveMember && (
                  <button
                    onClick={() => onRemoveMember(m.id)}
                    className="ml-0.5 text-gray-400 hover:text-red-500"
                    title="Retirer"
                  >
                    &times;
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {isAdmin && onAddMember && (
        <button
          onClick={() => onAddMember(group.id)}
          className="mt-3 text-xs text-[#E91E8C] hover:text-[#d11a7d] font-medium"
        >
          + Ajouter un bénévole
        </button>
      )}
    </div>
  );
}
