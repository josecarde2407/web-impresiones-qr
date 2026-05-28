# Sistema de Impresión QR - Estructura Reorganizada

Aplicación web para generar códigos QR e imprimir en impresoras Zebra.

## 📁 Estructura del Proyecto

```
web-impresiones-qr/
├── backend/                    # Código del servidor (Node.js + Express)
│   ├── src/
│   │   ├── app.js             # Configuración principal de Express
│   │   ├── config/
│   │   │   ├── printers.js    # Gestor de configuración de impresoras
│   │   │   └── printers.json  # Datos de impresoras
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── routes/            # Rutas API
│   │   └── services/          # Servicios reutilizables
│   ├── data/                  # Base de datos JSON
│   │   └── ubicaciones.json
│   ├── uploads/               # Archivos subidos
│   ├── server.js              # Punto de entrada
│   └── package.json
│
├── frontend/                   # Código del cliente (HTML + CSS + JS)
│   ├── public/
│   │   ├── index.html         # Página principal
│   │   ├── admin.html         # Panel de administración
│   │   ├── styles.css         # Estilos principales
│   │   ├── stylesadmin.css    # Estilos del admin
│   │   └── assets/            # Imágenes, iconos, etc.
│   └── package.json
│
├── package.json               # Dependencias compartidas (opcional)
├── README.md                  # Este archivo
└── Procfile                   # Configuración para Heroku
```

## 🚀 Instalación

### Backend
```bash
cd backend
npm install
npm start        # Producción
npm run dev      # Desarrollo con nodemon
```

El backend se ejecutará en `http://localhost:3000`

### Frontend
El frontend está servido como archivos estáticos desde el backend en la carpeta `/frontend/public`.

## 🔗 API Endpoints

- `POST /print-multiple` - Imprimir múltiples etiquetas
- `GET /api/ubicaciones` - Obtener todas las ubicaciones
- `POST /api/ubicaciones` - Crear nueva ubicación
- `PUT /api/ubicaciones/:id` - Actualizar ubicación
- `DELETE /api/ubicaciones/:id` - Eliminar ubicación
- `POST /api/ubicaciones/import` - Importar desde Excel
- `GET /api/printers` - Obtener configuración de impresoras
- `PUT /api/printers` - Actualizar impresoras

## 📋 Tecnologías

### Backend
- Node.js 18.x
- Express.js
- CORS
- Multer (subida de archivos)
- QRCode
- XLSX (lectura de Excel)
- PNG.js (procesamiento de imágenes)

### Frontend
- HTML5
- CSS3
- JavaScript Vanilla

## ⚙️ Configuración

### Impresoras
Edita `backend/src/config/printers.json` para configurar tus impresoras Zebra.

### Ubicaciones
Las ubicaciones se guardan en `backend/data/ubicaciones.json` y pueden ser editadas desde el panel de admin.

## 📝 Notas

- La contraseña de admin está hardcodeada en `frontend/public/index.html` (cambiar por seguridad)
- Los uploads se guardan en `backend/uploads/`
- Los datos de ubicaciones se persisten en JSON (considerar usar base de datos para producción)

## 👨‍💻 Autor

Desarrollado por JoseDev © 2026
