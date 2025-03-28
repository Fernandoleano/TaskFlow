'use client';

import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartPieIcon,
  UsersIcon,
  CalendarIcon,
  RocketLaunchIcon,
  SparklesIcon,
  BoltIcon,
  CircleStackIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/layout/Sidebar';

// Sample data for charts
const taskCompletionData = [
  { date: 'Jan', completed: 65, total: 100 },
  { date: 'Feb', completed: 75, total: 100 },
  { date: 'Mar', completed: 85, total: 100 },
  { date: 'Apr', completed: 90, total: 100 },
  { date: 'May', completed: 95, total: 100 },
  { date: 'Jun', completed: 98, total: 100 },
];

const taskDistributionData = [
  { category: 'To Do', count: 25 },
  { category: 'In Progress', count: 45 },
  { category: 'Review', count: 20 },
  { category: 'Done', count: 60 },
];

const teamPerformanceData = [
  { member: 'John', tasks: 45, completed: 42 },
  { member: 'Sarah', tasks: 38, completed: 35 },
  { member: 'Mike', tasks: 52, completed: 48 },
  { member: 'Emma', tasks: 41, completed: 40 },
  { member: 'David', tasks: 35, completed: 32 },
];

const projectProgressData = [
  { phase: 'Planning', progress: 100 },
  { phase: 'Design', progress: 85 },
  { phase: 'Development', progress: 65 },
  { phase: 'Testing', progress: 40 },
  { phase: 'Deployment', progress: 20 },
];

const monthlyTasksData = [
  { month: 'Jan', tasks: 120 },
  { month: 'Feb', tasks: 150 },
  { month: 'Mar', tasks: 180 },
  { month: 'Apr', tasks: 200 },
  { month: 'May', tasks: 220 },
  { month: 'Jun', tasks: 250 },
];

const priorityDistributionData = [
  { priority: 'High', count: 30 },
  { priority: 'Medium', count: 45 },
  { priority: 'Low', count: 25 },
];

const teamProductivityData = [
  { member: 'John', productivity: 92 },
  { member: 'Sarah', productivity: 88 },
  { member: 'Mike', productivity: 95 },
  { member: 'Emma', productivity: 90 },
  { member: 'David', productivity: 85 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600">Track your team's performance and project progress</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-green-500 flex items-center">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  12%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">2,547</h3>
              <p className="text-slate-600">Total Tasks</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-green-500 flex items-center">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  8%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
              <p className="text-slate-600">Team Members</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-red-500 flex items-center">
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                  5%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">4.2h</h3>
              <p className="text-slate-600">Avg. Time</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-green-500 flex items-center">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  15%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">92%</h3>
              <p className="text-slate-600">Completion Rate</p>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Tasks Bar Chart */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <ChartBarSquareIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Monthly Tasks</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Last 6 months</span>
                  <SparklesIcon className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
              <div className="h-64 flex items-end space-x-2">
                {monthlyTasksData.map((data) => (
                  <div key={data.month} className="flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.tasks / 250) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-indigo-500 rounded-t-lg"
                    />
                    <div className="text-center mt-2 text-sm text-slate-600">{data.month}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Priority Distribution Pie Chart */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-50 rounded-lg">
                    <ChartPieIcon className="w-5 h-5 text-pink-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Priority Distribution</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Current</span>
                  <BoltIcon className="w-5 h-5 text-pink-500" />
                </div>
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="relative w-48 h-48">
                  {priorityDistributionData.map((data, index) => {
                    const startAngle = index === 0 ? 0 : 
                      priorityDistributionData.slice(0, index).reduce((acc, curr) => acc + (curr.count / 100) * 360, 0);
                    const endAngle = startAngle + (data.count / 100) * 360;
                    const color = index === 0 ? 'bg-red-500' : index === 1 ? 'bg-yellow-500' : 'bg-green-500';
                    
                    return (
                      <motion.div
                        key={data.priority}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`absolute inset-0 ${color} rounded-full`}
                        style={{
                          clipPath: `conic-gradient(from ${startAngle}deg, transparent ${startAngle}deg, ${color} ${endAngle}deg, transparent ${endAngle}deg)`,
                        }}
                      />
                    );
                  })}
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {priorityDistributionData.reduce((acc, curr) => acc + curr.count, 0)}
                      </div>
                      <div className="text-sm text-slate-600">Total Tasks</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Team Productivity Circle Chart */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <CircleStackIcon className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Team Productivity</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">This Month</span>
                  <RocketLaunchIcon className="w-5 h-5 text-teal-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {teamProductivityData.map((data) => (
                  <div key={data.member} className="flex items-center space-x-3">
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          className="text-slate-200"
                          strokeWidth="4"
                          stroke="currentColor"
                          fill="transparent"
                          r="28"
                          cx="32"
                          cy="32"
                        />
                        <motion.circle
                          className="text-teal-500"
                          strokeWidth="4"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="28"
                          cx="32"
                          cy="32"
                          initial={{ strokeDasharray: 0, strokeDashoffset: 0 }}
                          animate={{ 
                            strokeDasharray: 175.93,
                            strokeDashoffset: 175.93 * (1 - data.productivity / 100)
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-900">{data.productivity}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{data.member}</div>
                      <div className="text-xs text-slate-500">Productivity</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Project Progress Chart */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <ChartBarIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Project Progress</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Overall</span>
                  <SparklesIcon className="w-5 h-5 text-orange-500" />
                </div>
              </div>
              <div className="space-y-4">
                {projectProgressData.map((data) => (
                  <div key={data.phase} className="flex items-center space-x-4">
                    <div className="w-24 text-sm text-slate-600">{data.phase}</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-orange-500"
                      />
                    </div>
                    <div className="w-12 text-sm text-slate-600">{data.progress}%</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 