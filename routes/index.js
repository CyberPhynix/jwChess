var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.locals.joinErr = req.query.err === "1";
    res.locals.joinPlayerCountErr = req.query.err === "2";
    res.locals.gameNotFound = req.query.err === "3";
    res.render("index");
});

module.exports = router;
