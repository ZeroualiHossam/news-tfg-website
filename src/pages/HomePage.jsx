import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getResumenes, getImagenes } from '../api/apiFunctions';
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
            const map = {};
            imagenes.forEach(({ key, url }) => {
            const match = key.match(/group_(\d+)_(\d+)\.png$/);
            if (!match) return;
            const [, gid, idx] = match;
            map[gid] = map[gid] || {};
            map[gid][idx] = url;
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
    
    console.log(groups);

    if (loading) return <p>Cargando grupos…</p>;
    if (error)   return <p>Error: {error.message}</p>;

    return (
        <div className="home-grid">
            {groups.slice(0, 18).map(({ group_id, summary }) => {
            const gid = String(group_id);
            const title = summary.split('.')[0];
            const thumb = imagesMap[gid]?.['1'];
            return (
                <Link key={gid} to={`/grupo/${gid}`} className="home-card">
                    {thumb
                    ? <img src={thumb} alt={title} className="home-card__thumb" />
                    : <div className="home-card__placeholder">Sin imagen</div>
                }
                    <h3 className="home-card__title">{title}</h3>
                </Link>
                );
            })}
        </div>
    );
}