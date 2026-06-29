import React from 'react';
import { CheckSquare, X } from 'lucide-react';
import API from '../api';

const InviteModal = ({ inviteId, onClose }) => {
  const [status, setStatus] = React.useState('pending');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleAccept = async () => {
    setLoading(true);
    try {
      await API.put(`/invites/${inviteId}`, { status: 'accepted' });
      setStatus('accepted');
    } catch {
      setError('Failed to accept');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      await API.put(`/invites/${inviteId}`, { status: 'declined' });
      setStatus('declined');
    } catch {
      setError('Failed to decline');
    } finally {
      setLoading(false);
    }
  };

  if (status !== 'pending') {
    return (
      <div className="p-4">
        <p className="text-center">{status === 'accepted' ? 'Invitation accepted' : 'Invitation declined'}</p>
        <button onClick={onClose} className="mt-2 btn-primary w-full justify-center">
          <X size={16} /> Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {error && <p className="text-red-600">{error}</p>}
      <p className="mb-4">Do you want to join this project?</p>
      <div className="flex gap-3">
        <button onClick={handleAccept} disabled={loading} className="btn-primary flex-1 flex items-center gap-1.5">
          <CheckSquare size={16} /> Accept
        </button>
        <button onClick={handleDecline} disabled={loading} className="btn-primary bg-slate-200 hover:bg-slate-300 text-slate-800 flex-1 flex items-center gap-1.5">
          <X size={16} /> Decline
        </button>
      </div>
    </div>
  );
};

export default InviteModal;