import { useState } from 'react';
import api from '../services/api';
import './ApplyButton.css';

const ApplyButton = ({ petId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);

  const handleApply = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/applications', { petId });
      if (response.data.success) {
        setShowConfirm(false);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="apply-button"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        Apply for Adoption
      </button>
      {error && <div className="apply-error">{error}</div>}
      {showConfirm && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Application</h3>
            <p>Are you sure you want to apply to adopt this pet?</p>
            <div className="confirm-actions">
              <button
                className="confirm-btn"
                onClick={handleApply}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Yes, Apply'}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplyButton;
