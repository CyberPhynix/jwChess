const socket = io();

socket.on("refresh", async function (data) {
    let gameData = await getGameData();
    if (!board) {
        init(gameData);
    }
    refresh(gameData);
});

/**
 * @param {String} move
 */
function sendMove(move) {
    socket.emit("move", { move: move });
}

async function getGameData() {
    let data = null;
    await axios.get("/api/game").then((response) => {
        data = response.data;
    });
    return data;
}

const leaveButton = document.querySelector("#leave");
leaveButton.addEventListener("click", () => {
    socket.emit("leave", true);
    window.location.replace("/api/game/leave");
});
