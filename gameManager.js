/**
 * @typedef {Object} I_Bet
 * @property {"Bet"} type - The type of move.
 * @property {number} betAmount - The bet amount.
 *
 * @param data
 * @param {I_Bet} data.move
 */

function bet(data, player, game) {
    if (game.gameState !== "Betting") return;
    if (player.betAmount > 0) return;

    let betAmount = parseInt(data.move.betAmount);
    if (isNaN(betAmount)) return;

    player.bet(betAmount);
    if (game.players.every((player) => player.betAmount > 0)) game.start();
}

function hit(data, player, game) {
    if (game.gameState !== "Playing") return;

    game.hit(player);
}

function stand(data, player, game) {
    if (game.gameState !== "Playing") return;

    game.stand(player);
}

module.exports = {
    bet,
    hit,
    stand,
};
