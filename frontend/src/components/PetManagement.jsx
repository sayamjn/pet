import { useState, useEffect } from 'react';
import api from '../services/api';
import PetForm from './PetForm';
import './PetManagement.css';

const PetManagement = ({ onUpdate }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pets?page=1&limit=100');
      if (response.data.success) {
        setPets(response.data.data.pets);
      }
    } catch (err) {
      setError('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPet(null);
    setShowForm(true);
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const handleDelete = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;

    try {
      await api.delete(`/pets/${petId}`);
      await fetchPets();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to delete pet');
    }
  };

  const handleStatusChange = async (petId, newStatus) => {
    try {
      await api.patch(`/pets/${petId}/status`, { status: newStatus });
      await fetchPets();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update status');
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingPet(null);
    await fetchPets();
    if (onUpdate) onUpdate();
  };

  if (loading) {
    return <div className="loading">Loading pets...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="pet-management">
      <div className="management-header">
        <h2>Pet Management</h2>
        <button className="create-btn" onClick={handleCreate}>
          Add New Pet
        </button>
      </div>
      {showForm && (
        <PetForm
          pet={editingPet}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingPet(null);
          }}
        />
      )}
      <div className="pets-table-container">
        <table className="pets-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet._id}>
                <td>{pet.name}</td>
                <td>{pet.species}</td>
                <td>{pet.breed}</td>
                <td>{pet.age}</td>
                <td>
                  <select
                    value={pet.status}
                    onChange={(e) => handleStatusChange(pet._id, e.target.value)}
                    className={`status-select ${pet.status}`}
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(pet)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(pet._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PetManagement;
