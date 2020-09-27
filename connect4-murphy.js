/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
	constructor(p1, p2, height = 6, width = 7) {
		this.players = [ p1, p2 ];
		this.height = height;
		this.width = width;
		this.currPlayer = p1;
		this.makeBoard();
		this.makeHtmlBoard();
		this.gameOver = false;
	}

	/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

	makeBoard() {
		this.board = [];
		let cssAnimation = document.createElement('style');
		for (let i = 0; i < this.height; i++) {
			this.board.push(Array.from({ length: this.width }));
			cssAnimation.setAttribute('type', 'text/css');
			let rules = document.createTextNode(
				`@keyframes piece-fallS${i} {from {top:${-300 + i * 50}px;}to {top: 0;}}`
			);
			cssAnimation.appendChild(rules);
		}

		document.getElementsByTagName('head')[0].appendChild(cssAnimation);
	}

	/** makeHtmlBoard: make HTML table and row of column tops. */

	makeHtmlBoard() {
		const board = document.getElementById('board');
		// This following section of code adds the clickable area of the game board that adds a piece to the game table
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');
		top.addEventListener('click', this.handleClick.bind(this));

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}
		board.append(top);

		// This following section of code makes the rows and columns of the game board
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr');
			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}
			board.append(row);
		}
	}

	/** findSpotForCol: given column x, return top empty y (null if filled) */

	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** placeInTable: update DOM to place piece into HTML table of board */

	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.style.backgroundColor = this.currPlayer.color;
		piece.style.top = -50 * (y + 2);
		const spot = document.getElementById(`${y}-${x}`);
		piece.style.animationName = `piece-fallS${5 - y}`;

		spot.appendChild(piece);
	}

	/** endGame: announce game end */

	endGame(msg) {
		alert(msg);
	}

	/** handleClick: handle click of column top to play piece */

	handleClick(evt) {
		// get x from ID of clicked cell
		let x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		console.log(this.checkForWin);
		// check for win
		if (this.checkForWin()) {
			this.gameOver = true;
			return this.endGame(`Player ${this.currPlayer.color} won!`);
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) this.endGame('Tie!');

		// switch players
		this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
	}

	/** checkForWin: check board cell-by-cell for "does a win start here?" */

	checkForWin() {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		const _win = (cells) =>
			cells.every(
				([ y, x ]) =>
					y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayer
			);

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// this nested loop genereates all possible winning conditions
				let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
				let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

				// this compares the current board condition to any of the previous generated winning conditions
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}
}

class Player {
	constructor(color) {
		this.color = color;
	}
}

document.getElementById('start').addEventListener('click', () => {
	let p1 = new Player(document.getElementById('p1-color').value);
	let p2 = new Player(document.getElementById('p2-color').value);
	new Game(p1, p2);
});
