import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';
import { USER_ROLES, ROLE_LABELS } from '../../config/constants';
import type { UserRole } from '../../config/constants';

interface InviteUserProps {
  onInvited: () => void;
}

export function InviteUser({ onInvited }: InviteUserProps) {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('benevole');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non connecté');

      const { error } = await supabase.functions.invoke('invite-user', {
        body: { email, full_name: fullName, role },
      });

      if (error) throw error;
      addToast(`Invitation envoyée à ${email}`, 'success');
      setEmail('');
      setFullName('');
      setRole('benevole');
      onInvited();
    } catch (err) {
      addToast('Erreur: ' + (err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <Input
        label="Nom complet"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        placeholder="Jean Dupont"
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="email@exemple.com"
      />
      <Select
        label="Rôle"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
        options={USER_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
      />
      <Button type="submit" variant="accent" className="w-full" loading={loading}>
        Envoyer l'invitation
      </Button>
    </form>
  );
}
