import { useMemo } from 'react';
import { Badge } from '../ui/Badge';
import type { Visit, Quartier, CampaignMember } from '../../types/database';

const statusConfig = {
  sympathisant: { label: 'Sympathisant', variant: 'success' as const },
  indecis: { label: 'Indécis', variant: 'warning' as const },
  opposant: { label: 'Opposant', variant: 'danger' as const },
  absent: { label: 'Absent', variant: 'default' as const },
};

interface VisitListProps {
  visits: Visit[];
  loading?: boolean;
  quartiers?: Quartier[];
  campaignMembers?: CampaignMember[];
}

export function VisitList({ visits, loading, quartiers = [], campaignMembers = [] }: VisitListProps) {
  const quartierMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const q of quartiers) map.set(q.id, q.name);
    return map;
  }, [quartiers]);

  const memberMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of campaignMembers) map.set(m.id, `${m.first_name} ${m.last_name}`);
    return map;
  }, [campaignMembers]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="font-medium">Aucune visite</p>
        <p className="text-sm mt-1">Les visites apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {visits.map((visit) => {
        const config = statusConfig[visit.status];
        const contactName = [visit.contact_first_name, visit.contact_last_name].filter(Boolean).join(' ');
        const conductorName = visit.conducted_by_member_id ? memberMap.get(visit.conducted_by_member_id) : null;
        return (
          <div key={visit.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {contactName && (
                  <p className="text-sm font-semibold text-[#1B2A4A] mb-1">{contactName}</p>
                )}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant={config.variant}>{config.label}</Badge>
                  <Badge variant="default">{quartierMap.get(visit.quartier_id) ?? visit.quartier_id}</Badge>
                  {visit.topic && visit.topic.split(',').map((t, i) => (
                    <Badge key={i} variant="info">{t.trim()}</Badge>
                  ))}
                  {visit.needs_followup && (
                    <Badge variant="accent">Suivi</Badge>
                  )}
                  {visit.action_id && (
                    <Badge variant="info">Action</Badge>
                  )}
                  {visit.household_voters && visit.household_voters > 0 && (
                    <Badge variant="default">{visit.household_voters} votant{visit.household_voters > 1 ? 's' : ''}</Badge>
                  )}
                  {conductorName && (
                    <Badge variant="default">Par {conductorName}</Badge>
                  )}
                </div>
                {visit.comment && (
                  <p className="text-sm text-gray-600 mt-1">{visit.comment}</p>
                )}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                {new Date(visit.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
