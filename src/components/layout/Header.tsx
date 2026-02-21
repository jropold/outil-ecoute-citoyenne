import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../config/constants';
import type { UserRole } from '../../config/constants';

export function Header() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="md:hidden">
        <h1 className="text-lg font-bold text-[#1B2A4A]">Écoute Citoyenne</h1>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        {profile && (
          <button
            onClick={() => navigate('/compte')}
            className="text-right hidden sm:block hover:opacity-80 transition-opacity cursor-pointer"
          >
            <p className="text-sm font-medium text-[#1B2A4A]">{profile.full_name || profile.email}</p>
            <p className="text-xs text-gray-500">{ROLE_LABELS[profile.role as UserRole]}</p>
          </button>
        )}
        <button
          onClick={() => navigate('/compte')}
          className="w-9 h-9 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-sm font-medium hover:bg-[#1B2A4A]/90 transition-colors"
        >
          {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
        </button>
      </div>
    </header>
  );
}
