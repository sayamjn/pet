import { Link } from 'react-router-dom';
import './ApplicationCard.css';

const ApplicationCard = ({ application }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="application-card">
      <div className="application-pet-info">
        {application.pet.photoUrl && (
          <img
            src={application.pet.photoUrl}
            alt={application.pet.name}
            className="application-pet-image"
          />
        )}
        <div className="application-details">
          <h3>
            <Link to={`/pets/${application.pet._id}`}>{application.pet.name}</Link>
          </h3>
          <p className="pet-info">
            {application.pet.species} • {application.pet.breed} • {application.pet.age} years old
          </p>
          <p className="application-date">Applied on {formatDate(application.createdAt)}</p>
        </div>
      </div>
      <div className="application-status-container">
        <span className={`application-status ${application.status}`}>
          {application.status}
        </span>
      </div>
    </div>
  );
};

export default ApplicationCard;
