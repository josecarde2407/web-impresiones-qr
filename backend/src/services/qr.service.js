const QRCode = require('qrcode');
const { PNG } = require('pngjs');

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

    return {
        totalBytes: bytesPerRow * height,
        bytesPerRow,
        hex,
        width
    };
}

module.exports = { qrToZPL };
