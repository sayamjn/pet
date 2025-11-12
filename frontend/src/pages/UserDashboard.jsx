import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ApplicationCard from '../components/ApplicationCard';
import './UserDashboard.css';

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications/my');
      if (response.data.success) {
        setApplications(response.data.data.applications);
      }
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your applications...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <h1>My Adoption Applications</h1>
        {applications.length === 0 ? (
          <div className="empty-state">
            <p>You haven't applied for any pets yet.</p>
            <Link to="/pets" className="browse-link">
              Browse Available Pets
            </Link>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <ApplicationCard key={application._id} application={application} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
