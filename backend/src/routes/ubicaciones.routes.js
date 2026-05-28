const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }

});

const upload = multer({ storage });

const controller = require("../controllers/ubicaciones.controller");

router.get("/", controller.getUbicaciones);
router.put("/", controller.updateUbicaciones);
router.post("/", controller.addUbicacion);

router.post(
    "/import",
    upload.single("file"),
    controller.importExcel
);

router.put("/:id", controller.updateUbicacionById);
router.delete("/:id", controller.deleteUbicacion);

module.exports = router;