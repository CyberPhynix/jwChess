/**
 * @typedef {Object} I_PlayerData
 * @property {number} gameData.gid
 * @property {"Betting" | "Playing"} gameData.gameState
 * @property {number} gameData.turn
 * @property {Array<{name: string, heap: Heap, betAmount: number, bank: number, value: number}>} gameData.players
 * @property {{heap: Heap}} gameData.dealer
 *
 * @param {I_PlayerData} data
 */
function refresh(data) {
    // game pin #game-pin
    // hide either bet input or hit/stand buttons
    // update dealer cards
    // update player cards
    // update player bet amounts
}

function createPlayerElement(name, heap, betAmount, bank, value, hideBank = false) {
    let playerTemplate = document.querySelector("#player-template");
    let playerElement = playerTemplate.content.cloneNode(true);

    playerElement.querySelector("#name").textContent = name;
    playerElement.querySelector("#value").textContent = value;
    playerElement.querySelector("#bet").textContent = betAmount === 0 ? "" : betAmount;
    playerElement.querySelector("#bank").textContent = bank;

    if (hideBank) {
        playerElement.querySelector("#bank-container").classList.add("hide");
    }

    if (value > 21) {
        playerElement.querySelector("#value").classList.add("busted");
    }

    if (heap.cards.length === 0) {
        playerElement.querySelector(".player-cards").appendChild(createHiddenCardElement());
        playerElement.querySelector(".player-cards").appendChild(createHiddenCardElement());
    }
    heap.cards.forEach((card) => {
        playerElement
            .querySelector(".player-cards")
            .appendChild(card.hidden ? createHiddenCardElement() : createCardElement(card.value, card.symbol));
    });

    console.log(playerElement);
    return playerElement;
}

/**
 * @param {number} value
 * @param {number} symbol
 */
function createCardElement(value, symbol) {
    let cardTemplate = document.querySelector("#card-template");
    let cardElement = cardTemplate.content.cloneNode(true);

    let displayValue = value.toString();
    if (value === 11) displayValue = "J";
    else if (value === 12) displayValue = "Q";
    else if (value === 13) displayValue = "K";
    else if (value === 14) displayValue = "A";

    let displaySymbol = "";
    if (symbol === 0) displaySymbol = "pique";
    else if (symbol === 1) displaySymbol = "coeur";
    else if (symbol === 2) displaySymbol = "carreau";
    else if (symbol === 3) displaySymbol = "trefle";

    cardElement.querySelectorAll(".card-value").forEach((element) => {
        element.textContent = displayValue;
        element.style.color = symbol === 0 || symbol === 3 ? "black" : "red";
    });
    cardElement.querySelector(".card-symbol").setAttribute("src", `/public/images/symbols/${displaySymbol}.svg`);
    cardElement.querySelector(".card-symbol").setAttribute("alt", displaySymbol);

    return cardElement;
}

function createHiddenCardElement() {
    let cardTemplate = document.querySelector("#hidden-card-template");
    return cardTemplate.content.cloneNode(true);
}

document.querySelector(".player-cards").appendChild(createCardElement(10, 3));
document.querySelector(".player-cards").appendChild(createHiddenCardElement());
document.querySelector("#player-container").appendChild(
    createPlayerElement(
        "test",
        {
            cards: [
                { value: 7, symbol: 2, hidden: false },
                { value: 7, symbol: 2, hidden: false },
            ],
        },
        100,
        -400,
        24,
    ),
);
