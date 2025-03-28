'use client';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import AnimatedStats from '../components/dashboard/AnimatedStats';
import ActivityHistory from '../components/dashboard/ActivityHistory';
import { 
  ChartPieIcon, 
  SparklesIcon, 
  ArrowPathIcon, 
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (!session?.user?.email) {
          redirect('/auth/signin');
          return;
        }

        const response = await fetch(`/api/users/me`);
        const userData = await response.json();
        
        if (!userData) {
          redirect('/auth/signin');
          return;
        }

        setUser(userData);

        const activitiesResponse = await fetch(`/api/activities?userId=${userData.id}&limit=5`);
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      loadData();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/signin');
    return null;
  }

  const stats = [
    {
      name: 'Total Tasks',
      value: '12',
      change: '+2',
      changeType: 'increase' as const,
      icon: ChartPieIcon,
      gradient: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Completed Tasks',
      value: '8',
      change: '+1',
      changeType: 'increase' as const,
      icon: SparklesIcon,
      gradient: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'In Progress',
      value: '3',
      change: '+1',
      changeType: 'increase' as const,
      icon: ArrowPathIcon,
      gradient: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Todo Tasks',
      value: '1',
      change: '+0',
      changeType: 'neutral' as const,
      icon: CalendarIcon,
      gradient: 'from-orange-500 to-amber-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-8">
      {user && <WelcomeSection user={user} />}
      {user && <AnimatedStats userId={user.id} />}
      {user && <ActivityHistory activities={activities} />}
    </div>
  );
} 