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

export default function TeamPage() {
  const demo = useDemo();
  const { profile: currentProfile } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('benevole');

  const canManage = currentProfile?.role === 'admin' || currentProfile?.role === 'coordinateur_terrain' || currentProfile?.role === 'direction_campagne';
  const isAdmin = currentProfile?.role === 'admin';

  const pendingUsers = users.filter(u => !u.is_active);
  const activeUsers = users.filter(u => u.is_active);

  const handleApprove = async (userId: string) => {
    if (demo?.isDemo) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: true } as Database['public']['Tables']['profiles']['Update'])
        .eq('id', userId);
      if (error) throw error;
      addToast('Compte validé', 'success');
      fetchUsers();
    } catch (err) {
      addToast('Erreur: ' + (err as Error).message, 'error');
    }
  };

  const handleReject = async (userId: string) => {
    if (demo?.isDemo) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      addToast('Compte refusé', 'success');
      fetchUsers();
    } catch (err) {
      addToast('Erreur: ' + (err as Error).message, 'error');
    }
  };

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

      {isAdmin && pendingUsers.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <h2 className="font-semibold text-amber-800">
            Comptes en attente ({pendingUsers.length})
          </h2>
          {pendingUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
              <div>
                <p className="font-medium text-sm text-gray-900">{u.full_name || 'Sans nom'}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="accent" onClick={() => handleApprove(u.id)}>
                  Valider
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleReject(u.id)}>
                  Refuser
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <UserList
        users={activeUsers}
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
