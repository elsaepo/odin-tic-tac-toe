const gameBoard = (() => {
    const gameSize = 3;
    const gameArray = [
        [""], [""], [""],
        [""], [""], [""],
        [""], [""], [""]
    ];
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
            if(gameArray[0] === mark && gameArray[4] === mark && gameArray[8] === mark){
                return [0, 4, 8];
            } else if(gameArray[2] === mark && gameArray[4] === mark && gameArray[6] === mark){
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
    let winner;
    const changePlayer = function () {
        this.currentPlayer = (this.currentPlayer === playerOne) ? playerTwo : playerOne;
        displayContainer.hoverBoxes.forEach(node => {
            node.textContent = this.currentPlayer.marker;
            this.currentPlayer.marker === "⚬" ? node.classList.add("o-sizer") : node.classList.remove("o-sizer")
        })
        return this.currentPlayer;
    };
    return { currentPlayer, changePlayer, moves };
})();

const Player = (name, marker) => {
    const move = function (cellID, node) {
        node.textContent = gameBoard.setMarkerAt(cellID, this.marker);
        // Makes "o" elements bigger due to available unicode characters
        if (this.marker === "⚬"){ node.classList.add("o-sizer") };
        node.classList.remove("grid-hover");
        gameData.moves++;
        let winReturn = gameBoard.checkWin(cellID, marker);
        if (winReturn) {
            gameData.winner = this;
            // Add visual flavour to winning cells, remove hover elements from remaining cells
            winReturn.map(ind => document.querySelector(`#cell-${ind}`).classList.add("grid-winner"));
            displayContainer.gridBox.childNodes.forEach(cell => {
                if(cell.classList){cell.classList.remove("grid-hover")}
            });
            displayContainer.outputBox.textContent = `${this.name} is the winner!`;
        } else if (gameData.moves === 9) {
            displayContainer.outputBox.textContent = `It's a draw! Though Carl is the real winner :)`;
        }
        gameData.changePlayer();
    }
    return { name, marker, move }
}

const displayContainer = (() => {
    const gridBox = document.querySelector("#grid-container");
    for (let i = 0; i < 9; i++) {
        const gridCell = document.createElement("div");
        gridCell.classList.add("grid-cell");
        gridCell.classList.add("grid-hover");
        const gridOver = document.createElement("div");
        gridOver.classList.add("grid-over");
        gridOver.textContent = "×";
        gridCell.appendChild(gridOver)
        gridCell.id = `cell-${i}`;
        gridCell.addEventListener("mousedown", (event) => {
            event.preventDefault();
            if (gameData.winner) { return };
            if (gameBoard.getMarkerAt(i)[0]) { return };
            gameData.currentPlayer.move(i, event.target);
        })
        gridBox.appendChild(gridCell);
    };
    const outputBox = document.querySelector("#output-container");
    const hoverBoxes = document.querySelectorAll(".grid-over")
    return { gridBox, outputBox, hoverBoxes }
})();

let playerOne = Player("Kindon", "×");
let playerTwo = Player("Carl", "⚬");
gameData.currentPlayer = playerOne;
