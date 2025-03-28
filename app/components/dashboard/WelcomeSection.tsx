'use client';

import { User } from '@prisma/client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';

interface WelcomeSectionProps {
  user: User;
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  const [greeting, setGreeting] = useState('');
  const firstName = user.name?.split(' ')[0] || 'User';

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    setGreeting(getTimeBasedGreeting());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm p-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {greeting},{' '}
        <TypeAnimation
          sequence={[`${firstName}!`]}
          wrapper="span"
          speed={50}
          cursor={false}
          className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        />
      </h1>
      <p className="text-gray-600">
        Here's what's happening with your tasks today.
      </p>
    </motion.div>
  );
} 