'use client';

interface Stat {
  name: string;
  value: string;
  trend: number;
}

interface OverviewStatsProps {
  stats: Stat[];
}

export default function OverviewStats({ stats }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-600">{stat.name}</h3>
          <p className="text-2xl font-semibold text-slate-800 mt-2">{stat.value}</p>
          <p className={`text-sm mt-2 ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}% from last month
          </p>
        </div>
      ))}
    </div>
  );
} 