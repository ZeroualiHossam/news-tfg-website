import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImagenesPrincipales, getResumenes } from '../api/apiFunctions';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
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
  const [imagesMap, setImagesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

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
        setImagesMap(imageMap);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

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
    const leadMatch = longSummary.match(/\*\*Entradilla:\*\*\s*(.+?)(?:\n\n|\*\*)/s);
    return leadMatch ? leadMatch[1].trim().substring(0, 150) + '...' : '';
  };

  const getImageByGroupId = (id) => {
    return imagesMap[String(id)] || '/assets/images/placeholder.jpg';
  };

  if (loading) return <LoadingSpinner message="Cargando noticias..." />;

  return (
    <>
      <h1 className="grid-title">Latest News</h1>

      <div className="grid-container">
        {news.slice(0, 5).map((item, i) => (
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
            <div className="overlay">
              <h2>{parseTitleFromSummary(item.long_summary)}</h2>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="slider-title">More News</h2>
      <div className="slider-container">
        <button
          className="slider-button left"
          onClick={() => scrollBy(-600)}
          aria-label="Scroll left"
        >
          &lt;
        </button>
        <div className="more-news-row" ref={sliderRef}>
          {news.slice(5).map(item => (
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
              <h4>{parseTitleFromSummary(item.long_summary)}</h4>
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
  );
};

export default MainPage;
