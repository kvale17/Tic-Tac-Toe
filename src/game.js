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

const Display = (() => {
    const updateCell = (choice, mark) => {
        const gridCell = document.querySelector(`.row${choice.row}.col${choice.col}`);

        gridCell.textContent = mark;
    }

    const fillLine = (type, value) => {
        let gridLine;

        if (type === "row") {
            gridLine = document.querySelectorAll(`.row${value}`);


        }
        else if (type === "col") {
            gridLine = document.querySelectorAll(`.col${value}`);
        }
        else if (type === "positive-diagonal") {
            gridLine = document.querySelectorAll(".positive-diagonal");
        }
        else if (type === "negative-diagonal") {
            gridLine = document.querySelectorAll(".negative-diagonal");
        }

        gridLine.forEach((cell) => {
            cell.style.backgroundColor = "aquamarine";
        });
    }

    return { updateCell, fillLine };

})();

const GameFlow = (() => {
    let winner = null;

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const getUserInput = () => {
        const boardGrid = document.querySelector('.board-grid');

        return new Promise(resolve => {
            boardGrid.addEventListener('click', function getUserCellClick(event) {
                if (event.target && event.target.matches('.cell') && event.target.textContent === "") {
                    boardGrid.removeEventListener('click', getUserCellClick);

                    const index = Array.from(boardGrid.children).indexOf(event.target);
                    const row = Math.floor(index / 3);
                    const col = index % 3;

                    const choice = createChoice(row, col);

                    if (GameBoard.gameBoard[row][col] === " ") {
                        resolve(choice);
                    }
                    else {
                        resolve(GameFlow.getUserInput());
                    }
                }
            });
        });
    }

    const checkPlayerCloseToWin = (playerMark) => {

        //Get all playerMark cells

        const playerMarkIndices = [];

        GameBoard.gameBoard.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === playerMark) {
                    playerMarkIndices.push({ row: rowIndex, col: colIndex });
                }
            });
        });

        for (let i = 0; i < playerMarkIndices.length; i++) {

            //Check diagonals for playerMark if corner piece
            if (GameBoard.isCorner(playerMarkIndices)) {

                const oppositeCorner = { row: (2 - playerMarkIndices[i].row), col: (2 - playerMarkIndices[i].col) };

                //If center is playerMark computer must choose opposite corner
                if (GameBoard.gameBoard[1][1] === playerMark) {
                    const choice = oppositeCorner;

                    const choiceValue = GameBoard.gameBoard[choice.row][choice.col];

                    if (choiceValue === " ") {
                        console.log("Found ideal choice must complete diagonal");

                        return choice;
                    }
                }

                //If center is not playerMark check opposite corner and return center if it is playerMark
                else if (GameBoard.gameBoard[oppositeCorner.row][oppositeCorner.col] === playerMark) {
                    const choice = { row: 1, col: 1 }

                    const choiceValue = GameBoard.gameBoard[choice.row][choice.col];

                    if (choiceValue === " ") {
                        console.log("Found ideal choice must complete diagonal");

                        return choice;
                    }
                }
            }


            //If not corner then check rows and columns

            for (let j = (i + 1); j < playerMarkIndices.length; j++) {

                //Check rows for playerMark
                if (playerMarkIndices[j].row === playerMarkIndices[i].row) {

                    const choice = { row: playerMarkIndices[i].row, col: (3 - playerMarkIndices[i].col - playerMarkIndices[j].col) };

                    const choiceValue = GameBoard.gameBoard[choice.row][choice.col];

                    if (choiceValue === " ") {
                        console.log("Found ideal choice must complete row");

                        return choice;
                    }
                }

                //Check columns for playerMark
                if (playerMarkIndices[j].col === playerMarkIndices[i].col) {

                    const choice = { row: (3 - playerMarkIndices[i].row - playerMarkIndices[j].row), col: playerMarkIndices[i].col };

                    const choiceValue = GameBoard.gameBoard[choice.row][choice.col];

                    if (choiceValue === " ") {
                        console.log("Found ideal choice must complete column");

                        return choice;
                    }
                }
            }
        }

        return 0;
    }

    const getComputerInput = () => {
        const emptyCellIndexes = GameBoard.getEmptyCellIndices();

        let idealChoice = GameFlow.checkPlayerCloseToWin("O");

        if (idealChoice !== 0) {
            return idealChoice;
        }

        idealChoice = GameFlow.checkPlayerCloseToWin("X");

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

                    Display.fillLine("row", i);

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

                    Display.fillLine("col", i);

                    return true;
                }
            }
        }

        //Check diagonals
        current = GameBoard.gameBoard[1][1];

        if (current !== " ") {
            if ((GameBoard.gameBoard[0][0] === current) && (GameBoard.gameBoard[2][2] === current)) {
                GameFlow.winner = current;

                console.log("Negative diagonal is filled");

                Display.fillLine("negative-diagonal", null);

                return true;
            }

            if ((GameBoard.gameBoard[0][2] === current) && (GameBoard.gameBoard[2][0] === current)) {
                GameFlow.winner = current;

                console.log("Positive diagonal is filled");

                Display.fillLine("positive-diagonal", null);

                return true;
            }
        }

        if (GameBoard.marksPlaced === 9) {
            return true;
        }

        return false;
    }

    const playGame = async () => {
        const pc = createPlayer("pc");
        const player = createPlayer("player");

        let gameOver = false;

        while (!gameOver) {
            let playerChoice = await GameFlow.getUserInput();
            GameBoard.placeMark(playerChoice, "X", player);

            drawBoard(GameBoard.gameBoard);

            Display.updateCell(playerChoice, "X");

            gameOver = GameFlow.isGameWon();

            if (gameOver) {
                break;
            }

            await sleep(500);

            let computerChoice = GameFlow.getComputerInput();
            GameBoard.placeMark(computerChoice, "O", pc);

            drawBoard(GameBoard.gameBoard);

            Display.updateCell(computerChoice, "O");

            gameOver = GameFlow.isGameWon();
        }

        if (GameFlow.winner) {
            console.log("Game over: " + GameFlow.winner + " wins");
        }
        else {

            console.log("Game over: the game tied");
        }
    }

    return { getUserInput, getComputerInput, isGameWon, checkPlayerCloseToWin, playGame, sleep };
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

GameFlow.playGame();
