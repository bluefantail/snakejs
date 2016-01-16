var currentGame;
var gameSpeed = 80; // Set the game movement speed in milliseconds
var direction = "right"; // Set the default direction
var startLength = 8; // Starting snake length

var game = document.querySelector('#game'); // Set the game object
var tile = document.querySelector('.snake-sample'); // Set a sample tile

// Set the size of a tile
var tileSize = parseInt(getComputedStyle(tile).height, 10);
// Set the boundaries of the game window
var gameSize_X = parseInt(getComputedStyle(game).width, 10) - tileSize;
var gameSize_Y = parseInt(getComputedStyle(game).height, 10) - tileSize;

// Event Listeners
var newGameButton = document.querySelector('#new-game'); // Set the new game button
newGameButton.addEventListener('click', new_game);
window.addEventListener("keydown", handle_keys);

// keypress event handler
function handle_keys(event) {
	if (currentGame) {
		switch (event.keyCode){
			case 39:
				direction = "right";
				break;
			case 37:
				direction = "left";
				break;
			case 40:
				direction = "down";
				break;
			case 38:
				direction = "up";
				break;
			default:
				console.log("Key not recognised");
		}
	}else{
		new_game();
	}
}

// Place items randomly in the game window
function random_position(max) {
	return Math.round(((Math.random() * (max - 0) + 0) / 10)) * 10;
}

function new_game() {
	var snake; // Define a snake
	// var snakeObjects; // For the nodetree of elements that will be pased to snake later
	currentGame = true; // Game in progress
	game.innerHTML = ""; // Clear game object of all elements
	var	startXY = [random_position(gameSize_X), random_position(gameSize_Y)]; // Set Snake start position
					
	// FUNCTIONS
	// Return all the Snake pieces as an object
	function get_snake() {
		var snakeObjects = document.querySelectorAll('.snake');
		return snakeObjects;
	}
	// Updates the xy of a snake bit
	function update_xy(item, newXY){
		item.style.left = newXY[0] + "px"; // Update x
		item.style.top = newXY[1] + "px"; // Update y
	}
	// END FUNCTIONS

	// Build the Snake
	var snakeTile = '<div class="snake"></div>'; // Create a Snake Tile
	var length = startLength; // Set length of the snake to building
	var bit = 0; // Set starting bit to 0
	do{
		game.insertAdjacentHTML('afterbegin', snakeTile); // Place a Snake bit in the window
		length--; // Move to the next bit
	}while(length > 0);

	snake = get_snake(); // Get the snake
	
	// Set starting position of the snake
	Array.prototype.forEach.call(snake, function(snakeBit){
		console.log("Bit Number: " + bit);
		bitXY = [startXY[0] - (tileSize * bit), startXY[1]] // Calc each bit position
		console.log("BitX: " + bitXY[0] + ", BitY: " + bitXY[1]);
		update_xy(snakeBit, bitXY); // Update the snake position
		bit++; // Increment the bit calculation
	});

	// Movement
	// Movement function calculates new positions
	function move(snake){
		Array.prototype.forEach.call(snake, function(snakeBit){
			currentXY = [parseInt(snakeBit.style.left, 10), parseInt(snakeBit.style.top, 10)];
			switch (direction){
				case "right":
					bitXY[0] = currentXY[0] + tileSize;
					bitXY[0] = bitXY[0] > gameSize_X ? 0 : bitXY[0];
					break;
				case "left":
					bitXY = [currentXY[0] - tileSize, currentXY[1]];
					bitXY[0] = bitXY[0] < 0 ? gameSize_X : bitXY[0];
					break;
				case "down":
					bitXY = [currentXY[0], currentXY[1] + tileSize];
					bitXY[1] = bitXY[1] > gameSize_Y ? 0 : bitXY[1];
					break;
				case "up":
					bitXY = [currentXY[0], currentXY[1] - tileSize];
					bitXY[1] = bitXY[1] < 0 ? gameSize_Y : bitXY[1];
					break;
			}
			update_xy(snakeBit, bitXY); // Update the position of each bit
		});
	}	  
	
	// Game Loop
	var timer = window.setInterval(function(){
		snake = get_snake(); // Get the new snake
		move(snake);
	}, gameSpeed);

	console.log("---- Debug Messages ----");
	console.log("Game Width: " + gameSize_X + "px");
	console.log("Game Height: " + gameSize_Y + "px");
	console.log("Tile Size: " + tileSize + "x" + tileSize + "px");
	console.log("Starting Position: " + startXY[0] + "x " + startXY[1] + "y");
}