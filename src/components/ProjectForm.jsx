import React from 'react';
import { Plus, X } from 'lucide-react';
import API from '../api';

const ProjectForm = ({ onSuccess, initialData, onCancel }) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const isEdit = Boolean(initialData?.id);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/projects/${initialData.id}`, { name });
      } else {
        await API.post('/projects', { name });
      }
      onSuccess();
    } catch {
      setError('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Project Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q3 Marketing Campaign" className="input" />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={!name || loading} className="btn-primary flex items-center gap-1.5">
          {loading ? <X size={16} className="animate-spin" /> : <Plus size={16} />}
          {isEdit ? 'Update' : 'Create'}
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

export default ProjectForm;