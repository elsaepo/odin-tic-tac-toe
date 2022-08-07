// main goal with the setup is to have as little global code as possible
// so tuck everything inside a module or a factory
// rule of thumb - if you only ever need ONE of something (gameBoard, displayController), use a module. if you need multiple (players), create using a factory



// player factory function
    // attributes - name, marker, maybe shared function to determine whose turn it is
    //player 1 object
    //layer 2 object

//displayContainer object (module?)
    // methods and info of the game on screen
    // essentially translating gameBoard to the screen
    // should this be a child of gameBoard? to use all of gameboard's data immediately?
    // or the other way around? so the action on screen is controlled by gameboard? 
            // eg: gameboard(set container = get array)


const gameBoard = (() => {
    const gameSize = 3;
    const gameArray = [
        [""],[""],[""],
        [""],[""],[""],
        [""],[""],[""]
    ];
    const coordToIndex = (x, y) => {
        return (x - 1) + (y * 3);
    }
    const getMarkerAt = (id) => {
        return gameArray[id];
    }
    const setMarkerAt = (id, marker) => {
        gameArray[id] = marker;
        return marker;
    }
    return { gameArray, getMarkerAt, setMarkerAt };
})();

const gameData = (() => {
    let currentPlayer;
    const changePlayer = () => {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
        return currentPlayer;
    };
    const getCurrentPlayer = () => {
        return currentPlayer;
    }
    return { getCurrentPlayer, changePlayer };
})();

const Player = (name, marker) => {
    const move = (marker) => {

    }
    return { name, marker }
}

const displayContainer = (() => {
    const gridBox = document.querySelector("#grid-container");
    for (let i = 0; i < 9; i++){
        const gridCell = document.createElement("div");
        gridCell.classList.add("grid-cell");
        gridCell.id = `cell-${i}`;
        gridCell.addEventListener("mousedown", function(event){
            if (gameBoard.getMarkerAt(i)[0]){ return };
            event.target.textContent = gameBoard.setMarkerAt(i, gameData.getCurrentPlayer().marker);
            gameData.changePlayer();
        })
        gridBox.appendChild(gridCell);
    };
    return { gridBox }
})();

let playerOne = Player("Carl", "x");
let playerTwo = Player("Kindon", "o");
gameData.changePlayer();