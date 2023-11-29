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

    let player = new Player(0, req.query.nickname);
    res.cookie("sid", player.sid);

    let game = cache.games.find((game) => game.gid === req.query.gid);
    game.addPlayer(player);

    res.redirect("/game");
});

/**
 * Game Data API
 *
 * /api/game
 * => {player, game, gameData}
 */
router.get("/game", function (req, res, next) {
    // Check if req is game
    let game = cache.games.find((game) => game.players.find((player) => player.sid === req.cookies.sid));
    if (!game) return res.status(500).send("Game has not been found");

    // Check if req is player
    let player = game.players.find((player) => player.sid === req.cookies.sid);
    if (!player) return res.status(401).send("No Permission");

    res.json(game);
});

module.exports = router;
