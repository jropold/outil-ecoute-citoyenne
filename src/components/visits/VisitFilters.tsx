import { Select } from '../ui/Select';
import { VISIT_STATUS, VISIT_TOPICS } from '../../config/constants';
import type { Quartier } from '../../types/database';

interface VisitFiltersProps {
  quartiers: Quartier[];
  selectedQuartier: string;
  selectedStatus: string;
  selectedTopic: string;
  onQuartierChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTopicChange: (value: string) => void;
}

export function VisitFilters({
  quartiers,
  selectedQuartier,
  selectedStatus,
  selectedTopic,
  onQuartierChange,
  onStatusChange,
  onTopicChange,
}: VisitFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-full sm:w-auto sm:min-w-[180px]">
        <Select
          value={selectedQuartier}
          onChange={(e) => onQuartierChange(e.target.value)}
          options={quartiers.map((q) => ({ value: q.id, label: q.name }))}
          placeholder="Tous les quartiers"
        />
      </div>
      <div className="w-full sm:w-auto sm:min-w-[150px]">
        <Select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          options={VISIT_STATUS.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          placeholder="Tous les statuts"
        />
      </div>
      <div className="w-full sm:w-auto sm:min-w-[150px]">
        <Select
          value={selectedTopic}
          onChange={(e) => onTopicChange(e.target.value)}
          options={VISIT_TOPICS.map((t) => ({ value: t, label: t }))}
          placeholder="Tous les thèmes"
        />
      </div>
    </div>
  );
}
