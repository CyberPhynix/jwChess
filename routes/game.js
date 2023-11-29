var express = require("express");
var router = express.Router();

/**
 *  /game
 */
router.get("/", function (req, res, next) {
    res.redirect("/api/game");
});

module.exports = router;
