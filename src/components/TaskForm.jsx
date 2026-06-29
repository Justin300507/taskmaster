import React from 'react';
import { CheckSquare, X } from 'lucide-react';
import API from '../api';

const TaskForm = ({ taskId, onSuccess, onCancel }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/tasks/${taskId}`);
        const t = res.data;
        setTitle(t.title);
        setDescription(t.description || '');
      } catch {}
    };
    fetchTask();
  }, [taskId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      await API.put(`/tasks/${taskId}`, { title, description });
      onSuccess();
    } catch {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Fix login bug" className="input" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional details" className="input" />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={!title || loading} className="btn-primary flex items-center gap-1.5">
          {loading ? <X size={16} className="animate-spin" /> : <CheckSquare size={16} />}
          Save
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-primary bg-slate-200 hover:bg-slate-300 text-slate-800">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;