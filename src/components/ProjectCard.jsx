import React from 'react';
import { ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project.id}`} className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <ListTodo className="text-indigo-600" size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{project.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Owner ID: {project.owner_id}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;