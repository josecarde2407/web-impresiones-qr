const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   FRONTEND STATIC
========================= */
app.use(express.static(path.join(__dirname, "../public")));

/* =========================
   ROUTES API
========================= */
const printRoutes = require("./routes/print.routes");
const ubicacionesRoutes = require("./routes/ubicaciones.routes");
const printersRoutes = require("./routes/printers.routes");

app.use("/api/ubicaciones", ubicacionesRoutes);
app.use("/api/printers", printersRoutes);
app.use("/", printRoutes);

/* =========================
   HTML ROUTES
========================= */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin.html"));
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});