/**
 * @typedef {Object} I_PlayerData
 * @property {number} gid
 * @property {"Betting" | "Playing"} gameState
 * @property {number} turn
 * @property {Array<{name: string, heap: Heap, betAmount: number, bank: number, value: number}>} players
 * @property {{heap: Heap}} dealer
 *
 * @param {I_PlayerData} data
 */
function refresh(data) {
    console.log("Refresh \n", data);

    // game pin #game-pin
    let gamePin = document.querySelector("#game-pin");
    gamePin.textContent = data.gid;

    // update dealer cards
    let dealerContainer = document.querySelector("#dealer-container");
    dealerContainer.innerHTML = "";
    dealerContainer.appendChild(
        createPlayerElement("Dealer", { cards: data.dealer.heap }, 0, 0, data.dealer.value, true),
    );

    // update player cards
    let playerContainer = document.querySelector("#player-container");
    playerContainer.innerHTML = "";
    for (let player of data.players) {
        playerContainer.appendChild(
            createPlayerElement(player.name, player.heap, player.betAmount, player.bank, player.value),
        );
    }

    // hide either bet input or hit/stand buttons or state turn
    let betInput = document.querySelector("#bet-amount");
    let betButton = document.querySelector("#bet-button");
    let hitButton = document.querySelector("#hit");
    let standButton = document.querySelector("#stand");
    let turnContainer = document.querySelector("#turn-msg-container");
    let betContainer = document.querySelector("#bet-msg-container");

    if (data.gameState === "Betting") {
        if (data.players.find((player) => player.self).betAmount === 0) {
            betInput.classList.remove("hide");
            betButton.classList.remove("hide");
            hitButton.classList.add("hide");
            standButton.classList.add("hide");
            turnContainer.classList.add("hide");
            betContainer.classList.add("hide");
        } else {
            betInput.classList.add("hide");
            betButton.classList.add("hide");
            hitButton.classList.add("hide");
            standButton.classList.add("hide");
            turnContainer.classList.add("hide");

            betContainer.querySelector("#bet-msg").textContent = data.players.find((player) => player.self).betAmount;

            betContainer.classList.remove("hide");
        }
    } else if (data.gameState === "Playing") {
        if (data.players[data.turn].self) {
            betInput.classList.add("hide");
            betButton.classList.add("hide");
            hitButton.classList.remove("hide");
            standButton.classList.remove("hide");
            turnContainer.classList.add("hide");
            betContainer.classList.add("hide");
        } else {
            betInput.classList.add("hide");
            betButton.classList.add("hide");
            hitButton.classList.add("hide");
            standButton.classList.add("hide");
            turnContainer.classList.remove("hide");
            betContainer.classList.add("hide");

            turnContainer.querySelector("#turn-msg").textContent = data.players[data.turn].name;
        }
    }

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

        playerElement.querySelector("#value").classList.add("hide");
    }
    heap.cards.forEach((card) => {
        playerElement
            .querySelector(".player-cards")
            .appendChild(card.hidden ? createHiddenCardElement() : createCardElement(card.value, card.symbol));
    });

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
