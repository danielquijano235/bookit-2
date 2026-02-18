/**
 * ============================================
 * BOOKIT - Componente FormularioLogin
 * Archivo: componentes/Login/FormularioLogin.js
 * ============================================
 * 
 * Propósito: Formulario de inicio de sesión con validación.
 * Envía las credenciales al backend PHP y redirige al dashboard.
 * 
 * Estados:
 *   - email: Valor del campo de email
 *   - contrasena: Valor del campo de contraseña
 *   - mostrarContrasena: Toggle para mostrar/ocultar contraseña
 *   - error: Mensaje de error si el login falla
 *   - cargando: Indica si está procesando la petición
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../servicios/api';

const FormularioLogin = () => {
  // Estados del formulario
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  /**
   * Manejar el envío del formulario
   * Se ejecuta cuando el usuario hace clic en "Iniciar Sesión"
   */
  const manejarSubmit = async (e) => {
    e.preventDefault(); // Evitar que la página se recargue
    setError('');        // Limpiar error anterior

    // Validación básica en el frontend
    if (!email || !contrasena) {
      setError('Por favor, completa todos los campos');
      return;
    }

    // Validar formato de email
    if (!email.includes('@')) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    setCargando(true); // Mostrar indicador de carga

    try {
      // Enviar petición al backend
      const respuesta = await login(email, contrasena);
      
      // Si el login es exitoso, guardar datos y redirigir
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
      navigate('/dashboard');
    } catch (err) {
      // Si hay error, mostrar mensaje
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setCargando(false); // Ocultar indicador de carga
    }
  };

  return (
    <div className="login-tarjeta">
      {/* Logo */}
      <div className="login-logo">
        <img src="/assets/images/logo-bookit.png" alt="BookIt" className="login-logo-img" />
      </div>

      {/* Título */}
      <h1 className="login-titulo">Iniciar Sesión</h1>
      <p className="login-subtitulo">Ingresa tus credenciales para acceder</p>

      {/* Mensaje de error (solo se muestra si hay error) */}
      {error && <div className="login-error">{error}</div>}

      {/* Formulario */}
      <form className="login-formulario" onSubmit={manejarSubmit}>
        {/* Campo de email */}
        <div className="campo-grupo">
          <label className="campo-label">Email</label>
          <div className="campo-input-contenedor">
            <span className="campo-icono"><img src="https://img.icons8.com/ios-filled/18/999999/email.png" alt="email" width="18" height="18" /></span>
            <input
              type="email"
              className="campo-input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Campo de contraseña */}
        <div className="campo-grupo">
          <label className="campo-label">Contraseña</label>
          <div className="campo-input-contenedor">
            <span className="campo-icono"><img src="https://img.icons8.com/ios-filled/18/999999/lock.png" alt="contraseña" width="18" height="18" /></span>
            <input
              type={mostrarContrasena ? 'text' : 'password'}
              className="campo-input"
              placeholder="Tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            {/* Botón para mostrar/ocultar contraseña */}
            <button
              type="button"
              className="btn-mostrar-contrasena"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
            >
              <img src={mostrarContrasena ? "https://img.icons8.com/ios-filled/20/666666/invisible.png" : "https://img.icons8.com/ios-filled/20/666666/visible.png"} alt="toggle" width="20" height="20" />
            </button>
          </div>
        </div>

        {/* Opciones: Recordarme y Olvidé contraseña */}
        <div className="login-opciones">
          <label className="recordarme">
            <input type="checkbox" />
            Recordarme
          </label>
          <a href="#" className="link-olvide">¿Olvidaste tu contraseña?</a>
        </div>

        {/* Botón de login */}
        <button 
          type="submit" 
          className="btn-login"
          disabled={cargando}
        >
          {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        {/* Separador */}
        <div className="login-separador">
          <span>o</span>
        </div>

        {/* Link de registro */}
        <p className="login-registro">
          ¿No tienes cuenta?{' '}
          <a href="#">Regístrate aquí</a>
        </p>
      </form>
    </div>
  );
};

export default FormularioLogin;
