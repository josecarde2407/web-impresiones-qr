const express = require('express');
const net = require('net');
const QRCode = require('qrcode');
const { PNG } = require('pngjs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// ===============================
// CONFIGURACIÓN DE IMPRESORAS
// ===============================
const printers = {
    recepcion: {
        ip: '10.155.158.200',
        port: 9100
    },
    pt: {
        ip: '10.155.158.201', 
        port: 9100
    }
};

// ===============================
// GENERAR QR COMO IMAGEN PNG → GRF
// ===============================
async function qrToZPL(text) {

    const buffer = await QRCode.toBuffer(text, {
        type: 'png',
        width: 320,
        margin: 1
    });

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
                    const luminance = data[idx];

                    if (luminance < 128) {
                        byte |= (0x80 >> bit);
                    }
                }
            }

            hex += byte.toString(16).padStart(2, '0').toUpperCase();
        }
    }

    const totalBytes = bytesPerRow * height;

    return {
        width,
        height,
        bytesPerRow,
        totalBytes,
        hex
    };
}

// ===============================
// ENDPOINT DE IMPRESIÓN
// ===============================
app.post('/print', async (req, res) => {

    try {

        const { text, printer } = req.body;

        console.log("Solicitud recibida:", req.body);

        if (!text) {
            return res.status(400).send('Texto requerido');
        }

        if (!printer || !printers[printer]) {
            return res.status(400).send('Impresora inválida');
        }

        const parts = text.split('-');

        if (parts.length !== 6) {
            return res.status(400).send('Formato inválido');
        }

        const nivel = parts[4];
        const profundidad = parts[5];

        const letra =
            profundidad === '001' ? 'A' :
            profundidad === '002' ? 'D' :
            '?';

        console.log("Generando QR...");

        const qr = await qrToZPL(text);

        const qrX = Math.floor((800 - qr.width) / 2);

        const zpl = `^XA
^PW800
^LL600
^CI28

^FO40,120
^A0N,240,180
^FD${letra}^FS

~DGR:QR.GRF,${qr.totalBytes},${qr.bytesPerRow},${qr.hex}
^FO${qrX},20
^XGR:QR.GRF,1,1^FS

^FO640,50^A0N,45,45^FB220,1,0,C^FDNIVEL^FS
^FO640,90^A0N,160,130^FB220,1,0,C^FD${parseInt(nivel)}^FS

^FO640,250^A0N,45,45^FB220,1,0,C^FDPROF^FS
^FO640,300^A0N,130,110^FB220,1,0,C^FD${parseInt(profundidad)}^FS

^FO60,400^GB680,150,3^FS
^FO90,410^A0N,60,50^FD${text}^FS
^FO60,480^GB680,0,3^FS
^FO90,500^A0N,40,45^FDPL   ALM   RCK   POS   NIV   PROF^FS

^XZ`;

        const selectedPrinter = printers[printer];

        console.log(`Conectando a ${selectedPrinter.ip}:${selectedPrinter.port}`);

        const client = new net.Socket();

        client.setTimeout(5000);

        client.connect(selectedPrinter.port, selectedPrinter.ip, () => {

            console.log("Conectado. Enviando ZPL...");

            client.write(zpl, 'ascii');
            client.end();

            res.send("Etiqueta enviada correctamente");
        });

        client.on('timeout', () => {
            console.error("Tiempo de conexión agotado");
            client.destroy();
            res.status(500).send("Tiempo de conexión agotado");
        });

        client.on('error', (err) => {
            console.error("Error de conexión:", err.message);
            res.status(500).send("Error al conectar con impresora");
        });

    } catch (err) {

        console.error("ERROR INTERNO:", err);

        res.status(500).send("Error interno del servidor");
    }
});

// ===============================
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});