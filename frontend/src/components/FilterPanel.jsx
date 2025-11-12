import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Species:</label>
        <select
          value={filters.species}
          onChange={(e) => handleChange('species', e.target.value)}
        >
          <option value="">All</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Breed:</label>
        <input
          type="text"
          value={filters.breed}
          onChange={(e) => handleChange('breed', e.target.value)}
          placeholder="Enter breed"
        />
      </div>
      <div className="filter-group">
        <label>Age:</label>
        <input
          type="number"
          value={filters.age}
          onChange={(e) => handleChange('age', e.target.value)}
          placeholder="Enter age"
          min="0"
        />
      </div>
      <button
        className="clear-filters"
        onClick={() => onFilterChange({ species: '', breed: '', age: '' })}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterPanel;
