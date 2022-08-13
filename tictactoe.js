const gameBoard = (() => {
    const emptyGameArray = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];
    let gameArray = [...emptyGameArray];
    // THIS IS NOT RESETTING so i'm not using it at the moment
    // it uses a different gameArray than the object? but setMarkerAt uses the right one? probably something to do with scope
    // const resetGameArray = () => {
    //     gameArray.forEach(tile => tile = "");
    // }
    const coordToIndex = (x, y) => x + y * 3;
    const indexToCoord = (index) => {
        return {
            x: Number(index) % 3,
            y: Math.floor(Number(index) / 3)
        }
    };
    const getMarkerAt = (id) => gameArray[id];
    const setMarkerAt = (id, marker) => {
        gameArray[id] = marker;
        return marker;
    }
    const checkWin = (board, cell, marker) => {
        if (!cell) {
            return (board[0] && board[0] === board[1] && board[1] === board[2] ? board[0] : false ||
                board[3] && board[3] === board[4] && board[4] === board[5] ? board[3] : false ||
                    board[6] && board[6] === board[7] && board[7] === board[8] ? board[6] : false ||
                        board[0] && board[0] === board[3] && board[3] === board[6] ? board[0] : false ||
                            board[1] && board[1] === board[4] && board[4] === board[7] ? board[1] : false ||
                                board[2] && board[2] === board[5] && board[5] === board[8] ? board[2] : false ||
                                    board[0] && board[0] === board[4] && board[4] === board[8] ? board[0] : false ||
                                        board[2] && board[2] === board[4] && board[4] === board[6] ? board[2] : false)
        }
        let coord = indexToCoord(cell);
        let baseX = coordToIndex(0, coord.y);
        let baseY = coordToIndex(coord.x, 0);
        const checkHorizontal = (y) => {
            if (board[y] === board[y + 1] && board[y + 1] === board[y + 2]) {
                return [y, y + 1, y + 2];
            };
        }
        const checkVertical = (x) => {
            if (board[x] === board[x + 3] && board[x + 3] === board[x + 6]) {
                return [x, x + 3, x + 6];
            };
        }
        const checkDiagonal = (mark) => {
            if (board[0] === mark && board[4] === mark && board[8] === mark) {
                return [0, 4, 8];
            } else if (board[2] === mark && board[4] === mark && board[6] === mark) {
                return [2, 4, 6];
            }
        }
        return (checkHorizontal(baseX) || checkVertical(baseY) || checkDiagonal(marker));
    }
    return { gameArray, getMarkerAt, setMarkerAt, checkWin };
})();

const gameData = (() => {
    let currentPlayer;
    let moves = 0;
    const changePlayer = function (player) {
        if (player) { this.currentPlayer = player } else {
            this.currentPlayer = (this.currentPlayer === playerOne) ? playerTwo : playerOne;
        }
        displayContainer.highlightBox(this.currentPlayer);
        // Set hover to current player's marker
        displayContainer.hoverBoxes.forEach(node => {
            node.textContent = this.currentPlayer.marker;
            this.currentPlayer.marker === "⚬" ? node.classList.add("o-sizer") : node.classList.remove("o-sizer")
        });
        // This adds an artificial delay to the AI's moves
        function resolveAfterTimeout() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve("resolved");
                }, 150)
            })
        };
        async function asyncCall() {
            await resolveAfterTimeout();
            gameData.currentPlayer.move(gameData.currentPlayer.getAICell(gameData.currentPlayer.controller));
        }
        if (this.currentPlayer.controller !== "human") { asyncCall(); };
        return this.currentPlayer;
    };
    return { currentPlayer, changePlayer, moves };
})();

