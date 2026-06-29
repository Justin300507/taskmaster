import React from 'react';
import API from '../api';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';
import NotificationToast from '../components/NotificationToast';
import { Plus } from 'lucide-react';
import ProjectForm from '../components/ProjectForm';

const ProjectListPage = () => {
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data.items || []);
    } catch {
      setToast({ msg: 'Failed to load projects', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => setShowForm(true);
  const handleSuccess = () => {
    setShowForm(false);
    fetchProjects();
    setToast({ msg: 'Project created', type: 'success' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Projects</h2>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> Add Project
        </button>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
      {loading ? (
        <div className="animate-pulse space-y-3 mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <p>No results found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {filtered.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}
      {showForm && <ProjectForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />}
      <NotificationToast toast={toast} />
    </div>
  );
};

export default ProjectListPage;