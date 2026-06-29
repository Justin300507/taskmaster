import React from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import TaskItem from '../components/TaskItem';
import NotificationToast from '../components/NotificationToast';
import { Plus } from 'lucide-react';
import TaskForm from '../components/TaskForm';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const fetchData = async () => {
    try {
      const projRes = await API.get(`/projects/${id}`);
      setProject(projRes.data);
      const tasksRes = await API.get('/tasks', { params: { project_id: id } });
      setTasks(tasksRes.data.items || []);
    } catch {
      setToast({ msg: 'Failed to load project', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddTask = () => setShowTaskForm(true);
  const handleTaskSuccess = () => {
    setShowTaskForm(false);
    fetchData();
    setToast({ msg: 'Task added', type: 'success' });
  };

  const filteredTasks = tasks;

  return (
    <div>
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{project?.name}</h2>
            <button onClick={handleAddTask} className="btn-primary flex items-center gap-1.5">
              <Plus size={16} /> New Task
            </button>
          </div>
          {filteredTasks.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">No tasks found</p>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}
        </>
      )}
      {showTaskForm && <TaskForm taskId={null} onSuccess={handleTaskSuccess} onCancel={() => setShowTaskForm(false)} />}
      <NotificationToast toast={toast} />
    </div>
  );
};

export default ProjectDetailPage;