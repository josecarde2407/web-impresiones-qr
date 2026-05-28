const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../../data/ubicaciones.json");

function getAll() {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
        return [];
    }
}

function saveAll(data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function add(item) {
    const errors = validate(item);

    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    }

    const data = getAll();

    const exists = data.some(u =>
        u.almacen === item.almacen &&
        u.mp === item.mp &&
        u.rack === item.rack &&
        u.pos === item.pos &&
        u.nivel === item.nivel &&
        u.prof === item.prof
    );

    if (exists) {
        throw new Error("Ubicación duplicada");
    }

    item.id = Date.now();
    data.push(item);
    saveAll(data);

    return item;
}

function validate(item) {
    const errors = [];

    if (!item.almacen) errors.push("almacen requerido");
    if (!item.mp) errors.push("mp requerido");
    if (!item.rack) errors.push("rack requerido");
    if (!item.pos) errors.push("pos requerido");

    if (!item.nivel) errors.push("nivel requerido");

    if (!item.prof) errors.push("prof requerido");

    return errors;
}

function remove(id) {
    const data = getAll();
    const filtered = data.filter(u => String(u.id) !== String(id));
    saveAll(filtered);
}

function updateById(id, item) {
    const errors = validate(item);

    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    }

    const data = getAll();
    const index = data.findIndex(u => String(u.id) === String(id));

    if (index === -1) {
        throw new Error("Ubicación no encontrada");
    }

    // Verificar duplicados (excluyendo el elemento actual)
    const isDuplicate = data.some((u, i) =>
        i !== index &&
        u.almacen === item.almacen &&
        u.mp === item.mp &&
        u.rack === item.rack &&
        u.pos === item.pos &&
        u.nivel === item.nivel &&
        u.prof === item.prof
    );

    if (isDuplicate) {
        throw new Error("Ubicación duplicada");
    }

    data[index] = { ...data[index], ...item };
    saveAll(data);

    return data[index];
}

function replaceAll(data) {
    saveAll(data);
}

module.exports = {
    getAll,
    saveAll,
    add,
    remove,
    updateById,
    replaceAll,
    validate
};
