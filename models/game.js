const { Heap, Stack } = require("./cards");
const { generateValidSID, generateGID } = require("./sid");

class Player {
    constructor(bank, name = "Default Nickname") {
        this.sid = generateValidSID();
        this.name = name;
        this.heap = new Heap();
        this.bank = bank;
        this.betAmount = 0;
    }

    bet(amount) {
        this.bank -= amount;
        this.betAmount = amount;
    }

    payout(amount) {
        this.bank += amount;
        this.betAmount = 0;
    }
}

class Game {
    // Blackjack
    constructor() {
        this.gid = generateGID();
        this.players = [];
        this.stack = new Stack();
        this.dealer = new Player(0, "Dealer");

        this.gameState = "Betting";
        this.turn = 0;
    }

    start() {
        if (this.gameState !== "Betting") return false;

        this.gameState = "Playing";
        this.stack = new Stack(); // TODO: Maybe remove this line (+ realism; - card counting)
        this.dealer.heap = new Heap();

        let hiddenCard = this.stack.removeCard();
        hiddenCard.hidden = true;
        this.dealer.heap.addCard(hiddenCard);
        this.dealer.heap.addCard(this.stack.removeCard());

        for (let player of this.players) {
            player.heap = new Heap();
            player.heap.addCard(this.stack.removeCard());
            player.heap.addCard(this.stack.removeCard());
        }
    }

    hit(player) {
        if (this.gameState !== "Playing") return false;
        if (player !== this.players[this.turn]) return false;

        player.heap.addCard(this.stack.removeCard());
        if (player.heap.value > 21) {
            this.stand(player);
        }
    }

    stand(player) {
        if (this.gameState !== "Playing") return false;
        if (player !== this.players[this.turn]) return false;

        this.turn++;
        if (this.turn >= this.players.length) this.end();
    }

    playDealer() {
        this.dealer.heap.cards.map((card) => (card.hidden = false));
        while (this.dealer.heap.value < 17) {
            this.dealer.heap.addCard(this.stack.removeCard());
        }
    }

    end() {
        this.playDealer();

        for (let player of this.players) {
            if (player.heap.value > 21) {
                console.log(`${player.name} Busted ${player.heap.value} ${this.dealer.heap.value}`);
                player.payout(0);
            } else if (this.dealer.heap.value > 21) {
                console.log(`${player.name} Bank Busted ${player.heap.value} ${this.dealer.heap.value}`);
                player.payout(player.betAmount * 2);
            } else if (player.heap.value > this.dealer.heap.value) {
                console.log(`${player.name} Won (More points) ${player.heap.value} > ${this.dealer.heap.value}`);
                player.payout(player.betAmount * 2);
            } else if (player.heap.value === this.dealer.heap.value) {
                console.log(`${player.name} Push (Same points) ${player.heap.value} = ${this.dealer.heap.value}`);
                player.payout(player.betAmount);
            } else {
                console.log(`${player.name} Lost (Less points) ${player.heap.value} < ${this.dealer.heap.value}`);
                player.payout(0);
            }
        }

        this.gameState = "Betting";
        this.turn = 0;
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
