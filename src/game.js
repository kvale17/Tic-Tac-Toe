const GameBoard = (() => {
    const gameBoard = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];

    const placeMark = (cell, mark, player) => {
        if (!GameBoard.gameBoard[cell.row] && !GameBoard.gameBoard[cell.col]) {
            console.error("Invalid row and column");
        }
        else if (!GameBoard.gameBoard[cell.row]) {
            console.error("Invalid row");
        }
        else if (!GameBoard.gameBoard[cell.col]) {
            console.error("Invalid col");
        }

        if ((mark === "X" || mark === "O")) {
            GameBoard.gameBoard[cell.row][cell.col] = mark;
            player.addMark();
        } else {
            console.error("Mark");
        }
    }

    const getEmptyCellIndices = () => {
        const emptyCellIndices = [];
        GameBoard.gameBoard.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === " ") {
                    emptyCellIndices.push({ row: rowIndex, col: colIndex });
                }
            });
        });

        return emptyCellIndices;

    }

    return { gameBoard, placeMark, getEmptyCellIndices };
})();

const GameFlow = (() => {
    const getUserInput = () => {
        const input = prompt("What cell do you want to place a mark in ? (row, col i.e \"2,1\")");

        const inputArray = input.split(',');

        const choice = createChoice((inputArray[0] - 1), (inputArray[1] - 1));

        return choice;
    }

    const getComputerInput = () => {
        const emptyCellIndexes = GameBoard.getEmptyCellIndices();

        const randomIndex = Math.floor(Math.random() * emptyCellIndexes.length);
        const randomCell = emptyCellIndexes[randomIndex];

        return randomCell;
    }

    return { getUserInput, getComputerInput };
})();


function createPlayer(name) {

    let marksPlaced = 0;

    let addMark = () => marksPlaced++;

    let getMarks = () => { return marksPlaced };

    return { name, addMark, getMarks };
}


function createChoice(row, col) {
    return { row, col }
}