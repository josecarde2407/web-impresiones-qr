const printers = require("../config/printers");
const { generarZPLDatos } = require("../services/zpl.service");
const { enviarAImpresora } = require("../services/printer.service");
const { getPrinters } = require("../config/printers");

function printLabels(printerKey, textos) {
    const printers = getPrinters();

    const printer = printers[printerKey];

    if (!printer) {
        throw new Error("Impresora no encontrada");
    }

    sendToPrinter(printer.ip, printer.port, textos);
}

async function printMultiple(req, res) {
    try {
        const { printer, textos } = req.body;

        const target = printers[printer];

        if (!target) return res.status(400).send("Impresora no válida.");
        if (!Array.isArray(textos)) {
            return res.status(400).send("Formato inválido");
        }
        if (textos.length === 0) {
            return res.status(400).send("No hay datos");
        }

        let exitos = 0;

        for (const t of textos) {
            try {
                const zpl = await generarZPLDatos(t);
                const ok = await enviarAImpresora(zpl, target);
                if (ok) exitos++;
            } catch (e) {
                console.error("Error etiqueta:", t);
            }
        }

        if (exitos > 0) {
            return res.send(`${exitos} etiqueta(s) impresa(s) en ${target.nombre}.`);
        }

        return res.status(422).send("No se pudo imprimir.");
    } catch (err) {
        res.status(500).send("Error interno del servidor.");
    }
}

module.exports = { printMultiple };
