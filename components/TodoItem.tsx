
import React, { useState } from 'react';
import { Task } from '../types';
import { TrashIcon, SparklesIcon } from './Icons';
import { breakdownTask } from '../services/geminiService';

interface TodoItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtasks: (id: string, subtasks: string[]) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ task, onToggle, onDelete, onAddSubtasks }) => {
  const [isExpanding, setIsExpanding] = useState(false);

  const handleSmartExpand = async () => {
    if (task.subtasks && task.subtasks.length > 0) return;
    
    setIsExpanding(true);
    const steps = await breakdownTask(task.text);
    onAddSubtasks(task.id, steps);
    setIsExpanding(false);
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
          />
          <span className={`text-slate-700 font-medium transition-all ${task.completed ? 'line-through text-slate-400 opacity-60' : ''}`}>
            {task.text}
          </span>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!task.completed && !task.subtasks?.length && (
            <button
              onClick={handleSmartExpand}
              disabled={isExpanding}
              title="Break down with Gemini AI"
              className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <SparklesIcon />
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {isExpanding && (
        <div className="mt-3 flex items-center gap-2 text-xs text-indigo-500 font-medium animate-pulse">
          <SparklesIcon /> Gemini is thinking...
        </div>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3 pl-8 space-y-2 border-l-2 border-indigo-100 ml-2.5">
          {task.subtasks.map((sub, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
              {sub}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
