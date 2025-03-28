'use client';

import { User } from '@prisma/client';
import { motion } from 'framer-motion';

interface WelcomeSectionProps {
  user: User;
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm p-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user.name || 'User'}!
      </h1>
      <p className="text-gray-600">
        Here's what's happening with your tasks today.
      </p>
    </motion.div>
  );
} 