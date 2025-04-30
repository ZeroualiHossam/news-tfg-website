import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const GaleriaImagenes = () => {
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/imagenes`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(data => setImagenes(data))
      .catch(err => setError(err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p>Cargando imágenes…</p>;
  if (error)    return <p>Error al cargar imágenes: {error.message}</p>;

  return (
    <div className="galeria">
      {imagenes.map(({ key, url }) => (
        <div key={key} className="galeria__item">
          <img
            src={url}
            alt={key.split('/').pop()}
            className="galeria__imagen"
          />
          <p className="galeria__nombre">{key.split('/').pop()}</p>
        </div>
    ))}
    </div>
);
};

export default GaleriaImagenes;
