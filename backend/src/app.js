const express = require("express");
const cors = require("cors");
const path = require("path");

const printRoutes = require("./routes/print.routes");
const ubicacionesRoutes = require("./routes/ubicaciones.routes");
const printersRoutes = require("./routes/printers.routes");

const app = express();

app.use(cors());
app.use(express.json());
console.log("STATIC PATH:", path.join(__dirname, "../../frontend/public"));
// 🔥 FIX CRÍTICO - Actualizados los paths
app.use(express.static(path.join(__dirname, "../../frontend/public")));

app.use("/api/ubicaciones", ubicacionesRoutes);
app.use("/", printRoutes);
app.use("/api/printers", printersRoutes);

module.exports = app;
