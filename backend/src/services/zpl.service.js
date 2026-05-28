const { qrToZPL } = require("./qr.service");

async function generarZPLDatos(text) {
    const cleanText = text.toString().trim();
    const parts = cleanText.split('-');

    if (parts.length < 6) {
        throw new Error("Formato inválido");
    }

    const nivel = parseInt(parts[4]) || 0;
    const prof = parseInt(parts[5]) || 0;

    const letra = prof === 1 ? 'A' : prof === 2 ? 'D' : '?';

    const qr = await qrToZPL(cleanText);
    const qrX = Math.floor((800 - qr.width) / 2);

    return `
^XA^PW800^LL600^CI28
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

module.exports = { generarZPLDatos };
