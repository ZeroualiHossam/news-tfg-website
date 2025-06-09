import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getImagenes, getResumenes, getVideos } from '../api/apiFunctions';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
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

  if (loading) return <LoadingSpinner message="Cargando noticia..." />;
  if (!newsItem) return <Navigate to="/" replace />;

  // Parsear el long_summary con la nueva estructura
  const parseLongSummary = (longSummary) => {
    // Extraer título
    const titleMatch = longSummary.match(/Título:\s*(.+?)(?:\n|$)/);
    const titulo = titleMatch ? titleMatch[1].trim() : newsItem.title;

    // Extraer entradilla
    const leadMatch = longSummary.match(/Entradilla:\s*(.+?)(?:\n\nCuerpo:|$)/s);
    const entradilla = leadMatch ? leadMatch[1].trim() : newsItem.lead;

    // Extraer cuerpo
    const bodyMatch = longSummary.match(/Cuerpo:\s*(.+)/s);
    let cuerpo = [];
    if (bodyMatch) {
      // Dividir el cuerpo en párrafos
      cuerpo = bodyMatch[1]
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0);
    }

    return { titulo, entradilla, cuerpo };
  };

  const { titulo, entradilla, cuerpo } = parseLongSummary(newsItem.long_summary);

  // Función para renderizar contenido con imágenes intercaladas
  const renderContentWithImages = () => {
    const content = [];
    
    // Título
    content.push(
      <h1 key="title" className="news-title">{titulo}</h1>
    );

    // Entradilla
    content.push(
      <p key="lead" className="news-lead">{entradilla}</p>
    );

    // Primera imagen después de la entradilla
    if (images.length > 0) {
      content.push(
        <div key="image-0" className="news-image-container">
          <img 
            src={images[0].url} 
            alt={titulo} 
            className="news-image"
            onError={(e) => {
              console.error('Error loading image:', images[0].url);
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }

    // Intercalar párrafos con imágenes
    cuerpo.forEach((paragraph, index) => {
      content.push(
        <p key={`paragraph-${index}`} className="news-paragraph">
          {paragraph}
        </p>
      );

      // Añadir imagen después de cada párrafo (empezando por la imagen 1)
      const imageIndex = index + 1;
      if (imageIndex < images.length && imageIndex < 5) {
        content.push(
          <div key={`image-${imageIndex}`} className="news-image-container">
            <img 
              src={images[imageIndex].url} 
              alt={titulo} 
              className="news-image"
              onError={(e) => {
                console.error('Error loading image:', images[imageIndex].url);
                e.target.style.display = 'none';
              }}
            />
          </div>
        );
      }
    });

    return content;
  };

  return (
    <article className="news-page">
      <div className="news-content">
        {renderContentWithImages()}
      </div>

      {/* Mostrar video al final */}
      {video && (
        <div className="news-video-container">
          <video controls className="news-video">
            <source src={video.url} type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
        </div>
      )}
    </article>
  );
};

export default NewsPage;