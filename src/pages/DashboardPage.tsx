import { useCallback } from 'react';
import { KPICard } from '../components/dashboard/KPICard';
import { DoorsKnockedChart } from '../components/dashboard/DoorsKnockedChart';
import { SupportByQuartier } from '../components/dashboard/SupportByQuartier';
import { TopConcerns } from '../components/dashboard/TopConcerns';
import { QuartierTable } from '../components/dashboard/QuartierTable';
import { useStats } from '../hooks/useStats';
import { useRealtime } from '../hooks/useRealtime';

export function DashboardPage() {
  const { kpis, quartierStats, dailyVisits, topTopics, loading, refetch } = useStats();

  useRealtime('visits', useCallback(() => {
    refetch();
  }, [refetch]));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1B2A4A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la campagne terrain</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Portes frappées"
          value={kpis?.total_doors_knocked ?? 0}
          icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          color="#1B2A4A"
        />
        <KPICard
          title="Taux de soutien"
          value={`${kpis?.support_rate ?? 0}%`}
          subtitle="Parmi les contacts"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          color="#22C55E"
        />
        <KPICard
          title="Couverture"
          value={`${kpis?.coverage_rate ?? 0}%`}
          subtitle="Réponses aux portes"
          icon="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          color="#E91E8C"
        />
        <KPICard
          title="Ratio S/I"
          value={kpis?.sympathisant_indecis_ratio ?? 0}
          subtitle="Sympathisants / Indécis"
          icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          color="#F59E0B"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DoorsKnockedChart data={dailyVisits} />
        <SupportByQuartier data={quartierStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopConcerns data={topTopics} />
        <QuartierTable data={quartierStats} title="Quartiers favorables" type="favorable" />
        <QuartierTable data={quartierStats} title="Quartiers à risque" type="risk" />
      </div>
    </div>
  );
}
