# Web Impresiones QR

Aplicación web para generar códigos QR a partir de texto ingresado por el usuario e imprimirlos directamente en una impresora Zebra en la red local.

## Instalación

1. Clona o descarga el proyecto.
2. Ejecuta `npm install` para instalar las dependencias.

## Uso

1. Ejecuta `npm start` para iniciar el servidor.
2. Abre tu navegador en `http://localhost:3000`.
3. Ingresa el texto en el campo y haz clic en "Generar QR" para ver el código QR.
4. Haz clic en "Imprimir" para enviar el QR a la impresora Zebra.

## Configuración de la Impresora

- En `server.js`, cambia la variable `printerIP` a la dirección IP real de tu impresora Zebra.
- Asegúrate de que la impresora esté en la misma red y accesible en el puerto 9100 (puerto estándar para impresoras Zebra).

## Solución de Problemas

- Si hay errores de conexión con la impresora, verifica la IP y el puerto.
- Asegúrate de que Node.js esté instalado y npm funcione correctamente.
- Para desarrollo, usa `npm run dev` con nodemon.

## Dependencias

- Express: Framework web para Node.js.
- QRCode: Librería para generar códigos QR en el cliente.