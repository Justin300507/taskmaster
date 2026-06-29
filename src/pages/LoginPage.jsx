import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import API from '../api';
import NotificationToast from '../components/NotificationToast';

const parseError = err => {
  if (!err.response) return null;
  const detail = err.response?.data?.detail;
  if (!detail) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(', ');
  return 'Something went wrong. Please try again.';
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState('');
  const [toast, setToast] = React.useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        setStatus(attempt === 1 ? 'Signing in...' : `Retrying (${attempt}/3)...`);
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        if (res.data.display_name) localStorage.setItem('display_name', res.data.display_name);
        if (res.data.user_id) localStorage.setItem('user_id', String(res.data.user_id));
        if (res.data.email) localStorage.setItem('user_email', res.data.email);
        navigate('/dashboard');
        return;
      } catch (err) {
        const msg = parseError(err);
        if (msg) {
          setError(msg);
          setLoading(false);
          return;
        }
        if (attempt < 3) {
          setStatus(`Backend starting up... retrying in 15s (${attempt}/3)`);
          await sleep(15000);
        }
      }
    }
    setError('Backend took too long. Wait 30 seconds then try again.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-4">
          {error && <p className="text-red-600">{error}</p>}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input" />
          </div>
          {status && <p className="text-indigo-600 text-sm">{status}</p>}
          <button type="submit" onClick={handleSubmit} disabled={loading || !email || !password} className="btn-primary w-full justify-center">
            Sign In
          </button>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
        </p>
        <NotificationToast toast={toast} />
      </div>
    </div>
  );
};

export default LoginPage;