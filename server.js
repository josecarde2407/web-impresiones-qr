const express = require('express');
const net = require('net');
const QRCode = require('qrcode');
const { PNG } = require('pngjs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

/* ==========================================================
   CONFIGURACIÓN PRIVADA (OCULTA AL FRONTEND)
   ========================================================== */
const printers = {
    recepcion: { ip: '10.155.158.200', port: 9100, nombre: 'REPCIÓN' },
    pt: { ip: '10.155.158.201', port: 9100, nombre: 'PRODUCTO TERMINADO' }
};

/* ==========================================================
   1. PROCESAMIENTO GRÁFICO (QR)
   ========================================================== */
async function qrToZPL(text) {
    const buffer = await QRCode.toBuffer(text, { type: 'png', width: 320, margin: 1 });
    const png = PNG.sync.read(buffer);
    const { width, height, data } = png;
    const bytesPerRow = Math.ceil(width / 8);
    let hex = '';

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < bytesPerRow; x++) {
            let byte = 0;
            for (let bit = 0; bit < 8; bit++) {
                const px = x * 8 + bit;
                if (px < width) {
                    const idx = (y * width + px) * 4;
                    if (data[idx] < 128) byte |= (0x80 >> bit);
                }
            }
            hex += byte.toString(16).padStart(2, '0').toUpperCase();
        }
    }
    return { totalBytes: bytesPerRow * height, bytesPerRow, hex, width };
}

/* ==========================================================
   2. LÓGICA DE DISEÑO (VALIDACIÓN DE FORMATO)
   ========================================================== */
async function generarZPLDatos(text) {
    const cleanText = text.toString().trim();
    const parts = cleanText.split('-');
    
    // Si no tiene el formato de ubicación, lanzamos error para que no cuente como enviada
    if (parts.length < 6) throw new Error("Formato inválido");

    const nivel = parseInt(parts[4]) || 0;
    const prof = parseInt(parts[5]) || 0;
    const letra = (prof === 1) ? 'A' : (prof === 2) ? 'D' : '?';
    
    const qr = await qrToZPL(cleanText);
    const qrX = Math.floor((800 - qr.width) / 2);

    return `^XA^PW800^LL600^CI28
^FO40,120^A0N,240,180^FD${letra}^FS
~DGR:QR.GRF,${qr.totalBytes},${qr.bytesPerRow},${qr.hex}
^FO${qrX},20^XGR:QR.GRF,1,1^FS
^FO640,50^A0N,45,45^FB220,1,0,C^FDNIVEL^FS
^FO640,90^A0N,160,130^FB220,1,0,C^FD${nivel}^FS
^FO640,250^A0N,45,45^FB220,1,0,C^FDPROF^FS
^FO640,300^A0N,130,110^FB220,1,0,C^FD${prof}^FS
^FO60,400^GB680,150,3^FS
^FO90,410^A0N,60,50^FD${cleanText}^FS
^FO60,480^GB680,0,3^FS
^FO90,500^A0N,40,45^FDPL   ALM   RCK   POS   NIV   PROF^FS
^XZ`;
}

/* ==========================================================
   3. COMUNICACIÓN TCP CON IMPRESORA
   ========================================================== */
function enviarAImpresora(zpl, printer) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(3000);

        socket.connect(printer.port, printer.ip, () => {
            socket.write(zpl, 'ascii', () => {
                socket.end();
                resolve(true); // Retorna éxito real
            });
        });

        socket.on('error', () => { socket.destroy(); resolve(false); });
        socket.on('timeout', () => { socket.destroy(); resolve(false); });
    });
}

/* ==========================================================
   4. ENDPOINT: /print-multiple
   ========================================================== */
app.post('/print-multiple', async (req, res) => {
    try {
        const { printer, textos } = req.body;
        const target = printers[printer];

        if (!target) return res.status(400).send("Impresora no válida.");
        if (!textos || textos.length === 0) return res.status(400).send("No hay datos.");

        let exitos = 0;

        for (const t of textos) {
            try {
                const zpl = await generarZPLDatos(t);
                const fueEnviado = await enviarAImpresora(zpl, target);
                if (fueEnviado) exitos++;
            } catch (err) {
                console.error(`Salto de etiqueta por error: ${t}`);
            }
        }

        // RESPUESTA SEGURA Y REAL
        if (exitos > 0) {
            // Solo mencionamos el nombre descriptivo, NUNCA la IP
            res.send(`${exitos} etiqueta(s) impresa(s) en ${target.nombre}.`);
        } else {
            res.status(422).send("No se pudo imprimir. Verifique el formato o conexión.");
        }

    } catch (error) {
        res.status(500).send("Error interno en el servidor.");
    }
});

app.listen(port, () => {
    console.log(`✅ Backend seguro ejecutándose en puerto ${port}`);
});