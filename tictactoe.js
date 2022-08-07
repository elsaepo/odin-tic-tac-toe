const gameBoard = (() => {
    const gameSize = 3;
    const gameArray = [
        [""],[""],[""],
        [""],[""],[""],
        [""],[""],[""]
    ];
    const indexToCoord = (index) => {
        return {
            x: Number(index)%3,
            y: Math.floor(Number(index)/3)
        }
    };
    const coordToIndex = (x, y) => x + y*3;
    const getMarkerAt = (id) => gameArray[id];
    const setMarkerAt = (id, marker) => {
        gameArray[id] = marker;
        return marker;
    }
    const checkWin = (cell, marker) => {
        let coord = indexToCoord(cell);
        let baseX = coordToIndex(0, coord.y);
        let baseY = coordToIndex(coord.x, 0);
        const checkHorizontal = (y) => (gameArray[y] === gameArray[y + 1] &&
                gameArray[y + 1] === gameArray[y + 2]);
        const checkVertical = (x) => (gameArray[x] === gameArray[x + 3] &&
            gameArray[x + 3] === gameArray[x + 6]);
        const checkDiagonal = (mark) => {
            return (gameArray[0] === mark && gameArray[4] === mark && gameArray[8] === mark ||
                gameArray[2] === mark && gameArray[4] === mark && gameArray[6] === mark)
        }
        if (checkHorizontal(baseX) || checkVertical(baseY) || checkDiagonal(marker)){
            alert("you win");
        }
    }
    return { gameArray, getMarkerAt, setMarkerAt, checkWin };
})();

const gameData = (() => {
    let currentPlayer;
    const changePlayer = function(){
        this.currentPlayer = (this.currentPlayer === playerOne) ? playerTwo : playerOne;
        return this.currentPlayer;
    };
    return { currentPlayer, changePlayer };
})();

const Player = (name, marker) => {
    const move = function(cellID, node){
        node.textContent = gameBoard.setMarkerAt(cellID, this.marker);
        gameBoard.checkWin(cellID, marker)
        gameData.changePlayer();
    }
    return { name, marker, move }
}

const displayContainer = (() => {
    const gridBox = document.querySelector("#grid-container");
    for (let i = 0; i < 9; i++){
        const gridCell = document.createElement("div");
        gridCell.classList.add("grid-cell");
        gridCell.id = `cell-${i}`;
        gridCell.addEventListener("mousedown", (event) => {
            if (gameBoard.getMarkerAt(i)[0]){ return };
            gameData.currentPlayer.move(i, event.target);
        })
        gridBox.appendChild(gridCell);
    };
    return { gridBox }
})();

let playerOne = Player("Carl", "x");
let playerTwo = Player("Kindon", "o");
gameData.changePlayer();