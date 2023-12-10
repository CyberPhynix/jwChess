/**
 * @typedef {Object} I_Bet
 * @property {"Bet"} type - The type of move.
 * @property {number} betAmount - The bet amount.
 *
 * @param data
 * @param {I_Bet} data.move
 */

function bet(data, player, game) {
    if (game.gameState !== "Betting") return false;
    if (player.betAmount > 0) return false;

    let betAmount = parseInt(data.move.betAmount);
    if (isNaN(betAmount)) return false;

    player.bet(betAmount);
    if (game.players.every((player) => player.betAmount > 0)) game.start();
    return true;
}

function hit(data, player, game) {
    if (game.gameState !== "Playing") return false;

    game.hit(player);
    return true;
}

function stand(data, player, game) {
    if (game.gameState !== "Playing") return false;

    game.stand(player);
    return true;
}

module.exports = {
    bet,
    hit,
    stand,
};
