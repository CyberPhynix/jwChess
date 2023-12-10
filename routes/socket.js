var cookie = require("cookie");
const { cache } = require("../data/cache");
const { bet, hit, stand } = require("../gameManager");

function routeSocket(app, io) {
    io.on("connection", (socket) => {
        log("Connection");
        assignRoom();

        socket.on("disconnect", () => {
            log("Disconnection");
        });

        socket.on("leave", () => {
            var cookies = cookie.parse(socket.handshake.headers.cookie);

            let game = cache.games.find((game) => game.players.find((player) => player.sid === cookies.sid));
            if (!game) return;

            io.to(game.gid).emit("refresh", true);
        });

        socket.on("move", move);

        /**
         * @typedef {Object} I_Bet
         * @property {"Bet"} type - The type of move.
         * @property {number} betAmount - The bet amount.
         */
        /**
         * @typedef {Object} I_Hit
         * @property {"Hit"} type - The type of move.
         */
        /**
         * @typedef {Object} I_Stand
         * @property {"Stand"} type - The type of move.
         */
        /**
         * @param data
         * @param {I_Bet, I_Hit, I_Stand} data.move
         */
        function move(data) {
            var cookies = cookie.parse(socket.handshake.headers.cookie);

            let game = cache.games.find((game) => game.players.find((player) => player.sid === cookies.sid));
            if (!game) return;

            // Check if req is player
            let player = game.players.find((player) => player.sid === cookies.sid);
            if (!player) return;

            logMsg(player, "Move", data.move);

            let updated = true;
            switch (data.move.type) {
                case "Bet":
                    updated = bet(data, player, game);
                    break;
                case "Hit":
                    updated = hit(data, player, game);
                    break;
                case "Stand":
                    updated = stand(data, player, game);
                    break;
            }

            if (updated) io.to(game.gid).emit("refresh", true);
        }

        function assignRoom() {
            var cookies = cookie.parse(socket.handshake.headers.cookie);

            let game = cache.games.find((game) => game.players.find((player) => player.sid === cookies.sid));
            if (!game) return;

            // Check if req is player
            let player = game.players.find((player) => player.sid === cookies.sid);
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
