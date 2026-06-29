import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Calendar, Users, Settings } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <aside className="w-56 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col px-3 py-4 fixed h-full">
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">AppName</span>
        </div>
        <nav className="flex-1 space-y-0.5">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <ListTodo size={16} />
            Projects
          </NavLink>
          <NavLink
            to="/invites"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <Users size={16} />
            Invites
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <Settings size={16} />
            Settings
          </NavLink>
        </nav>
      </aside>
      <div className="ml-56 flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;