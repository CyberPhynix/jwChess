var socket = io();

refresh();

socket.on("refresh", async function (data) {
    let gameData = await getGameData();
    refresh(gameData);
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
