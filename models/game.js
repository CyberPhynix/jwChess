var { generateGID, generateValidSID } = require("./sid");
var Chess = require("chess.js").Chess;

class Player {
    constructor(name = "Default Nickname") {
        this.sid = generateValidSID();
        this.name = name;
    }
}

class Game {
    constructor(white = null, black = null) {
        this.gid = generateGID();
        this.white = white;
        this.black = black;
        this.chess = new Chess();

        this.gameState = "Waiting"; // Waiting, Playing, Finished
        this.isEmpty = false;
    }

    getPlayer(sid) {
        if (this.white && this.white.sid === sid) return this.white;
        if (this.black && this.black.sid === sid) return this.black;
        return null;
    }

    addPlayer(player, color = "r") {
        if (this.gameState !== "Waiting") return false;

        // Check if player already exists
        if (this.white || this.black) {
            if (this.white) {
                this.black = player;
            } else {
                this.white = player;
            }
            this.gameState = "Playing";
            return true;
        }

        // Assign player to color
        if (color === "w") {
            this.white = player;
        } else if (color === "b") {
            this.black = player;
        } else {
            Math.random() < 0.5 ? (this.white = player) : (this.black = player);
        }

        return true;
    }

    removePlayer(sid) {
        if (this.white && this.white.sid === sid) {
            this.white = null;
        } else if (this.black && this.black.sid === sid) {
            this.black = null;
        }
        this.gameState = "Finished";

        if (!this.white && !this.black) {
            this.isEmpty = true;
        }
    }

    move(move, player) {
        if (this.gameState !== "Playing" || !player) return false;

        // Check if the correct player is making the move
        let turn = this.chess.turn();
        let playerColor = this.white && this.white.sid === player.sid ? "w" : "b";
        if (turn !== playerColor) return false;

        // Validate the move
        try {
            this.chess.move(move);
            if (this.chess.isGameOver()) {
                this.gameState = "Finished";
            }
            return true;
        } catch (err) {
            return false;
        }
    }
}

module.exports = {
    Player,
    Game,
};
