import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDailyActions } from '../hooks/useDailyActions';
import { useVisits } from '../hooks/useVisits';

interface ActionStats {
  total: number;
  sympathisants: number;
  indecis: number;
  opposants: number;
  absents: number;
  supportRate: number;
}

function ActionsPage() {
  const { allActions, loading: actionsLoading } = useDailyActions();
  const { visits, loading: visitsLoading } = useVisits();
  const navigate = useNavigate();

  const statsByAction = useMemo(() => {
    const map = new Map<string, ActionStats>();
    for (const action of allActions) {
      const actionVisits = visits.filter(v => v.action_id === action.id);
      const sympathisants = actionVisits.filter(v => v.status === 'sympathisant').length;
      const indecis = actionVisits.filter(v => v.status === 'indecis').length;
      const opposants = actionVisits.filter(v => v.status === 'opposant').length;
      const absents = actionVisits.filter(v => v.status === 'absent').length;
      const total = actionVisits.length;
      const contacted = sympathisants + indecis + opposants;
      const supportRate = contacted > 0 ? Math.round((sympathisants / contacted) * 100) : 0;
      map.set(action.id, { total, sympathisants, indecis, opposants, absents, supportRate });
    }
    return map;
  }, [allActions, visits]);

  const sortedActions = useMemo(() => {
    return [...allActions].sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return b.action_date.localeCompare(a.action_date);
    });
  }, [allActions]);

  const loading = actionsLoading || visitsLoading;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-[#1B2A4A]">Actions</h1>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#1B2A4A] border-t-transparent" />
        </div>
      ) : sortedActions.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="text-gray-400 text-5xl">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Aucune action pour le moment</p>
          <button
            onClick={() => navigate('/carte')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1B2A4A]/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Aller sur la carte
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedActions.map((action) => {
            const stats = statsByAction.get(action.id) || { total: 0, sympathisants: 0, indecis: 0, opposants: 0, absents: 0, supportRate: 0 };
            return (
              <button
                key={action.id}
                onClick={() => navigate(`/actions/${action.id}`)}
                className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-[#1B2A4A]">{action.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(action.action_date)}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      action.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {action.status === 'active' ? 'Active' : 'Terminée'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center bg-gray-50 rounded-lg py-1.5">
                    <div className="text-lg font-bold text-[#1B2A4A]">{stats.total}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Visites</div>
                  </div>
                  <div className="text-center bg-green-50 rounded-lg py-1.5">
                    <div className="text-lg font-bold text-green-600">{stats.sympathisants}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Sympa.</div>
                  </div>
                  <div className="text-center bg-yellow-50 rounded-lg py-1.5">
                    <div className="text-lg font-bold text-yellow-600">{stats.indecis}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Indécis</div>
                  </div>
                  <div className="text-center bg-red-50 rounded-lg py-1.5">
                    <div className="text-lg font-bold text-red-500">{stats.opposants}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Opposants</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg py-1.5">
                    <div className="text-lg font-bold text-gray-400">{stats.absents}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Absents</div>
                  </div>
                  <div className="text-center bg-[#E91E8C]/10 rounded-lg py-1.5">
                    <div className="text-lg font-bold text-[#E91E8C]">{stats.supportRate}%</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Soutien</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActionsPage;
