import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DailyVisits } from '../../types/models';

interface DoorsKnockedChartProps {
  data: DailyVisits[];
}

export function DoorsKnockedChart({ data }: DoorsKnockedChartProps) {
  const formattedData = data.map((d) => ({
    ...d,
    date: new Date(d.visit_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-4">Évolution des visites quotidiennes</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="sympathisants" stackId="1" stroke="#22C55E" fill="#22C55E" fillOpacity={0.6} name="Sympathisants" />
            <Area type="monotone" dataKey="indecis" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Indécis" />
            <Area type="monotone" dataKey="opposants" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Opposants" />
            <Area type="monotone" dataKey="absents" stackId="1" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.6} name="Absents" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
