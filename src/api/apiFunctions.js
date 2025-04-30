const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

export async function getResumenes() {
    const res = await fetch(`${API_BASE_URL}/api/resumenes_noticias`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function getImagenes() {
    const res = await fetch(`${API_BASE_URL}/api/imagenes`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
