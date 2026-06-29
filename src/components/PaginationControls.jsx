import React from 'react';

const PaginationControls = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center gap-2 mt-4">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 disabled:opacity-50">
        Prev
      </button>
      <span className="text-sm text-slate-700 dark:text-slate-300">Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 disabled:opacity-50">
        Next
      </button>
    </div>
  );
};

export default PaginationControls;