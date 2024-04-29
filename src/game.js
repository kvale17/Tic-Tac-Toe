const GameBoard = (function () {
    const gameBoard =
        [
            { row: "a", column: "1", id: "a1", mark: 0 }, { row: "a", column: "2", cell: "a2", mark: 0 }, { row: "a", column: "3", cell: "a3", mark: 0 },
            { row: "b", column: "1", id: "b1", mark: 0 }, { row: "b", column: "2", cell: "b2", mark: 0 }, { row: "b", column: "3", cell: "b3", mark: 0 },
            { row: "c", column: "1", id: "c1", mark: 0 }, { row: "c", column: "2", cell: "c2", mark: 0 }, { row: "c", column: "3", cell: "c3", mark: 0 }
        ];

    const placeMark = (cell, mark, player) => {
        let index = gameBoard.findIndex(gameBoard => gameBoard.cell == cell);

        if (mark === "X" || mark === "O") {
            gameBoard[index].mark = mark;

            player.addMark();
        }
        else {
            console.error("Invalid mark (must be X or O)");
        }
    }

    return { gameBoard, placeMark };
})();


function createPlayer(name) {

    let marksPlaced = 0;

    let addMark = () => marksPlaced++;

    let getMarks = () => { return marksPlaced };

    return { name, addMark, getMarks };
}




