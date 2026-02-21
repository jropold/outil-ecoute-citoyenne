import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { useQuartiers } from '../../hooks/useQuartiers';
import { useVisits } from '../../hooks/useVisits';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { saveOfflineVisit } from '../../lib/offlineStorage';
import { findQuartierByLocation } from '../../lib/geoUtils';
import { VISIT_TOPICS, COLORS } from '../../config/constants';
import type { VisitStatus } from '../../config/constants';

const statusOptions: { value: VisitStatus; label: string; color: string; emoji: string }[] = [
  { value: 'sympathisant', label: 'Sympathisant', color: COLORS.sympathisant, emoji: '👍' },
  { value: 'indecis', label: 'Indécis', color: COLORS.indecis, emoji: '🤔' },
  { value: 'opposant', label: 'Opposant', color: COLORS.opposant, emoji: '👎' },
  { value: 'absent', label: 'Absent', color: COLORS.absent, emoji: '🚪' },
];

interface VisitFormProps {
  onSuccess?: () => void;
  activeActionId?: string | null;
  activeGroupId?: string | null;
  activeActionName?: string | null;
}

export function VisitForm({ onSuccess, activeActionId, activeGroupId, activeActionName }: VisitFormProps) {
  const { user } = useAuth();
  const { quartiers } = useQuartiers();
  const { createVisit } = useVisits();
  const { isOnline, refreshCount } = useOfflineQueue();
  const { addToast } = useToast();

  const [status, setStatus] = useState<VisitStatus | ''>('');
  const [quartierId, setQuartierId] = useState('');
  const [topic, setTopic] = useState('');
  const [comment, setComment] = useState('');
  const [needsFollowup, setNeedsFollowup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // Contact fields
  const [hasConsent, setHasConsent] = useState(false);
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [householdVoters, setHouseholdVoters] = useState('');

  // Auto-detect GPS location
  useEffect(() => {
    if ('geolocation' in navigator) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          // Auto-detect quartier
          const detectedId = findQuartierByLocation(pos.coords.latitude, pos.coords.longitude, quartiers);
          if (detectedId) setQuartierId(detectedId);
          setGeoLoading(false);
        },
        () => setGeoLoading(false),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [quartiers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status || !quartierId || !user) return;

    setLoading(true);
    const offlineId = uuidv4();
    const visitData = {
      volunteer_id: user.id,
      sector_id: null,
      quartier_id: quartierId,
      status: status as VisitStatus,
      topic: topic || null,
      comment: comment || null,
      latitude,
      longitude,
      needs_followup: needsFollowup,
      offline_id: offlineId,
      contact_first_name: hasConsent && contactFirstName ? contactFirstName : null,
      contact_last_name: hasConsent && contactLastName ? contactLastName : null,
      contact_address: hasConsent && contactAddress ? contactAddress : null,
      contact_phone: hasConsent && contactPhone ? contactPhone : null,
      has_consent: hasConsent,
      household_voters: hasConsent && status === 'sympathisant' && householdVoters ? parseInt(householdVoters, 10) : null,
      action_id: activeActionId || null,
      action_group_id: activeGroupId || null,
    };

    try {
      if (isOnline) {
        await createVisit(visitData);
        addToast('Visite enregistrée !', 'success');
      } else {
        await saveOfflineVisit({
          ...visitData,
          offline_id: offlineId,
          created_at: new Date().toISOString(),
          synced: false,
        });
        await refreshCount();
        addToast('Visite sauvegardée hors ligne', 'warning');
      }

      // Reset form
      setStatus('');
      setTopic('');
      setComment('');
      setNeedsFollowup(false);
      setHasConsent(false);
      setContactFirstName('');
      setContactLastName('');
      setContactAddress('');
      setContactPhone('');
      setHouseholdVoters('');
      onSuccess?.();
    } catch (err) {
      // Fallback to offline
      try {
        await saveOfflineVisit({
          ...visitData,
          offline_id: offlineId,
          created_at: new Date().toISOString(),
          synced: false,
        });
        await refreshCount();
        addToast('Erreur réseau - sauvegardé hors ligne', 'warning');
      } catch {
        addToast('Erreur: ' + (err as Error).message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Active action banner */}
      {activeActionId && activeActionName && (
        <div className="flex items-center gap-2 bg-[#E91E8C]/10 border border-[#E91E8C]/30 rounded-lg px-3 py-2">
          <div className="w-2.5 h-2.5 bg-[#E91E8C] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#E91E8C]">Action en cours : {activeActionName}</span>
        </div>
      )}

      {/* GPS Status */}
      <div className="flex items-center gap-2 text-sm">
        {geoLoading ? (
          <span className="text-gray-500 flex items-center gap-1">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Localisation GPS...
          </span>
        ) : latitude ? (
          <span className="text-green-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
            GPS actif
          </span>
        ) : (
          <span className="text-gray-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
            GPS indisponible
          </span>
        )}
      </div>

      {/* Quartier selection */}
      <Select
        label="Quartier"
        value={quartierId}
        onChange={(e) => setQuartierId(e.target.value)}
        options={quartiers.map((q) => ({ value: q.id, label: q.name }))}
        placeholder="Sélectionner un quartier"
        required
      />

      {/* Status selection - big touch buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Réponse du contact</label>
        <div className="grid grid-cols-2 gap-3">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                status === opt.value
                  ? 'border-current shadow-lg scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                color: status === opt.value ? opt.color : undefined,
                backgroundColor: status === opt.value ? `${opt.color}15` : undefined,
              }}
            >
              <span className="text-2xl mb-1">{opt.emoji}</span>
              <span className="text-sm font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Consent toggle + contact fields (only if not absent) */}
      {status && status !== 'absent' && (
        <>
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  hasConsent ? 'bg-[#1B2A4A]' : 'bg-gray-300'
                }`}
                onClick={() => setHasConsent(!hasConsent)}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    hasConsent ? 'translate-x-5' : ''
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">Consentement pour enregistrer les coordonnées</span>
            </label>
          </div>

          {hasConsent && (
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="contact-first-name" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    id="contact-first-name"
                    type="text"
                    value={contactFirstName}
                    onChange={(e) => setContactFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label htmlFor="contact-last-name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    id="contact-last-name"
                    type="text"
                    value={contactLastName}
                    onChange={(e) => setContactLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                    placeholder="Nom"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-address" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  id="contact-address"
                  type="text"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                  placeholder="Adresse du foyer"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                  placeholder="+262 6XX XX XX XX"
                />
              </div>

              {/* Household voters (only for sympathisant) */}
              {status === 'sympathisant' && (
                <div>
                  <label htmlFor="household-voters" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de votants dans le foyer
                  </label>
                  <input
                    id="household-voters"
                    type="number"
                    min="1"
                    max="20"
                    value={householdVoters}
                    onChange={(e) => setHouseholdVoters(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                    placeholder="Nombre de sympathisants votants"
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Topic selection */}
      {status && status !== 'absent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Préoccupation principale</label>
          <div className="flex flex-wrap gap-2">
            {VISIT_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(topic === t ? '' : t)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  topic === t
                    ? 'bg-[#1B2A4A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Commentaire (optionnel)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
          placeholder="Note rapide..."
        />
      </div>

      {/* Follow-up toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          className={`relative w-11 h-6 rounded-full transition-colors ${
            needsFollowup ? 'bg-[#E91E8C]' : 'bg-gray-300'
          }`}
          onClick={() => setNeedsFollowup(!needsFollowup)}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              needsFollowup ? 'translate-x-5' : ''
            }`}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">Nécessite un suivi</span>
      </label>

      {/* Submit */}
      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full"
        loading={loading}
        disabled={!status || !quartierId}
      >
        {isOnline ? 'Enregistrer la visite' : 'Sauvegarder hors ligne'}
      </Button>
    </form>
  );
}
