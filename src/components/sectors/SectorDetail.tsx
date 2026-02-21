import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Sector, SectorAssignment, Profile } from '../../types/database';

const statusConfig = {
  non_couvert: { label: 'Non couvert', variant: 'danger' as const },
  partiellement_couvert: { label: 'Partiel', variant: 'warning' as const },
  couvert: { label: 'Couvert', variant: 'success' as const },
};

interface SectorDetailProps {
  sector: Sector;
  onClose: () => void;
}

export function SectorDetail({ sector, onClose }: SectorDetailProps) {
  const [assignments, setAssignments] = useState<(SectorAssignment & { volunteer?: Profile })[]>([]);
  const [visitCount, setVisitCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      const [assignRes, visitRes] = await Promise.all([
        supabase
          .from('sector_assignments')
          .select('*, volunteer:profiles!sector_assignments_volunteer_id_fkey(*)')
          .eq('sector_id', sector.id),
        supabase
          .from('visits')
          .select('id', { count: 'exact' })
          .eq('sector_id', sector.id),
      ]);

      setAssignments((assignRes.data as unknown as (SectorAssignment & { volunteer?: Profile })[]) || []);
      setVisitCount(visitRes.count || 0);
      setLoading(false);
    }
    fetchDetails();
  }, [sector.id]);

  const config = statusConfig[sector.status];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1B2A4A]">{sector.name}</h2>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Fermer
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-[#1B2A4A]">{sector.estimated_doors}</p>
          <p className="text-xs text-gray-500">Portes estimées</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-[#E91E8C]">{visitCount}</p>
          <p className="text-xs text-gray-500">Visites réalisées</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#1B2A4A] mb-2">
          Bénévoles assignés ({assignments.length})
        </h3>
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-gray-200 rounded" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun bénévole assigné</p>
        ) : (
          <div className="space-y-2">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-[#1B2A4A]">
                    {a.volunteer?.full_name || a.volunteer?.email || 'Inconnu'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Depuis le {new Date(a.assigned_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
