var express = require("express");
const { cache } = require("../data/cache");
var router = express.Router();

/**
 *  /game
 */
router.get("/", function (req, res, next) {
    let game = cache.games.find((game) => game.players.find((player) => player.sid === req.cookies.sid));
    if (!game) return res.status(500).send("Game has not been found");

    // Check if req is player
    let player = game.players.find((player) => player.sid === req.cookies.sid);
    if (!player) return res.status(401).send("No Permission");

    res.render("game");
});

module.exports = router;
