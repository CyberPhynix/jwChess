var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.locals.joinErr = req.query.err === "1";
    res.locals.createErr = req.query.err === "2";
    res.render("index");
});

module.exports = router;
