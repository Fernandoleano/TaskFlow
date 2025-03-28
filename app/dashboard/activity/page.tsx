'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  CheckCircleIcon,
  RocketLaunchIcon,
  BellIcon,
  ArrowLeftIcon,
  SparklesIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ActivityHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your activity...</p>
        </div>
      </div>
    );
  }

  const activities = [
    {
      id: 1,
      action: 'completed',
      target: 'Design Homepage',
      time: '2 hours ago',
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-r from-emerald-500 to-green-500',
      textColor: 'text-emerald-500'
    },
    {
      id: 2,
      action: 'started',
      target: 'User Authentication',
      time: '3 hours ago',
      icon: RocketLaunchIcon,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      textColor: 'text-blue-500'
    },
    {
      id: 3,
      action: 'created',
      target: 'Project Setup',
      time: '4 hours ago',
      icon: SparklesIcon,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textColor: 'text-purple-500'
    },
    {
      id: 4,
      action: 'updated',
      target: 'Project Requirements',
      time: '5 hours ago',
      icon: DocumentCheckIcon,
      color: 'bg-gradient-to-r from-orange-500 to-amber-500',
      textColor: 'text-orange-500'
    },
    {
      id: 5,
      action: 'reviewed',
      target: 'Initial Designs',
      time: '6 hours ago',
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      textColor: 'text-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 hover:bg-white/50 rounded-lg transition-all duration-300 hover:shadow-md"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-transparent bg-clip-text">
              Your Activity History
            </h1>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-white transition-all duration-300 hover:shadow-md"
              >
                <div className={`p-3 rounded-xl ${activity.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <span className="text-gray-600">You</span>
                    <span className={`font-medium ${activity.textColor}`}>{activity.action}</span>
                    <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 