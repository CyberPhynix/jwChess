var crypto = require("crypto");

let sids = [];
let gids = [];

function generateValidSID() {
    let id = generate_key();
    if (sids.indexOf(id) >= 0) return generateValidSID();
    sids.push(id);
    return id;
}

function generateGID() {
    let id = getRandomInt(1000000);
    if (gids.indexOf(id) >= 0) return generateGID();
    gids.push(id);
    return id.toString();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function voidSID(sidToVoid) {
    sids = sids.filter((sid) => sid !== sidToVoid);
}

let generate_key = function () {
    // 16 bytes is likely to be more than enough,
    // but you may tweak it to your needs
    return crypto
        .randomBytes(16)
        .toString("base64")
        .split("")
        .map((e) => (e === "/" ? "ä" : e === "+" ? "ö" : e))
        .join("");
};

exports.sids = sids;
exports.generateValidSID = generateValidSID;
exports.generateGID = generateGID;
exports.voidSID = voidSID;
