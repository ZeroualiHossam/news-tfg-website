import React, { useState, useEffect } from 'react';
import './MainPage.css';
import newsData from '../assets/news_groups.json'; // Importando el archivo JSON directamente

const MainPage = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Establecer las noticias directamente desde el JSON
    setNews(newsData);
    console.log('News Data Loaded:', newsData); // Verificar que los datos se están cargando
  }, []);

// Obtener una imagen correspondiente a un group_id
    const getImageByGroupId = (groupId) => {
    const imageCount = 3; // Ajusta según cuántas imágenes tienes por grupo
    const randomImageIndex = Math.floor(Math.random() * imageCount) + 1;
    const imagePath = `/assets/images/group_${groupId}_image_${randomImageIndex}.jpg`;

    console.log(`Image path: ${imagePath}`); // Verificar la ruta de la imagen generada
    return imagePath;
    };


  return (
    <div className="main-container">
      {/* Header Section */}
      <header className="header">
        <div className="logo">TNW</div>
        <nav>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">Events</a></li>
            <li><a href="#">Programs</a></li>
            <li><a href="#">Spaces</a></li>
            <li><a href="#">Partner With Us</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content Section */}
      <div className="main-content">
        <div className="news-grid">
          {/* Cuadrícula de noticias */}
          {news.slice(0, 4).map((newsItem, index) => (
            <div
              key={newsItem.group_id}
              className={`news-item ${index % 2 === 0 ? 'large' : ''}`}
            >
              <img
                src={getImageByGroupId(newsItem.group_id)}
                alt="News"
                className="news-image"
              />
              <div className="news-text">
                <h2>{newsItem.short_summary}</h2>
                <p>{newsItem.long_summary.slice(0, 100)}...</p>
                <button className="cta-btn">Read More</button>
              </div>
            </div>
          ))}
        </div>

        <div className="more-news">
          {/* Noticias adicionales */}
          {news.slice(4).map((newsItem) => (
            <div key={newsItem.group_id} className="more-news-item">
              <img
                src={getImageByGroupId(newsItem.group_id)}
                alt="News"
                className="news-image"
              />
              <div className="more-news-text">
                <h2>{newsItem.short_summary}</h2>
                <p>{newsItem.long_summary.slice(0, 100)}...</p>
                <button className="cta-btn">Read More</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Articles Section */}
      <div className="popular-articles">
        <h3>Popular Articles Today</h3>
        <ul>
          <li>Scientists created a biological quantum circuit in risky experiment</li>
          <li>I secured a $100K pre-seed investment in 30 min</li>
          <li>Leak: Samsung's S22 Ultra is the new Galaxy Note</li>
          <li>Many startup accelerators fail. Here's how to find the right one</li>
          <li>Scientists want to call Pluto a planet again</li>
        </ul>
      </div>
    </div>
  );
};

export default MainPage;
