// controls the model and view
var controller = {
	guesses: 0,		// original guess count

	// brings in guess
	processGuess: function(guess) {
		var location = parseGuess(guess);		// calls and validates the guess
		if (location) {
			this.guesses++;					// adds to the guess count
			var hit = model.fire(location);
			if ( hit && model.shipsSunk === model.numShips) {	// numShips and shipsSunk are properties of model
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
};

// object model of the game board
var model = {
	boardSize: 	7,
	numShips: 	3,
	shipsSunk: 	0,
	shipLength:  3,
	ships:   [{ locations: 	[0, 0, 0], 	hits: 	["", "", ""]	},
			 { locations: 	[0, 0, 0], 	hits: 	["", "", ""]	},
			 { locations: 	[0, 0, 0], 	hits: 	["", "", ""]	} ],

	// returns true if hit and false if missed
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {			// all Ships
			var ship = this.ships[i];						// each ship
			var index = ship.locations.indexOf(guess);	// returns index of hit location

			if (index >= 0) {							// otherwise -1
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;					// add one o the total number of ships sunk
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	// overall function to create new ships
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {		// for the total amount of ships
			do {
				locations = this.generateShip();		// set new locations
			} while (this.collision(locations));		// if there is a collision, generate a new ship
			this.ships[i].locations = locations;		// assign to the object's ships array
		}
	},

	// creates each ship
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) {		// horizontal ship
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));	// otherwise could go off the side of the board
		} else {						// vertical ship
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));	// otherwise could go off the bottom of the board
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {		// loop through the length of the ship
			if (direction === 1) {	// horizontal ship
				newShipLocations.push(row + "" + (col +i));	// adds one to the column after the first time through
			} else {					// vertical ship
				newShipLocations.push((row + i) + "" + col);	// adds one to the row after the first time through
			}
		}
		return newShipLocations;
	},

	// checks for collisions
	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {						// for each ship already on the board
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {				// check each location of the current ship
				if (ship.locations.indexOf(locations[j]) >= 0) {		// if any of the locations match
					return true;										// report a collision
				}
			}
		}
		return false;
	},

	// returns true when all locations of a ship show "hit"
	isSunk: 	function(ship) {
		for 	(var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	}
};

// the display aspect of the game
var view = {
	// getting and displaying the HTML for the message area
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	// getting and displaying hits
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	// getting and displaying misses
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

// breaks down and validates the players guess
// there is a bug. it only accepts capital letters.
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {		// validating length
		alert("Oops, please enter a letter and a number on the board.:");
	} else {
		firstChar = guess.charAt(0);					// first character
		var row = alphabet.indexOf(firstChar);		// using the alphabet array to convert the first character in to a number
		var column = guess.charAt(1);				// second character

		if (isNaN(row) || isNaN(column)) {			// if either one is not a number
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {	// checking to see if the numbers are less than 0 or greater than the board size
			alert("Oops, that's off the board!");
		} else {
			return row +column;
		}
	}
	return null;
}

// gets button from the HTML and adds handlers
function init() {
	var fireButton = document.getElementById("fireButton");		// mouse click handler
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");		// keyboard enter handler
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();		// generates the random ship locations
}

// function for mouse click handler
function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);	// passes the guess to the controller
	guessInput.value = "";				// resets the form
}

// fuunction for keyboard event handler
function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode ===13) {	// the return key's code is 13
		fireButton.click();		// act like the fireButton was clicked
		return false;			// do not try to submit the form
	}
}

window.onload = init;		// when windows is loaded, call init


