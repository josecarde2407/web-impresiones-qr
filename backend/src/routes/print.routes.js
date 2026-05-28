const express = require("express");
const router = express.Router();

const controller = require("../controllers/print.controller");

router.post("/print-multiple", controller.printMultiple);

module.exports = router;
