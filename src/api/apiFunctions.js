const API_BASE_URL = "https://news-tfg-api.onrender.com";

export async function getNoticias() {
    const url = `${API_BASE_URL}/api/noticias`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('❌ Error en getNoticias:', error);
        throw error;
    }
}

export async function getGruposNoticias() {
    const url = `${API_BASE_URL}/api/grupos_noticias`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('❌ Error en getGruposNoticias:', error);
        throw error;
    }
}

export async function getResumenes() {
    const url = `${API_BASE_URL}/api/resumenes_noticias`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText.substring(0, 200));
            throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
        }
        // Leer siempre como texto para sanear NaN
        const text = await res.text();
        // Reemplazar tokens NaN inválidos por null
        const safeText = text.replace(/:NaN(?=[,}])/g, ':null');
        let data;
        try {
            data = JSON.parse(safeText);
        } catch (parseError) {
            console.error('❌ Error parseando JSON tras saneamiento:', parseError);
            throw new Error('Error al parsear JSON de resumenes');
        }
        return data;
    } catch (error) {
        console.error('❌ Error en getResumenes:', error);
        throw error;
    }
}

export async function getImagenes() {
    const url = `${API_BASE_URL}/api/imagenes`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText.substring(0, 200));
            throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('❌ Error en getImagenes:', error);
        throw error;
    }
}


export async function getImagenesPrincipales() {
    try {
        const todas = await getImagenes();
        const primerosPorGrupo = [];
        const vistos = new Set();
        todas.forEach(img => {
            const match = img.key.match(/group_(\d+)_/);
            if (match) {
                const groupId = match[1];
                if (!vistos.has(groupId)) {
                    vistos.add(groupId);
                    primerosPorGrupo.push({
                        key: img.key,
                        url: img.url,
                        group_id: groupId
                    });
                }
            }
        });
        return primerosPorGrupo;
    } catch (error) {
        console.error('❌ Error en getImagenesPrincipales (fallback):', error);
        throw error;
    }
}

export async function getVideos() {
    const res = await fetch(`${API_BASE_URL}/api/videos`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function getAudios() {
    const url = `${API_BASE_URL}/api/audios`;
    try {
        const res = await fetch(url);

        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText.substring(0, 200));
            throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
        }
        const data = await res.json();
        if (data && data.length > 0) {
        }
        return data;
    } catch (error) {
        console.error('❌ Error en getAudios:', error);
        throw error;
    }
}
