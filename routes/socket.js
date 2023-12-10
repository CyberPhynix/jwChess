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

        socket.on("move", move);

        /**
         * #@typedef {Object} I_PlayerData
         *
         * @typedef {Object} I_Bet
         * @property {"Bet"} type - The type of move.
         * @property {number} betAmount - The bet amount.
         *
         * @typedef {Object} I_Hit
         * @property {"Hit"} type - The type of move.
         *
         * @typedef {Object} I_Stand
         * @property {"Stand"} type - The type of move.
         *
         * @param data
         * @param {I_Bet, I_Hit, I_Stand} data.move
         * #@param {I_PlayerData} data.data
         */
        function move(data) {
            var cookies = cookie.parse(socket.handshake.headers.cookie);

            let game = cache.games.find((game) => game.players.find((player) => player.sid === cookies.sid));
            if (!game) return;

            // Check if req is player.ejs
            let player = game.players.find((player) => player.sid === cookies.sid);
            if (!player) return;

            logMsg(player, "Move", data.move);

            switch (data.move.type) {
                case "Bet":
                    bet(data, player, game);
                    break;
                case "Hit":
                    hit(data, player, game);
                    break;
                case "Stand":
                    stand(data, player, game);
                    break;
            }

            io.to(game.gid).emit("refresh", true);
        }

        function assignRoom() {
            var cookies = cookie.parse(socket.handshake.headers.cookie);

            let game = cache.games.find((game) => game.players.find((player) => player.sid === cookies.sid));
            if (!game) return;

            // Check if req is player.ejs
            let player = game.players.find((player) => player.sid === cookies.sid);
            if (!player) return;

            socket.join(game.gid);
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
