import { useState, useEffect } from 'react';
import api from '../services/api';
import PetManagement from '../components/PetManagement';
import ApplicationManagement from '../components/ApplicationManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pets');
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    pendingApplications: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [petsResponse, applicationsResponse] = await Promise.all([
        api.get('/pets'),
        api.get('/applications'),
      ]);

      if (petsResponse.data.success && applicationsResponse.data.success) {
        const pets = petsResponse.data.data.pets;
        const applications = applicationsResponse.data.data.applications;

        setStats({
          totalPets: petsResponse.data.data.pagination.total,
          availablePets: pets.filter((p) => p.status === 'available').length,
          pendingApplications: applications.filter((a) => a.status === 'pending').length,
          totalApplications: applications.length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Pets</h3>
            <p className="stat-value">{stats.totalPets}</p>
          </div>
          <div className="stat-card">
            <h3>Available Pets</h3>
            <p className="stat-value">{stats.availablePets}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Applications</h3>
            <p className="stat-value">{stats.pendingApplications}</p>
          </div>
          <div className="stat-card">
            <h3>Total Applications</h3>
            <p className="stat-value">{stats.totalApplications}</p>
          </div>
        </div>
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'pets' ? 'active' : ''}`}
            onClick={() => setActiveTab('pets')}
          >
            Pet Management
          </button>
          <button
            className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Application Management
          </button>
        </div>
        <div className="tab-content">
          {activeTab === 'pets' ? (
            <PetManagement onUpdate={fetchStats} />
          ) : (
            <ApplicationManagement onUpdate={fetchStats} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
