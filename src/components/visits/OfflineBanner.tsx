import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { Button } from '../ui/Button';

export function OfflineBanner() {
  const { isOnline, pendingCount, syncing, syncOfflineVisits } = useOfflineQueue();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div
      className={`rounded-lg p-3 flex items-center justify-between ${
        isOnline ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'
      }`}
    >
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-700">
              Hors ligne {pendingCount > 0 && `- ${pendingCount} visite${pendingCount > 1 ? 's' : ''} en attente`}
            </span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-sm font-medium text-amber-700">
              {pendingCount} visite{pendingCount > 1 ? 's' : ''} en attente de synchronisation
            </span>
          </>
        )}
      </div>
      {isOnline && pendingCount > 0 && (
        <Button size="sm" variant="outline" onClick={syncOfflineVisits} loading={syncing}>
          Synchroniser
        </Button>
      )}
    </div>
  );
}
