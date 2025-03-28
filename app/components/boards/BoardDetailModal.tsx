'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  PlusIcon, 
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BoltIcon,
  LightBulbIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  StarIcon,
  TrophyIcon,
  BoltIcon as LightningBoltIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
}

interface BoardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: {
    id: string;
    title: string;
    description: string;
    viewType: 'kanban' | 'list' | 'table';
    taskCount: number;
  };
}

export default function BoardDetailModal({ isOpen, onClose, board }: BoardDetailModalProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    assignee: '',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    progress: 0
  });
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design Homepage',
      description: 'Create a modern and responsive homepage design',
      status: 'in-progress',
      assignee: 'John Doe',
      dueDate: '2024-04-01',
      priority: 'high',
      progress: 75
    },
    {
      id: '2',
      title: 'Implement Authentication',
      description: 'Set up user authentication system',
      status: 'todo',
      assignee: 'Jane Smith',
      dueDate: '2024-04-05',
      priority: 'high',
      progress: 0
    },
    {
      id: '3',
      title: 'Database Schema',
      description: 'Design and implement database schema',
      status: 'review',
      assignee: 'Mike Johnson',
      dueDate: '2024-04-03',
      priority: 'medium',
      progress: 90
    }
  ]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'todo',
      progress: 0
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      progress: 0
    });
    setIsAddingTask(false);
  };

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      'todo': 'bg-slate-100 text-slate-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'review': 'bg-yellow-100 text-yellow-700',
      'done': 'bg-green-100 text-green-700'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-green-100 text-green-700'
    };
    return colors[priority];
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const calculateAnalytics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
    const averageProgress = tasks.reduce((acc, task) => acc + task.progress, 0) / totalTasks;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      highPriorityTasks,
      averageProgress,
      completionRate: (completedTasks / totalTasks) * 100
    };
  };

  const analytics = calculateAnalytics();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                      <RocketLaunchIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-bold text-slate-900">
                        {board.title}
                      </Dialog.Title>
                      <p className="text-slate-600 mt-1">{board.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-500 cursor-pointer"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Total Tasks</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{analytics.totalTasks}</p>
                      </div>
                      <div className="p-2 bg-blue-200 rounded-lg">
                        <ChartPieIcon className="w-6 h-6 text-blue-700" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Completion Rate</p>
                        <p className="text-2xl font-bold text-green-900 mt-1">{analytics.completionRate.toFixed(1)}%</p>
                      </div>
                      <div className="p-2 bg-green-200 rounded-lg">
                        <TrophyIcon className="w-6 h-6 text-green-700" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">In Progress</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">{analytics.inProgressTasks}</p>
                      </div>
                      <div className="p-2 bg-purple-200 rounded-lg">
                        <ArrowTrendingUpIcon className="w-6 h-6 text-purple-700" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-700">High Priority</p>
                        <p className="text-2xl font-bold text-red-900 mt-1">{analytics.highPriorityTasks}</p>
                      </div>
                      <div className="p-2 bg-red-200 rounded-lg">
                        <FireIcon className="w-6 h-6 text-red-700" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Tasks Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Tasks</h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsAddingTask(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
                    >
                      <PlusIcon className="w-5 h-5" />
                      <span>Add Task</span>
                    </motion.button>
                  </div>

                  {/* Add Task Form */}
                  <AnimatePresence>
                    {isAddingTask && (
                      <motion.form
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onSubmit={handleAddTask}
                        className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl space-y-4 shadow-xl border border-blue-100"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label htmlFor="title" className="block text-sm font-medium text-blue-700">
                            Task Title
                          </label>
                          <input
                            type="text"
                            id="title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="mt-1 block w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-900 bg-white/80 backdrop-blur-sm"
                            required
                            placeholder="Enter task title..."
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label htmlFor="description" className="block text-sm font-medium text-purple-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            rows={3}
                            className="mt-1 block w-full rounded-lg border-purple-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-slate-900 bg-white/80 backdrop-blur-sm"
                            placeholder="Enter task description..."
                          />
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <label htmlFor="assignee" className="block text-sm font-medium text-pink-700">
                              Assignee
                            </label>
                            <input
                              type="text"
                              id="assignee"
                              value={newTask.assignee}
                              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                              className="mt-1 block w-full rounded-lg border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm text-slate-900 bg-white/80 backdrop-blur-sm"
                              placeholder="Enter assignee name..."
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <label htmlFor="dueDate" className="block text-sm font-medium text-indigo-700">
                              Due Date
                            </label>
                            <input
                              type="date"
                              id="dueDate"
                              value={newTask.dueDate}
                              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                              className="mt-1 block w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-slate-900 bg-white/80 backdrop-blur-sm"
                            />
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-end space-x-3 pt-4"
                        >
                          <button
                            type="button"
                            onClick={() => setIsAddingTask(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 cursor-pointer transition-all duration-200 hover:shadow-md"
                          >
                            Cancel
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border border-transparent rounded-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30"
                          >
                            Add Task
                          </motion.button>
                        </motion.div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Tasks List */}
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-slate-900">{task.title}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              {task.assignee && (
                                <span className="flex items-center">
                                  <UserIcon className="w-4 h-4 mr-1" />
                                  {task.assignee}
                                </span>
                              )}
                              {task.dueDate && (
                                <span className="flex items-center">
                                  <CalendarIcon className="w-4 h-4 mr-1" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{task.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${task.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${getProgressColor(task.progress)}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 