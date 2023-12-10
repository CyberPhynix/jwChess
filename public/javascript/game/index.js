var socket = io();

socket.on("refresh", async function (data) {
    let gameData = await getGameData();
    refresh(gameData);
});

let hitButton = document.querySelector("#hit");
let standButton = document.querySelector("#stand");
let betInput = document.querySelector("#bet-amount");
let betButton = document.querySelector("#bet-button");

hitButton.addEventListener("click", () => {
    move("Hit");
});

standButton.addEventListener("click", () => {
    move("Stand");
});

betInput.addEventListener("input", () => {
    if (betInput.value < 1) betInput.value = 1;
    if (betInput.value > 100) betInput.value = 100;
});

betButton.addEventListener("click", () => {
    if (!betInput.value) return;
    socket.emit("move", {
        move: {
            type: "Bet",
            betAmount: betInput.value,
        },
    });
});

/**
 * @param {"Hit" | "Stand"} move
 */
function move(move) {
    socket.emit("move", {
        move: {
            type: move,
        },
    });
}

async function getGameData() {
    let data = null;
    await axios.get("/api/game").then((response) => {
        data = response.data;
    });
    return data;
}
