let todasUbicaciones = [];

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    let icon = type === 'success' ? '✅ ' : (type === 'error' ? '❌ ' : '⌛ ');
    toast.innerHTML = icon + msg;
    toast.className = 'show ' + type;
    setTimeout(() => { toast.className = ''; }, 3500);
}

function clearField() {
    document.getElementById("textInput").value = "";
    document.getElementById("rackSelect").selectedIndex = 0;
    document.getElementById("sectionSelect").innerHTML = '<option value="">-- Seleccionar sección --</option>';
    document.getElementById("statusMessage").style.display = "none";
    showToast("Vista restablecida", "info");
}

async function cargarDatos() {
    try {
        const response = await fetch("/api/ubicaciones");
        todasUbicaciones = await response.json();

        const racks = [...new Set(
            todasUbicaciones.map(u => `${u.almacen}-${u.mp}-${u.rack}`)
        )];

        const select = document.getElementById("rackSelect");

        racks.forEach(r => {
            const opt = document.createElement("option");
            opt.value = r;
            opt.textContent = r;
            select.appendChild(opt);
        });

    } catch (e) {
        showToast("Error al cargar base de datos", "error");
    }
}

document.getElementById("rackSelect").addEventListener("change", function () {
    const rack = this.value;
    const secSelect = document.getElementById("sectionSelect");

    secSelect.innerHTML = '<option value="">-- Seleccionar sección --</option>';

    if (rack) {
        const secciones = [...new Set(
            todasUbicaciones
                .filter(u => `${u.almacen}-${u.mp}-${u.rack}` === rack)
                .map(u => `${u.almacen}-${u.mp}-${u.rack}-${u.pos}`)
        )];

        secciones.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s;
            opt.textContent = s;
            secSelect.appendChild(opt);
        });
    }
});

async function enviarPeticion(payload) {
    const status = document.getElementById("statusMessage");
    status.innerHTML = "⌛ Comunicando con el servidor...";
    status.className = "status success-box";
    status.style.display = "block";
    showToast("Enviando orden...", "info");

    try {
        const res = await fetch("/print-multiple", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const msg = await res.text();
        if (res.ok) {
            status.innerHTML = "✅ " + msg;
            showToast("Proceso completado", "success");
        } else {
            status.innerHTML = "❌ " + msg;
            status.className = "status error-box";
            showToast(msg, "error");
        }
    } catch (e) {
        status.innerHTML = "❌ Error crítico de red";
        status.className = "status error-box";
        showToast("No hay conexión con el servidor", "error");
    }
}

function validarFormato(texto) {
    return typeof texto === "string" && texto.split('-').length === 6;
}

function printQR() {
    const val = document.getElementById("textInput").value.trim();
    const printer = document.querySelector('input[name="printer"]:checked').value;

    if (!val) return showToast("⚠️ Ingrese un código", "error");

    // Bloqueo preventivo en el cliente
    if (!validarFormato(val)) {
        return showToast("⚠️ El formato debe ser: L1-MP1-RCK-POS-NIV-PROF", "error");
    }

    enviarPeticion({ printer, textos: [val] });
}

function imprimirSeccion() {
    const sec = document.getElementById("sectionSelect").value;
    const printer = document.querySelector('input[name="printer"]:checked').value;

    if (!sec) return showToast("⚠️ Seleccione una sección válida", "error");

    const lista = todasUbicaciones
        .filter(u =>
            `${u.almacen}-${u.mp}-${u.rack}-${u.pos}` === sec
        )
        .map(u =>
            `${u.almacen}-${u.mp}-${u.rack}-${u.pos}-${u.nivel}-${u.prof}`
        );

    if (lista.length === 0) {
        return showToast("⚠️ No hay ubicaciones en esta sección", "error");
    }

    enviarPeticion({ printer, textos: lista });
}

const ADMIN_PASSWORD = "1234"; // luego mover a backend

function openAdminModal() {
    document.getElementById("adminModal").style.display = "flex";
}

function closeAdminModal() {
    document.getElementById("adminModal").style.display = "none";
}

function validateAdmin() {
    const pass = document.getElementById("adminPass").value;

    if (pass === ADMIN_PASSWORD) {
        window.location.href = "/admin.html";
    } else {
        showToast("Contraseña incorrecta", "error");
    }
}

cargarDatos();
