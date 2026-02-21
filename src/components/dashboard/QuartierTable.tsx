import { Badge } from '../ui/Badge';
import type { QuartierStats } from '../../types/models';

interface QuartierTableProps {
  data: QuartierStats[];
  title: string;
  type: 'risk' | 'favorable';
}

export function QuartierTable({ data, title, type }: QuartierTableProps) {
  const sorted = [...data]
    .filter((d) => d.total_visits > 0)
    .sort((a, b) =>
      type === 'risk' ? a.support_rate - b.support_rate : b.support_rate - a.support_rate
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-3">{title}</h3>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Aucune donnée</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Quartier</th>
                <th className="text-right py-2 text-gray-500 font-medium">Visites</th>
                <th className="text-right py-2 text-gray-500 font-medium">Soutien</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((q) => (
                <tr key={q.quartier_id} className="border-b border-gray-50">
                  <td className="py-2 font-medium text-[#1B2A4A]">{q.quartier_name}</td>
                  <td className="py-2 text-right text-gray-600">{q.total_visits}</td>
                  <td className="py-2 text-right">
                    <Badge variant={q.support_rate >= 50 ? 'success' : q.support_rate >= 30 ? 'warning' : 'danger'}>
                      {q.support_rate}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
