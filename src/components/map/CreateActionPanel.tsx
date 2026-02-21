import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { useDailyActions } from '../../hooks/useDailyActions';
import { useQuartiers } from '../../hooks/useQuartiers';
import { useCampaignMembers } from '../../hooks/useCampaignMembers';
import { useDemo } from '../../contexts/DemoContext';
import { supabase } from '../../config/supabase';
import { CAMPAIGN_MEMBER_ROLES } from '../../config/constants';
import type { CampaignMember } from '../../types/database';

interface CreateActionPanelProps {
  drawnGeometry: GeoJSON.Geometry | null;
  onDrawModeChange: (enabled: boolean) => void;
  drawMode: boolean;
  onCreated: () => void;
  onCancel: () => void;
}

export function CreateActionPanel({
  drawnGeometry,
  onDrawModeChange,
  drawMode,
  onCreated,
  onCancel,
}: CreateActionPanelProps) {
  const { user } = useAuth();
  const { createAction } = useDailyActions();
  const { addToast } = useToast();
  const { quartiers } = useQuartiers();
  const { members: campaignMembers, createMember } = useCampaignMembers();
  const demo = useDemo();

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Members state
  const [selectedMembers, setSelectedMembers] = useState<CampaignMember[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newRole, setNewRole] = useState('Autre');
  const [customRole, setCustomRole] = useState('');

  const filteredMembers = campaignMembers.filter(m => {
    if (selectedMembers.some(sm => sm.id === m.id)) return false;
    if (!memberSearch.trim()) return false;
    const search = memberSearch.toLowerCase();
    return `${m.first_name} ${m.last_name}`.toLowerCase().includes(search) ||
           m.role.toLowerCase().includes(search);
  });

  const addExistingMember = (member: CampaignMember) => {
    setSelectedMembers(prev => [...prev, member]);
    setMemberSearch('');
  };

  const removeMember = (memberId: string) => {
    setSelectedMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleAddNewMember = async () => {
    if (!newFirstName.trim() || !newLastName.trim()) return;
    const role = newRole === 'Autre' && customRole.trim() ? customRole.trim() : newRole;
    try {
      const member = await createMember(newFirstName.trim(), newLastName.trim(), role);
      setSelectedMembers(prev => [...prev, member]);
      setNewFirstName('');
      setNewLastName('');
      setNewRole('Autre');
      setCustomRole('');
      setShowAddForm(false);
    } catch {
      addToast('Erreur lors de l\'ajout du membre', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawnGeometry || !user) {
      addToast('Veuillez dessiner la zone sur la carte', 'error');
      return;
    }
    if (!name.trim()) {
      addToast('Veuillez nommer la zone', 'error');
      return;
    }

    setLoading(true);
    try {
      const newAction = await createAction({
        name: name.trim(),
        geometry: drawnGeometry,
        notes: notes.trim() || undefined,
        created_by: user.id,
      });

      // Create action_members junction rows
      if (newAction && selectedMembers.length > 0) {
        if (demo?.isDemo) {
          for (const member of selectedMembers) {
            demo.addActionMember?.({
              id: `am-${uuidv4()}`,
              action_id: newAction.id,
              member_id: member.id,
              created_at: new Date().toISOString(),
            });
          }
        } else {
          const rows = selectedMembers.map(m => ({
            action_id: newAction.id,
            member_id: m.id,
          }));
          await supabase.from('action_members').insert(rows);
        }
      }

      addToast('Action du jour créée !', 'success');
      onCreated();
    } catch (err) {
      addToast('Erreur : ' + (err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-[#E91E8C]/30 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-[#E91E8C] rounded-full animate-pulse" />
        <h2 className="text-lg font-bold text-[#1B2A4A]">Nouvelle action du jour</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="action-zone-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la zone (= quartier)
          </label>
          <input
            id="action-zone-name"
            type="text"
            list="quartiers-list"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Centre-Ville Nord"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C] focus:border-[#E91E8C] text-sm"
            autoComplete="off"
          />
          <datalist id="quartiers-list">
            {quartiers.map((q) => (
              <option key={q.id} value={q.name} />
            ))}
          </datalist>
          <p className="text-xs text-gray-500 mt-1">
            Ce nom sera aussi utilisé comme nom de quartier pour les visites. Tapez pour chercher un quartier existant ou créez-en un nouveau.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C] focus:border-[#E91E8C] text-sm"
            placeholder="Instructions pour les bénévoles..."
          />
        </div>

        {/* Membres de l'action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Membres de l'action</label>

          {/* Selected members chips */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedMembers.map(m => (
                <span key={m.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1B2A4A]/10 text-[#1B2A4A] rounded-full text-xs font-medium">
                  {m.first_name} {m.last_name}
                  <span className="text-gray-500">({m.role})</span>
                  <button type="button" onClick={() => removeMember(m.id)} className="ml-0.5 text-gray-400 hover:text-red-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search existing members */}
          <input
            type="text"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            placeholder="Rechercher un membre existant..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C] focus:border-[#E91E8C] text-sm"
          />

          {/* Search results */}
          {filteredMembers.length > 0 && (
            <div className="mt-1 border border-gray-200 rounded-lg bg-white shadow-sm max-h-32 overflow-y-auto">
              {filteredMembers.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => addExistingMember(m)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between items-center"
                >
                  <span>{m.first_name} {m.last_name}</span>
                  <span className="text-xs text-gray-400">{m.role}</span>
                </button>
              ))}
            </div>
          )}

          {/* Add new member button/form */}
          {!showAddForm ? (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-sm text-[#E91E8C] hover:text-[#E91E8C]/80 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une personne
            </button>
          ) : (
            <div className="mt-2 bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="Prénom"
                  className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C] focus:border-[#E91E8C]"
                />
                <input
                  type="text"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  placeholder="Nom"
                  className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C] focus:border-[#E91E8C]"
                />
              </div>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C] focus:border-[#E91E8C]"
              >
                {CAMPAIGN_MEMBER_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {newRole === 'Autre' && (
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Préciser le rôle..."
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C] focus:border-[#E91E8C]"
                />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setNewFirstName(''); setNewLastName(''); setNewRole('Autre'); setCustomRole(''); }}
                  className="flex-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleAddNewMember}
                  disabled={!newFirstName.trim() || !newLastName.trim()}
                  className="flex-1 px-3 py-1.5 bg-[#E91E8C] text-white rounded-lg text-sm font-medium hover:bg-[#E91E8C]/90 disabled:opacity-50"
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Draw zone button */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zone de l'action</label>
          {!drawMode ? (
            <Button
              type="button"
              variant={drawnGeometry ? 'outline' : 'accent'}
              className="w-full"
              onClick={() => onDrawModeChange(true)}
            >
              {drawnGeometry ? 'Redessiner la zone' : 'Dessiner la zone sur la carte'}
            </Button>
          ) : (
            <div className="bg-[#E91E8C]/10 border border-[#E91E8C]/30 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-[#E91E8C] mb-1">Mode dessin actif</p>
              <p className="text-xs text-gray-500">Cliquez sur la carte pour tracer le contour de la zone, puis fermez le polygone en cliquant sur le premier point.</p>
            </div>
          )}
          {drawnGeometry && !drawMode && (
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Zone dessinée
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="accent"
            className="flex-1"
            loading={loading}
            disabled={!drawnGeometry || !name.trim()}
          >
            Créer l'action
          </Button>
        </div>
      </form>
    </div>
  );
}
