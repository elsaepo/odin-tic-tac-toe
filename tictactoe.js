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
    const checkWin = (cell, marker) => {
        let coord = indexToCoord(cell);
        let baseX = coordToIndex(0, coord.y);
        let baseY = coordToIndex(coord.x, 0);
        const checkHorizontal = (y) => {
            if (gameArray[y] === gameArray[y + 1] && gameArray[y + 1] === gameArray[y + 2]) {
                return [y, y + 1, y + 2];
            };
        }
        const checkVertical = (x) => {
            if (gameArray[x] === gameArray[x + 3] && gameArray[x + 3] === gameArray[x + 6]) {
                return [x, x + 3, x + 6];
            };
        }
        const checkDiagonal = (mark) => {
            if (gameArray[0] === mark && gameArray[4] === mark && gameArray[8] === mark) {
                return [0, 4, 8];
            } else if (gameArray[2] === mark && gameArray[4] === mark && gameArray[6] === mark) {
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
        })
        if(this.currentPlayer.controller !== "human"){
            this.currentPlayer.move(this.currentPlayer.getAICell("aiEasy"));
        }
        return this.currentPlayer;
        // send player move here or something
    };
    return { currentPlayer, changePlayer, moves };
})();

const Player = (name, marker, controller) => {
    const getAICell = function(difficulty){
        let pseudoArray = [...gameBoard.gameArray];
        // let pseudoArray = [
        //    "⚬", "⚬", "",
        //    "×", "×", "",
        //    "", "", "×"
        // ];
        let possibleMoves = pseudoArray.reduce((acc, curr, index) => {
            if(!curr){ acc.push(index); }
            return acc;
        }, []);
        if(difficulty = "aiEasy"){
            return possibleMoves[Math.floor(Math.random()*possibleMoves.length)];
        }
        if(difficulty = "aiHard"){
            //return hard move

        }
        if(difficulty = "aiPro"){
            //return pro move
        }
    }
    const move = function (cellID) {
        let node = document.querySelector(`#cell-${cellID}`)
        node.textContent = gameBoard.setMarkerAt(cellID, this.marker);
        // Makes "o" elements bigger due to available unicode characters
        if (this.marker === "⚬") { node.classList.add("o-sizer") };
        node.classList.remove("grid-hover");
        gameData.moves++;
        let winReturn = gameBoard.checkWin(cellID, marker);
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
        if(playerOne.controller !== "human"){
            //playerOne.move(player.getAICell())
            playerOne.move(playerOne.getAICell());
        }
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