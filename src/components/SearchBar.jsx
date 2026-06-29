import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-md px-3 py-2">
      <Search size={16} className="text-slate-500 dark:text-slate-400" />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="bg-transparent focus:outline-none text-sm w-full text-slate-900 dark:text-white" />
    </div>
  );
};

export default SearchBar;