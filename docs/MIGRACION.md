# Guía de Migración: Estructura Original → Nueva Estructura

## ¿Qué cambió?

El proyecto ha sido separado en dos carpetas claramente definidas:

### Antes (Estructura Mezclada)
```
src/          ← Backend
public/       ← Frontend
data/         ← Datos
uploads/      ← Archivos
server.js     ← Punto de entrada
package.json
```

### Ahora (Estructura Separada)
```
backend/      ← Código del servidor
  ├── src/
  ├── data/
  ├── uploads/
  ├── server.js
  └── package.json

frontend/     ← Código del cliente
  ├── public/
  └── package.json
```

## 🔄 Puntos Importantes

1. **Backend**
   - Ejecutar desde: `backend/` folder
   - Comando: `npm install && npm start`
   - Puerto: 3000 (configurable con `PORT=XXXX`)
   - Sirve el frontend desde `../../frontend/public`

2. **Frontend**
   - No requiere instalación de dependencias
   - Se sirve automáticamente desde el backend
   - Todos los archivos deben estar en `frontend/public/`

3. **Archivos Compartidos**
   - `Procfile` - Sigue en la raíz para Heroku
   - `README.md` - Documentación original (conservada)

## ⚠️ Cambios en Rutas

Si tenías referencias a las rutas antiguas, actualiza:

**Antes:**
- Archivos Backend: `./src/**`
- Archivos Frontend: `./public/**`

**Ahora:**
- Archivos Backend: `./backend/src/**`
- Archivos Frontend: `./frontend/public/**`

## 📚 Ficheros de Ayuda Creados

- `ESTRUCTURA.md` - Resumen ejecutivo
- `README_ESTRUCTURA.md` - Guía detallada
- `README_PROYECTO.md` - Overview general
- `MIGRACION.md` - Este archivo

## ✅ Checklist

- ✓ Backend copiado a `/backend`
- ✓ Frontend copiado a `/frontend`
- ✓ Datos migrados a `/backend/data`
- ✓ Configuración de impresoras en `/backend/src/config`
- ✓ Package.json actualizado en ambos lados
- ✓ Rutas internas en `backend/src/app.js` actualizadas
- ✓ Carpeta `uploads` creada en backend

## 🎯 Próximos Pasos

1. Copiar assets (si los hay) a `frontend/public/assets/`
2. Instalar dependencias: `cd backend && npm install`
3. Probar: `cd backend && npm run dev`
4. Realizar cambios finales según sea necesario

¡Listo! Tu proyecto está reorganizado y optimizado.
