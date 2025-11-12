import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ApplyButton from '../components/ApplyButton';
import './PetDetails.css';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pets/${id}`);
      if (response.data.success) {
        setPet(response.data.data.pet);
      }
    } catch (err) {
      setError('Failed to load pet details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading pet details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!pet) {
    return <div className="error">Pet not found</div>;
  }

  return (
    <div className="pet-details-page">
      <div className="pet-details-container">
        <Link to="/pets" className="back-link">
          ← Back to Pets
        </Link>
        <div className="pet-details-content">
          <div className="pet-details-image">
            {pet.photoUrl ? (
              <img src={pet.photoUrl} alt={pet.name} />
            ) : (
              <div className="pet-details-placeholder">No Image Available</div>
            )}
          </div>
          <div className="pet-details-info">
            <h1>{pet.name}</h1>
            <div className="pet-info-grid">
              <div className="info-item">
                <span className="info-label">Species:</span>
                <span className="info-value">{pet.species}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Breed:</span>
                <span className="info-value">{pet.breed}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Age:</span>
                <span className="info-value">{pet.age} years old</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`pet-status ${pet.status}`}>{pet.status}</span>
              </div>
            </div>
            <div className="pet-description">
              <h3>About {pet.name}</h3>
              <p>{pet.description}</p>
            </div>
            {user && pet.status === 'available' && (
              <ApplyButton petId={pet._id} onSuccess={() => navigate('/dashboard')} />
            )}
            {!user && pet.status === 'available' && (
              <div className="login-prompt">
                <Link to="/login" className="login-link">
                  Login to apply for adoption
                </Link>
              </div>
            )}
            {pet.status !== 'available' && (
              <div className="unavailable-message">
                This pet is currently {pet.status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
