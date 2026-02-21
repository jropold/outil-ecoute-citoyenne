import { Badge } from '../ui/Badge';
import type { Sector } from '../../types/database';

const statusConfig = {
  non_couvert: { label: 'Non couvert', variant: 'danger' as const },
  partiellement_couvert: { label: 'Partiel', variant: 'warning' as const },
  couvert: { label: 'Couvert', variant: 'success' as const },
};

interface SectorListProps {
  sectors: Sector[];
  loading?: boolean;
  onSelect?: (sector: Sector) => void;
}

export function SectorList({ sectors, loading, onSelect }: SectorListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (sectors.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p className="font-medium">Aucun secteur</p>
        <p className="text-sm mt-1">Les secteurs seront affichés ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sectors.map((sector) => {
        const config = statusConfig[sector.status];
        return (
          <div
            key={sector.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-[#1B2A4A]/20 transition-colors cursor-pointer"
            onClick={() => onSelect?.(sector)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[#1B2A4A]">{sector.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {sector.estimated_doors} portes estimées
                </p>
              </div>
              <Badge variant={config.variant}>{config.label}</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
