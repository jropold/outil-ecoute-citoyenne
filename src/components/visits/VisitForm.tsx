import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MapContainer, TileLayer, Marker, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { useQuartiers } from '../../hooks/useQuartiers';
import { useVisits } from '../../hooks/useVisits';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { useActionMembers } from '../../hooks/useActionMembers';
import { useCampaignMembers } from '../../hooks/useCampaignMembers';
import { saveOfflineVisit } from '../../lib/offlineStorage';
import { findQuartierByLocation } from '../../lib/geoUtils';
import { MAP_CENTER, TILE_URL, TILE_ATTRIBUTION } from '../../config/map';
import { VISIT_TOPICS, COLORS, CAMPAIGN_MEMBER_ROLES } from '../../config/constants';
import type { VisitStatus } from '../../config/constants';

const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ lat, lng, geometry }: { lat: number | null; lng: number | null; geometry?: unknown }) {
  const map = useMap();
  const hasCentered = useRef(false);
  useEffect(() => {
    if (hasCentered.current) return;
    // If we have a geometry, fit to its bounds
    if (geometry) {
      try {
        const geoLayer = L.geoJSON(geometry as GeoJSON.GeoJsonObject);
        const bounds = geoLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
          hasCentered.current = true;
          return;
        }
      } catch { /* fallthrough to GPS */ }
    }
    if (lat && lng) {
      map.setView([lat, lng], 17);
      hasCentered.current = true;
    }
  }, [lat, lng, geometry, map]);
  return null;
}

const statusOptions: { value: VisitStatus; label: string; color: string; emoji: string }[] = [
  { value: 'sympathisant', label: 'Sympathisant', color: COLORS.sympathisant, emoji: '\u{1F44D}' },
  { value: 'indecis', label: 'Indécis', color: COLORS.indecis, emoji: '\u{1F914}' },
  { value: 'opposant', label: 'Opposant', color: COLORS.opposant, emoji: '\u{1F44E}' },
  { value: 'absent', label: 'Absent', color: COLORS.absent, emoji: '\u{1F6AA}' },
];

interface VisitFormProps {
  onSuccess?: () => void;
  activeActionId?: string | null;
  activeGroupId?: string | null;
  activeActionName?: string | null;
  activeQuartierId?: string | null;
  activeActionGeometry?: unknown;
}

