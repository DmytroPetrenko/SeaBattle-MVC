window.onload = init

function init() {
	let squeres = []
	squeres = getSqueres()
	for (let i = 0; i < squeres.length; i++) {
		const squere = squeres[i]
		squere.onclick = handleSquereClick
	}
	model.generateShipLocations()
}

function handleSquereClick() {
	controller.processGuess(this.id)
}
function getSqueres() {
	if (document.getElementsByClassName("squere")) {
		return document.getElementsByClassName("squere")
	}
	return new Error("No squeres on the board!!!")
}

let view = {
	displayHit: function (location) {
		document.getElementById(location).innerHTML = "Ship"
	},
	displayMiss: function (location) {
		document.getElementById(location).innerHTML = "Miss"
	},
	displayShipLives: function (shipLives) {
		document.getElementById("shipLives").innerText = shipLives
	},
	displayGuesses: function (guesses) {
		document.getElementById("guesses").innerText = guesses
	},
	displayResult: function (result) {
		document.getElementById("result").innerText = result
	},
}
let model = {
	boardSize: 7,
	ships: [
		{ locations: ["0", "0", "0"], hits: ["", "", ""] },
		{ locations: ["0", "0", "0"], hits: ["", "", ""] },
		{ locations: ["0", "0", "0"], hits: ["", "", ""] },
	],
	numShips: 3,
	shipsSunk: 0,
	shipLength: 3,
	fire: function (guess) {
		for (let i = 0; i < this.numShips; i++) {
			let index = this.ships[i].locations.indexOf(guess)
			if (index >= 0) {
				this.ships[i].hits[index] = "hit"
				view.displayHit(guess)
				if (this.isSunk(this.ships[i])) {
					this.shipsSunk++
					view.displayShipLives(this.numShips - this.shipsSunk)
				}
				return true
			}
		}
		view.displayMiss(guess)
		return false
	},
	isSunk: function (ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false
			}
		}
		return true
	},
	generateShipLocations: function () {
		let locations
		for (let i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip()
			} while (this.collision(locations))
			console.log(locations[0])
			this.ships[i].locations = locations
		}
	},
	generateShip: function () {
		let locationsGetter = {
			getRawStartLocation: function () {
				let arrSize = this.boardSize - (this.shipLength - 1)
				let rowArray = []

				for (let j = 0; j < this.boardSize * this.boardSize; j + this.boardSize) {
					for (let i = 0; i < arrSize; i++) {
						rowArray.push(i + j)
					}
				}

				return rowArray[Math.floor(Math.random() * rowArray.length)]
			},
			getColumnStartLocation: function () {
				let arrSize = this.boardSize * this.boardSize - this.boardSize * (this.shipLength - 1)
				let columnArray = []

				for (let i = 0; i < arrSize; i++) {
					columnArray[i] = i
				}

				return columnArray[Math.floor(Math.random() * columnArray.length)]
			},
		}
		let direction = Math.floor(Math.random() * 2)
		let startLocation

		if (direction === 1) {
			startLocation = locationsGetter.getRawStartLocation()
		} else {
			startLocation = locationsGetter.getColumnStartLocation()
		}

		let newShipLocations = []
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(startLocation + i)
			} else {
				newShipLocations.push(startLocation + this.boardSize * i)
			}
		}

		return newShipLocations
	},
	collision: function (locations) {
		for (let i = 0; i < this.numShips; i++) {
			for (let j = 0; j < locations.length; j++) {
				if (model.ships[i].locations.indexOf(locations[j]) >= 0) {
					return true
				}
			}
		}
		return false
	},
}
let controller = {
	guesses: 0,

	processGuess: function (guess) {
		this.guesses++
		view.displayGuesses(this.guesses)
		var hit = model.fire(guess)
		if (hit && model.shipsSunk === model.numShips) {
			view.displayResult("U win in " + this.guesses + " guesses")
		}
	},
}
