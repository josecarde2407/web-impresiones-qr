const net = require("net");

function enviarAImpresora(zpl, printer) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(3000);

        socket.connect(printer.port, printer.ip, () => {
            socket.write(zpl, 'ascii', () => {
                socket.end();
                resolve(true);
            });
        });

        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
    });
}

module.exports = { enviarAImpresora };
