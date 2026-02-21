import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { APP_NAME } from '../config/constants';

export default function PendingApprovalPage() {
  const { signOut, profile } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1B2A4A] mb-2">Compte en attente</h1>
        <p className="text-gray-600 mb-1">
          Votre inscription a bien été prise en compte.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Un administrateur doit valider votre accès à <strong>{APP_NAME}</strong> avant que vous puissiez l'utiliser.
        </p>
        {profile && (
          <p className="text-xs text-gray-400 mb-6">
            Connecté en tant que {profile.email}
          </p>
        )}
        <Button variant="outline" onClick={signOut}>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
