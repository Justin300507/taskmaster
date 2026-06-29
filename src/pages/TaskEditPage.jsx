import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotificationToast from '../components/NotificationToast';
import TaskForm from '../components/TaskForm';

const TaskEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(null);

  const handleSuccess = () => {
    setToast({ msg: 'Task updated', type: 'success' });
    setTimeout(() => navigate(-1), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <TaskForm taskId={id} onSuccess={handleSuccess} onCancel={() => navigate(-1)} />
      <NotificationToast toast={toast} />
    </div>
  );
};

export default TaskEditPage;