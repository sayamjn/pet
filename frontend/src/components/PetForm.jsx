import { useState, useEffect } from 'react';
import api from '../services/api';
import './PetForm.css';

const PetForm = ({ pet, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
    photoUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        description: pet.description,
        photoUrl: pet.photoUrl || '',
      });
    }
  }, [pet]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.species.trim()) {
      newErrors.species = 'Species is required';
    }

    if (!formData.breed.trim()) {
      newErrors.breed = 'Breed is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 0) {
      newErrors.age = 'Age must be a positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError('');

      if (pet) {
        await api.put(`/pets/${pet._id}`, formData);
      } else {
        await api.post('/pets', formData);
      }

      onSuccess();
    } catch (error) {
      setApiError(error.response?.data?.error?.message || 'Failed to save pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pet-form-overlay">
      <div className="pet-form-container">
        <h3>{pet ? 'Edit Pet' : 'Add New Pet'}</h3>
        <form onSubmit={handleSubmit} className="pet-form">
          {apiError && <div className="api-error">{apiError}</div>}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="species">Species *</label>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                className={errors.species ? 'error' : ''}
              >
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Other">Other</option>
              </select>
              {errors.species && <span className="error-message">{errors.species}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="breed">Breed *</label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className={errors.breed ? 'error' : ''}
              />
              {errors.breed && <span className="error-message">{errors.breed}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="age">Age (years) *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                className={errors.age ? 'error' : ''}
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="photoUrl">Photo URL</label>
            <input
              type="url"
              id="photoUrl"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://example.com/pet-photo.jpg"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : pet ? 'Update Pet' : 'Create Pet'}
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetForm;
