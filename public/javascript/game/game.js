let gamePin = document.querySelector("#game-pin");
let playerNameUp = document.querySelector("#player-name-up");
let playerNameDown = document.querySelector("#player-name-down");
let results = document.querySelector("#results");

const chess = new Chess();

let board = null;
let yourTurn = false;
let gameRunning = false;

function onDragStart(source, piece, position, orientation) {
    if (
        (orientation === "white" && piece.search(/^w/) === -1) ||
        (orientation === "black" && piece.search(/^b/) === -1) ||
        !yourTurn ||
        !gameRunning
    ) {
        return false;
    }
}

function onDrop(source, target) {
    // see if the move is legal
    let move = chess.move({
        from: source,
        to: target,
        promotion: "q", // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return "snapback";

    // Emit move event
    sendMove(move.san);
}

function onSnapEnd() {
    board.position(chess.fen());
}

function init(gamedata) {
    yourTurn = gamedata.turn === (gamedata.white ? "w" : "b");

    board = Chessboard("board", {
        position: "start",
        pieceTheme: "public/images/pieces/{piece}.png",
        draggable: true,
        orientation: gamedata.white ? "white" : "black",
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
    });
}

function refresh(gameData) {
    gamePin.textContent = gameData.gid;
    playerNameUp.textContent = gameData.white ? gameData.players.black : gameData.players.white;
    playerNameDown.textContent = gameData.white ? gameData.players.white : gameData.players.black;

    if (gameData.result) {
        results.classList.remove("hidden");
        results.textContent = gameData.result;
    }

    yourTurn = gameData.turn === (gameData.white ? "w" : "b");
    gameRunning = gameData.gameState === "Playing";

    if (chess) {
        chess.load(gameData.position);
    }

    if (board) {
        board.position(gameData.position);
    }
}
