const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "printers.json");

function getPrinters() {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function savePrinters(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { getPrinters, savePrinters };
