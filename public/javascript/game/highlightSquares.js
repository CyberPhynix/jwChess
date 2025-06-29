const chess = new Chess();

var whiteSquareGrey = "#a9a9a9";
var blackSquareGrey = "#696969";

function removeAllHighlights() {
    $("#board .square-55d63").removeClass("highlight");
}

function highlightSquare(square) {
    $("#board .square-" + square).addClass("highlight");
}

function onMouseoverSquare(isWhite) {
    return (square, piece) => {
        let moves = chess.moves({
            square: square,
            verbose: true,
        });

        if (moves.length === 0 || piece.startsWith(isWhite ? "b" : "w")) return;

        highlightSquare(square);

        for (let i = 0; i < moves.length; i++) {
            highlightSquare(moves[i].to);
        }
    };
}

function onMouseoutSquare(square, piece) {
    removeAllHighlights();
}
