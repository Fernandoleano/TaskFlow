'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string | null;
}

interface Board {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

export default function BoardDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: string;
  }>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
  });

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await fetch(`/api/boards/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch board');
        }
        const data = await response.json();
        setBoard(data);
      } catch (err) {
        setError('Failed to load board');
        console.error('Error fetching board:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [params.id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTask,
          boardId: params.id,
          dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create task');
      }

      const createdTask = await response.json();
      
      // Update board state with new task
      setBoard(prev => prev ? {
        ...prev,
        tasks: [...prev.tasks, createdTask]
      } : null);

      // Reset form and close modal
      setNewTask({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
      });
      setIsCreateTaskModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/tasks?id=${taskId}&title=${encodeURIComponent(taskTitle)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete task');
      }

      // Update board state by removing the deleted task
      setBoard(prev => prev ? {
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== taskId)
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string, taskTitle: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
          status: 'DONE',
          title: taskTitle
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to complete task');
      }

      const updatedTask = await response.json();
      
      // Update board state with the completed task
      setBoard(prev => prev ? {
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Board not found'}</p>
          <Link
            href="/dashboard/boards"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Boards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/boards"
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
              <p className="text-gray-600">{board.description}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Task
          </motion.button>
        </div>

        {/* Board Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TODO Column */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">To Do</h2>
            <div className="space-y-4">
              {board.tasks
                .filter(task => task.status === 'TODO')
                .map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm group relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {task.status !== 'DONE' && (
                          <button
                            onClick={() => handleCompleteTask(task.id, task.title)}
                            className="p-1 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50 transition-colors"
                            title="Complete task"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id, task.title)}
                          className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete task"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">In Progress</h2>
            <div className="space-y-4">
              {board.tasks
                .filter(task => task.status === 'IN_PROGRESS')
                .map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm group relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {task.status !== 'DONE' && (
                          <button
                            onClick={() => handleCompleteTask(task.id, task.title)}
                            className="p-1 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50 transition-colors"
                            title="Complete task"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id, task.title)}
                          className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete task"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Done</h2>
            <div className="space-y-4">
              {board.tasks
                .filter(task => task.status === 'DONE')
                .map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm group relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteTask(task.id, task.title)}
                          className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete task"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTask({ ...newTask, priority: 'LOW' })}
                    className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      newTask.priority === 'LOW'
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Low
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTask({ ...newTask, priority: 'MEDIUM' })}
                    className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      newTask.priority === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                    Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTask({ ...newTask, priority: 'HIGH' })}
                    className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      newTask.priority === 'HIGH'
                        ? 'bg-red-100 text-red-800 border-2 border-red-500'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    High
                  </button>
                </div>
                <input
                  type="hidden"
                  id="priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
} 