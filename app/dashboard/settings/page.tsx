'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  BellIcon,
  LockClosedIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  KeyIcon,
  EnvelopeIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  BellAlertIcon,
  UserGroupIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/layout/Sidebar';
import LanguageModal from '../../components/settings/LanguageModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { Switch } from '@headlessui/react';

interface SettingsItem {
  title: string;
  description: string;
  action: React.ReactNode;
}

interface SettingsSection {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  items?: SettingsItem[];
  textColor: string;
}

export default function SettingsPage() {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });

  const settingsSections: SettingsSection[] = [
    {
      title: 'Profile Settings',
      description: 'Manage your personal information and account settings',
      icon: UserIcon,
      items: [
        {
          title: 'Personal Information',
          description: 'Update your personal information',
          action: (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Edit Profile
            </motion.button>
          ),
        },
        {
          title: 'Email Preferences',
          description: 'Manage your email preferences',
          action: (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Configure
            </motion.button>
          ),
        },
      ],
      textColor: 'text-blue-600',
    },
    {
      title: 'Notifications',
      description: 'Configure your notification preferences',
      icon: BellIcon,
      items: [
        {
          title: 'Email Notifications',
          description: 'Manage email notifications',
          action: (
            <Switch
              checked={notifications.email}
              onChange={(checked) => setNotifications({ ...notifications, email: checked })}
              className={`${notifications.email ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              <span className={`${notifications.email ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md`} />
            </Switch>
          ),
        },
        {
          title: 'Push Notifications',
          description: 'Manage push notifications',
          action: (
            <Switch
              checked={notifications.push}
              onChange={(checked) => setNotifications({ ...notifications, push: checked })}
              className={`${notifications.push ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              <span className={`${notifications.push ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md`} />
            </Switch>
          ),
        },
        {
          title: 'Marketing Updates',
          description: 'Receive marketing updates',
          action: (
            <Switch
              checked={notifications.marketing}
              onChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              className={`${notifications.marketing ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              <span className={`${notifications.marketing ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md`} />
            </Switch>
          ),
        },
      ],
      textColor: 'text-green-600',
    },
    {
      title: 'Language & Region',
      description: 'Select your preferred language and regional settings',
      icon: GlobeAltIcon,
      items: [
        {
          title: 'Language',
          description: 'Choose your preferred language',
          action: (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLanguageModalOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Change Language
            </motion.button>
          ),
        },
      ],
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </motion.div>

          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Cog6ToothIcon className="w-6 h-6 text-blue-500 mr-2" />
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  <GlobeAltIcon className="w-5 h-5 mr-2" />
                  Change Language
                </motion.button>
              </div>
            </motion.div>

            {/* Settings Sections */}
            {settingsSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded-xl bg-${section.textColor.split('-')[1]}-50`}>
                      <section.icon className={`w-6 h-6 ${section.textColor}`} />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {section.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {section.items?.map((item, itemIndex) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: (index * 0.1) + (itemIndex * 0.1) }}
                        className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                        {item.action}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={setLanguage}
      />
    </div>
  );
} 