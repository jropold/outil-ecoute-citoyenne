import { useState } from 'react';
import { ActionGroupCard } from './ActionGroupCard';
import { CreateGroupForm } from './CreateGroupForm';
import { AssignGroupMember } from './AssignGroupMember';
import { useActionGroups } from '../../hooks/useActionGroups';
import type { ActionSector, Profile } from '../../types/database';

interface ActionSectorListProps {
  sectors: ActionSector[];
  users: Profile[];
  isAdmin: boolean;
  onDeleteSector?: (sectorId: string) => void;
}

export function ActionSectorList({ sectors, users, isAdmin, onDeleteSector }: ActionSectorListProps) {
  const [expandedSector, setExpandedSector] = useState<string | null>(sectors[0]?.id || null);
  const [showCreateGroup, setShowCreateGroup] = useState<string | null>(null);
  const [assignMemberGroup, setAssignMemberGroup] = useState<string | null>(null);

  if (sectors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="font-medium">Aucun secteur défini</p>
        <p className="text-sm mt-1">Ajoutez des secteurs pour organiser les équipes</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sectors.map(sector => (
        <SectorCard
          key={sector.id}
          sector={sector}
          users={users}
          isAdmin={isAdmin}
          expanded={expandedSector === sector.id}
          onToggle={() => setExpandedSector(expandedSector === sector.id ? null : sector.id)}
          onDeleteSector={onDeleteSector}
          showCreateGroup={showCreateGroup === sector.id}
          onShowCreateGroup={() => setShowCreateGroup(showCreateGroup === sector.id ? null : sector.id)}
          assignMemberGroup={assignMemberGroup}
          onAssignMember={setAssignMemberGroup}
        />
      ))}
    </div>
  );
}

function SectorCard({
  sector,
  users,
  isAdmin,
  expanded,
  onToggle,
  onDeleteSector,
  showCreateGroup,
  onShowCreateGroup,
  assignMemberGroup,
  onAssignMember,
}: {
  sector: ActionSector;
  users: Profile[];
  isAdmin: boolean;
  expanded: boolean;
  onToggle: () => void;
  onDeleteSector?: (id: string) => void;
  showCreateGroup: boolean;
  onShowCreateGroup: () => void;
  assignMemberGroup: string | null;
  onAssignMember: (id: string | null) => void;
}) {
  const { groups, members, createGroup, addMember, removeMember } = useActionGroups(sector.id);
  const responsible = users.find(u => u.id === sector.responsible_id);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-[#1B2A4A]">{sector.name}</span>
          {responsible && (
            <span className="text-xs text-gray-500">— {responsible.full_name}</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{groups.length} groupe{groups.length > 1 ? 's' : ''}</span>
      </button>

      {/* Body */}
      {expanded && (
        <div className="p-4 space-y-3">
          {groups.map(group => (
            <div key={group.id}>
              <ActionGroupCard
                group={group}
                members={members}
                users={users}
                isAdmin={isAdmin}
                onAddMember={(gId) => onAssignMember(gId)}
                onRemoveMember={removeMember}
              />
              {assignMemberGroup === group.id && (
                <div className="mt-2">
                  <AssignGroupMember
                    users={users}
                    existingMemberIds={members.filter(m => m.group_id === group.id).map(m => m.volunteer_id)}
                    onAssign={async (volunteerId) => {
                      await addMember(group.id, volunteerId);
                      onAssignMember(null);
                    }}
                    onCancel={() => onAssignMember(null)}
                  />
                </div>
              )}
            </div>
          ))}

          {groups.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-2">Aucun groupe dans ce secteur</p>
          )}

          {isAdmin && !showCreateGroup && (
            <button
              onClick={onShowCreateGroup}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#E91E8C] hover:text-[#E91E8C] transition-colors"
            >
              + Créer un groupe
            </button>
          )}

          {showCreateGroup && (
            <CreateGroupForm
              users={users}
              onSubmit={async (data) => {
                await createGroup(data);
                onShowCreateGroup();
              }}
              onCancel={onShowCreateGroup}
            />
          )}

          {isAdmin && onDeleteSector && (
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => onDeleteSector(sector.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Supprimer ce secteur
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
