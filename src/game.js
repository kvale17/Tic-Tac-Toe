const GameBoard = (() => {
    const gameBoard = [
        { row: "a", column: "1", cell: "a1", mark: 0 }, { row: "a", column: "2", cell: "a2", mark: 0 }, { row: "a", column: "3", cell: "a3", mark: 0 },
        { row: "b", column: "1", cell: "b1", mark: 0 }, { row: "b", column: "2", cell: "b2", mark: 0 }, { row: "b", column: "3", cell: "b3", mark: 0 },
        { row: "c", column: "1", cell: "c1", mark: 0 }, { row: "c", column: "2", cell: "c2", mark: 0 }, { row: "c", column: "3", cell: "c3", mark: 0 }
    ];

    const placeMark = (cell, mark, player) => {
        let index = gameBoard.findIndex(cellObj => cellObj.cell === cell);

        if (index !== -1 && (mark === "X" || mark === "O")) {
            gameBoard[index].mark = mark;
            player.addMark();
        } else {
            console.error("Invalid mark or cell");
        }
    }

    const getEmptyCells = () => {
        return gameBoard.filter(cell => cell.mark === 0);
    }

    return { gameBoard, placeMark, getEmptyCells };
})();


function createPlayer(name) {

    let marksPlaced = 0;

    let addMark = () => marksPlaced++;

    let getMarks = () => { return marksPlaced };

    return { name, addMark, getMarks };
}

const GameFlow = (() => {
    const getUserInput = () => {
        const input = prompt("What cell do you want to place a mark in ?");

        return input;
    }

    const getComputerInput = () => {
        const emptyCells = GameBoard.getEmptyCells();

        const computerChoiceIndex = Math.floor(Math.random() * emptyCells.length);

        const computerChoiceCell = emptyCells[computerChoiceIndex].cell;

        return computerChoiceCell;
    }

    return { getUserInput, getComputerInput };
})();