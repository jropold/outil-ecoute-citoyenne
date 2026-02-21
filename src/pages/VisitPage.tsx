import { useState, useCallback } from 'react';
import { VisitForm } from '../components/visits/VisitForm';
import { VisitList } from '../components/visits/VisitList';
import { VisitFilters } from '../components/visits/VisitFilters';
import { OfflineBanner } from '../components/visits/OfflineBanner';
import { useVisits } from '../hooks/useVisits';
import { useQuartiers } from '../hooks/useQuartiers';
import { useAuth } from '../hooks/useAuth';
import { useRealtime } from '../hooks/useRealtime';
import { useActiveAction } from '../hooks/useActiveAction';
import { useCampaignMembers } from '../hooks/useCampaignMembers';

export default function VisitPage() {
  const { profile } = useAuth();
  const { quartiers } = useQuartiers();
  const [showForm, setShowForm] = useState(true);
  const [filterQuartier, setFilterQuartier] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTopic, setFilterTopic] = useState('');

  const isVolunteer = profile?.role === 'benevole';
  const { visits, loading, fetchVisits } = useVisits(
    isVolunteer ? { volunteerId: profile?.id } : {}
  );

  const { action: activeAction, groupId: activeGroupId } = useActiveAction(profile?.id || null);
  const { members: campaignMembers } = useCampaignMembers();

  useRealtime('visits', useCallback(() => {
    fetchVisits();
  }, [fetchVisits]));

  const filteredVisits = visits.filter((v) => {
    if (filterQuartier && v.quartier_id !== filterQuartier) return false;
    if (filterStatus && v.status !== filterStatus) return false;
    if (filterTopic && !v.topic?.split(',').some(t => t.trim() === filterTopic)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Visites terrain</h1>
          <p className="text-gray-500 text-sm mt-1">{visits.length} visite{visits.length > 1 ? 's' : ''} enregistrée{visits.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="md:hidden bg-[#E91E8C] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
        </button>
      </div>

      <OfflineBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className={`lg:col-span-1 ${showForm ? '' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4">Nouvelle visite</h2>
            {profile?.can_create_visits ? (
              <VisitForm
                onSuccess={fetchVisits}
                activeActionId={activeAction?.id || null}
                activeGroupId={activeGroupId}
                activeActionName={activeAction?.name || null}
                activeQuartierId={activeAction?.quartier_id || null}
                activeActionGeometry={activeAction?.geometry || null}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <p className="font-medium">Pas d'autorisation</p>
                <p className="text-sm mt-1">Vous n'avez pas la permission de créer des visites. Contactez un administrateur.</p>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <VisitFilters
            quartiers={quartiers}
            selectedQuartier={filterQuartier}
            selectedStatus={filterStatus}
            selectedTopic={filterTopic}
            onQuartierChange={setFilterQuartier}
            onStatusChange={setFilterStatus}
            onTopicChange={setFilterTopic}
          />
          <div className="mt-4">
            <VisitList visits={filteredVisits} loading={loading} quartiers={quartiers} campaignMembers={campaignMembers} />
          </div>
        </div>
      </div>
    </div>
  );
}
