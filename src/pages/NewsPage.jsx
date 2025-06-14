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

  // Función mejorada para renderizar contenido con imágenes intercaladas
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

    // Si no hay párrafos, mostrar todas las imágenes
    if (cuerpo.length === 0) {
      if (images.length > 0) {
        // Agrupar todas las imágenes disponibles de 2 en 2
        for (let i = 0; i < images.length; i += 2) {
          const imageIndexes = i + 1 < images.length ? [i, i + 1] : [i];
          content.push(renderImageGroup(imageIndexes, `images-${i}`));
        }
      }
      return content;
    }

    // Estrategia de distribución de contenido
    const totalParagraphs = cuerpo.length;
    const totalImages = images.length;

    if (totalImages === 0) {
      // Solo texto
      content.push(renderTextBlock(cuerpo, 'all-text'));
    } else if (totalImages === 1) {
      // Una imagen después del primer párrafo
      content.push(renderTextBlock([cuerpo[0]], 'text-1'));
      content.push(renderImageGroup([0], 'image-1'));
      if (cuerpo.length > 1) {
        content.push(renderTextBlock(cuerpo.slice(1), 'text-remaining'));
      }
    } else {
      // NUEVA LÓGICA: Primera imagen individual, resto de 2 en 2
      const paragraphsPerSection = Math.ceil(totalParagraphs / Math.min(3, totalImages));
      
      // Primera sección de texto
      content.push(renderTextBlock(cuerpo.slice(0, paragraphsPerSection), 'text-1'));
      
      // Primera imagen (individual)
      content.push(renderImageGroup([0], 'image-1'));
      
      // Segunda sección de texto (si hay más párrafos)
      const start2 = paragraphsPerSection;
      const end2 = Math.min(start2 + paragraphsPerSection, totalParagraphs);
      if (start2 < totalParagraphs) {
        content.push(renderTextBlock(cuerpo.slice(start2, end2), 'text-2'));
      }
      
      // RESTO DE IMÁGENES DE 2 EN 2
      let imageIndex = 1; // Empezamos desde la segunda imagen
      let sectionIndex = 3;
      
      while (imageIndex < totalImages) {
        // Determinar cuántas imágenes añadir en este grupo (máximo 2)
        const imagesInThisGroup = Math.min(2, totalImages - imageIndex);
        const imageIndexes = [];
        
        for (let i = 0; i < imagesInThisGroup; i++) {
          imageIndexes.push(imageIndex + i);
        }
        
        // Añadir el grupo de imágenes (siempre de 2 en 2 a partir de la segunda)
        content.push(renderImageGroup(imageIndexes, `images-group-${sectionIndex}`));
        
        // Añadir más texto si queda y hay más imágenes por mostrar
        const textStart = end2 + (sectionIndex - 3) * Math.ceil(paragraphsPerSection / 2);
        const textEnd = Math.min(textStart + Math.ceil(paragraphsPerSection / 2), totalParagraphs);
        
        if (textStart < totalParagraphs && imageIndex + imagesInThisGroup < totalImages) {
          content.push(renderTextBlock(cuerpo.slice(textStart, textEnd), `text-${sectionIndex}`));
        }
        
        imageIndex += imagesInThisGroup;
        sectionIndex++;
      }
      
      // Añadir texto restante al final si queda
      const finalTextStart = end2 + Math.floor((imageIndex - 1) / 2) * Math.ceil(paragraphsPerSection / 2);
      if (finalTextStart < totalParagraphs) {
        content.push(renderTextBlock(cuerpo.slice(finalTextStart), 'text-final'));
      }
    }

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