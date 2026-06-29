import React from 'react';
import { CheckSquare, Calendar, Clock, Target, ListTodo, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api';
import NotificationToast from '../components/NotificationToast';

const DashboardPage = () => {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/stats/summary');
        setStats(res.data);
      } catch {
        setToast({ msg: 'Failed to load stats', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = [
    { month: 'Jan', total: 840 },
    { month: 'Feb', total: 720 },
    { month: 'Mar', total: 1100 },
    { month: 'Apr', total: 890 },
    { month: 'May', total: 1240 },
    { month: 'Jun', total: 980 },
  ];

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Hello, {localStorage.getItem('display_name') || 'User'}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{today}</p>
      </header>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Projects</p>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <ListTodo size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.projects || 0}</p>
              <p className="text-xs text-indigo-600 mt-1">+{stats?.project_change || 0}% this week</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tasks</p>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <CheckSquare size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.tasks || 0}</p>
              <p className="text-xs text-indigo-600 mt-1">+{stats?.task_change || 0}% this week</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Invites</p>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.invites || 0}</p>
              <p className="text-xs text-indigo-600 mt-1">+{stats?.invite_change || 0}% this week</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Members</p>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                  <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.members || 0}</p>
              <p className="text-xs text-indigo-600 mt-1">+{stats?.member_change || 0}% this week</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      <NotificationToast toast={toast} />
    </div>
  );
};

export default DashboardPage;