'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  ChartPieIcon, 
  SparklesIcon, 
  ArrowPathIcon, 
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface AnimatedStatsProps {
  userId: string;
}

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}

export default function AnimatedStats({ userId }: AnimatedStatsProps) {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/tasks/stats?userId=${userId}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, [userId]);

  const statItems = [
    {
      name: 'Total Tasks',
      value: stats.total,
      icon: ChartPieIcon,
      gradient: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Completed Tasks',
      value: stats.completed,
      icon: SparklesIcon,
      gradient: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'In Progress',
      value: stats.inProgress,
      icon: ArrowPathIcon,
      gradient: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Todo Tasks',
      value: stats.todo,
      icon: CalendarIcon,
      gradient: 'from-orange-500 to-amber-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-600">{stat.name}</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
} 