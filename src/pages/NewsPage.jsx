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
        const groupImages = imagenesData.filter(img =>
          img.key.includes(`group_${group_id}_`)
        );
        setImages(groupImages);
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
    // Desplazar al tope de la página al abrir noticia
    window.scrollTo({ top: 0, behavior: 'auto' });
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

  // NUEVA FUNCIÓN: Renderizar imágenes en grupos
  const renderImageGroup = (imageIndexes, key) => {
    const validImages = imageIndexes
      .map(idx => images[idx])
      .filter(img => img);

    if (validImages.length === 0) return null;

    if (validImages.length === 1) {
      return (
        <div key={key} className="news-image-container">
          <img 
            src={validImages[0].url} 
            alt={titulo} 
            className="news-image"
            onError={(e) => {
              console.error('Error loading image:', validImages[0].url);
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }

    if (validImages.length === 2) {
      return (
        <div key={key} className="news-images-dual">
          {validImages.map((img, idx) => (
            <img 
              key={`dual-${idx}`}
              src={img.url} 
              alt={titulo} 
              className="news-image"
              onError={(e) => {
                console.error('Error loading image:', img.url);
                e.target.style.display = 'none';
              }}
            />
          ))}
        </div>
      );
    }

    if (validImages.length === 3) {
      return (
        <div key={key} className="news-images-triple">
          {validImages.map((img, idx) => (
            <img 
              key={`triple-${idx}`}
              src={img.url} 
              alt={titulo} 
              className="news-image"
              onError={(e) => {
                console.error('Error loading image:', img.url);
                e.target.style.display = 'none';
              }}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  // NUEVA FUNCIÓN: Renderizar bloques de texto
  const renderTextBlock = (paragraphs, key) => {
    if (paragraphs.length === 0) return null;

    return (
      <div key={key} className="news-text-block">
        {paragraphs.map((paragraph, idx) => (
          <p key={`text-${idx}`} className="news-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  const renderContentWithImages = () => {
    const content = [];
    
    // 1. TÍTULO
    content.push(
      <h1 key="title" className="news-title">{titulo}</h1>
    );

    // 2. ENTRADILLA
    content.push(
      <p key="lead" className="news-lead">{entradilla}</p>
    );

    // 3. PRIMERAS DOS IMÁGENES (debajo de la entradilla)
    if (images.length >= 2) {
      content.push(
        <div key="hero-images" className="news-hero-images">
          <img 
            src={images[0].url} 
            alt={images[0].alt || 'Imagen de la noticia'} 
            className="news-image hero-image"
          />
          <img 
            src={images[1].url} 
            alt={images[1].alt || 'Imagen de la noticia'} 
            className="news-image hero-image"
          />
        </div>
      );
    } else if (images.length === 1) {
      content.push(
        <div key="hero-image" className="news-hero-image-single">
          <img 
            src={images[0].url} 
            alt={images[0].alt || 'Imagen de la noticia'} 
            className="news-image hero-image"
          />
        </div>
      );
    }

    // 4. PRIMEROS 2 PÁRRAFOS
    if (cuerpo.length >= 2) {
      content.push(
        <div key="first-paragraphs" className="news-text-block">
          <p className="news-paragraph">{cuerpo[0]}</p>
          <p className="news-paragraph">{cuerpo[1]}</p>
        </div>
      );
    } else if (cuerpo.length === 1) {
      content.push(
        <div key="first-paragraph" className="news-text-block">
          <p className="news-paragraph">{cuerpo[0]}</p>
        </div>
      );
    }

    // 5. LAYOUT TRIPLE DE IMÁGENES (si hay al menos 5 imágenes: 2 hero + 3 triple)
    if (images.length >= 5) {
      content.push(
        <div key="triple-layout" className="news-triple-image-layout">
          <div className="news-small-images-column">
            <img 
              src={images[2].url} 
              alt={images[2].alt || 'Imagen 3'} 
              className="news-image small-image"
            />
            <img 
              src={images[3].url} 
              alt={images[3].alt || 'Imagen 4'} 
              className="news-image small-image"
            />
          </div>
          <div className="news-large-image">
            <img 
              src={images[4].url} 
              alt={images[4].alt || 'Imagen 5'} 
              className="news-image large-image"
            />
          </div>
        </div>
      );
    } else if (images.length >= 3) {
      // Si hay menos de 5 imágenes pero al menos 3, mostrar las restantes
      const remainingImages = images.slice(2);
      for (let i = 0; i < remainingImages.length; i++) {
        content.push(
          <div key={`remaining-image-${i}`} className="news-image-container">
            <img 
              src={remainingImages[i].url} 
              alt={remainingImages[i].alt || `Imagen ${i + 3}`} 
              className="news-image"
            />
          </div>
        );
      }
    }

    // 6. RESTO DEL TEXTO (desde el párrafo 3 en adelante)
    if (cuerpo.length > 2) {
      const remainingParagraphs = cuerpo.slice(2);
      content.push(
        <div key="remaining-text" className="news-text-block">
          {remainingParagraphs.map((paragraph, idx) => (
            <p key={`remaining-${idx}`} className="news-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }

    // 7. IMÁGENES RESTANTES (si hay más de 5)
    if (images.length > 5) {
      const extraImages = images.slice(5);
      extraImages.forEach((img, idx) => {
        content.push(
          <div key={`extra-image-${idx}`} className="news-image-container">
            <img 
              src={img.url} 
              alt={img.alt || `Imagen ${idx + 6}`} 
              className="news-image"
            />
          </div>
        );
      });
    }

    return content;
  };

  return (
    <article className="news-page">
      <div className="news-content">
        {renderContentWithImages()}
      </div>

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