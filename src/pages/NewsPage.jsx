import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getResumenes, getImagenes, getVideos } from '../api/apiFunctions';
import './NewsPage.css';

const NewsPage = () => {
  const { group_id } = useParams();
  const [newsItem, setNewsItem] = React.useState(null);
  const [images, setImages] = React.useState([]);
  const [video, setVideo] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadNews() {
      try {
        const [resumenes, imagenesData, videosData] = await Promise.all([
          getResumenes(),
          getImagenes(),
          getVideos()
        ]);
        
        const item = resumenes.find(n => String(n.group_id) === group_id);
        setNewsItem(item);
        
        // Filtrar imágenes para este grupo
        const groupImages = imagenesData.filter(img => 
          img.key.includes(`group_${group_id}_`)
        );
        setImages(groupImages);
        
        // Filtrar video para este grupo
        const groupVideo = videosData.find(vid => 
          vid.key.includes(`group_${group_id}`)
        );
        setVideo(groupVideo);
        
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [group_id]);

  if (loading) return <div className="news-page"><p>Cargando...</p></div>;
  if (!newsItem) return <Navigate to="/" replace />;

  // Parsear el long_summary con la nueva estructura
  const parseLongSummary = (longSummary) => {
    const sections = longSummary.split('\n\n');
    let titulo = '';
    let entradilla = '';
    let cuerpo = [];

    sections.forEach(section => {
      if (section.startsWith('**Título:**')) {
        titulo = section.replace('**Título:**', '').trim();
      } else if (section.startsWith('**Entradilla:**')) {
        entradilla = section.replace('**Entradilla:**', '').trim();
      } else if (section.startsWith('**Cuerpo:**')) {
        const cuerpoText = section.replace('**Cuerpo:**', '').trim();
        cuerpo = cuerpoText.split('\n\n').filter(p => p.trim());
      } else if (!section.startsWith('**') && section.trim()) {
        cuerpo.push(section.trim());
      }
    });

    return { titulo, entradilla, cuerpo };
  };

  const { titulo, entradilla, cuerpo } = parseLongSummary(newsItem.long_summary);

  // Dividir el cuerpo en dos partes para las imágenes
  const middleIndex = Math.floor(cuerpo.length / 2);
  const firstPart = cuerpo.slice(0, middleIndex);
  const secondPart = cuerpo.slice(middleIndex);

  return (
    <div className="news-page">
      <h1 className="news-title">{titulo || newsItem.title}</h1>
      <p className="news-lead">{entradilla || newsItem.lead}</p>

      {/* Mostrar el primer bloque de texto */}
      <div className="news-content">
        {firstPart.map((p, idx) => <p key={idx}>{p}</p>)}
      </div>

      {/* Mostrar las imágenes reales del API */}
      {images.length > 0 && (
        <div className="news-images">
          {images.slice(0, 3).map(img => (
            <img 
              key={img.key} 
              src={img.url} 
              alt={titulo || newsItem.title} 
              onError={(e) => {
                console.error('Error loading image:', img.url);
                e.target.style.display = 'none';
              }}
            />
          ))}
        </div>
      )}

      {/* Mostrar el segundo bloque de texto */}
      <div className="news-content">
        {secondPart.map((p, idx) => <p key={idx}>{p}</p>)}
      </div>

      {/* Mostrar video real del API */}
      {video && (
        <div className="news-video-container">
          <video controls className="news-video">
            <source src={video.url} type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
        </div>
      )}
    </div>
  );
};

export default NewsPage;