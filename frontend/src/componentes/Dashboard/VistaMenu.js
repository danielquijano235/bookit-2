/**
 * ============================================
 * BOOKIT - Componente VistaMenu
 * Archivo: componentes/Dashboard/VistaMenu.js
 * ============================================
 *
 * Propósito: Módulo de gestión del menú del restaurante.
 * Permite ver, agregar, editar y eliminar platos del menú,
 * organizar por categorías y gestionar precios y disponibilidad.
 */

import React, { useState, useEffect } from 'react';
import ConfirmDialog from '../Compartidos/ConfirmDialog';
import { useNotificaciones } from '../../contextos/NotificacionesContext';
import Boton from '../Compartidos/Boton';
import ModalSimple from '../Compartidos/ModalSimple';
import { getPlatos, savePlatos, getPlatosByCategoria, normalizeCategoria, addPlato, upsertPlato } from '../../servicios/menuStorage';
import samplePlatos from '../../servicios/samplePlatos';
import categorias from '../../servicios/categorias';

// Datos de ejemplo para el menú (vacio por defecto)
const menuInicial = [];

const VistaMenu = () => {
  const [platos, setPlatos] = useState(() => {
    try {
      const stored = getPlatos() || [];
      const normalized = stored.map((p, i) => ({
        ...p,
        id: p && p.id != null ? p.id : Date.now() + i,
        categoria: p && p.categoria ? normalizeCategoria(p.categoria) : (categorias[0] ? categorias[0].id : 'para-empezar')
      }));
      if (normalized.length !== stored.length || normalized.some((p, i) => p !== stored[i])) {
        try { savePlatos(normalized); } catch (e) { /* ignore */ }
      }
      return normalized.length > 0 ? normalized : menuInicial;
    } catch (e) {
      return menuInicial;
    }
  });
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [openCategoria, setOpenCategoria] = useState(false);
  const [categoriaModal, setCategoriaModal] = useState(null);
  const [itemsCategoria, setItemsCategoria] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [platoEditando, setPlatoEditando] = useState(null);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('todos');


  // Formulario para nuevo/editar plato
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: categorias && categorias.length > 0 ? categorias[0].id : 'para-empezar',
    disponible: true,
    imagen: '',
    tiempoPreparacion: '',
    alergenos: [],
  });

  // Filtrar platos según criterios
  const platosFiltrados = platos.filter(plato => {
    const coincideCategoria = categoriaActiva === 'todos' || plato.categoria === categoriaActiva;
    const coincideBusqueda = plato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           plato.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideDisponibilidad = filtroDisponibilidad === 'todos' ||
                                 (filtroDisponibilidad === 'disponible' && plato.disponible) ||
                                 (filtroDisponibilidad === 'no-disponible' && !plato.disponible);

    return coincideCategoria && coincideBusqueda && coincideDisponibilidad;
  });

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const abrirCategoriaModal = (c) => {
    // cargar platos por categoria y fallback a samplePlatos
    let found = getPlatosByCategoria(c.id) || [];
    if (!found || found.length === 0) found = samplePlatos[c.id] || [];
    setCategoriaModal(c);
    setItemsCategoria(found);
    setOpenCategoria(true);
  };

  const cerrarCategoriaModal = () => {
    setOpenCategoria(false);
    setCategoriaModal(null);
    setItemsCategoria([]);
  };

  

  const abrirModalNuevo = () => {
    setPlatoEditando(null);
    setFormulario({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: 'para-empezar',
      disponible: true,
      imagen: '',
      tiempoPreparacion: '',
      alergenos: [],
    });
    setModalVisible(true);
  };

  const abrirModalEditar = (plato) => {
    setPlatoEditando(plato);
    setFormulario({
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      precio: plato.precio.toString(),
      categoria: plato.categoria,
      disponible: plato.disponible,
      imagen: plato.imagen,
      tiempoPreparacion: plato.tiempoPreparacion.toString(),
      alergenos: [...plato.alergenos],
    });
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setPlatoEditando(null);
  };

  const guardarPlato = () => {
    if (!formulario.nombre || !formulario.precio) {
      agregarNotificacion('info', 'Validación', 'Por favor completa los campos obligatorios');
      return;
    }

      const nuevoPlato = {
      id: platoEditando ? platoEditando.id : Date.now(),
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      precio: parseInt(formulario.precio),
      categoria: normalizeCategoria(formulario.categoria),
      disponible: formulario.disponible,
      imagen: formulario.imagen || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
      tiempoPreparacion: parseInt(formulario.tiempoPreparacion) || 15,
      alergenos: formulario.alergenos,
      popularidad: platoEditando ? platoEditando.popularidad : Math.floor(Math.random() * 20) + 70,
    };

    // Read current stored platos to avoid overwriting if local state is stale
    try {
      const updated = upsertPlato(nuevoPlato);
      setPlatos(updated);
    } catch (e) {
      // fallback: merge with current state
      setPlatos((prev) => {
        const updated = upsertPlato(nuevoPlato);
        return updated;
      });
    }

    cerrarModal();
  };

  const { agregarNotificacion } = useNotificaciones();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);

  const eliminarPlato = (id) => {
    const plato = platos.find(p => p.id === id);
    setConfirmPayload({ tipo: 'plato', id, texto: plato ? plato.nombre : 'plato' });
    setConfirmOpen(true);
  };

  const ejecutarEliminar = () => {
    if (!confirmPayload) return;
    const { tipo, id, texto } = confirmPayload;
    if (tipo === 'plato') {
      setPlatos((prev) => {
        const updated = prev.filter(p => p.id !== id);
        savePlatos(updated);
        return updated;
      });
      agregarNotificacion('sistema', 'Plato eliminado', `${texto} ha sido eliminado del menú`);
    }
    setConfirmOpen(false);
    setConfirmPayload(null);
  };

  const toggleDisponibilidad = (id) => {
    setPlatos((prev) => {
      const updated = prev.map(p => p.id === id ? { ...p, disponible: !p.disponible } : p);
      savePlatos(updated);
      return updated;
    });
  };

  const agregarAlergeno = (alergeno) => {
    if (alergeno && !formulario.alergenos.includes(alergeno)) {
      setFormulario({
        ...formulario,
        alergenos: [...formulario.alergenos, alergeno]
      });
    }
  };

  const quitarAlergeno = (alergeno) => {
    setFormulario({
      ...formulario,
      alergenos: formulario.alergenos.filter(a => a !== alergeno)
    });
  };

  const estadisticasMenu = {
    totalPlatos: platos.length,
    platosDisponibles: platos.filter(p => p.disponible).length,
    platosNoDisponibles: platos.filter(p => !p.disponible).length,
    precioPromedio: Math.round(platos.reduce((sum, p) => sum + p.precio, 0) / platos.length),
    popularidadPromedio: Math.round(platos.reduce((sum, p) => sum + p.popularidad, 0) / platos.length),
  };

  return (
    <div className="vista-menu">
      {/* Header con estadísticas */}
      <div className="menu-header">
        <div className="menu-titulo">
          <h1>Gestión del Menú</h1>
          <p>Administra los platos de tu restaurante</p>
        </div>

        <div className="menu-estadisticas">
          <div className="estadistica-item">
            <span className="estadistica-valor">{estadisticasMenu.totalPlatos}</span>
            <span className="estadistica-etiqueta">Total Platos</span>
          </div>
          <div className="estadistica-item">
            <span className="estadistica-valor">{estadisticasMenu.platosDisponibles}</span>
            <span className="estadistica-etiqueta">Disponibles</span>
          </div>
          <div className="estadistica-item">
            <span className="estadistica-valor">{formatearPrecio(estadisticasMenu.precioPromedio)}</span>
            <span className="estadistica-etiqueta">Precio Promedio</span>
          </div>
          <div className="estadistica-item">
            <span className="estadistica-valor">{estadisticasMenu.popularidadPromedio}%</span>
            <span className="estadistica-etiqueta">Popularidad</span>
          </div>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="menu-toolbar">
        <div className="toolbar-izquierda">
          <div className="busqueda-container">
            <input
              type="text"
              placeholder="Buscar platos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="busqueda-input"
            />
            <span className="busqueda-icono">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="7" stroke="#FDB022" strokeWidth="2" />
                <line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#FDB022" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <select
            value={filtroDisponibilidad}
            onChange={(e) => setFiltroDisponibilidad(e.target.value)}
            className="filtro-disponibilidad"
          >
            <option value="todos">Todos</option>
            <option value="disponible">Disponibles</option>
            <option value="no-disponible">No disponibles</option>
          </select>
        </div>

        <Boton variante="primario" className="btn btn--primario btn-nuevo-plato" onClick={abrirModalNuevo}>
          <span>+</span> Nuevo Plato
        </Boton>
      </div>

      {/* Filtros por categoría */}
      <div className="categorias-filtro">
          {categorias.map(categoria => (
          <Boton
            key={categoria.id}
            variante={categoriaActiva === categoria.id ? 'primario' : 'secundario'}
            className={`categoria-btn ${categoriaActiva === categoria.id ? 'activo' : ''}`}
            onClick={() => { setCategoriaActiva(categoria.id); abrirCategoriaModal(categoria); }}
          >
            <span className="categoria-nombre">{categoria.title}</span>
          </Boton>
        ))}
      </div>

      {/* Grid de platos removed per user request */}

      

      {/* Modal para nuevo/editar plato */}
      {modalVisible && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido menu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{platoEditando ? 'Editar Plato' : 'Nuevo Plato'}</h2>
              <Boton variante="ghost" className="modal-cerrar" onClick={cerrarModal}>
                <img src="https://img.icons8.com/ios-filled/20/1a1a2e/delete-sign.png" alt="Cerrar" style={{width:'20px', height:'20px'}} />
              </Boton>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-grupo">
                  <label>Nombre del plato *</label>
                  <input
                    type="text"
                    value={formulario.nombre}
                    onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                    placeholder="Ej: Risotto de Champiñones"
                  />
                </div>

                <div className="form-grupo">
                  <label>Precio *</label>
                  <input
                    type="number"
                    value={formulario.precio}
                    onChange={(e) => setFormulario({...formulario, precio: e.target.value})}
                    placeholder="38000"
                  />
                </div>

                <div className="form-grupo">
                  <label>Categoría</label>
                  <select
                    value={formulario.categoria}
                    onChange={(e) => setFormulario({...formulario, categoria: e.target.value})}
                  >
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-grupo">
                  <label>Tiempo de preparación (min)</label>
                  <input
                    type="number"
                    value={formulario.tiempoPreparacion}
                    onChange={(e) => setFormulario({...formulario, tiempoPreparacion: e.target.value})}
                    placeholder="25"
                  />
                </div>

                <div className="form-grupo full-width">
                  <label>Descripción</label>
                  <textarea
                    value={formulario.descripcion}
                    onChange={(e) => setFormulario({...formulario, descripcion: e.target.value})}
                    placeholder="Describe los ingredientes y preparación..."
                    rows="3"
                  />
                </div>

                

                <div className="form-grupo checkbox-grupo">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formulario.disponible}
                      onChange={(e) => setFormulario({...formulario, disponible: e.target.checked})}
                    />
                    <span className="checkmark"></span>
                    Disponible en el menú
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Boton variante="secundario" className="btn btn--secundario" onClick={cerrarModal}>Cancelar</Boton>
              <Boton variante="primario" className="btn btn--primario" onClick={guardarPlato}>
                {platoEditando ? 'Actualizar' : 'Crear'} Plato
              </Boton>
            </div>
          </div>
        </div>
      )}
      {/* ModalSimple: listar platos por categoría (mismo modal que PaginaMenu) */}
      <ModalSimple open={openCategoria} title={categoriaModal ? (categoriaModal.title || categoriaModal.nombre) : ''} onClose={cerrarCategoriaModal}>
        <div className="categoria-list">
          {itemsCategoria.map((it, idx) => (
            <div className="categoria-item" key={it.id || it.nombre || idx}>
              <div className="categoria-row">
                <div className="categoria-nombre">{it.nombre}</div>
                <div className="categoria-precio">{it.precio ? ('$' + Number(it.precio).toLocaleString('es-CO')) : ''}</div>
              </div>
              {it.descripcion ? <div className="categoria-desc">{it.descripcion}</div> : null}
              <div className="categoria-sep" />
            </div>
          ))}
        </div>
      </ModalSimple>
      {/* Confirm dialog (eliminar plato) */}
      <ConfirmDialog
        abierto={confirmOpen}
        titulo={confirmPayload ? `Eliminar ${confirmPayload.texto}` : 'Eliminar'}
        mensaje={confirmPayload ? `¿Estás seguro de eliminar "${confirmPayload.texto}"? Esta acción no se puede deshacer.` : '¿Estás seguro?'}
        onConfirm={ejecutarEliminar}
        onCancel={() => { setConfirmOpen(false); setConfirmPayload(null); }}
      />
    </div>
  );
};

export default VistaMenu;