import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { QuartierStats } from '../../types/models';

interface SupportByQuartierProps {
  data: QuartierStats[];
}

export function SupportByQuartier({ data }: SupportByQuartierProps) {
  const chartData = data
    .filter((d) => d.total_visits > 0)
    .sort((a, b) => b.total_visits - a.total_visits)
    .slice(0, 12)
    .map((d) => ({
      name: d.quartier_name.length > 15 ? d.quartier_name.slice(0, 13) + '...' : d.quartier_name,
      Sympathisants: d.sympathisants,
      Indécis: d.indecis,
      Opposants: d.opposants,
    }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-4">Soutien par quartier</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sympathisants" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Indécis" stackId="a" fill="#F59E0B" />
            <Bar dataKey="Opposants" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