export function VisitForm({ onSuccess, activeActionId, activeGroupId, activeActionName, activeQuartierId, activeActionGeometry }: VisitFormProps) {
  const { user } = useAuth();
  const { quartiers } = useQuartiers(activeQuartierId ? undefined : { onlyFromActions: true });
  const { createVisit } = useVisits();
  const { isOnline, refreshCount } = useOfflineQueue();
  const { addToast } = useToast();
  const { memberDetails: actionMemberDetails, addMemberToAction } = useActionMembers(activeActionId || null);
  const { createMember: createCampaignMember } = useCampaignMembers();

  const [status, setStatus] = useState<VisitStatus | ''>('');
  const [quartierId, setQuartierId] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [needsFollowup, setNeedsFollowup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [manualMode, setManualMode] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Contact fields
  const [hasConsent, setHasConsent] = useState(false);
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [householdVoters, setHouseholdVoters] = useState('');
  const [votersNotCommunicated, setVotersNotCommunicated] = useState(true);

  // Conducted by
  const [conductedByMemberId, setConductedByMemberId] = useState<string | null>(null);
  const [showAddConductor, setShowAddConductor] = useState(false);
  const [conductorFirstName, setConductorFirstName] = useState('');
  const [conductorLastName, setConductorLastName] = useState('');
  const [conductorRole, setConductorRole] = useState('Autre');
  const [conductorCustomRole, setConductorCustomRole] = useState('');

  // Auto-select quartier from active action
  useEffect(() => {
    if (activeQuartierId) {
      setQuartierId(activeQuartierId);
    }
  }, [activeQuartierId]);

  // Auto-detect GPS location (used to pre-center the mini-map)
  const gpsAttempted = useRef(false);
  useEffect(() => {
    if (!gpsAttempted.current && 'geolocation' in navigator) {
      gpsAttempted.current = true;
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
        () => {
          setGeoLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [quartiers]);

  const handleManualLocationSelect = useCallback((lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    const detectedId = findQuartierByLocation(lat, lng, quartiers);
    if (detectedId) setQuartierId(detectedId);
  }, [quartiers]);

  const handleConductedByChange = (value: string) => {
    if (value === '__add__') {
      setShowAddConductor(true);
    } else {
      setConductedByMemberId(value || null);
    }
  };

  const handleAddConductor = async () => {
    if (!conductorFirstName.trim() || !conductorLastName.trim()) return;
    const role = conductorRole === 'Autre' && conductorCustomRole.trim() ? conductorCustomRole.trim() : conductorRole;
    try {
      const newMember = await createCampaignMember(conductorFirstName.trim(), conductorLastName.trim(), role);
      // Also add to the active action if we have one
      if (activeActionId) {
        await addMemberToAction(newMember.id);
      }
      setConductedByMemberId(newMember.id);
      setConductorFirstName('');
      setConductorLastName('');
      setConductorRole('Autre');
      setConductorCustomRole('');
      setShowAddConductor(false);
    } catch {
      addToast('Erreur lors de l\'ajout', 'error');
    }
  };

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
      topic: topics.length > 0 ? topics.join(',') : null,
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
      household_voters: status === 'sympathisant'
        ? (votersNotCommunicated ? null : (householdVoters ? parseInt(householdVoters, 10) : null))
        : null,
      action_id: activeActionId || null,
      action_group_id: activeGroupId || null,
      conducted_by_member_id: conductedByMemberId,
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
      setTopics([]);
      setComment('');
      setNeedsFollowup(false);
      setHasConsent(false);
      setContactFirstName('');
      setContactLastName('');
      setContactAddress('');
      setContactPhone('');
      setHouseholdVoters('');
      setVotersNotCommunicated(true);
      setConductedByMemberId(null);
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

      {/* GPS Status + Manual location */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {geoLoading ? (
              <span className="text-gray-500 flex items-center gap-1">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Localisation GPS...
              </span>
            ) : latitude ? (
              <span className="text-green-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                {manualMode ? 'Position manuelle' : 'GPS actif'}
              </span>
            ) : (
              <span className="text-gray-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                GPS indisponible
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setManualMode(true);
              setShowMiniMap(!showMiniMap);
            }}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              showMiniMap
                ? 'bg-[#1B2A4A] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {showMiniMap ? 'Masquer carte' : 'Placer sur carte'}
            </span>
          </button>
        </div>

        {/* Mini-map for manual location */}
        {showMiniMap && (
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5">Tapez sur la carte pour placer votre position</p>
            <div className="h-48">
              <MapContainer
                center={latitude && longitude ? [latitude, longitude] : MAP_CENTER}
                zoom={latitude && longitude ? 17 : 14}
                className="h-full w-full z-0"
                scrollWheelZoom={true}
                zoomControl={false}
              >
                <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
                <MapClickHandler onLocationSelect={handleManualLocationSelect} />
                <RecenterMap lat={latitude} lng={longitude} geometry={activeActionGeometry} />
                {activeActionGeometry ? (
                  <GeoJSON
                    key="active-zone"
                    data={activeActionGeometry as GeoJSON.GeoJsonObject}
                    style={{ color: '#E91E8C', weight: 2, fillColor: '#E91E8C', fillOpacity: 0.15 }}
                  />
                ) : null}
                {latitude && longitude && (
                  <Marker position={[latitude, longitude]} icon={pinIcon} />
                )}
              </MapContainer>
            </div>
          </div>
        )}
      </div>

      {/* Quartier selection */}
      {activeQuartierId ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
            <svg className="w-4 h-4 text-[#E91E8C]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium">{quartiers.find(q => q.id === activeQuartierId)?.name || activeActionName || 'Quartier de l\'action'}</span>
          </div>
        </div>
      ) : (
        <Select
          label="Quartier"
          value={quartierId}
          onChange={(e) => setQuartierId(e.target.value)}
          options={quartiers.map((q) => ({ value: q.id, label: q.name }))}
          placeholder="Sélectionner un quartier"
          required
        />
      )}

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

      {/* Mené par — after status selection */}
      {status && status !== 'absent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mené par</label>
          <select
            value={conductedByMemberId || ''}
            onChange={(e) => handleConductedByChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A] text-sm"
          >
            <option value="">Militant (par défaut)</option>
            {actionMemberDetails.map(m => (
              <option key={m.id} value={m.id}>{m.first_name} {m.last_name} ({m.role})</option>
            ))}
            <option value="__add__">+ Ajouter une personne...</option>
          </select>

          {/* Inline add conductor form */}
          {showAddConductor && (
            <div className="mt-2 bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={conductorFirstName}
                  onChange={(e) => setConductorFirstName(e.target.value)}
                  placeholder="Prénom"
                  className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                />
                <input
                  type="text"
                  value={conductorLastName}
                  onChange={(e) => setConductorLastName(e.target.value)}
                  placeholder="Nom"
                  className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                />
              </div>
              <select
                value={conductorRole}
                onChange={(e) => setConductorRole(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
              >
                {CAMPAIGN_MEMBER_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {conductorRole === 'Autre' && (
                <input
                  type="text"
                  value={conductorCustomRole}
                  onChange={(e) => setConductorCustomRole(e.target.value)}
                  placeholder="Préciser le rôle..."
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
                />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddConductor(false); setConductorFirstName(''); setConductorLastName(''); }}
                  className="flex-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleAddConductor}
                  disabled={!conductorFirstName.trim() || !conductorLastName.trim()}
                  className="flex-1 px-3 py-1.5 bg-[#1B2A4A] text-white rounded-lg text-sm font-medium hover:bg-[#1B2A4A]/90 disabled:opacity-50"
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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
            </div>
          )}
        </>
      )}

      {/* Household voters for sympathisants — outside consent block */}
      {status === 'sympathisant' && (
        <div className="bg-green-50 rounded-lg p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Nombre de votants dans le foyer
          </label>
          <p className="text-xs text-gray-500">Inclut la personne visitée. Si non communiqué, comptera comme 1.</p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="voters-mode"
                checked={votersNotCommunicated}
                onChange={() => { setVotersNotCommunicated(true); setHouseholdVoters(''); }}
                className="text-[#1B2A4A]"
              />
              <span className="text-sm">Non communiqué</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="voters-mode"
                checked={!votersNotCommunicated}
                onChange={() => setVotersNotCommunicated(false)}
                className="text-[#1B2A4A]"
              />
              <span className="text-sm">Indiquer un nombre</span>
            </label>
          </div>
          {!votersNotCommunicated && (
            <input
              id="household-voters"
              type="number"
              min="1"
              max="20"
              value={householdVoters}
              onChange={(e) => setHouseholdVoters(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-[#1B2A4A]"
              placeholder="Nombre de votants sympathisants"
            />
          )}
        </div>
      )}

      {/* Topic selection — multi */}
      {status && status !== 'absent' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Préoccupations (choix multiples)</label>
          <div className="flex flex-wrap gap-2">
            {VISIT_TOPICS.map((t) => {
              const selected = topics.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopics(selected ? topics.filter(x => x !== t) : [...topics, t])}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-[#1B2A4A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              );
            })}
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
