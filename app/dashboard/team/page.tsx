'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  UserPlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/layout/Sidebar';
import AddMemberModal from '../../components/team/AddMemberModal';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  performance: number;
  tasksCompleted: number;
  tasksInProgress: number;
  lastActive: string;
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Frontend Developer',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D9488&color=fff',
      performance: 92,
      tasksCompleted: 45,
      tasksInProgress: 3,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Backend Developer',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=3B82F6&color=fff',
      performance: 88,
      tasksCompleted: 38,
      tasksInProgress: 2,
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'UI/UX Designer',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=8B5CF6&color=fff',
      performance: 95,
      tasksCompleted: 52,
      tasksInProgress: 4,
      lastActive: '3 hours ago'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      role: 'Product Manager',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=EC4899&color=fff',
      performance: 90,
      tasksCompleted: 42,
      tasksInProgress: 5,
      lastActive: '30 minutes ago'
    }
  ]);

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = (member: { name: string; role: string; email: string }) => {
    const newMember: TeamMember = {
      id: (teamMembers.length + 1).toString(),
      name: member.name,
      role: member.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff`,
      performance: Math.floor(Math.random() * 20) + 80, // Random performance between 80-100
      tasksCompleted: 0,
      tasksInProgress: 0,
      lastActive: 'Just now'
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Team</h1>
              <p className="text-slate-600 mt-1">Manage your team members and their performance</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <UserPlusIcon className="w-5 h-5" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Members</p>
                  <p className="text-2xl font-semibold text-slate-900">{teamMembers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Avg. Performance</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {Math.round(teamMembers.reduce((acc, member) => acc + member.performance, 0) / teamMembers.length)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Tasks Completed</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {teamMembers.reduce((acc, member) => acc + member.tasksCompleted, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">In Progress</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {teamMembers.reduce((acc, member) => acc + member.tasksInProgress, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-slate-900"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Team Members Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-xl shadow-sm p-6 ${
                  viewMode === 'list' ? 'flex items-center justify-between' : ''
                }`}
              >
                <div className={`flex items-center space-x-4 ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-slate-900">{member.name}</h3>
                    <p className="text-sm text-slate-600">{member.role}</p>
                  </div>
                </div>

                <div className={`space-y-4 ${viewMode === 'list' ? 'flex items-center space-x-8' : ''}`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-slate-600">Active {member.lastActive}</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-slate-600">Performance</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${member.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{member.performance}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">Tasks</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">{member.tasksCompleted}</span>
                        <span className="text-sm text-slate-400">/</span>
                        <span className="text-sm font-medium text-blue-600">{member.tasksInProgress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
} 