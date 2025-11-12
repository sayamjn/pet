import { useState } from 'react';
import api from '../services/api';
import './ApplicationReview.css';

const ApplicationReview = ({ application, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAction = (action) => {
    setActionType(action);
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    try {
      setLoading(true);
      await api.patch(`/applications/${application._id}/status`, {
        status: actionType,
      });
      setShowConfirm(false);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="application-review-card">
        <div className="review-content">
          <div className="applicant-info">
            <h4>Applicant Information</h4>
            <p>
              <strong>Name:</strong> {application.user.name}
            </p>
            <p>
              <strong>Email:</strong> {application.user.email}
            </p>
            <p>
              <strong>Applied:</strong> {formatDate(application.createdAt)}
            </p>
          </div>
          <div className="pet-info">
            <h4>Pet Information</h4>
            {application.pet.photoUrl && (
              <img
                src={application.pet.photoUrl}
                alt={application.pet.name}
                className="review-pet-image"
              />
            )}
            <p>
              <strong>Name:</strong> {application.pet.name}
            </p>
            <p>
              <strong>Species:</strong> {application.pet.species}
            </p>
            <p>
              <strong>Breed:</strong> {application.pet.breed}
            </p>
            <p>
              <strong>Age:</strong> {application.pet.age} years
            </p>
          </div>
          <div className="status-info">
            <h4>Status</h4>
            <span className={`review-status ${application.status}`}>
              {application.status}
            </span>
          </div>
        </div>
        {application.status === 'pending' && (
          <div className="review-actions">
            <button
              className="approve-btn"
              onClick={() => handleAction('approved')}
              disabled={loading}
            >
              Approve
            </button>
            <button
              className="reject-btn"
              onClick={() => handleAction('rejected')}
              disabled={loading}
            >
              Reject
            </button>
          </div>
        )}
      </div>
      {showConfirm && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to {actionType} this application for {application.pet.name}?
            </p>
            <div className="confirm-actions">
              <button className="confirm-btn" onClick={confirmAction} disabled={loading}>
                {loading ? 'Processing...' : 'Yes, Confirm'}
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

export default ApplicationReview;
