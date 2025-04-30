import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getResumenes, getImagenes } from '../api/apiFunctions';

export default function NewsPage() {
  const { groupId } = useParams();
  const [resumen, setResumen]     = useState(null);
  const [imgs, setImgs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    async function loadDetail() {
      try {
        const [resumenes, imagenes] = await Promise.all([
          getResumenes(),
          getImagenes()
        ]);
        const grupo = resumenes.find(r => String(r.group_id) === groupId);
        const urls = imagenes
          .filter(({ key }) => key.match(new RegExp(`group_${groupId}_[1-3]\\.png$`)))
          .map(i => i.url);
        setResumen(grupo);
        setImgs(urls);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [groupId]);

  if (loading)  return <p>Cargando detalles…</p>;
  if (error)    return <p>Error: {error.message}</p>;
  if (!resumen) return <p>Grupo no encontrado</p>;

  return (
    <div className="news-detail">
      <h1 className="news-detail__title">
        {resumen.summary.split('.')[0]}
      </h1>
      <p className="news-detail__summary">
        {resumen.summary}
      </p>
      <div className="news-detail__carousel">
        {imgs.map(url => (
          <img
            key={url}
            src={url}
            alt=""
            className="news-detail__image"
          />
        ))}
      </div>
    </div>
  );
}