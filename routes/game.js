var express = require("express");
var router = express.Router();
const { cache } = require("../data/cache");

/**
 *  /game
 */
router.get("/", function (req, res, next) {
    let game = cache.games.find((game) => game.getPlayer(req.cookies.sid));
    if (!game) return res.status(500).redirect("/?err=3");

    res.render("game");
});

module.exports = router;