const Player = (name, marker, controller) => {
    const getAICell = function (difficulty) {
        let pseudoArray = [...gameBoard.gameArray];
        // let pseudoArray = [
        //     "⚬", "⚬", "",
        //     "×", "×", "",
        //     "⚬", "×", ""
        // ];
        // the above is a gret test because at first we have to stop our opponent winning with [2]
        // then our opponent is forced to play [5]
        // then we can force a win with a certain move after that with [6]!
        let possibleMoves = pseudoArray.reduce((acc, curr, index) => {
            if (!curr) { acc.push(index); }
            return acc;
        }, []);
        let dummyOppObject = this === playerOne ? playerTwo : playerOne;
        console.log(`${possibleMoves}`)
        if (difficulty === "aiEasy") {
            // Easy - plays a random move
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        if (difficulty === "aiHard") {
            // Hard - checks for a winning move, then for an opponent's next winning move, then random
            for (let i = 0; i < possibleMoves.length; i++) {
                let checkArray = [...pseudoArray];
                checkArray[possibleMoves[i]] = this.marker;
                let winReturn = gameBoard.checkWin([...checkArray], possibleMoves[i], marker);
                if (winReturn) {
                    return possibleMoves[i];
                } else {
                    let oppPossibleMoves = possibleMoves.filter(index => index !== possibleMoves[i])
                    for (let j = 0; j < oppPossibleMoves.length; j++) {
                        let oppArray = [...checkArray];
                        oppArray[oppPossibleMoves[j]] = dummyOppObject.marker;
                        if (gameBoard.checkWin([...oppArray], oppPossibleMoves[j], dummyOppObject.marker)) {
                            return oppPossibleMoves[j];
                        }
                    };
                }
            }
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        if (difficulty = "aiPro") {
            //Pro uses minimax to return a winning tree
            //evaluation funtion - returns +10, -10 or zero depending on board state

            const evaluate = (board) => {

                //console.log(`evaluating ${this.marker} on board ${board} \n ${gameBoard.checkWin(board)}`)
                if (!gameBoard.checkWin(board)) {
                    return 0;
                } else if (gameBoard.checkWin(board) === this.marker) {
                    return 10;
                } else return -10;
            };

            // findBestMove returns a move for a given game board
            const findBestMove = (board) => {
                console.log(board);
                let bestMoveValue = -1000;
                let bestMoveIndex;

                for (let i = 0; i < possibleMoves.length; i++) {
                    console.log(`-----checking move ${possibleMoves[i]}`)
                    //evaluate the current move
                    board[possibleMoves[i]] = this.marker;
                    let thisMoveValue = minimax(board, 0, false);
                    console.log(`-----evaluation: ${thisMoveValue}`)
                    //console.log(`thisMoveValue: ${thisMoveValue}`);
                    //console.log(`bestMoveValue: ${bestMoveValue}`);
                    board[possibleMoves[i]] = "";
                    if (thisMoveValue > bestMoveValue) {
                        console.log("new move is better")
                        bestMoveValue = thisMoveValue;
                        bestMoveIndex = possibleMoves[i];
                    }
                }
                console.log(`best move: ${bestMoveIndex}`);
                console.log(`best move value: ${bestMoveValue}`);
                return bestMoveIndex;
            }

            const checkMovesLeft = function (board) {
                for (let i = 0; i < board.length; i++){
                    if (board[i] === ""){
                        return true;
                    }
                }
                return false;
            }

            //minimax returns a value for the given move
            const minimax = (board, depth, isMaximizingPlayer) => {
                let score = evaluate(board)
                // console.log(board)
                // console.log(`score: ${score}`);
                //console.log(`depth: ${depth}`)
                // if current board is in a terminal state (win, lose or draw):
                // return value of the board
                if (score === 10 || score === -10) { return score; };
                if (!checkMovesLeft(board)) { return 0; };
                // if ixMaximizingPlayer (finding highest value)
                if (isMaximizingPlayer) {
                    // console.log(`checking max`)
                    let bestValue = -100;
                    // for each move in board:
                    for (let i = 0; i < 9; i++) {
                        //console.log(`max checking board ${board}`)
                        if (!board[i]) {
                            board[i] = this.marker;
                            //console.log(`max new board: ${board}`)
                            let thisValue = minimax(board, depth + 1, !isMaximizingPlayer);
                            //console.log(thisValue)
                            bestValue = Math.max(bestValue, thisValue);
                            board[i] = "";
                        }
                    }
                    return bestValue;
                    // if the minimiziers move (finding lowest value)
                } else {
                    // console.log(`checking min`)
                    let bestValue = 100;
                    for (let i = 0; i < 9; i++) {
                        //console.log(`min checking board ${board}`)
                        if (!board[i]) {
                            board[i] = dummyOppObject.marker;
                            // console.log(`min new board: ${board}`)
                            let thisValue = minimax(board, depth + 1, !isMaximizingPlayer);
                            bestValue = Math.min(bestValue, thisValue);
                            board[i] = "";
                        }
                    }
                    return bestValue;
                }

            }
            return findBestMove([...pseudoArray])
        }
    }
    const move = function (cellID) {
        let node = document.querySelector(`#cell-${cellID}`)
        node.textContent = gameBoard.setMarkerAt(cellID, this.marker);
        // Makes "o" elements bigger due to available unicode characters
        if (this.marker === "⚬") { node.classList.add("o-sizer") };
        node.classList.remove("grid-hover");
        gameData.moves++;
        let winReturn = gameBoard.checkWin(gameBoard.gameArray, cellID, marker);
        // On Win logic
        if (winReturn) {
            gameData.winner = this;
            // Add visual flavour to winning cells, remove hover elements from remaining cells
            winReturn.map(ind => document.querySelector(`#cell-${ind}`).classList.add("grid-winner"));
            displayContainer.hoverBoxes.forEach(node => { node.textContent = "" });
            displayContainer.gridBox.childNodes.forEach(cell => {
                if (cell.classList) { cell.classList.remove("grid-hover") }
            });
            displayContainer.addScore(this);
            displayContainer.nextRoundButton.classList.remove("inactive-button");
        } else if (gameData.moves === 9) {
            displayContainer.nextRoundButton.classList.remove("inactive-button");
            // DRAW DISPLAY
        } else gameData.changePlayer();

    }

    return { name, marker, move, getAICell, controller }
}

const displayContainer = (() => {
    const gridBox = document.querySelector("#grid-container");
    let hoverBoxes;
    const drawGrid = function () {
        for (let i = 0; i < 9; i++) {
            const gridCell = document.createElement("div");
            gridCell.classList.add("grid-cell");
            gridCell.classList.add("grid-hover");
            const gridOver = document.createElement("div");
            gridOver.classList.add("grid-over");
            gridOver.textContent = playerOne.marker;
            gridCell.appendChild(gridOver)
            gridCell.id = `cell-${i}`;
            gridCell.addEventListener("mousedown", (event) => {
                event.preventDefault();
                if (gameData.winner) { return };
                if (gameBoard.getMarkerAt(i)[0]) { return };
                gameData.currentPlayer.move(i);
            })
            gridBox.appendChild(gridCell);
        }
        this.hoverBoxes = document.querySelectorAll(".grid-over");
    };
    const resetGrid = function () {
        while (this.gridBox.children.length > 1) {
            this.gridBox.removeChild(this.gridBox.lastChild);
        }
        this.drawGrid();
    }
    const newGameBox = {
        startButton: document.querySelector("#start-game"),
        playerOne: document.querySelector(".new-player-one"),
        playerTwo: document.querySelector(".new-player-two"),
        newContainer: document.querySelector("#newgame-container")
    }
    newGameBox.startButton.addEventListener("mousedown", function (event) {
        let p1Name = document.querySelector("#player-one-name").value || "Anonymous";
        let p2Name = document.querySelector("#player-two-name").value || "Anonymous";
        let p1Controller = document.querySelector(".control-box-one").getAttribute("data-chosen");
        let p2Controller = document.querySelector(".control-box-two").getAttribute("data-chosen");
        p1Controller = p1Controller ? p1Controller : "human";
        p2Controller = p2Controller ? p2Controller : "human";
        const getControllerName = function (controller) {
            switch (controller) {
                case "aiEasy":
                    return "AI - EASY";
                case "aiHard":
                    return "AI - HARD";
                case "aiPro":
                    return "AI - PRO";
                default:
                    return;
            }
        }
        if (p1Controller !== "human") { p1Name = getControllerName(p1Controller); };
        if (p2Controller !== "human") { p2Name = getControllerName(p2Controller); };
        playerOne = Player(p1Name, "×", p1Controller);
        playerTwo = Player(p2Name, "⚬", p2Controller);
        drawName(playerOne);
        drawName(playerTwo);
        document.querySelector(".player-one-score").textContent = "0";
        document.querySelector(".player-two-score").textContent = "0";
        newGameBox.startButton.classList.add("zoom");
        newGameBox.playerOne.classList.add("hide-up");
        newGameBox.playerTwo.classList.add("hide-down");
        setTimeout(function () {
            newGameBox.newContainer.style.display = "none";
        }, 500)
        gameData.changePlayer(playerOne);
    })
    const getPlayerNum = (obj) => { return (obj === playerOne) ? "one" : "two"; }
    const drawName = function (player) {
        const name = document.querySelector(`.player-${getPlayerNum(player)}-name`);
        name.textContent = player.name;
    }
    const addScore = function (player) {
        const score = document.querySelector(`.player-${getPlayerNum(player)}-score`);
        score.textContent = Number(score.textContent) + 1;
    }
    // This highlights the player whose move it is (the active player)
    const highlightBox = function (player) {
        document.querySelectorAll(`.player-one-name, .player-two-name`).forEach(node => node.classList.remove("active-move"));
        document.querySelector(`.player-${getPlayerNum(player)}-name`).classList.add("active-move");
    }
    const nextRoundButton = document.querySelector("#next-round");
    nextRoundButton.addEventListener("mousedown", function (event) {
        event.target.classList.add("inactive-button")
        displayContainer.resetGrid();
        // gameBoard.resetGameArray(); <- why doesn't this work?
        for (let i = 0; i < gameBoard.gameArray.length; i++) {
            gameBoard.setMarkerAt(i, "");
        }
        gameData.winner = "";
        gameData.moves = 0;
        gameData.changePlayer();
    })
    const restartButton = document.querySelector("#restart-game");
    restartButton.addEventListener("mousedown", function (event) {
        displayContainer.resetGrid();
        for (let i = 0; i < gameBoard.gameArray.length; i++) {
            gameBoard.setMarkerAt(i, "");
        }
        gameData.winner = "";
        gameData.moves = 0;
        newGameBox.newContainer.style.display = "flex";
        newGameBox.startButton.classList.remove("zoom");
        newGameBox.playerOne.classList.remove("hide-up");
        newGameBox.playerTwo.classList.remove("hide-down");

    })
    return { gridBox, drawGrid, resetGrid, hoverBoxes, drawName, addScore, highlightBox, nextRoundButton }
})();

let playerOne = Player("Carl", "×");
let playerTwo = Player("Kindon", "⚬");

displayContainer.drawGrid();