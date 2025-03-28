'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  ClipboardIcon,
  SparklesIcon,
  ChartPieIcon,
  UserIcon,
  CalendarIcon,
  RocketLaunchIcon,
  PresentationChartLineIcon,
  UserCircleIcon,
  CogIcon,
  BellAlertIcon,
  QuestionMarkCircleIcon as HelpIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    gradient: 'from-blue-500 to-indigo-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: PresentationChartLineIcon,
    gradient: 'from-purple-500 to-pink-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Boards',
    href: '/dashboard/boards',
    icon: ClipboardDocumentListIcon,
    gradient: 'from-green-500 to-emerald-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Activity',
    href: '/dashboard/activity',
    icon: BellAlertIcon,
    gradient: 'from-orange-500 to-amber-500',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    name: 'Team',
    href: '/dashboard/team',
    icon: UserGroupIcon,
    gradient: 'from-pink-500 to-rose-500',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: CogIcon,
    gradient: 'from-gray-500 to-slate-500',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { translations } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="w-72 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 shadow-sm flex flex-col">
      <div className="p-8 flex-1">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 mb-12">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg"
          >
            <RocketLaunchIcon className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
              TaskFlow
            </h1>
            <p className="text-sm text-gray-500 font-medium">Task Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? `${item.bgColor} ${item.textColor} shadow-md`
                    : 'text-gray-600 hover:bg-gray-50/80'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`p-2.5 rounded-xl ${
                    isActive
                      ? `bg-gradient-to-br ${item.gradient} shadow-sm`
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'
                    }`}
                  />
                </motion.div>
                <span className={`ml-4 font-medium text-[15px] ${
                  isActive ? item.textColor : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="p-8 border-t border-gray-100 bg-white">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-gradient-to-br from-gray-500 to-slate-500 rounded-2xl shadow-lg"
          >
            <UserCircleIcon className="w-8 h-8 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {session?.user?.name || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.email}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
} 