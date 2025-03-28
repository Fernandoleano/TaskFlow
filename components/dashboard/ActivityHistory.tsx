'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Activity } from '@prisma/client';

interface ActivityHistoryProps {
  activities: Activity[];
}

export default function ActivityHistory({ activities }: ActivityHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">
                  {activity.type.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.description}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 