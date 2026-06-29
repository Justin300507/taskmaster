import React from 'react';
import { CheckSquare, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const TaskItem = ({ task }) => {
  return (
    <Link to={`/tasks/${task.id}/edit`} className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <CheckSquare className="text-indigo-600" size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{task.title}</p>
            {task.due_date && <p className="text-xs text-slate-500 dark:text-slate-400">Due {new Date(task.due_date).toLocaleDateString()}</p>}
          </div>
        </div>
        {task.completed && <span className="badge bg-emerald-50 text-emerald-700">Done</span>}
      </div>
    </Link>
  );
};

export default TaskItem;