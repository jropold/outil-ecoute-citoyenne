import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { USER_ROLES, ROLE_LABELS } from '../../config/constants';
import type { UserRole } from '../../config/constants';

interface CreateUserFormProps {
  onCreated: () => void;
}

export function CreateUserForm({ onCreated }: CreateUserFormProps) {
  const { addToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('benevole');
  const [canCreateVisits, setCanCreateVisits] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email,
          password,
          full_name: fullName,
          role,
          can_create_visits: canCreateVisits,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      addToast('Compte créé avec succès', 'success');
      onCreated();
    } catch (err) {
      addToast('Erreur: ' + (err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom complet"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Prénom Nom"
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="utilisateur@teamjmd.re"
        required
      />
      <Input
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Minimum 6 caractères"
        required
      />
      <Select
        label="Rôle"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
        options={USER_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
      />
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          className={`relative w-11 h-6 rounded-full transition-colors ${
            canCreateVisits ? 'bg-[#1B2A4A]' : 'bg-gray-300'
          }`}
          onClick={() => setCanCreateVisits(!canCreateVisits)}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              canCreateVisits ? 'translate-x-5' : ''
            }`}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">Peut créer des visites</span>
      </label>
      <Button type="submit" variant="accent" className="w-full" loading={loading}>
        Créer le compte
      </Button>
    </form>
  );
}
