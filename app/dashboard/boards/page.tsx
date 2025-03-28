'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  TableCellsIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BoltIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/layout/Sidebar';
import CreateBoardModal from '../../components/boards/CreateBoardModal';
import BoardCard from '../../components/boards/BoardCard';

interface Board {
  id: string;
  title: string;
  description: string;
  viewType: 'kanban' | 'list' | 'table';
  taskCount: number;
  icon: string;
  color: string;
}

export default function BoardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([
    {
      id: '1',
      title: 'Project Planning',
      description: 'Track project milestones and deadlines',
      viewType: 'kanban',
      taskCount: 12,
      icon: 'RocketLaunchIcon',
      color: 'blue'
    },
    {
      id: '2',
      title: 'Team Tasks',
      description: 'Manage team assignments and progress',
      viewType: 'list',
      taskCount: 8,
      icon: 'UserGroupIcon',
      color: 'purple'
    },
    {
      id: '3',
      title: 'Bug Tracking',
      description: 'Track and resolve software issues',
      viewType: 'table',
      taskCount: 15,
      icon: 'BoltIcon',
      color: 'red'
    },
    {
      id: '4',
      title: 'Feature Requests',
      description: 'Manage new feature proposals',
      viewType: 'kanban',
      taskCount: 6,
      icon: 'LightBulbIcon',
      color: 'yellow'
    },
    {
      id: '5',
      title: 'Analytics Dashboard',
      description: 'Track project metrics and KPIs',
      viewType: 'table',
      taskCount: 10,
      icon: 'ChartBarIcon',
      color: 'green'
    },
    {
      id: '6',
      title: 'Sprint Planning',
      description: 'Plan and track sprint tasks',
      viewType: 'list',
      taskCount: 9,
      icon: 'CalendarIcon',
      color: 'indigo'
    },
  ]);

  const filteredBoards = boards.filter(board =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBoard = (board: { title: string; description: string; viewType: 'kanban' | 'list' | 'table' }) => {
    const newBoard: Board = {
      ...board,
      id: Date.now().toString(),
      taskCount: 0,
      icon: 'DocumentTextIcon',
      color: 'blue'
    };
    setBoards([...boards, newBoard]);
    setIsCreateModalOpen(false);
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      RocketLaunchIcon,
      UserGroupIcon,
      BoltIcon,
      LightBulbIcon,
      ChartBarIcon,
      CalendarIcon,
      DocumentTextIcon,
      ClipboardDocumentListIcon,
      ClipboardDocumentCheckIcon,
      ClipboardIcon
    };
    return icons[iconName] || DocumentTextIcon;
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
      red: { bg: 'bg-red-50', text: 'text-red-600' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
      green: { bg: 'bg-green-50', text: 'text-green-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Boards</h1>
              <p className="text-slate-600 mt-1">Manage your project boards and tasks</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Board
            </motion.button>
          </div>

          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search boards..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900"
              />
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white border-transparent'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <ViewColumnsIcon className="w-5 h-5 mr-2" />
                Grid
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white border-transparent'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <ListBulletIcon className="w-5 h-5 mr-2" />
                List
              </motion.button>
            </div>
          </div>

          {/* Boards Grid/List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
            >
              {filteredBoards.map((board) => {
                const IconComponent = getIconComponent(board.icon);
                const colorClasses = getColorClasses(board.color);
                return (
                  <BoardCard
                    key={board.id}
                    board={board}
                    onEdit={(board) => {
                      // Handle edit
                      console.log('Edit board:', board);
                    }}
                    onDelete={(boardId) => {
                      setBoards(boards.filter(b => b.id !== boardId));
                    }}
                    icon={<IconComponent className={`w-6 h-6 ${colorClasses.text}`} />}
                    colorClasses={colorClasses}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredBoards.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <SparklesIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No boards found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or create a new board</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Board
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />
    </div>
  );
} 