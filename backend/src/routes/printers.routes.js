const express = require("express");
const router = express.Router();

const { getPrinters, savePrinters } = require("../config/printers");

// GET
router.get("/", (req, res) => {
    res.json(getPrinters());
});

// PUT
router.put("/", (req, res) => {
    const { key, ip, port, nombre } = req.body;

    const printers = getPrinters();

    printers[key] = { ip, port, nombre };

    savePrinters(printers);

    res.json({ ok: true, printers });
});

module.exports = router;
