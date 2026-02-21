import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ActionSectorList } from '../components/actions/ActionSectorList';
import { CreateActionSectorPanel } from '../components/actions/CreateActionSectorPanel';
import { useActionSectors } from '../hooks/useActionSectors';
import { useDailyActions } from '../hooks/useDailyActions';
import { useAuth } from '../hooks/useAuth';
import { useDemo } from '../contexts/DemoContext';

const ADMIN_ROLES = ['admin'];

export function ActionDetailPage() {
  const { actionId } = useParams<{ actionId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const demo = useDemo();
  const { actions } = useDailyActions();
  const { sectors, createSector, deleteSector } = useActionSectors(actionId || null);
  const [showCreateSector, setShowCreateSector] = useState(false);

  const isAdmin = profile ? ADMIN_ROLES.includes(profile.role) : false;

  // Find the action — in demo mode check both active actions and the full demo list
  const action = actions.find(a => a.id === actionId)
    || (demo?.isDemo ? demo.dailyActions.find(a => a.id === actionId) : null);

  const users = demo?.isDemo ? demo.users : [];

  if (!action) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Action introuvable</p>
        <Button variant="outline" onClick={() => navigate('/carte')}>Retour à la carte</Button>
      </div>
    );
  }

  const statusLabel = {
    active: { label: 'Active', variant: 'success' as const },
    completed: { label: 'Terminée', variant: 'default' as const },
    cancelled: { label: 'Annulée', variant: 'danger' as const },
  };

  const statusInfo = statusLabel[action.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/carte')}
            className="text-sm text-gray-500 hover:text-[#1B2A4A] mb-2 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la carte
          </button>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">{action.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            <span className="text-sm text-gray-500">
              {new Date(action.action_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          {action.notes && (
            <p className="text-sm text-gray-600 mt-2">{action.notes}</p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-[#1B2A4A]">{sectors.length}</p>
          <p className="text-xs text-gray-500">Secteur{sectors.length > 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-[#E91E8C]">
            {demo?.isDemo
              ? (demo.actionGroups || []).filter(g =>
                  sectors.some(s => s.id === g.action_sector_id)
                ).length
              : '—'}
          </p>
          <p className="text-xs text-gray-500">Groupe{sectors.length > 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {demo?.isDemo
              ? (demo.groupMembers || []).filter(m =>
                  (demo.actionGroups || []).some(g =>
                    g.id === m.group_id && sectors.some(s => s.id === g.action_sector_id)
                  )
                ).length
              : '—'}
          </p>
          <p className="text-xs text-gray-500">Bénévoles</p>
        </div>
      </div>

      {/* Sectors + Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1B2A4A]">Organisation</h2>
          {isAdmin && !showCreateSector && (
            <Button variant="accent" size="sm" onClick={() => setShowCreateSector(true)}>
              + Ajouter un secteur
            </Button>
          )}
        </div>

        {showCreateSector && (
          <div className="mb-4">
            <CreateActionSectorPanel
              users={users}
              onSubmit={async (data) => {
                await createSector(data);
                setShowCreateSector(false);
              }}
              onCancel={() => setShowCreateSector(false)}
            />
          </div>
        )}

        <ActionSectorList
          sectors={sectors}
          users={users}
          isAdmin={isAdmin}
          onDeleteSector={deleteSector}
        />
      </div>
    </div>
  );
}
