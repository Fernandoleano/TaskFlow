'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CheckCircleIcon, 
  ClockIcon,
  RocketLaunchIcon,
  BellIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../components/layout/Sidebar';
import Link from 'next/link';

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  
  useEffect(() => {
    setDisplayText(''); // Reset display text
    setIsTypingDone(false); // Reset typing state
    
    if (!text) return;
    
    const timeouts: NodeJS.Timeout[] = [];
    
    const animateText = () => {
      const characters = text.split('');
      characters.forEach((char, index) => {
        const timeout = setTimeout(() => {
          setDisplayText(prev => {
            // Only append if we're still within the length of the target text
            if (prev.length < text.length) {
              return prev + char;
            }
            return prev;
          });
          
          // If this is the last character, set typing as done after a small delay
          if (index === characters.length - 1) {
            const finalTimeout = setTimeout(() => {
              setIsTypingDone(true);
            }, 150); // Small delay before showing exclamation
            timeouts.push(finalTimeout);
          }
        }, 100 * (index + 1));
        timeouts.push(timeout);
      });
    };
    
    animateText();
    
    // Cleanup function to clear all timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      setIsTypingDone(false);
    };
  }, [text]);

  // If animation hasn't started yet, show nothing
  if (!displayText && text) {
    return <span className="opacity-0">{text}</span>;
  }

  return (
    <>
      <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text font-bold drop-shadow-[0_0_2px_rgba(99,102,241,0.4)]">
        {displayText}
      </span>
      <span className={`transition-opacity duration-300 ${isTypingDone ? 'opacity-100' : 'opacity-0'}`}>
        !
      </span>
    </>
  );
};

interface DashboardStats {
  totalTasks: number;
  teamMembers: number;
  completionRate: number;
  averageTime: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [greeting] = useState(getTimeBasedGreeting());
  const [userName, setUserName] = useState<string>('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name) {
      const firstName = session.user.name.split(' ')[0];
      if (firstName) {
        setUserName(firstName);
      } else {
        setUserName('User');
      }
    } else {
      setUserName('User');
    }
  }, [session]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();
        setDashboardStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Tasks',
      value: dashboardStats ? dashboardStats.totalTasks.toString() : '...',
      change: '+12%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'Team Members',
      value: dashboardStats ? dashboardStats.teamMembers.toString() : '...',
      change: '+2',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      name: 'Completion Rate',
      value: dashboardStats ? `${dashboardStats.completionRate.toFixed(1)}%` : '...',
      change: '+5%',
      changeType: 'increase',
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Avg. Time',
      value: dashboardStats ? `${dashboardStats.averageTime.toFixed(1)}h` : '...',
      change: '-0.3h',
      changeType: 'decrease',
      icon: ClockIcon,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      user: session?.user?.name || 'Anonymous',
      action: 'completed',
      target: 'Design Homepage',
      time: '2 hours ago',
      icon: CheckCircleIcon,
      color: 'text-green-500'
    },
    {
      id: 2,
      user: session?.user?.name || 'Anonymous',
      action: 'started',
      target: 'User Authentication',
      time: '3 hours ago',
      icon: RocketLaunchIcon,
      color: 'text-blue-500'
    },
    {
      id: 3,
      user: session?.user?.name || 'Anonymous',
      action: 'created',
      target: 'Project Setup',
      time: '4 hours ago',
      icon: BellIcon,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <RocketLaunchIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {greeting}, <TypewriterText text={userName} />
                </h1>
                <p className="text-slate-600 mt-1">Here's what's happening with your projects today.</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 ${stat.color} rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last week</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Recent Activity</h2>
              <Link 
                href="/dashboard/activity" 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View your history
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="text-gray-600">You {activity.action}</span>{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 