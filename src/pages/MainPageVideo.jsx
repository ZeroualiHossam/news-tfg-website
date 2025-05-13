import React, { useState, useEffect } from 'react';
import './MainPageVideo.css';
import newsData from '../assets/news_groups.json'; // Importando el archivo JSON directamente

const MainPageVideos = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Establecer las noticias directamente desde el JSON
    setNews(newsData);
  }, []);

  // Obtener la URL pública del vídeo correspondiente a un group_id
  const getVideoByGroupId = (groupId) => {
    const videoPath = `/assets/videos/group_${groupId}.mp4`;
    console.log(`Video path: ${videoPath}`);
    return videoPath;
  };

  // Funciones para navegar entre los vídeos
  const handleNext = () => {
    if (currentIndex < news.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentNews = news[currentIndex];

  return (
    <div className="main-container">
      {/* Header Section */}
      <header className="header">
        <div className="logo">TNW Videos</div>
        <nav>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Videos</a></li>
            <li><a href="#">Events</a></li>
            <li><a href="#">Programs</a></li>
            <li><a href="#">Spaces</a></li>
            <li><a href="#">Partner With Us</a></li>
          </ul>
        </nav>
      </header>

      {/* Video Section */}
      <div className="video-section">
        <div className="video-summary">
          <h2>{currentNews?.short_summary}</h2>
        </div>

        <div className="video-container">
          <video
            key={currentNews?.group_id}
            controls
            src={getVideoByGroupId(currentNews?.group_id)}
            className="video-player"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="navigation-buttons">
          <button
            className="nav-btn"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ↑ Previous Video
          </button>
          <button
            className="nav-btn"
            onClick={handleNext}
            disabled={currentIndex === news.length - 1}
          >
            ↓ Next Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPageVideos;