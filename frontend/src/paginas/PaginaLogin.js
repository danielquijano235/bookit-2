/**
 * ============================================
 * BOOKIT - Página de Login
 * Archivo: paginas/PaginaLogin.js
 * ============================================
 * 
 * Propósito: Página de inicio de sesión.
 * Contiene el formulario de login centrado en pantalla.
 */

import React from 'react';
import FormularioLogin from '../componentes/Login/FormularioLogin';
import '../estilos/login.css';

const PaginaLogin = () => {
  return (
    <div className="login-pagina">
      <FormularioLogin />
    </div>
  );
};

export default PaginaLogin;
