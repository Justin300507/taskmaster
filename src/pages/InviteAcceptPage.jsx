import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InviteModal from '../components/InviteModal';
import NotificationToast from '../components/NotificationToast';

const InviteAcceptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(null);

  const handleClose = () => {
    setToast({ msg: 'Invitation handled', type: 'success' });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <InviteModal inviteId={id} onClose={handleClose} />
      <NotificationToast toast={toast} />
    </div>
  );
};

export default InviteAcceptPage;