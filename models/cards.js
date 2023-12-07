class Card {
    constructor(value, symbol, hidden = false) {
        this.value = value;
        this.symbol = symbol;
        this.hidden = hidden;
    }

    toString() {
        if (this.hidden) return "XX";
        let value = this.value;
        if (value === 11) value = "J";
        else if (value === 12) value = "Q";
        else if (value === 13) value = "K";
        else if (value === 14) value = "A";
        let symbol = this.symbol;
        if (symbol === 0) symbol = "♠";
        else if (symbol === 1) symbol = "♥";
        else if (symbol === 2) symbol = "♦";
        else if (symbol === 3) symbol = "♣";
        return `${value}${symbol}`;
    }
}

class Stack {
    constructor() {
        this.cards = [];
        this.fillDeck();
        this.shuffle();
    }

    addCard(card) {
        this.cards.push(card);
    }

    removeCard() {
        if (this.cards.length === 0) {
            this.fillDeck();
            this.shuffle();
        }
        return this.cards.pop();
    }

    fillDeck() {
        this.cards = [];
        for (let symbol = 0; symbol < 4; symbol++) {
            for (let value = 2; value <= 14; value++) {
                this.cards.push(new Card(value, symbol));
            }
        }
    }

    shuffle() {
        let shuffledCards = [];
        while (this.cards.length > 0) {
            let randomIndex = Math.floor(Math.random() * this.cards.length);
            shuffledCards.push(this.cards[randomIndex]);
            this.cards.splice(randomIndex, 1);
        }
        this.cards = shuffledCards;
    }
}

class Heap {
    constructor() {
        this.cards = [];
    }

    get value() {
        let value = 0;
        for (let card of this.cards) {
            if (card.value === 14) value += 11;
            else if (card.value > 10) value += 10;
            else if (card.value >= 2 && card.value <= 10) value += card.value;
        }
        let convertedAces = 0;
        while (value > 21 && this.#hasAce(convertedAces)) {
            value -= 10;
            convertedAces++;
        }
        return value;
    }

    #hasAce(converted = 0) {
        return this.cards.filter((card) => card.value === 14) > converted;
    }

    addCard(card) {
        this.cards.push(card);
    }

    removeCard() {
        return this.cards.pop();
    }
}

module.exports = {
    Card,
    Stack,
    Heap,
};
