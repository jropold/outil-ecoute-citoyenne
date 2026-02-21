import type { TopicCount } from '../../types/models';

interface TopConcernsProps {
  data: TopicCount[];
}

export function TopConcerns({ data }: TopConcernsProps) {
  const maxCount = data.length > 0 ? data[0].count : 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-4">Top 5 préoccupations</h3>
      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Aucune donnée</p>
        ) : (
          data.map((item, index) => (
            <div key={item.topic}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {index + 1}. {item.topic}
                </span>
                <span className="text-sm font-bold text-[#1B2A4A]">{item.count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: index === 0 ? '#E91E8C' : '#1B2A4A',
                    opacity: 1 - index * 0.15,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
