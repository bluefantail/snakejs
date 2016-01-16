var currentGame;
var gameSpeed = 50; // Set the game movement speed in milliseconds
var direction = "right"; // Set the default direction
var startLength = 15; // Starting snake length

var game = document.querySelector('#game'); // Set the game object
var tile = document.querySelector('.snake-sample'); // Set a sample tile
var messages = document.querySelector('#messages');

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
				if (direction != "left") direction = "right";
				break;
			case 37:
				if(direction != "right") direction = "left";
				break;
			case 40:
				if(direction != "up") direction = "down";
				break;
			case 38:
				if(direction != "down") direction = "up";
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
	messages.innerHTML = "Snake so hungry."; // Clear messages and set placeholder
	score.innerHTML = "<b>Score </b>"; // Clear score and set placeholder
	var	startXY = [random_position(gameSize_X), random_position(gameSize_Y)]; // Set Snake start position
					
	// FUNCTIONS
	// Return all the Snake pieces as an object
	function get_snake() {
		var snakeObjects = document.querySelectorAll('.snake-bit');
		return snakeObjects;
	}
	// Updates the xy of a snake bit
	function update_xy(item, newXY){
		item.style.left = newXY[0] + "px"; // Update x
		item.style.top = newXY[1] + "px"; // Update y
	}
	// END FUNCTIONS

	// Build the Snake
	var snakeTile = '<div class="snake-bit"></div>'; // Create a Snake Tile
	var length = startLength; // Set length of the snake to building
	var bit = 0; // Set starting bit to 0
	do{
		game.insertAdjacentHTML('afterbegin', snakeTile); // Place a Snake bit in the window
		length--; // Move to the next bit
	}while(length > 0);

	snake = get_snake(); // Get the snake
	
	// Set starting position of the snake
	Array.prototype.forEach.call(snake, function(snakeBit){
		bitXY = [startXY[0] - (tileSize * bit), startXY[1]] // Calc each bit position
		update_xy(snakeBit, bitXY); // Update the snake position
		snakeBit.setAttribute("id", bit);
		bit++; // Increment the bit calculation
	});

	// Movement
	// Movement function calculates new positions
	function move(snake){
		snake = get_snake(); // Get the new snake
		snakeHead = snake[0]; // Get just the snakes head
		headXY = [parseInt(snakeHead.style.left, 10), parseInt(snakeHead.style.top, 10)]; // Current head position
		switch (direction){
			case "right":
				headXY[0] = headXY[0] + tileSize; // Calc new head position
				if ( headXY[0] > gameSize_X ) headXY[0] = 0; // snake head position reset check
				break;
			case "left":
				headXY[0] = headXY[0] - tileSize; // Calc new head position
				if ( headXY[0] < 0 ) headXY[0] = gameSize_X; // snake head position reset check
				break;
			case "down":
				headXY[1] = headXY[1] + tileSize; // Calc new head position
				if ( headXY[1] > gameSize_Y ) headXY[1] = 0; // snake head position reset check
				break;
			case "up":
				headXY[1] = headXY[1] - tileSize; // Calc new head position
				if( headXY[1] < 0 ) headXY[1] = gameSize_Y; // snake head position reset check
				break;
		}
		// update_xy(snakeHead, headXY); // Update snake head position

		snakeBits = [];
		Array.prototype.forEach.call(snake, function(snakeBit) {
			snakeBits.push([parseInt(snakeBit.style.left, 10), parseInt(snakeBit.style.top, 10)]);		
		});

		//Build the new snake
		snakeBits = snakeBits.slice(0, -1); // Cut the head and tail off		
		snakeBits.unshift(headXY); // Add the head

		bit = 0;
		Array.prototype.forEach.call(snake, function(snakeBit) {
			bitXY = snakeBits[bit]; // Get the bit XY for the particular index
			update_xy(snakeBit, bitXY); // Update snake bit position
			bit++; // Increment the bit number
		})

	}
	
	// Main Game Loop
	var timer = window.setInterval(function(){
		move(snake);
	}, gameSpeed);

	console.log("---- Debug Messages ----");
	console.log("Game Width: " + gameSize_X + "px");
	console.log("Game Height: " + gameSize_Y + "px");
	console.log("Tile Size: " + tileSize + "x" + tileSize + "px");
	console.log("Starting Position: " + startXY[0] + "x " + startXY[1] + "y");
}