const { Card, Heap, Stack } = require("./cards");
const { generateValidSID, generateGID } = require("./sid");

class Player {
    constructor(bank, name = "Default Nickname") {
        this.sid = generateValidSID();
        this.name = name;
        this.heap = new Heap();
        this.bank = bank;
    }
}

class Game {
    // Blackjack
    constructor() {
        this.gid = generateGID();
        this.players = [];
        this.stack = new Stack();
        this.dealer = new Player(0, "Dealer");
        this.players.push(this.dealer);
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(sid) {
        this.players = this.players.filter((player) => player.sid !== sid);
    }

    reset() {
        for (let player of this.players) {
            player.heap = new Heap();
        }
    }
}

module.exports = {
    Player,
    Game,
};
