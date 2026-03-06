# 📋 Checklist de Deployment en Render - BookIt

## ✅ Paso 1: Crear la Base de Datos PostgreSQL

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"PostgreSQL"**
3. Configura los siguientes datos:

```
Name: bookit-db
Database: bookit
User: bookit_admin
Region: Oregon (us-west) o el más cercano
PostgreSQL Version: 15
Instance Type: Free
```

4. Click en **"Create Database"**
5. **Espera 2-3 minutos** hasta que el estado sea "Available"
6. Copia los siguientes datos (los encontrarás en la sección "Connections"):
   - **Internal Database URL** (para el backend)
   - **PSQL Command** (para importar datos)

---

## ✅ Paso 2: Importar el Schema y Datos

### Opción A: Desde tu computadora local

1. Abre PowerShell
2. Copia el comando PSQL que te dio Render (se ve así):
   ```bash
   psql -h dpg-xxxxx-a.oregon-postgres.render.com -U bookit_admin bookit
   ```
3. Cuando pida contraseña, pégala desde Render Dashboard
4. Ejecuta estos comandos **en orden**:
   ```sql
   \i 'C:/Users/B16-1-507-23/bookit-2/base-datos/bookit.sql'
   \i 'C:/Users/B16-1-507-23/bookit-2/base-datos/datos-prueba.sql'
   \q
   ```

### Opción B: Copiar el contenido manualmente

1. En Render Dashboard, ve a tu base de datos → pestaña "Query"
2. Abre `base-datos/bookit.sql` y copia TODO el contenido
3. Pégalo en la consola de Query y ejecuta
4. Repite lo mismo con `base-datos/datos-prueba.sql`

---

## ✅ Paso 3: Desplegar el Backend (PHP con Docker)

1. Ve a Render Dashboard → **"New +"** → **"Web Service"**
2. Conecta tu repositorio de Github: **"despliegue-camilo"**
3. Click en **"Connect"** junto al repositorio
4. Configura los siguientes datos:

```
Name: bookit-backend
Region: Oregon (us-west) - ¡MISMO REGION QUE LA DB!
Branch: main
Root Directory: .
Runtime: Docker
Docker Command: (déjalo vacío, usa el Dockerfile)
Instance Type: Free
```

5. Click en **"Advanced"** y agrega estas **Environment Variables**:

```bash
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=bookit
DB_USER=bookit_admin
DB_PASSWORD=[tu contraseña de la base de datos]
CORS_ORIGIN=https://tu-frontend-url.onrender.com
```

> **IMPORTANTE**: Reemplaza los valores de DB_* con los datos reales de tu PostgreSQL.
> El valor de `CORS_ORIGIN` lo agregarás después de crear el frontend.

6. Click en **"Create Web Service"**
7. **Espera 5-10 minutos** para que construya la imagen Docker
8. Cuando termine, copia la URL (ej: `https://bookit-backend.onrender.com`)
9. Prueba que funcione visitando: `https://bookit-backend.onrender.com/index.php`

---

## ✅ Paso 4: Actualizar CORS_ORIGIN del Backend

1. Ve al frontend que crearás en el siguiente paso
2. Copia su URL de producción (ej: `https://bookit-app.onrender.com`)
3. Regresa al backend → pestaña "Environment"
4. Edita la variable `CORS_ORIGIN` y pega la URL del frontend
5. Guarda y espera que se redeploy automáticamente (~1 min)

---

## ✅ Paso 5: Desplegar el Frontend (React)

1. Ve a Render Dashboard → **"New +"** → **"Static Site"**
2. Selecciona el mismo repositorio: **"despliegue-camilo"**
3. Configura:

```
Name: bookit-app
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

4. Click en **"Advanced"** y agrega esta **Environment Variable**:

```bash
REACT_APP_API_URL=https://bookit-backend.onrender.com
```

> **IMPORTANTE**: Reemplaza con la URL real de tu backend del Paso 3.

5. Click en **"Create Static Site"**
6. **Espera 3-5 minutos** para que construya
7. Cuando termine, copia la URL del frontend
8. **¡Ve al Paso 4!** para actualizar el CORS del backend con esta URL

---

## ✅ Paso 6: Verificar la Configuración del Frontend

Abre el archivo `frontend/src/servicios/api.js` y verifica que tenga:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/bookit-2/backend';
```

Si no está así, edita el archivo y haz push:

```bash
git add frontend/src/servicios/api.js
git commit -m "Configurar API URL dinámica"
git push
```

Render re-deployará automáticamente.

---

## ✅ Paso 7: Testing

### Test 1: Verificar Backend
Visita: `https://bookit-backend.onrender.com/index.php`

Deberías ver:
```json
{"mensaje":"API de BookIt funcionando","version":"1.0"}
```

### Test 2: Login de Prueba
Abre tu app en: `https://bookit-app.onrender.com`

Credenciales de prueba:
- **Email**: admin@bookit.com
- **Password**: Admin123

### Test 3: Dashboard
Después de login, deberías ver:
- Métricas de hoy (reservas, clientes, ocupación)
- Gráfica de reservas por día de la semana
- Lista de próximas reservas

---

## 🎯 Resumen de URLs

Guarda estas URLs para tu proyecto:

```
🗄️ Base de Datos: [tu-db-host].oregon-postgres.render.com
🔧 Backend API: https://bookit-backend.onrender.com
🌐 Frontend App: https://bookit-app.onrender.com
```

---

## 🚨 Solución de Problemas

### Error: "Connection refused" o "Database unavailable"
- Verifica que backend y DB estén en la **misma región**
- Verifica las variables DB_* en el backend
- Revisa los logs: Backend → "Logs" tab

### Error: "CORS policy error"
- Verifica que `CORS_ORIGIN` tenga la URL del frontend (sin `/` al final)
- Espera 1-2 min después de cambiar variables (auto-redeploy)

### Error: "502 Bad Gateway"
- El servicio gratuito "duerme" después de 15 min sin uso
- Espera 30-60 segundos en la primera visita mientras "despierta"
- Recarga la página

### Frontend no muestra datos
- Abre DevTools → Console para ver errores
- Verifica que `REACT_APP_API_URL` esté correctamente configurada
- Verifica que el backend responda en `/index.php`

---

## 📝 Notas Importantes

1. **Servicios gratuitos "duermen"**: Después de 15 minutos sin uso, los servicios free entran en sleep mode. La primera request toma 30-60 segundos.

2. **Base de datos gratuita expira**: Las DBs free en Render **expiran después de 90 días**. Respalda tus datos periódicamente.

3. **Dominio personalizado**: Para usar tu propio dominio, ve a Settings → Custom Domains en cada servicio.

4. **Logs en tiempo real**: Para ver errores PHP, ve a Backend → Logs tab.

5. **Auto-deploy**: Cada push a la rama `main` triggerea un nuevo deployment automáticamente.

---

✅ **¡Listo!** Tu aplicación BookIt está desplegada en producción.
