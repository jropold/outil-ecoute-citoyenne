import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import type { Profile, Sector, Database } from '../../types/database';

interface AssignVolunteerProps {
  sector: Sector;
  onAssigned: () => void;
}

export function AssignVolunteer({ sector, onAssigned }: AssignVolunteerProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [volunteers, setVolunteers] = useState<Profile[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVolunteers() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .in('role', ['benevole', 'responsable_quartier'])
        .order('full_name');
      setVolunteers(data || []);
    }
    fetchVolunteers();
  }, []);

  const handleAssign = async () => {
    if (!selectedVolunteer || !user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('sector_assignments').insert({
        sector_id: sector.id,
        volunteer_id: selectedVolunteer,
        assigned_by: user.id,
      } as Database['public']['Tables']['sector_assignments']['Insert']);
      if (error) throw error;
      addToast('Bénévole assigné avec succès', 'success');
      setSelectedVolunteer('');
      onAssigned();
    } catch (err) {
      addToast('Erreur: ' + (err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Select
          label="Assigner un bénévole"
          value={selectedVolunteer}
          onChange={(e) => setSelectedVolunteer(e.target.value)}
          options={volunteers.map((v) => ({
            value: v.id,
            label: v.full_name || v.email,
          }))}
          placeholder="Choisir un bénévole"
        />
      </div>
      <Button
        variant="accent"
        onClick={handleAssign}
        loading={loading}
        disabled={!selectedVolunteer}
      >
        Assigner
      </Button>
    </div>
  );
}
