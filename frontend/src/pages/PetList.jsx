import { useState, useEffect } from 'react';
import api from '../services/api';
import PetCard from '../components/PetCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import './PetList.css';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    species: '',
    breed: '',
    age: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchPets();
  }, [search, filters, pagination.page]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        ...(search && { search }),
        ...(filters.species && { species: filters.species }),
        ...(filters.breed && { breed: filters.breed }),
        ...(filters.age && { age: filters.age }),
      };

      const response = await api.get('/pets', { params });
      if (response.data.success) {
        setPets(response.data.data.pets);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  if (loading && pets.length === 0) {
    return <div className="loading">Loading pets...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="pet-list-page">
      <div className="pet-list-container">
        <h1>Available Pets</h1>
        <SearchBar onSearch={handleSearch} />
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        {pets.length === 0 ? (
          <div className="no-pets">No pets found matching your criteria</div>
        ) : (
          <>
            <div className="pet-grid">
              {pets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PetList;
