const GameBoard = (() => {
    let gameBoard = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];

    let marksPlaced = 0;

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

            GameBoard.marksPlaced++;
        }
        else {
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

    const isCorner = (cell) => {
        if ((cell.row === cell.col && cell.row !== 1) || (cell.row === 2 && cell.col === 0) || (cell.row === 0 && cell.col === 2)) {
            return true;
        }
        else {
            return false;
        }
    }

    return { gameBoard, placeMark, getEmptyCellIndices, marksPlaced, isCorner };
})();

const GameFlow = (() => {
    let winner = null;

    const getUserInput = () => {
        const input = prompt("What cell do you want to place a mark in ? (row, col i.e \"2,1\")");

        const inputArray = input.split(',');

        const choice = createChoice((inputArray[0] - 1), (inputArray[1] - 1));

        if (GameBoard.gameBoard[choice.row][choice.col] !== " ") {
            alert("That cell is already filled");

            return GameFlow.getUserInput();
        }
        else {

            return choice;
        }
    }

    const checkPlayerCloseToWin = () => {

        //Get all X cells

        const xIndices = [];

        GameBoard.gameBoard.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === "X") {
                    xIndices.push({ row: rowIndex, col: colIndex });
                }
            });
        });

        for (let i = 0; i < xIndices.length; i++) {

            //Check diagonals for X if corner piece
            if (GameBoard.isCorner(xIndices)) {

                console.log(3 - xIndices[i].row);

                const oppositeCorner = { row: (2 - xIndices[i].row), col: (2 - xIndices[i].col) };

                //If center is X computer must choose opposite corner
                if (GameBoard.gameBoard[1][1] === "X") {
                    const choice = oppositeCorner;

                    const choiceValue = GameBoard.gameBoard[choice.row][choice.col];

                    if (choiceValue !== "O" && choiceValue !== "X") {
                        console.log("Found ideal choice must complete diagonal");

                        return choice;
                    }
                }

                //If center is not X check opposite corner and return center if it is X
                else if (GameBoard.gameBoard[oppositeCorner.row][oppositeCorner.col] === "X") {
                    const choice = { row: 1, col: 1 }

                    const choiceValue = GameBoard.gameBoard[choice.row][choice.col];

                    if (choiceValue !== "O" && choiceValue !== "X") {
                        console.log("Found ideal choice must complete diagonal");

                        return choice;
                    }
                }
            }


            //If not corner then check rows and columns

            for (let j = (i + 1); j < xIndices.length; j++) {

                //Check rows for X 
                if (xIndices[j].row === xIndices[i].row) {

                    const choice = { row: xIndices[i].row, col: (3 - xIndices[i].col - xIndices[j].col) };

                    const choiceValue = GameBoard.gameBoard[choice.row][choice.col];

                    if (choiceValue !== "O" && choiceValue !== "X") {
                        console.log("Found ideal choice must complete row");

                        return choice;
                    }
                }

                //Check columns for X
                if (xIndices[j].col === xIndices[i].col) {

                    const choice = { row: (3 - xIndices[i].row - xIndices[j].row), col: xIndices[i].col };

                    const choiceValue = GameBoard.gameBoard[choice.row][choice.col];

                    if (choiceValue !== "O" && choiceValue !== "X") {
                        console.log("Found ideal choice must complete column");

                        return choice;
                    }
                }
            }
        }



        console.log("Did not find ideal choice");

        return 0;


    }

    const getComputerInput = () => {
        const emptyCellIndexes = GameBoard.getEmptyCellIndices();

        const idealChoice = GameFlow.checkPlayerCloseToWin();

        if (idealChoice !== 0) {
            return idealChoice;
        }
        else {

            console.log("Getting random cell");

            const randomIndex = Math.floor(Math.random() * emptyCellIndexes.length);
            const randomCell = emptyCellIndexes[randomIndex];

            return randomCell;
        }
    }

    const isGameWon = () => {
        let current;

        if (GameBoard.marksPlaced < 5) {
            return false;
        }

        //Check rows
        for (let i = 0; i < 3; i++) {
            current = GameBoard.gameBoard[i][0];

            if (current !== " ") {
                if ((GameBoard.gameBoard[i][1] === current) && (GameBoard.gameBoard[i][2] === current)) {

                    GameFlow.winner = current;

                    console.log("Row " + (i + 1) + " is filled");

                    return true
                }
            }
        }

        //Check columns
        for (let i = 0; i < 3; i++) {
            current = GameBoard.gameBoard[0][i];

            if (current !== " ") {

                if ((GameBoard.gameBoard[1][i] == current) && (GameBoard.gameBoard[2][i] === current)) {

                    GameFlow.winner = current;

                    console.log("Column " + (i + 1) + " is filled");

                    return true;
                }
            }
        }

        //Check diagonals
        current = GameBoard.gameBoard[1][1];

        if (current !== " ") {

            if (((GameBoard.gameBoard[0][0] === current) && (GameBoard.gameBoard[2][2] === current)) ||
                ((GameBoard.gameBoard[0][2] === current) && (GameBoard.gameBoard[2][0] === current))) {

                GameFlow.winner = current;

                console.log("Diagonal is filled");

                return true;
            }

        }

        if (GameBoard.marksPlaced === 9) {
            return true;
        }

        return false;
    }

    return { getUserInput, getComputerInput, isGameWon, checkPlayerCloseToWin };
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

function drawBoard(board) {
    const divider = "---+---+---";
    console.log(board.map(row => row.map(cell => cell === 0 ? " " : cell).join(" | ")).join("\n" + divider + "\n"));
    console.log("\n");
}