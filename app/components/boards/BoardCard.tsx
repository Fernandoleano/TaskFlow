'use client';

import { motion } from 'framer-motion';
import { 
  TrashIcon, 
  PencilIcon, 
  ViewColumnsIcon, 
  ListBulletIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import BoardDetailModal from './BoardDetailModal';

interface BoardCardProps {
  board: {
    id: string;
    title: string;
    description: string;
    viewType: 'kanban' | 'list' | 'table';
    taskCount: number;
  };
  onEdit: (board: BoardCardProps['board']) => void;
  onDelete: (boardId: string) => void;
  icon: React.ReactNode;
  colorClasses: {
    bg: string;
    text: string;
  };
}

export default function BoardCard({ board, onEdit, onDelete, icon, colorClasses }: BoardCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening modal if clicking on edit or delete buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-sm p-6 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className={`p-3 ${colorClasses.bg} rounded-lg`}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-slate-900">{board.title}</h3>
            <p className="text-sm text-slate-600">{board.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">{board.taskCount} tasks</span>
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(board);
              }}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(board.id);
              }}
              className="text-slate-400 hover:text-red-600 cursor-pointer"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <BoardDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        board={board}
      />
    </>
  );
} 