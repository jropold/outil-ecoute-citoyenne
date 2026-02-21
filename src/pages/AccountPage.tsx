import { useState } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../hooks/useAuth';
import { useDemo } from '../contexts/DemoContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { ROLE_LABELS } from '../config/constants';
import type { UserRole } from '../config/constants';
import type { Database } from '../types/database';

export default function AccountPage() {
  const { profile, signOut } = useAuth();
  const demo = useDemo();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async () => {
    if (!profile) return;
    if (demo?.isDemo) {
      addToast('Non disponible en mode démo', 'warning');
      return;
    }
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone: phone || null } as Database['public']['Tables']['profiles']['Update'])
        .eq('id', profile.id);
      if (error) throw error;
      addToast('Profil mis à jour', 'success');
    } catch (err) {
      addToast('Erreur: ' + (err as Error).message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      addToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Le mot de passe doit faire au moins 6 caractères', 'error');
      return;
    }
    if (demo?.isDemo) {
      addToast('Non disponible en mode démo', 'warning');
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      addToast('Mot de passe modifié', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast('Erreur: ' + (err as Error).message, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#1B2A4A]">Mon compte</h1>

      {/* Profile info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-[#1B2A4A]">Informations</h2>
        <Input
          label="Nom complet"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="Email"
          value={profile.email}
          disabled
          className="bg-gray-50"
        />
        <Input
          label="Téléphone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+262 6XX XX XX XX"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
            {ROLE_LABELS[profile.role as UserRole] || profile.role}
          </div>
        </div>
        <Button variant="accent" className="w-full" onClick={handleProfileSave} loading={savingProfile}>
          Enregistrer les modifications
        </Button>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-[#1B2A4A]">Changer le mot de passe</h2>
        <Input
          label="Nouveau mot de passe"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Minimum 6 caractères"
        />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Retapez le mot de passe"
        />
        <Button
          variant="accent"
          className="w-full"
          onClick={handlePasswordChange}
          loading={savingPassword}
          disabled={!newPassword || !confirmPassword}
        >
          Modifier le mot de passe
        </Button>
      </div>

      {/* Sign out */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <Button variant="outline" className="w-full" onClick={signOut}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
