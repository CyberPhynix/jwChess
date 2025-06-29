let cookie = require("cookie");
const { cache } = require("../data/cache");

function routeSocket(app, io) {
    io.on("connection", (socket) => {
        log("Connection");

        const cookies = cookie.parse(socket.handshake.headers.cookie);
        let game = cache.games.find((game) => game.getPlayer(cookies.sid));
        if (!game) return;
        let player = game.getPlayer(cookies.sid);
        if (!player) return;

        socket.join(game.gid);
        io.to(game.gid).emit("refresh", true);

        socket.on("move", (data) => {
            logMsg(player, "Move", data.move);

            game.move(data.move, player);

            io.to(game.gid).emit("refresh", true);
        });

        socket.on("leave", () => {
            logMsg(player, "Leave");
            io.to(game.gid).emit("refresh", true);
        });

        socket.on("disconnect", () => {
            log("Disconnection");
        });
    });
}

function log(...args) {
    console.log("[socket]", ...args);
}

function logMsg(player, ...args) {
    console.log(`[socket - ${player.name}]`, ...args);
}

module.exports = routeSocket;
