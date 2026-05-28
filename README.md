# 🖨️ Web Impresiones QR

Sistema web para generar e imprimir etiquetas QR directamente en impresoras Zebra conectadas en red local.

---

# ✨ Características

- ✅ Generación de códigos QR
- ✅ Impresión directa a impresoras Zebra
- ✅ Gestión de múltiples impresoras
- ✅ Configuración dinámica desde panel administrador
- ✅ Impresión individual y por lotes
- ✅ Interfaz moderna y responsive
- ✅ Modo oscuro / claro
- ✅ Validación de ubicaciones
- ✅ Compatible con red local Zebra (Puerto 9100)

---

# 📦 Tecnologías Utilizadas

| Tecnología | Descripción |
|---|---|
| Node.js | Entorno backend |
| Express | Framework servidor |
| QRCode | Generación de QR |
| HTML/CSS/JS | Frontend |
| Zebra ZPL | Lenguaje de impresión |

---

# 📁 Estructura del Proyecto

```txt
web-impresiones-qr/
│
├── backend/
├── frontend/
├── docs/
├── README.md
└── Procfile
```

---

# ⚙️ Instalación

## 1. Clonar proyecto

```bash
git clone https://github.com/tu-repo/web-impresiones-qr.git
```

## 2. Entrar al proyecto

```bash
cd web-impresiones-qr
```

## 3. Instalar dependencias

```bash
npm install
```

---

# 🚀 Ejecución

## Producción

```bash
npm start
```

## Desarrollo

```bash
npm run dev
```

---

# 🌐 Acceso al Sistema

```txt
http://localhost:3000
```

---

# 🖨️ Configuración de Impresoras

Editar:

```txt
backend/src/config/printers.json
```

Ejemplo:

```json
{
  "recepcion": {
    "ip": "10.155.158.38",
    "port": 9100,
    "nombre": "RECEPCION"
  }
}
```

---

# 📋 Funcionalidades

- Impresión individual
- Impresión masiva
- Gestión de impresoras
- Importación Excel
- Panel administrador

---

# 👨‍💻 Autor

**JoseDev** © 2026

GitHub:
https://github.com/josecarde2407
