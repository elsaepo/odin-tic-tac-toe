# Tic Tac Toe.

A Tic Tac Toe web game, created with HTML, CSS & vanilla JavaScript.

Part of The Odin Project's [curriculum](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe).

Created by Carl Madsen, 2022.

**[Live page!](https://elsaepo.github.io/odin-tic-tac-toe/)**

## Functionality

* **Gameplay** - Get 3 of your marker in a row to win the game!
* **AI** - Compete against another player locally, or challenge the computer on 3 difficulty levels:
* Easy - computer makes a random move each turn.
* Hard - computer will always make a winning move if possible, and always prevent the opponent from making a winning move if possible.
* TACBOT 3000 - computer uses a minimax algorithm to make the best possible move in every situation. It cannot lose.

## Contributions

* [Google Fonts](https://fonts.google.com/)
* These 3 posts from [GeeksforGeeks](https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-1-introduction/) were extremely helpful in introducing me to minimax theory and the process of applying it to a game such as Tic Tac Toe.

## Learning outcomes & challenges

* This project came after some fairly heavy learning on **Factory Functions and modules, Scope and Object Oriented Programming** - so I went into this project with those concepts in mind. I was definitely able to keep the code very clean and segregated at first, but I feel the cleanliness crept away from me as the code added more features and because more complex.
* Programming the Hard AI was my first introduction into creating **AI logic** that wasn't just random, and forced me to think conceptually about the process of how the computer would approach the problem step by step.
* Programming in the **minimax algorithm** was a huge task - and the first of its kind I'd generated. The above resource was a huge help, and broke down the psuedocode into easy to understand chunks. I attempted to code it myself using as little reference as possible (as a challenge to myself), which would work for some amount of the process, but I looked back on the articles a few times as I came across roadblocks I couldn't pass myself.
* **Debugging** became a huge part of this project, especially during the minimax programming. There were numerous times things wouldn't work, and after scanning through my code I noticed a value wasn't returning as I expected, causing a cascade of errors. This happened over and over, and CHrome Developer TOols wre instrumental in stepping through the functions and allowing me to pinpoint exactly where things were performing unexpectedly (unexpected to me, at least).

## Future Development

* Making the game mobile responsive - it wasn't a focus of the learning, but still important.
* Clean up the code a bit - I definitely notice places where there can be refactoring done, removing duplicates, and ordering the logic a bit cleaner.