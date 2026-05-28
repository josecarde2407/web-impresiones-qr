const API = "/api/ubicaciones";
let allData = [];
let currentEditId = null;

async function load() {
    const res = await fetch(API);
    const data = await res.json();
    allData = data;

    renderTable(data);
}

function renderTable(data) {
    const tbody = document.getElementById("tbody");
    const count = document.getElementById("count");

    tbody.innerHTML = "";
    count.textContent = `${data.length} registros`;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#999;">No hay ubicaciones registradas</td></tr>';
        return;
    }

    data.forEach(item => {
        const full = `${item.almacen}-${item.mp}-${item.rack}-${item.pos}-${item.nivel}-${item.prof}`;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${full}</strong></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-copy" onclick="copyToClipboard('${full}')" title="Copiar">📋</button>
                    <button class="btn-edit" onclick="openEditModal(${item.id}, '${item.almacen}', '${item.mp}', '${item.rack}', '${item.pos}', '${item.nivel}', '${item.prof}')" title="Editar">✏️</button>
                    <button class="btn-danger-sm" onclick="confirmDelete(${item.id})" title="Eliminar">🗑️</button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function filterTable() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allData.filter(item => {
        const full = `${item.almacen}-${item.mp}-${item.rack}-${item.pos}-${item.nivel}-${item.prof}`.toLowerCase();
        return full.includes(input);
    });
    renderTable(filtered);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Ubicación copiada");
    });
}

function openEditModal(id, almacen, mp, rack, pos, nivel, prof) {
    currentEditId = id;
    document.getElementById("editAlmacen").value = almacen;
    document.getElementById("editMp").value = mp;
    document.getElementById("editRack").value = rack;
    document.getElementById("editPos").value = pos;
    document.getElementById("editNivel").value = nivel;
    document.getElementById("editProf").value = prof;
    document.getElementById("editModal").classList.add("show");
}

function closeEditModal() {
    document.getElementById("editModal").classList.remove("show");
    currentEditId = null;
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        almacen: document.getElementById("editAlmacen").value,
        mp: document.getElementById("editMp").value,
        rack: document.getElementById("editRack").value,
        pos: document.getElementById("editPos").value,
        nivel: document.getElementById("editNivel").value,
        prof: document.getElementById("editProf").value,
    };

    await fetch(`${API}/${currentEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    closeEditModal();
    load();
});

function confirmDelete(id) {
    const modal = document.getElementById("confirmModal");
    const btn = document.getElementById("confirmDeleteBtn");

    modal.classList.add("show");

    btn.onclick = async () => {
        await removeItem(id);
        closeConfirm();
    };
}

async function removeItem(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
}

function exportToCSV() {
    if (allData.length === 0) {
        showToast("No hay datos para exportar", "error");
        return;
    }

    let csv = "ID,Almacén,MP,Rack,Pos,Nivel,Prof,Ubicación\n";
    allData.forEach(item => {
        const full = `${item.almacen}-${item.mp}-${item.rack}-${item.pos}-${item.nivel}-${item.prof}`;
        csv += `${item.id},${item.almacen},${item.mp},${item.rack},${item.pos},${item.nivel},${item.prof},"${full}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ubicaciones-${new Date().getTime()}.csv`;
    a.click();
}

async function updatePrinter() {
    const key = document.getElementById("printerKey").value;
    const ip = document.getElementById("ip").value.trim();
    const port = Number(document.getElementById("port").value);
    const nombre = document.getElementById("nombre").value.trim();

    const res = await fetch("/api/printers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, ip, port, nombre })
    });

    await res.json();
    showToast("Impresora actualizada");
}

async function uploadExcel() {
    const file = document.getElementById("fileExcel").files[0];
    if (!file) {
        showToast("Selecciona un archivo", "error");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/ubicaciones/import", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    showToast(`${data.inserted} líneas insertadas`);
    load();
}

document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        almacen: document.getElementById("almacen").value,
        mp: document.getElementById("mp").value,
        rack: document.getElementById("rack").value,
        pos: document.getElementById("pos").value,
        nivel: document.getElementById("nivel").value,
        prof: document.getElementById("prof").value,
    };

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    e.target.reset();
    load();
});

function goPrint() {
    window.location.href = "/";
}

async function loadPrinters() {
    const res = await fetch("/api/printers");
    const data = await res.json();
    window.printersData = data;
    setPrinterForm("recepcion");
}

function setPrinterForm(key) {
    const p = window.printersData[key];
    if (!p) return;

    document.getElementById("ip").value = p.ip;
    document.getElementById("port").value = p.port;
    document.getElementById("nombre").value = p.nombre;
}

document.getElementById("printerKey").addEventListener("change", (e) => {
    setPrinterForm(e.target.value);
});

["almacen", "mp", "rack", "pos", "nivel", "prof"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
        });
    }
});

["editAlmacen", "editMp", "editRack", "editPos", "editNivel", "editProf"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
        });
    }
});

document.getElementById("searchInput").addEventListener("input", filterTable);

// Cerrar modal con tecla ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeEditModal();
    }
});

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");

    toast.textContent = message;

    if (type === "error") {
        toast.style.background = "#dc2626";
    } else {
        toast.style.background = "#111827";
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function closeConfirm() {
    document.getElementById("confirmModal").classList.remove("show");
}

load();
loadPrinters();
