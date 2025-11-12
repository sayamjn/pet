import { Link } from 'react-router-dom';
import './PetCard.css';

const PetCard = ({ pet }) => {
  return (
    <Link to={`/pets/${pet._id}`} className="pet-card">
      <div className="pet-card-image">
        {pet.photoUrl ? (
          <img src={pet.photoUrl} alt={pet.name} />
        ) : (
          <div className="pet-card-placeholder">No Image</div>
        )}
      </div>
      <div className="pet-card-content">
        <h3>{pet.name}</h3>
        <p className="pet-species">{pet.species}</p>
        <p className="pet-breed">{pet.breed}</p>
        <p className="pet-age">{pet.age} years old</p>
        <span className={`pet-status ${pet.status}`}>{pet.status}</span>
      </div>
    </Link>
  );
};

export default PetCard;
