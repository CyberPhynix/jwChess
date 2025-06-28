let cookie = require("cookie");
const { cache } = require("../data/cache");

function routeSocket(app, io) {
    io.on("connection", (socket) => {
        log("Connection");
        assignRoom();

        // middleware for cookie parsing etc

        socket.on("disconnect", () => {
            log("Disconnection");
        });

        socket.on("leave", () => {
            const cookies = cookie.parse(socket.handshake.headers.cookie);

            let game = cache.games.find((game) => game.getPlayer(cookies.sid));
            if (!game) return;

            io.to(game.gid).emit("refresh", true);
        });

        socket.on("move", move);

        /**
         * @param data
         * @param {String} data.move
         */
        function move(data) {
            const cookies = cookie.parse(socket.handshake.headers.cookie);

            let game = cache.games.find((game) => game.getPlayer(cookies.sid));
            if (!game) return;

            // Check if req is player
            let player = game.getPlayer(cookies.sid);
            if (!player) return;

            logMsg(player, "Move", data.move);

            game.move(data.move, player);

            io.to(game.gid).emit("refresh", true);
        }

        function assignRoom() {
            var cookies = cookie.parse(socket.handshake.headers.cookie);

            let game = cache.games.find((game) => game.getPlayer(cookies.sid));
            if (!game) return;

            // Check if req is player
            let player = game.getPlayer(cookies.sid);
            if (!player) return;

            socket.join(game.gid);
            io.to(game.gid).emit("refresh", true);
        }
    });
}

function log(...args) {
    console.log("[socket]", ...args);
}

function logMsg(player, ...args) {
    console.log(`[socket - ${player.name}]`, ...args);
}

module.exports = routeSocket;
