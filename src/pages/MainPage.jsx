import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImagenesPrincipales, getResumenes } from '../api/apiFunctions';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import NewsFilters from '../components/newsFilters/newsFilters';
import './MainPage.css';

const layoutMap = [
  { col: '1', row: '1' },
  { col: '2', row: '1' },
  { col: '3', row: '1' },
  { col: '1', row: '2' },
  { col: '2 / span 2', row: '2' }
];

const MainPage = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [imagesMap, setImagesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const sliderRef = useRef(null);

  // Check if any filters are active
  const isFiltering = searchTerm.trim() !== '' || selectedCategory !== '';

  useEffect(() => {
    async function loadNews() {
      try {
        const [resumenes, imagenesPrincipales] = await Promise.all([
          getResumenes(),
          getImagenesPrincipales()
        ]);

        const imageMap = {};
        imagenesPrincipales.forEach(img => {
          const match = img.key.match(/group_(\d+)_/);
          if (match) {
            imageMap[match[1]] = img.url;
          }
        });

        setNews(resumenes);
        setFilteredNews(resumenes);
        setImagesMap(imageMap);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // Filter news based on search term and category
  useEffect(() => {
    let filtered = news;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => {
        const title = parseTitleFromSummary(item.long_summary);
        return title.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredNews(filtered);
  }, [news, searchTerm, selectedCategory]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const scrollBy = (distance) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  const parseTitleFromSummary = (longSummary) => {
    const titleMatch = longSummary.match(/^Título:\s*(.+?)(?:\n|$)/i);
    if (titleMatch) return titleMatch[1].trim();
    const titleMatchAngle = longSummary.match(/^<Título>:\s*(.+?)(?:\n|$)/i);
    if (titleMatchAngle) return titleMatchAngle[1].trim();
    const titleMatchAster = longSummary.match(/\*\*Título:\*\*\s*(.+?)(?:\n|$)/i);
    if (titleMatchAster) return titleMatchAster[1].trim();
    return longSummary.substring(0, 100) + '...';
  };

  const parseLeadFromSummary = (longSummary) => {
    // Buscar diferentes patrones de entradilla
    const leadMatch1 = longSummary.match(/\*\*Entradilla:\*\*\s*(.+?)(?:\n\n|\*\*|$)/s);
    if (leadMatch1) return leadMatch1[1].trim().substring(0, 200) + '...';
    
    const leadMatch2 = longSummary.match(/Entradilla:\s*(.+?)(?:\n\n|\*\*|$)/s);
    if (leadMatch2) return leadMatch2[1].trim().substring(0, 200) + '...';
    
    const leadMatch3 = longSummary.match(/<Entradilla>:\s*(.+?)(?:\n\n|\*\*|$)/s);
    if (leadMatch3) return leadMatch3[1].trim().substring(0, 200) + '...';
    
    // Si no encuentra entradilla específica, usar el texto después del título
    const afterTitle = longSummary.replace(/^(Título:|<Título>:|\*\*Título:\*\*)\s*(.+?)(?:\n|$)/i, '').trim();
    if (afterTitle) {
      // Tomar las primeras líneas después del título
      const lines = afterTitle.split('\n').filter(line => line.trim() !== '');
      if (lines.length > 0) {
        return lines[0].substring(0, 200) + '...';
      }
    }
    
    // Fallback: usar short_summary si existe
    return longSummary.substring(0, 200) + '...';
  };

  const getImageByGroupId = (id) => {
    return imagesMap[String(id)] || '/assets/images/placeholder.jpg';
  };

  if (loading) return <LoadingSpinner message="Cargando noticias..." />;

  return (
    <>
      
      {/* Filters Component */}
      <NewsFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Show results when filtering */}
      {isFiltering && (
        <>
          {/* Results count */}
          <div className="results-info">
            <p>
              {filteredNews.length} resultado{filteredNews.length !== 1 ? 's' : ''} encontrado{filteredNews.length !== 1 ? 's' : ''}
              {searchTerm && ` para "${searchTerm}"`}
              {selectedCategory && ` en ${selectedCategory}`}
            </p>
          </div>

          {filteredNews.length > 0 ? (
            /* List View for filtered results */
            <div className="news-list">
              {filteredNews.map(item => (
                <Link 
                  key={item.group_id} 
                  to={`/grupo/${item.group_id}`} 
                  className="news-list-item"
                >
                  <img 
                    src={getImageByGroupId(item.group_id)}
                    alt={parseTitleFromSummary(item.long_summary)}
                    className="news-list-image"
                    onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
                  />
                  <div className="news-list-content">
                    <span className="news-list-category">{item.category}</span>
                    <h3 className="news-list-title">
                      {parseTitleFromSummary(item.long_summary)}
                    </h3>
                    <p className="news-list-lead">
                      {parseLeadFromSummary(item.long_summary)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* No results message */
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No se encontraron noticias</h3>
              <p>No hay noticias que coincidan con tu búsqueda</p>
              <div className="no-results-suggestions">
                <p><strong>Intenta:</strong></p>
                <ul>
                  <li>Cambiar o eliminar algunos filtros</li>
                  <li>Usar términos de búsqueda más generales</li>
                  <li>Seleccionar "Todas" las categorías</li>
                </ul>
              </div>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </>
      )}

      {/* Show default layout only when NOT filtering */}
      {!isFiltering && (
        <>
          {/* Main Grid */}
          <div className="grid-container">
            {filteredNews.slice(0, 5).map((item, i) => (
              <Link
                key={item.group_id}
                to={`/grupo/${item.group_id}`}
                className="grid-item"
                style={{
                  gridColumn: layoutMap[i].col,
                  gridRow: layoutMap[i].row,
                  backgroundImage: `url(${getImageByGroupId(item.group_id)})`
                }}
              >
                <span className="category-tag">{item.category}</span>
                <div className="overlay">
                  <h2>{parseTitleFromSummary(item.long_summary)}</h2>
                </div>
              </Link>
            ))}
          </div>

          {/* More News Slider */}
          {filteredNews.length > 5 && (
            <>
              <h2 className="slider-title">Más notícias</h2>
              <div className="slider-container">
                <button
                  className="slider-button left"
                  onClick={() => scrollBy(-600)}
                  aria-label="Scroll left"
                >
                  &lt;
                </button>
                <div className="more-news-row" ref={sliderRef}>
                  {filteredNews.slice(5).map(item => (
                    <Link
                      key={item.group_id}
                      to={`/grupo/${item.group_id}`}
                      className="more-news-item"
                    >
                      <img
                        src={getImageByGroupId(item.group_id)}
                        alt={parseTitleFromSummary(item.long_summary)}
                        onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
                      />
                      <div className="more-news-content">
                        <span className="category-tag small">{item.category}</span>
                        <h4>{parseTitleFromSummary(item.long_summary)}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
                <button
                  className="slider-button right"
                  onClick={() => scrollBy(600)}
                  aria-label="Scroll right"
                >
                  &gt;
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default MainPage;
