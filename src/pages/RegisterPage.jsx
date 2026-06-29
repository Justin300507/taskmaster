import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import NotificationToast from '../components/NotificationToast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [toast, setToast] = React.useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/signup', { email, password, display_name: displayName });
      const loginRes = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', loginRes.data.access_token);
      if (loginRes.data.display_name) localStorage.setItem('display_name', loginRes.data.display_name);
      if (loginRes.data.user_id) localStorage.setItem('user_id', String(loginRes.data.user_id));
      if (loginRes.data.email) localStorage.setItem('user_email', loginRes.data.email);
      setToast({ msg: 'Account created!', type: 'success' });
      navigate('/dashboard');
    } catch {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Start your journey</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-4">
          {error && <p className="text-red-600">{error}</p>}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Display Name</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. Alex Chen" className="input" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input" />
            <p className="text-xs text-slate-400">Must be at least 8 characters</p>
          </div>
          <button type="submit" onClick={handleSubmit} disabled={loading || !email || !password || !displayName} className="btn-primary w-full justify-center">
            Sign Up
          </button>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
        </p>
        <NotificationToast toast={toast} />
      </div>
    </div>
  );
};

export default RegisterPage;