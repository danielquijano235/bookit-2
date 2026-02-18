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

// Datos de ejemplo para el menú
const menuInicial = [
  {
    id: 1,
    nombre: 'Carpaccio de Salmon',
    descripcion: 'Finas láminas de salmón fresco con aceite de oliva, limón y alcaparras',
    precio: 45000,
    categoria: 'entradas',
    disponible: true,
    popularidad: 95,
    imagen: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
    tiempoPreparacion: 10,
    alergenos: ['pescado'],
  },
  {
    id: 2,
    nombre: 'Risoto de Champiñones',
    descripcion: 'Arroz arborio cremoso con champiñones silvestres y parmesano',
    precio: 38000,
    categoria: 'principales',
    disponible: true,
    popularidad: 88,
    imagen: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&h=200&fit=crop',
    tiempoPreparacion: 25,
    alergenos: ['lácteos'],
  },
  {
    id: 3,
    nombre: 'Filete de Res Angus',
    descripcion: 'Filete de 250g con reducción de vino tinto y vegetales de temporada',
    precio: 75000,
    categoria: 'principales',
    disponible: true,
    popularidad: 92,
    imagen: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
    tiempoPreparacion: 20,
    alergenos: [],
  },
  {
    id: 4,
    nombre: 'Tiramisú Casero',
    descripcion: 'Postre italiano tradicional con café, mascarpone y cacao',
    precio: 25000,
    categoria: 'postres',
    disponible: true,
    popularidad: 85,
    imagen: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
    tiempoPreparacion: 5,
    alergenos: ['lácteos', 'gluten', 'huevos'],
  },
  {
    id: 5,
    nombre: 'Vino Tinto Reserva',
    descripcion: 'Copa de vino tinto Cabernet Sauvignon de la región de Maipo',
    precio: 18000,
    categoria: 'bebidas',
    disponible: true,
    popularidad: 78,
    imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop',
    tiempoPreparacion: 2,
    alergenos: ['sulfitos'],
  },
  {
    id: 6,
    nombre: 'Ensalada César',
    descripcion: 'Lechuga romana, crutones, parmesano y aderezo César tradicional',
    precio: 32000,
    categoria: 'entradas',
    disponible: false,
    popularidad: 76,
    imagen: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
    tiempoPreparacion: 12,
    alergenos: ['lácteos', 'gluten', 'huevos'],
  },
];

const categorias = [
  { id: 'entradas', nombre: 'Entradas', icono: 'https://img.icons8.com/ios-filled/20/000000/salad.png', color: '#10B981' },
  { id: 'principales', nombre: 'Platos Principales', icono: 'https://img.icons8.com/ios-filled/20/000000/restaurant.png', color: '#FDB022' },
  { id: 'postres', nombre: 'Postres', icono: 'https://img.icons8.com/ios-filled/20/000000/cake.png', color: '#EC4899' },
  { id: 'bebidas', nombre: 'Bebidas', icono: 'https://img.icons8.com/ios-filled/20/000000/wine-glass.png', color: '#8B5CF6' },
];

