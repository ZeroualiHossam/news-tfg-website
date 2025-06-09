// src/pages/MainPageVideo.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getResumenes, getVideos } from '../api/apiFunctions';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import ToggleViewSwitch from '../components/ToggleViewSwitch';
import './MainPageVideo.css';

const MainPageVideos = () => {
  const [news, setNews] = useState([]);
  const [videosMap, setVideosMap] = useState({});
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const [resumenes, videos] = await Promise.all([
          getResumenes(),
          getVideos()
        ]);
        
        const videoMap = {};
        videos.forEach(video => {
          const match = video.key.match(/group_(\d+)/);
          if (match) {
            const groupId = match[1];
            videoMap[groupId] = video;
          }
        });
        
        setNews(resumenes);
        setVideosMap(videoMap);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

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
    const leadMatch = longSummary.match(/Entradilla:\s*(.+?)(?:\n\n|\n(?=[A-Z])|$)/s);
    if (leadMatch) return leadMatch[1].trim();
    
    const leadMatchAngle = longSummary.match(/<Entradilla>:\s*(.+?)(?:\n\n|\n(?=[A-Z])|$)/s);
    if (leadMatchAngle) return leadMatchAngle[1].trim();
    
    const leadMatchAster = longSummary.match(/\*\*Entradilla:\*\*\s*(.+?)(?:\n\n|\*\*|$)/s);
    if (leadMatchAster) return leadMatchAster[1].trim();
    
    return '';
  };

  if (loading) return <LoadingSpinner message="Cargando videos..." />;

  const current = news[idx] || {};
  const currentVideo = videosMap[String(current.group_id)];

  return (
    <div className="video-section">

      <div className="content">
        <div className="side left">
          <h2 className="video-summary">
            {parseTitleFromSummary(current.long_summary || '')}
          </h2>
          <p className="video-lead">
            {parseLeadFromSummary(current.long_summary || '')}
          </p>
        </div>

        <div className="video-container">
          {currentVideo ? (
            <video
              key={current.group_id}
              controls
              src={currentVideo.url}
              className="video-player"
            >
              Tu navegador no soporta el elemento video.
            </video>
          ) : (
            <div className="video-placeholder">
              <p>Video no disponible para esta noticia</p>
            </div>
          )}
          
          <div className="navigation-buttons">
            <button
              className="nav-btn"
              onClick={() => setIdx(i => Math.max(i - 1, 0))}
              disabled={idx === 0}
            >
              ↑ Previous
            </button>
            <button
              className="nav-btn"
              onClick={() => setIdx(i => Math.min(i + 1, news.length - 1))}
              disabled={idx === news.length - 1}
            >
              ↓ Next
            </button>
          </div>
        </div>

        <div className="side right">
          <Link to={`/grupo/${current.group_id}`} className="detail-btn">
            Ver Noticia Completa
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainPageVideos;
