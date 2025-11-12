import { useState, useEffect } from 'react';
import api from '../services/api';
import ApplicationReview from './ApplicationReview';
import './ApplicationManagement.css';

const ApplicationManagement = ({ onUpdate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await api.get('/applications', { params });
      if (response.data.success) {
        setApplications(response.data.data.applications);
      }
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    await fetchApplications();
    if (onUpdate) onUpdate();
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="application-management">
      <div className="management-header">
        <h2>Application Management</h2>
        <div className="filter-group">
          <label>Filter by status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      {applications.length === 0 ? (
        <div className="no-applications">No applications found</div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <ApplicationReview
              key={application._id}
              application={application}
              onUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
