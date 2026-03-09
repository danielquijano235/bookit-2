---
Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| **React 18** (JavaScript) | Frontend - Interfaz de usuario |
| **React Router v6** | Navegación entre páginas (SPA) |
| **Chart.js** | Gráficas de barras del dashboard |
| **CSS puro** | Estilos sin frameworks (sin Bootstrap ni Tailwind) |
| **PHP 7.4+** | Backend - API REST |
| **MySQL 5.7+** | Base de datos relacional |
| **MySQLi** | Conexión PHP-MySQL con prepared statements |
| **XAMPP** | Servidor local (Apache + PHP + MySQL) |
---

## 📁 Estructura del Proyecto

```
bookit/
├── frontend/                          # Aplicación React
│   ├── public/
│   │   └── index.html                 # HTML base
│   ├── src/
│   │   ├── componentes/               # Componentes React
│   │   │   ├── LandingPage/           # Componentes de la landing
│   │   │   │   ├── BarraNavegacion.js  # Navbar sticky
│   │   │   │   ├── SeccionHero.js      # Sección principal
│   │   │   │   ├── SeccionVentajas.js  # 6 tarjetas de ventajas
│   │   │   │   ├── SeccionCaracteristicas.js # Tabs de features
│   │   │   │   ├── SeccionTestimonios.js     # 6 testimonios
│   │   │   │   └── PiePagina.js        # Footer
│   │   │   ├── Dashboard/             # Componentes del panel
│   │   │   │   ├── BarraLateral.js     # Sidebar con menú
│   │   │   │   ├── BarraSuperior.js    # Header con búsqueda
│   │   │   │   ├── TarjetaMetrica.js   # Tarjeta de métrica
│   │   │   │   ├── GraficaReservas.js  # Gráfica Chart.js
│   │   │   │   ├── ListaReservas.js    # Lista de reservas
│   │   │   │   └── ModalNuevaReserva.js # Modal para crear
│   │   │   ├── Login/
│   │   │   │   └── FormularioLogin.js  # Formulario de login
│   │   │   └── Compartidos/           # Componentes reutilizables
│   │   │       ├── Boton.js
│   │   │       ├── Tarjeta.js
│   │   │       └── Cargando.js
│   │   ├── paginas/                   # Páginas principales
│   │   │   ├── PaginaLanding.js
│   │   │   ├── PaginaLogin.js
│   │   │   └── PaginaDashboard.js
│   │   ├── estilos/                   # Hojas de estilo CSS
│   │   │   ├── variables.css           # Variables (colores, etc.)
│   │   │   ├── landing.css             # Estilos landing page
│   │   │   ├── login.css               # Estilos login
│   │   │   ├── dashboard.css           # Estilos dashboard
│   │   │   └── compartidos.css         # Estilos globales
│   │   ├── servicios/
│   │   │   └── api.js                  # Funciones de peticiones HTTP
│   │   ├── App.js                      # Componente raíz con rutas
│   │   └── index.js                    # Punto de entrada React
│   └── package.json                    # Dependencias npm
│
├── backend/                            # API PHP
│   ├── configuracion/
│   │   └── conexion.php                # Conexión a MySQL + CORS
│   ├── autenticacion/
│   │   ├── login.php                   # Iniciar sesión
│   │   ├── registro.php                # Registrar usuario
│   │   ├── verificar-sesion.php        # Verificar si está logueado
│   │   └── cerrar-sesion.php           # Cerrar sesión
│   ├── reservas/
│   │   ├── obtener-todas.php           # GET todas las reservas
│   │   ├── obtener-una.php             # GET una reserva por ID
│   │   ├── crear.php                   # POST nueva reserva
│   │   ├── actualizar.php              # PUT actualizar estado
│   │   └── eliminar.php               # DELETE eliminar reserva
│   ├── clientes/
│   │   ├── obtener-todos.php           # GET todos los clientes
│   │   ├── obtener-uno.php             # GET un cliente por ID
│   │   ├── crear.php                   # POST nuevo cliente
│   │   └── actualizar.php              # PUT actualizar cliente
│   ├── estadisticas/
│   │   ├── metricas-hoy.php            # Métricas del dashboard
│   │   ├── reservas-semana.php         # Datos para la gráfica
│   │   └── proximas-reservas.php       # Próximas reservas
│   └── .htaccess                       # Config Apache
│
├── base-datos/
│   ├── bookit.sql                      # Estructura de tablas
│   └── datos-prueba.sql                # Datos de ejemplo
│
└── README.md                           # Este archivo
```

---


Requisitos

Antes de instalar, asegúrate de tener:

1. **XAMPP** (o similar como WAMP, MAMP)
   - Descarga: https://www.apachefriends.org/es/download.html
   - Incluye Apache, PHP y MySQL

