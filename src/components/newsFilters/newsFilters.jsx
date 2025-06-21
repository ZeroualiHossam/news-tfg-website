import { useEffect, useRef, useState } from 'react';
import './newsFilters.css';

const CATEGORIES = [
  'Economía',
  'Salud',
  'Cultura',
  'Deporte',
  'Entretenimiento',
  'Política',
  'Sociedad'
];

const NewsFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setIsDropdownOpen(false);
  };

  const getCategoryDisplayName = (category) => {
    return category === '' ? 'Todas' : category;
  };

  return (
    <div className="news-filters">
      <div className="filters-container">
        {/* Search Bar and Dropdown Container */}
        <div className="search-and-dropdown-container">
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>

          {/* Category Dropdown for Mobile/Tablet */}
          <div className="category-dropdown-container" ref={dropdownRef}>
            <button
              className={`category-dropdown-btn ${isDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{getCategoryDisplayName(selectedCategory)}</span>
              <span className={`dropdown-arrow ${isDropdownOpen ? 'up' : 'down'}`}>▾</span>
            </button>
            
            {isDropdownOpen && (
              <div className="category-dropdown-menu">
                <button
                  className={`dropdown-item ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => handleCategorySelect('')}
                >
                  Todas
                </button>
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Filters for Desktop */}
        <div className="category-filters">
          <button
            className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => onCategoryChange('')}
          >
            Todas
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFilters;