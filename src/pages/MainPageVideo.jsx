// src/pages/MainPageVideo.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ToggleViewSwitch from '../components/ToggleViewSwitch';
import './MainPageVideo.css';
import newsData from '../assets/news_groups.json';

const MainPageVideos = () => {
  const [news, setNews] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setNews(newsData);
  }, []);

  const current = news[idx] || {};
  const getVideoByGroupId = id => `/assets/videos/group_${id}.mp4`;

  return (
    <div className="video-section">

      {/* HEADER NEGRO CON LOGO + SWITCH */}
      <header className="header">
        <div className="logo">NEWS TFG</div>
        <ToggleViewSwitch />
      </header>

      {/* CONTENIDO: RESUMEN, VÍDEO, NAVEGACIÓN, DETALLE */}
      <div className="content">
        <div className="side left">
          <h2 className="video-summary">{current.title}</h2>
        </div>

        <div className="video-container">
          <video
            key={current.group_id}
            controls
            src={getVideoByGroupId(current.group_id)}
            className="video-player"
          />
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