2. **Node.js** (versión 16 o superior) y **npm**
   - Descarga: https://nodejs.org/es
   - Verificar instalación: `node --version` y `npm --version`

---

### PASO 1: Configurar la Base de Datos

1. Abre **XAMPP** y enciende **Apache** y **MySQL**
2. Abre **phpMyAdmin** en tu navegador: http://localhost/phpmyadmin
3. Haz clic en **"Nueva"** (menú izquierdo) para crear una base de datos
4. Escribe `bookit` como nombre y selecciona `utf8mb4_unicode_ci`
5. Haz clic en **"Crear"**
6. Ve a la pestaña **"Importar"**
7. Selecciona el archivo `base-datos/bookit.sql` y haz clic en **"Continuar"**
8. Repite la importación con el archivo `base-datos/datos-prueba.sql`

### PASO 2: Configurar el Backend (PHP)

1. Copia la carpeta **`backend`** completa a la ruta de XAMPP:

   ```
   C:/xampp/htdocs/bookit/backend/
   ```

   (La estructura debería quedar: `C:/xampp/htdocs/bookit/backend/configuracion/conexion.php`)

2. Verifica que la configuración en `backend/configuracion/conexion.php` sea correcta:

   ```php
   $servidor = "localhost";
   $usuario = "root";
   $contrasena = "";       // Vacía por defecto en XAMPP
   $base_datos = "bookit";
   ```

3. Asegúrate de que **Apache** esté corriendo en XAMPP



1. Abre una **terminal/CMD** en la carpeta `frontend`:

   ```bash
   cd ruta/al/proyecto/frontend
   ```

2. Instala las dependencias con npm:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm start
   ```

4. El navegador se abrirá automáticamente en **http://localhost:3000**

### PASO 4: Probar la Aplicación

1. La **Landing Page** se carga en http://localhost:3000
2. Haz clic en **"Iniciar Sesión"** o ve a http://localhost:3000/login
3. Usa las credenciales de prueba:

   | Campo          | Valor              |
   | -------------- | ------------------ |
   | **Email**      | `admin@bookit.com` |
   | **Contraseña** | `Admin123`         |

4. Después del login, serás redirigido al **Dashboard** con todas las métricas y datos

---

## 🔐 Credenciales de Prueba

| Usuario        | Email            | Contraseña |
| -------------- | ---------------- | ---------- |
| Daniel Quijano | admin@bookit.com | Admin123   |

---

## 🎨 Paleta de Colores

| Color                | Código    | Uso                              |
| -------------------- | --------- | -------------------------------- |
| Amarillo (principal) | `#FDB022` | Botones, badges, logo            |
| Azul oscuro          | `#1e3a5f` | Sidebar, footer, navbar          |
| Verde                | `#10B981` | Badges positivos, confirmaciones |
| Morado               | `#8B5CF6` | Iconos y acentos                 |
| Rosa                 | `#EC4899` | Iconos y variedad visual         |
| Naranja              | `#F97316` | Iconos y alertas                 |
| Gris fondo           | `#f5f6fa` | Fondos de secciones              |

---

## 📊 Base de Datos

### Tablas

1. **usuarios**: Administradores de restaurantes (login, datos del restaurante)
2. **clientes**: Clientes que hacen reservas (nombre, teléfono, email, visitas)
3. **mesas**: Mesas del restaurante (número, capacidad, ubicación, estado)
4. **reservas**: Reservas realizadas (cliente, mesa, fecha, hora, estado)

### Relaciones

- Un **usuario** tiene muchos **clientes**, **mesas** y **reservas**
- Un **cliente** puede tener muchas **reservas**
- Una **mesa** puede estar en muchas **reservas**
- Las **reservas** conectan clientes con mesas en fechas específicas

---

## 🔧 Solución de Problemas

### Error de CORS

Si ves errores de CORS en la consola del navegador:

- Verifica que Apache esté corriendo en XAMPP
- Asegúrate de que la carpeta backend esté en `C:/xampp/htdocs/bookit/backend/`
- Revisa que el archivo `conexion.php` tenga los headers de CORS correctos

### Error de conexión a MySQL

- Verifica que MySQL esté corriendo en XAMPP
- Asegúrate de que la base de datos `bookit` existe
- Revisa las credenciales en `conexion.php`

### El dashboard muestra datos de ejemplo

Si el backend no está conectado, el dashboard muestra datos estáticos de ejemplo. Esto es normal para poder ver la interfaz sin backend. Los datos reales se cargarán cuando el backend esté configurado correctamente.

Si el backend no está conectado, el dashboard muestra datos estáticos de ejemplo. Esto es normal para poder ver la interfaz sin backend. Los datos reales se cargarán cuando el backend esté configurado correctamente.

git push origin main
