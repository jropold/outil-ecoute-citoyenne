import { useState } from 'react';
import { SectorList } from '../components/sectors/SectorList';
import { SectorDetail } from '../components/sectors/SectorDetail';
import { AssignVolunteer } from '../components/sectors/AssignVolunteer';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useQuartiers } from '../hooks/useQuartiers';
import { useSectors } from '../hooks/useSectors';
import { useAuth } from '../hooks/useAuth';
import type { Sector } from '../types/database';

export function SectorsPage() {
  const { profile } = useAuth();
  const { quartiers } = useQuartiers();
  const [selectedQuartier, setSelectedQuartier] = useState('');
  const { sectors, loading, refetch } = useSectors(selectedQuartier || undefined);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  const canManage = profile?.role === 'coordinateur_terrain' || profile?.role === 'direction_campagne';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Gestion des secteurs</h1>
        <p className="text-gray-500 text-sm mt-1">{sectors.length} secteur{sectors.length > 1 ? 's' : ''}</p>
      </div>

      <Select
        value={selectedQuartier}
        onChange={(e) => setSelectedQuartier(e.target.value)}
        options={quartiers.map((q) => ({ value: q.id, label: q.name }))}
        placeholder="Tous les quartiers"
      />

      <SectorList sectors={sectors} loading={loading} onSelect={setSelectedSector} />

      <Modal
        isOpen={!!selectedSector}
        onClose={() => setSelectedSector(null)}
        title="Détail du secteur"
        size="lg"
      >
        {selectedSector && (
          <div className="space-y-6">
            <SectorDetail sector={selectedSector} onClose={() => setSelectedSector(null)} />
            {canManage && (
              <AssignVolunteer sector={selectedSector} onAssigned={refetch} />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
