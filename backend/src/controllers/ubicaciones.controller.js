const service = require("../services/ubicaciones.service");
const XLSX = require("xlsx");

//get
function getUbicaciones(req, res) {
    res.json(service.getAll());
}

//put
function updateUbicaciones(req, res) {
    try {
        service.replaceAll(req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error al guardar" });
    }
}

//post
function addUbicacion(req, res) {
    try {
        const result = service.add(req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

//delete
function deleteUbicacion(req, res) {
    try {
        service.remove(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar" });
    }
}

//update by id
function updateUbicacionById(req, res) {
    try {
        const result = service.updateById(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

//import excel
function importExcel(req, res) {
    try {
        console.log("FILE:", req.file);

        const workbook = XLSX.readFile(req.file.path);

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet);

        console.log(rows);

        let inserted = 0;

        rows.forEach((row) => {

            const payload = {
                almacen: String(row.ALMACEN || "").trim(),
                mp: String(row.MATERIAL || "").trim(),
                rack: String(row.RACK || "").trim(),
                pos: String(row.POSICION || "").trim(),
                nivel: String(row.NIVEL || "").trim(),
                prof: String(row.PROFUNDIDAD || "").trim(),
            };

            service.add(payload);

            inserted++;
        });

        res.json({
            success: true,
            inserted
        });

    } catch (err) {
        console.error("ERROR IMPORT:", err);

        res.status(500).json({
            error: err.message
        });
    }
}
module.exports = {
    getUbicaciones,
    updateUbicaciones,
    addUbicacion,
    deleteUbicacion,
    updateUbicacionById,
    importExcel
};