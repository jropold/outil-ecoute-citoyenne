import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useDemo } from '../contexts/DemoContext';
import { UserList } from '../components/users/UserList';
import { InviteUser } from '../components/users/InviteUser';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES, ROLE_LABELS } from '../config/constants';
import type { UserRole } from '../config/constants';
import type { Profile, Database } from '../types/database';

export function TeamPage() {
  const demo = useDemo();
  const { profile: currentProfile } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('benevole');

  const canManage = currentProfile?.role === 'admin' || currentProfile?.role === 'coordinateur_terrain' || currentProfile?.role === 'direction_campagne';

  const fetchUsers = async () => {
    if (demo?.isDemo) {
      setUsers(demo.users);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [demo?.isDemo]);

  const handleRoleUpdate = async () => {
    if (!editUser) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: editRole } as Database['public']['Tables']['profiles']['Update'])
        .eq('id', editUser.id);
      if (error) throw error;
      addToast('Rôle mis à jour', 'success');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      addToast('Erreur: ' + (err as Error).message, 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Équipe</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} membre{users.length > 1 ? 's' : ''}</p>
        </div>
        {canManage && (
          <Button variant="accent" onClick={() => setShowInvite(true)}>
            Inviter
          </Button>
        )}
      </div>

      <UserList
        users={users}
        loading={loading}
        onSelect={canManage ? (user) => { setEditUser(user); setEditRole(user.role as UserRole); } : undefined}
      />

      {/* Invite Modal */}
      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Inviter un membre">
        <InviteUser onInvited={() => { setShowInvite(false); fetchUsers(); }} />
      </Modal>

      {/* Edit Role Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Modifier le rôle">
        {editUser && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{editUser.full_name || editUser.email}</span>
            </p>
            <Select
              label="Rôle"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as UserRole)}
              options={USER_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
            />
            <Button variant="accent" className="w-full" onClick={handleRoleUpdate}>
              Enregistrer
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
