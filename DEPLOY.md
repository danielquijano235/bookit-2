# BookIt - Despliegue en Render

Este proyecto requiere configuración especial para desplegarse en Render debido a su arquitectura de backend PHP + frontend React.

## 📦 Opciones de Despliegue

### Opción 1: Desplegar Frontend y Backend por separado (Recomendado)

#### Frontend (React)
1. Crea un nuevo **Web Service** en Render
2. Conecta este repositorio de GitHub
3. Configuración:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npx serve -s build -p $PORT`
   - **Root Directory**: (dejar vacío)

#### Backend (PHP)
- Render no soporta PHP nativamente
- Opciones:
  - Usar **InfinityFree** o **000webhost** (gratuito)
  - Migrar el backend a Node.js/Express
  - Usar **Railway** o **Heroku** con PHP buildpack

### Opción 2: Migrar Backend a Node.js
Para desplegar completamente en Render, considera migrar el backend PHP a Node.js con Express y MySQL.

## 🗄️ Base de Datos

Para MySQL, puedes usar:
- **Render PostgreSQL** (gratuito, pero requiere migrar de MySQL a PostgreSQL)
- **PlanetScale** (MySQL gratuito)
- **Railway MySQL** (tiene plan gratuito)

## 📝 Variables de Entorno Necesarias

Cuando despliegues, configura estas variables de entorno en Render:

```
DATABASE_HOST=tu-host-de-base-de-datos
DATABASE_NAME=bookit
DATABASE_USER=tu-usuario
DATABASE_PASSWORD=tu-contraseña
API_URL=tu-url-del-backend
```

## 🔗 Configuración CORS

El backend PHP necesita permitir peticiones desde el dominio de Render. Añade en cada archivo PHP del backend:

```php
header('Access-Control-Allow-Origin: https://tu-app.onrender.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
```
