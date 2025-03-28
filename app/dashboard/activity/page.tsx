'use client';

import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  CheckCircleIcon,
  RocketLaunchIcon,
  PencilSquareIcon,
  ArrowLeftIcon,
  SparklesIcon,
  DocumentCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type Activity = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
};

const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'create':
      return { icon: SparklesIcon, color: 'from-purple-500 to-pink-500', textColor: 'text-purple-500' };
    case 'update':
      return { icon: PencilSquareIcon, color: 'from-orange-500 to-amber-500', textColor: 'text-orange-500' };
    case 'complete':
      return { icon: CheckCircleIcon, color: 'from-emerald-500 to-green-500', textColor: 'text-emerald-500' };
    case 'start':
      return { icon: RocketLaunchIcon, color: 'from-blue-500 to-indigo-500', textColor: 'text-blue-500' };
    default:
      return { icon: DocumentCheckIcon, color: 'from-cyan-500 to-blue-500', textColor: 'text-cyan-500' };
  }
};

export default function ActivityHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchActivities();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your activity history...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 hover:bg-white/50 rounded-lg transition-all duration-300 hover:shadow-md"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-transparent bg-clip-text">
              Activity History
            </h1>
          </div>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          {error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Activities</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </motion.div>
          ) : activities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <ClockIcon className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
              <p className="text-gray-600 mb-4">Start creating and completing tasks to see your activity here!</p>
              <Link
                href="/dashboard/tasks/new"
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200"
              >
                Create Your First Task
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const { icon: Icon, color, textColor } = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-white transition-all duration-300 hover:shadow-md"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 flex items-center gap-2 flex-wrap">
                          <span className="text-gray-600">You</span>
                          <span className={`font-medium ${textColor}`}>{activity.type}</span>
                          <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text">
                            {activity.description}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
} 