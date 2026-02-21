import { Badge } from '../ui/Badge';
import { ROLE_LABELS } from '../../config/constants';
import type { UserRole } from '../../config/constants';
import type { Profile } from '../../types/database';

const roleVariant: Record<string, 'accent' | 'info' | 'success' | 'default'> = {
  admin: 'accent',
  direction_campagne: 'accent',
  coordinateur_terrain: 'info',
  responsable_quartier: 'success',
  benevole: 'default',
};

interface UserListProps {
  users: Profile[];
  loading?: boolean;
  onSelect?: (user: Profile) => void;
}

export function UserList({ users, loading, onSelect }: UserListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="font-medium">Aucun membre</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-[#1B2A4A]/20 transition-colors cursor-pointer"
          onClick={() => onSelect?.(user)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B2A4A] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {(user.full_name || user.email).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1B2A4A] truncate">
                {user.full_name || 'Sans nom'}
              </p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={roleVariant[user.role] || 'default'}>
                {ROLE_LABELS[user.role as UserRole]}
              </Badge>
              {!user.is_active && (
                <Badge variant="danger">Inactif</Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
