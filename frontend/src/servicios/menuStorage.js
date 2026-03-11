// Helper para persistir y recuperar platos del menú en localStorage
const STORAGE_KEY = 'bookit:menu:platos';

// Obtiene todos los platos guardados en localStorage
export const getPlatos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error leyendo platos desde localStorage', e);
    return [];
  }
};

// Guarda un array de platos en localStorage
export const savePlatos = (platos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(platos));
  } catch (e) {
    console.error('Error guardando platos en localStorage', e);
  }
};

// Agrega o actualiza un plato usando upsert
export const addPlato = (plato) => upsertPlato(plato);

// Obtiene platos filtrados por categoría (normaliza para evitar errores por tildes o mayúsculas)
export const getPlatosByCategoria = (categoria) => {
  const all = getPlatos();
  if (!categoria) return all;
  const normalize = (s) => {
    if (!s && s !== 0) return '';
    return String(s)
      .toLowerCase()
      .trim()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
  };

  const target = normalize(categoria);
  return all.filter(p => {
    if (!p || !p.categoria) return false;
    const cat = normalize(p.categoria);
    return cat === target || cat.includes(target) || target.includes(cat);
  });
};

// Normaliza el nombre de la categoría para búsquedas y almacenamiento
export const normalizeCategoria = (categoria) => {
  if (!categoria && categoria !== 0) return '';
  return String(categoria)
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
};

// Inserta o actualiza un plato en el array, evitando duplicados por id y categoría
export const upsertPlato = (plato) => {
  const all = getPlatos() || [];
  const normalize = (s) => normalizeCategoria(s);
  const normalizedExisting = all.map((p, i) => ({
    ...p,
    id: p && p.id != null ? p.id : Date.now() + i,
    categoria: p && p.categoria ? normalize(p.categoria) : ''
  }));

  const newItem = {
    ...plato,
    id: plato && plato.id != null ? plato.id : Date.now(),
    categoria: plato && plato.categoria ? normalize(plato.categoria) : ''
  };

  // Agrupa por categoría y actualiza el plato si ya existe
  const sameCat = normalizedExisting.filter(p => p.categoria === newItem.categoria);
  const other = normalizedExisting.filter(p => p.categoria !== newItem.categoria);

  const map = new Map();
  sameCat.forEach(p => { if (p && p.id != null) map.set(p.id, p); });
  map.set(newItem.id, newItem);
  const mergedSame = Array.from(map.values());

  const updated = [...other, ...mergedSame];
  savePlatos(updated);
  return updated;
};

// Si no hay platos, agrega los de muestra evitando duplicados
export const seedIfEmpty = (samplePlatos) => {
  try {
    const existing = getPlatos() || [];

    const normalizeName = (s) => {
      if (!s && s !== 0) return '';
      return String(s).toLowerCase().trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ');
    };

    // Mapa para evitar duplicados por categoría y nombre
    const map = new Map();
    existing.forEach((p) => {
      const key = `${normalizeCategoria(p.categoria)}::${normalizeName(p.nombre)}`;
      map.set(key, p);
    });

    const sampleItems = Object.entries(samplePlatos || {}).flatMap(([cat, arr]) => {
      const catNorm = normalizeCategoria(cat);
      return (arr || []).map((it, i) => {
        const nameNorm = normalizeName(it.nombre || it.title || `Plato ${i+1}`);
        const key = `${catNorm}::${nameNorm}`;
        if (map.has(key)) return null; // skip existing
        const item = {
          id: Date.now() + Math.floor(Math.random() * 100000) + i,
          nombre: it.nombre || it.title || `Plato ${i+1}`,
          descripcion: it.descripcion || it.desc || '',
          precio: it.precio || 0,
          categoria: catNorm,
          disponible: it.disponible !== undefined ? it.disponible : true,
          imagen: it.imagen || '',
          tiempoPreparacion: it.tiempoPreparacion || 15,
          alergenos: it.alergenos || [],
          popularidad: Math.floor(Math.random() * 20) + 70,
        };
        map.set(key, item);
        return item;
      }).filter(Boolean);
    });

    const updated = [...existing, ...sampleItems];
    if (updated.length > 0) savePlatos(updated);
    return updated;
  } catch (e) {
    console.error('Error seeding sample platos', e);
    return getPlatos() || [];
  }
};

// Exporta todos los helpers para el menú
export default { getPlatos, savePlatos, addPlato, getPlatosByCategoria, seedIfEmpty };
