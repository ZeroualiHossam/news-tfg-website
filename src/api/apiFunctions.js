const API_BASE_URL = "https://news-tfg-api.onrender.com";

console.log('🔧 API_BASE_URL configurada:', API_BASE_URL);

export async function getNoticias() {
    console.log('📡 Llamando a getNoticias...');
    const url = `${API_BASE_URL}/api/noticias`;
    console.log('🌐 URL completa:', url);
    try {
        const res = await fetch(url);
        console.log('📊 Headers de la solicitud:', res);
        console.log('📊 Response status:', res.status);
        console.log('📊 Response headers:', [...res.headers.entries()]);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        const data = await res.json();
        console.log('✅ Data recibida:', data);
        return data;
    } catch (error) {
        console.error('❌ Error en getNoticias:', error);
        throw error;
    }
}

export async function getGruposNoticias() {
    console.log('📡 Llamando a getGruposNoticias...');
    const url = `${API_BASE_URL}/api/grupos_noticias`;
    console.log('🌐 URL completa:', url);
    try {
        const res = await fetch(url);
        console.log('📊 Response status:', res.status);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        const data = await res.json();
        console.log('✅ Data recibida:', data);
        return data;
    } catch (error) {
        console.error('❌ Error en getGruposNoticias:', error);
        throw error;
    }
}

export async function getResumenes() {
    console.log('📡 Llamando a getResumenes...');
    const url = `${API_BASE_URL}/api/resumenes_noticias`;
    console.log('🌐 URL completa:', url);
    try {
        const res = await fetch(url);
        console.log('📊 Response status:', res.status);
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
        console.log('✅ Data recibida (primeros 2 items tras saneamiento):', data?.slice(0, 2));
        return data;
    } catch (error) {
        console.error('❌ Error en getResumenes:', error);
        throw error;
    }
}

export async function getImagenes() {
    console.log('📡 Llamando a getImagenes...');
    const url = `${API_BASE_URL}/api/imagenes`;
    console.log('🌐 URL completa:', url);
    try {
        const res = await fetch(url);
        console.log('📊 Response status:', res.status);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText.substring(0, 200));
            throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
        }
        const data = await res.json();
        console.log('✅ Imagenes recibidas (cantidad):', data?.length);
        return data;
    } catch (error) {
        console.error('❌ Error en getImagenes:', error);
        throw error;
    }
}

/**
 * Obtiene la primera imagen de cada grupo de noticias
 * Fallback que agrupa localmente a partir de todas las imágenes
 */
export async function getImagenesPrincipales() {
    console.log('📡 Generando principales localmente a partir de todas las imágenes…');
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
        console.log('✅ Principales imágenes calculadas localmente:', primerosPorGrupo);
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
    console.log('📡 Llamando a getAudios...');
    const url = `${API_BASE_URL}/api/audios`;
    console.log('🌐 URL completa:', url);
    try {
        const res = await fetch(url);
        console.log('📊 Response status:', res.status);
        console.log('📊 Content-Type:', res.headers.get('content-type'));
        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText.substring(0, 200));
            throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
        }
        const data = await res.json();
        console.log('✅ Audios recibidos:', data);
        console.log('📊 Cantidad de audios:', data?.length);
        if (data && data.length > 0) {
            console.log('🎵 Primera URL de audio:', data[0]?.url);
        }
        return data;
    } catch (error) {
        console.error('❌ Error en getAudios:', error);
        throw error;
    }
}
