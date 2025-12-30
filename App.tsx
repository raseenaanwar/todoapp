
import React, { useState, useEffect, useMemo } from 'react';
import { Task, FilterType } from './types';
import TodoItem from './components/TodoItem';
import { PlusIcon } from './components/Icons';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('gemini-todo-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini-todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addSubtasks = (id: string, subtasks: string[]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, subtasks } : t));
  };

  const clearAllTasks = () => {
    setTasks([]);
    setShowClearConfirm(false);
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active': return tasks.filter(t => !t.completed);
      case 'completed': return tasks.filter(t => t.completed);
      default: return tasks;
    }
  }, [tasks, filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [tasks]);

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 text-slate-900">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Smart Tasker
          </h1>
          <p className="text-slate-500 font-medium">Simplify your workflow with AI-powered task breakdowns.</p>
        </header>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Progress</h3>
            <p className="text-3xl font-bold text-slate-800">{stats.percent}% <span className="text-sm font-normal text-slate-500">done</span></p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
              <p className="text-xl font-bold text-indigo-600">{stats.total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase">Pending</p>
              <p className="text-xl font-bold text-amber-500">{stats.total - stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={addTask} className="relative mb-8 group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-6 pr-14 text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-sm focus:shadow-md"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            aria-label="Add task"
          >
            <PlusIcon />
          </button>
        </form>

        {/* Filters */}
        <div className="flex items-center justify-center gap-1 mb-8 p-1 bg-slate-200/50 rounded-xl w-fit mx-auto">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                filter === f 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TodoItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onAddSubtasks={addSubtasks}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400 font-medium">No tasks found. Time to relax or add a new one!</p>
            </div>
          )}
        </div>

        {tasks.length > 0 && (
          <div className="mt-12 text-center flex flex-col items-center gap-2">
            {!showClearConfirm ? (
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 uppercase tracking-widest transition-colors cursor-pointer"
              >
                Clear all tasks
              </button>
            ) : (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                <button 
                  onClick={clearAllTasks}
                  className="text-xs font-bold bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 uppercase tracking-widest transition-colors shadow-sm"
                >
                  Yes, Clear All
                </button>
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
