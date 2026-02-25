const express = require('express');
const net = require('net');
const QRCode = require('qrcode');
const { PNG } = require('pngjs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// ===============================
// GENERAR QR COMO IMAGEN
// ===============================
async function qrToZPL(text) {
    // 560 px = 7 cm en 203 dpi
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
                    const luminance = data[idx]; // grayscale simple
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
// IMPRIMIR
// ===============================
app.post('/print', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).send('Texto requerido');

        const parts = text.split('-');
        if (parts.length !== 6) {
            return res.status(400).send('Formato inválido');
        }

        const nivel = parts[4];
        const profundidad = parts[5];

        const letra = profundidad === '001' ? 'A'
            : profundidad === '002' ? 'D'
                : '?';

        // ===== QR GIGANTE =====
        const qr = await qrToZPL(text);

        // Centrado en etiqueta 800 dots
        const qrX = Math.floor((800 - qr.width) / 2);

        const zpl = `^XA
^PW800
^LL600
^CI28

^FX ================= LETRA =================
^FO40,120
^A0N,240,180
^FD${letra}^FS

^FX ================= QR GIGANTE 7CM =================
~DGR:QR.GRF,${qr.totalBytes},${qr.bytesPerRow},${qr.hex}
^FO${qrX},20
^XGR:QR.GRF,1,1^FS

^FX ================= PANEL DERECHO =================
^FO640,50^A0N,45,45^FB220,1,0,C^FDNIVEL^FS
^FO640,90^A0N,160,130^FB220,1,0,C^FD${parseInt(nivel)}^FS

^FO640,250^A0N,45,45^FB220,1,0,C^FDPROF^FS
^FO640,300^A0N,130,110^FB220,1,0,C^FD${parseInt(profundidad)}^FS

^FX ================= CAJA INFERIOR =================
^FO60,400^GB680,150,3^FS
^FO90,410^A0N,60,50^FD${text}^FS
^FO60,480^GB680,0,3^FS
^FO90,500^A0N,40,45^FDPL   ALM   RCK   POS   NIV   PROF^FS

^XZ`;

        const client = new net.Socket();
        client.connect(9100, '10.155.158.200', () => {
            client.write(zpl, 'ascii');
            client.end();
            res.send('QR 7cm enviado correctamente');
        });

        client.on('error', err => {
            console.error(err);
            res.status(500).send('Error al imprimir');
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno');
    }
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});