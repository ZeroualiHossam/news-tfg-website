import React from 'react';
import './NewsPage.css';
import { useParams, Navigate } from 'react-router-dom';
import newsData from '../assets/news_groups.json';

const NewsPage = () => {
  const { group_id } = useParams();
  // Búsqueda síncrona y directa
  const item = newsData.find(n => String(n.group_id) === group_id);
  if (!item) return <Navigate to="/" replace />;

  // Dividir el resumen largo en párrafos
  const paragraphs = item.long_summary.split('\n\n');
  const middleIndex = Math.floor(paragraphs.length / 2);

  // Primer bloque de texto antes de las imágenes
  const firstPart = paragraphs.slice(0, middleIndex);
  // Segundo bloque de texto después de las imágenes
  const secondPart = paragraphs.slice(middleIndex);

  const images = [1, 2, 3].map(i => `/assets/images/group_${item.group_id}_image_${i}.jpg`);

  return (
    <div className="news-page">
      <h1 className="news-title">{item.title}</h1>
      <p className="news-lead">{item.lead}</p>

      {/* Mostrar el primer bloque de texto */}
      <div className="news-content">
        {firstPart.map((p, idx) => <p key={idx}>{p}</p>)}
      </div>

      {/* Mostrar las imágenes en el medio */}
      <div className="news-images">
        {images.map(src => (
          <img key={src} src={src} alt={item.title} />
        ))}
      </div>

      {/* Mostrar el segundo bloque de texto */}
      <div className="news-content">
        {secondPart.map((p, idx) => <p key={idx}>{p}</p>)}
      </div>

      {/* Si hay video, mostrarlo al final */}
      {item.video_url && (
        <div className="news-video-container">
          <video controls className="news-video">
            <source src={item.video_url} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
