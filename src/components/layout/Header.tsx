import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { ROLE_LABELS } from '../../config/constants';
import type { UserRole } from '../../config/constants';

export function Header() {
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="md:hidden">
        <h1 className="text-lg font-bold text-[#1B2A4A]">Écoute Citoyenne</h1>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        {profile && (
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[#1B2A4A]">{profile.full_name || profile.email}</p>
            <p className="text-xs text-gray-500">{ROLE_LABELS[profile.role as UserRole]}</p>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={signOut}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Button>
      </div>
    </header>
  );
}
