import React from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [dark, setDark] = React.useState(document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleLogout = () => {
    ['token','display_name','user_id','user_email'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 border-b border-slate-100 dark:border-slate-700">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h2>
      <div className="flex items-center gap-3">
        <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;