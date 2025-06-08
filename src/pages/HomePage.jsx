import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImagenes, getResumenes } from '../api/apiFunctions';
import './HomePage.css';

export default function HomePage() {
    const [groups, setGroups] = useState([]);
    const [imagesMap, setImagesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const [resumenes, imagenes] = await Promise.all([
                    getResumenes(),
                    getImagenes()
                ]);
                
                // Crear mapa de imágenes más eficiente
                const map = {};
                imagenes.forEach(({ key, url }) => {
                    const match = key.match(/group_(\d+)_/);
                    if (match) {
                        const gid = match[1];
                        if (!map[gid]) {
                            map[gid] = [];
                        }
                        map[gid].push(url);
                    }
                });
                
                setGroups(resumenes);
                setImagesMap(map);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);
    
    const parseTitleFromSummary = (longSummary) => {
        const titleMatch = longSummary.match(/\*\*Título:\*\*\s*(.+?)(?:\n|$)/);
        return titleMatch ? titleMatch[1].trim() : longSummary.substring(0, 80) + '...';
    };

    if (loading) return <p>Cargando grupos…</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="home-grid">
            {groups.slice(0, 18).map(({ group_id, long_summary }) => {
                const gid = String(group_id);
                const title = parseTitleFromSummary(long_summary);
                const groupImages = imagesMap[gid];
                const thumb = groupImages && groupImages.length > 0 ? groupImages[0] : null;
                
                return (
                    <Link key={gid} to={`/grupo/${gid}`} className="home-card">
                        {thumb ? (
                            <img
                                src={thumb}
                                alt={title}
                                className="home-card__thumb"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div 
                            className="home-card__placeholder" 
                            style={{ display: thumb ? 'none' : 'flex' }}
                        >
                            Sin imagen
                        </div>
                        <h3 className="home-card__title">{title}</h3>
                    </Link>
                );
            })}
        </div>
    );
}