var express = require("express");
let { Player, Game } = require("../models/game");
const { cache } = require("../data/cache");
var router = express.Router();

/**
 *  /api/game/create?nickname={name}+color={w|b}
 */
router.get("/game/create", function (req, res, next) {
    let player = new Player(req.query.nickname);
    let game = new Game();

    game.addPlayer(player, req.query.color);

    res.cookie("sid", player.sid);

    cache.games.push(game);
    res.redirect("/game");
});

/**
 *  /api/game/join?nickname={name}&gid={gameID}
 */
router.get("/game/join", function (req, res, next) {
    let game = cache.games.find((game) => game.gid === req.query.gid);

    if (!game) return res.status(400).redirect("/?err=1");
    if (game.gameState !== "Waiting") return res.status(400).redirect("/?err=2");

    let player = new Player(req.query.nickname);
    res.cookie("sid", player.sid);

    game.addPlayer(player);

    res.redirect("/game");
});

router.get("/game/leave", function (req, res, next) {
    let game = cache.games.find((game) => game.getPlayer(req.cookies.sid));
    if (!game) return res.status(500).send("Game has not been found");

    let player = game.getPlayer(req.cookies.sid);
    if (!player) return res.status(401).send("No Permission");

    game.removePlayer(player.sid);
    res.clearCookie("sid");
    res.redirect("/");
});

/**
 * Game Data API
 *
 * /api/game
 * => {player, game, gameData}
 *
 * @typedef {Object} I_GameData
 * @property {number} gameData.gid
 * @property {"Waiting" | "Playing" | "Finished"} gameData.gameState
 * @property {String} gameData.position
 *
 * @returns {I_GameData}
 */
router.get("/game", function (req, res, next) {
    // Check if req is game
    let game = cache.games.find((game) => game.getPlayer(req.cookies.sid));
    if (!game) return res.status(500).send("Game has not been found");

    // Check if req is player
    let player = game.getPlayer(req.cookies.sid);
    if (!player) return res.status(401).send("No Permission");

    let isWhite = !!game.white && game.white.sid === player.sid;
    let turn = game.chess.turn();

    res.json({
        gid: game.gid,
        gameState: game.gameState,
        position: game.chess.fen(),
        players: {
            white: game.white ? game.white.name : "Waiting for player",
            black: game.black ? game.black.name : "Waiting for player",
        },
        white: isWhite,
        turn: turn,
        result: getGameStatus(game),
    });
});

function getGameStatus(game) {
    if (!game.chess.isGameOver()) return null;

    if (game.chess.isCheckmate()) {
        let winner = game.chess.turn() === "w" ? game.black.name : game.white.name;
        return `Checkmate - ${winner} wins`;
    }

    // Check for various draw conditions
    if (game.chess.isDrawByFiftyMoves()) return "Draw by fifty-move rule";
    if (game.chess.isInsufficientMaterial()) return "Draw by insufficient material";
    if (game.chess.isThreefoldRepetition()) return "Draw by threefold repetition";
    if (game.chess.isStalemate()) return "Draw by stalemate";
    if (game.chess.isDraw()) return "Draw";

    return "Game over";
}

module.exports = router;