const VistaMenu = () => {
  const [platos, setPlatos] = useState(menuInicial);
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [platoEditando, setPlatoEditando] = useState(null);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('todos');

  // Formulario para nuevo/editar plato
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'entradas',
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

  const abrirModalNuevo = () => {
    setPlatoEditando(null);
    setFormulario({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: 'entradas',
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
      alert('Por favor complete los campos obligatorios');
      return;
    }

    const nuevoPlato = {
      id: platoEditando ? platoEditando.id : Date.now(),
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      precio: parseInt(formulario.precio),
      categoria: formulario.categoria,
      disponible: formulario.disponible,
      imagen: formulario.imagen || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
      tiempoPreparacion: parseInt(formulario.tiempoPreparacion) || 15,
      alergenos: formulario.alergenos,
      popularidad: platoEditando ? platoEditando.popularidad : Math.floor(Math.random() * 20) + 70,
    };

    if (platoEditando) {
      setPlatos(platos.map(p => p.id === platoEditando.id ? nuevoPlato : p));
    } else {
      setPlatos([...platos, nuevoPlato]);
    }

    cerrarModal();
  };

  const eliminarPlato = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este plato?')) {
      setPlatos(platos.filter(p => p.id !== id));
    }
  };

  const toggleDisponibilidad = (id) => {
    setPlatos(platos.map(p =>
      p.id === id ? { ...p, disponible: !p.disponible } : p
    ));
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

        <button className="btn-nuevo-plato" onClick={abrirModalNuevo}>
          <span>+</span> Nuevo Plato
        </button>
      </div>

      {/* Filtros por categoría */}
      <div className="categorias-filtro">
        <button
          className={`categoria-btn ${categoriaActiva === 'todos' ? 'activo' : ''}`}
          onClick={() => setCategoriaActiva('todos')}
        >
          <span className="categoria-icono">
            <img src="https://img.icons8.com/ios-filled/20/000000/restaurant.png" alt="" style={{width:'20px', height:'20px'}} />
          </span>
          <span className="categoria-nombre">Todos</span>
        </button>
        {categorias.map(categoria => (
          <button
            key={categoria.id}
            className={`categoria-btn ${categoriaActiva === categoria.id ? 'activo' : ''}`}
            onClick={() => setCategoriaActiva(categoria.id)}
          >
            <span className="categoria-icono">
              <img src={categoria.icono} alt="" style={{width:'20px', height:'20px'}} />
            </span>
            <span className="categoria-nombre">{categoria.nombre}</span>
            <span className="categoria-cantidad">
              {platos.filter(p => p.categoria === categoria.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid de platos */}
      <div className="platos-grid">
        {platosFiltrados.map(plato => (
          <div key={plato.id} className={`plato-card ${!plato.disponible ? 'no-disponible' : ''}`}>
            <div className="plato-imagen">
              <img src={plato.imagen ? plato.imagen : '/assets/images/placeholder-plato.png'} alt={plato.nombre} onError={e => { e.target.onerror = null; e.target.src = '/assets/images/placeholder-plato.png'; }} />
              {!plato.disponible && <div className="plato-overlay">No disponible</div>}
            </div>

            <div className="plato-info">
              <div className="plato-header">
                <h3 className="plato-nombre">{plato.nombre}</h3>
                <div className="plato-acciones">
                  <button
                    className="btn-accion"
                    onClick={() => toggleDisponibilidad(plato.id)}
                    title={plato.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}
                  >
                    <img src={plato.disponible ? 'https://img.icons8.com/ios-filled/20/000000/checkmark.png' : 'https://img.icons8.com/ios-filled/20/000000/cancel.png'} alt="" style={{width:'16px', height:'16px'}} />
                  </button>
                  <button
                    className="btn-accion"
                    onClick={() => abrirModalEditar(plato)}
                    title="Editar plato"
                  >
                    <img src="https://img.icons8.com/ios-filled/20/000000/edit.png" alt="" style={{width:'16px', height:'16px'}} />
                  </button>
                  <button
                    className="btn-accion eliminar"
                    onClick={() => eliminarPlato(plato.id)}
                    title="Eliminar plato"
                  >
                    <img src="https://img.icons8.com/ios-filled/20/000000/trash.png" alt="" style={{width:'16px', height:'16px'}} />
                  </button>
                </div>
              </div>

              <p className="plato-descripcion">{plato.descripcion}</p>

              <div className="plato-detalles">
                <span className="plato-precio">{formatearPrecio(plato.precio)}</span>
                <span className="plato-tiempo">{plato.tiempoPreparacion}min</span>
                <div className="plato-popularidad">
                  <span className="popularidad-icono">
                    <img src="https://img.icons8.com/ios-filled/20/000000/star--v1.png" alt="" style={{width:'16px', height:'16px'}} />
                  </span>
                  <span className="popularidad-valor">{plato.popularidad}%</span>
                </div>
              </div>

              {plato.alergenos.length > 0 && (
                <div className="plato-alergenos">
                  <span className="alergenos-etiqueta">⚠️ Alérgenos:</span>
                  {plato.alergenos.map(alergeno => (
                    <span key={alergeno} className="alergeno-tag">{alergeno}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para nuevo/editar plato */}
      {modalVisible && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido menu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{platoEditando ? 'Editar Plato' : 'Nuevo Plato'}</h2>
              <button className="modal-cerrar" onClick={cerrarModal}>
                <img src="https://img.icons8.com/ios-filled/20/000000/delete-sign.png" alt="Cerrar" style={{width:'20px', height:'20px'}} />
              </button>
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
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
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

                <div className="form-grupo full-width">
                  <label>URL de imagen</label>
                  <input
                    type="url"
                    value={formulario.imagen}
                    onChange={(e) => setFormulario({...formulario, imagen: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-grupo full-width">
                  <label>Alérgenos</label>
                  <div className="alergenos-input">
                    <input
                      type="text"
                      placeholder="Agregar alérgeno..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          agregarAlergeno(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <div className="alergenos-lista">
                      {formulario.alergenos.map(alergeno => (
                        <span key={alergeno} className="alergeno-tag editable">
                          {alergeno}
                          <button onClick={() => quitarAlergeno(alergeno)}>
                            <img src="https://img.icons8.com/ios-filled/20/666666/delete-sign.png" alt="Quitar" style={{width:'12px', height:'12px'}} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
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
              <button className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
              <button className="btn-guardar" onClick={guardarPlato}>
                {platoEditando ? 'Actualizar' : 'Crear'} Plato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaMenu;