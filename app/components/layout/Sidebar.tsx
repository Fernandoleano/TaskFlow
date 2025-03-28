'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import {
  ViewColumnsIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronDoubleLeftIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const navigation = [
  { name: 'dashboard', href: '/dashboard', icon: ViewColumnsIcon },
  { name: 'boards', href: '/dashboard/boards', icon: ChartBarIcon },
  { name: 'analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'settings', href: '/dashboard/settings', icon: Cog6ToothIcon }
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
    <div className="flex flex-col h-screen bg-white border-r border-gray-200 relative">
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="flex flex-col h-full"
      >
        {/* Logo */}
        <div className="p-4 flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </motion.div>
          </Link>
        </div>

        {/* Collapse Button */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-6 p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            rotate: isCollapsed ? 180 : 0,
            x: isCollapsed ? 8 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDoubleLeftIcon className="w-4 h-4 text-gray-500" />
        </motion.button>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  className="font-medium"
                >
                  {translations[`nav.${item.name}`]}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-4' : 'space-x-3'}`}>
            {status === 'loading' ? (
              <div className="animate-pulse w-8 h-8 bg-gray-200 rounded-full" />
            ) : session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-gray-400 shrink-0" />
            )}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              className={`flex-1 min-w-0 ${isCollapsed ? 'hidden' : ''}`}
            >
              {status === 'loading' ? (
                <div className="space-y-2">
                  <div className="animate-pulse h-3 w-20 bg-gray-200 rounded" />
                  <div className="animate-pulse h-2 w-24 bg-gray-200 rounded" />
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email || 'user@example.com'}
                  </p>
                </>
              )}
            </motion.div>
            <motion.div 
              className={`flex ${isCollapsed ? 'flex-col space-y-3' : 'items-center space-x-2'}`}
              animate={{ 
                flexDirection: isCollapsed ? 'column' : 'row',
                marginLeft: isCollapsed ? '0' : undefined
              }}
            >
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-500"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 