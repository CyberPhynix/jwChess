var express = require("express");
let { Player, Game } = require("../models/game");
const { cache } = require("../data/cache");
var router = express.Router();

/**
 *   /api/game/create?nickname={name}
 */
router.get("/game/create", function (req, res, next) {
    let player = new Player(0, req.query.nickname);
    let game = new Game();

    game.addPlayer(player);
    res.cookie("sid", player.sid);

    cache.games.push(game);
    res.redirect("/game");
});

/**
 * /api/game/join?nickname={name}&gid={gameID}
 */
router.get("/game/join", function (req, res, next) {
    if (cache.games.filter((game) => game.gid === req.query.gid).length < 1) return res.status(400).redirect("/?err=1");
    if (cache.games.find((game) => game.gid === req.query.gid).players.length >= 4)
        return res.status(400).redirect("/?err=2");

    let player = new Player(0, req.query.nickname);
    res.cookie("sid", player.sid);

    let game = cache.games.find((game) => game.gid === req.query.gid);
    game.addPlayer(player);

    res.redirect("/game");
});

router.get("/game/leave", function (req, res, next) {
    let game = cache.games.find((game) => game.players.find((player) => player.sid === req.cookies.sid));
    if (!game) return res.status(500).send("Game has not been found");

    let player = game.players.find((player) => player.sid === req.cookies.sid);
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
 * @typedef {Object} I_PlayerData
 * @property {number} gameData.gid
 * @property {"Betting" | "Playing"} gameData.gameState
 * @property {number} gameData.turn
 * @property {Array<{name: string, heap: Heap, betAmount: number, bank: number, value: number}>} gameData.players
 * @property {{heap: Heap}} gameData.dealer
 *
 * @returns {I_PlayerData}
 */
router.get("/game", function (req, res, next) {
    // Check if req is game
    let game = cache.games.find((game) => game.players.find((player) => player.sid === req.cookies.sid));
    if (!game) return res.status(500).send("Game has not been found");

    // Check if req is player
    let player = game.players.find((player) => player.sid === req.cookies.sid);
    if (!player) return res.status(401).send("No Permission");

    let gameData = {
        gid: game.gid,
        gameState: game.gameState,
        turn: game.turn,
        players: game.players.map((player) => {
            return {
                name: player.name,
                heap: player.heap,
                betAmount: player.betAmount,
                bank: player.bank,
                value: player.heap.value,
                self: player.sid === req.cookies.sid,
            };
        }),
        dealer: {
            heap: game.dealer.heap.cards.map((card) => {
                if (card.hidden)
                    return {
                        value: 0,
                        symbol: 0,
                        hidden: true,
                    };
                return {
                    value: card.value,
                    symbol: card.symbol,
                    hidden: card.hidden,
                };
            }),
            value: game.dealer.heap.cards.every((card) => !card.hidden) ? game.dealer.heap.value : 0,
        },
    };

    res.json(gameData);
});

module.exports = router;
