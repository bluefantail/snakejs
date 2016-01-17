var currentGame;
var gameSpeed = 60; // Set the game movement speed in milliseconds
var direction = "right"; // Set the default direction
var startLength = 5; // Starting snake length
var snakeTile = '<div class="snake-bit"></div>'; // Define a Snake Tile
var	foodTile = '<div class="food"></div>'; // Define a Food Tile

var game = document.querySelector('#game'); // Set the game object
var tile = document.querySelector('.snake-sample'); // Set a sample tile
var messages = document.querySelector('#messages');
var scoreBoard = document.querySelector('#score-board');

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
// Generate a random number
function random_number(max) {
	// Returns a random position rounded to the nearest tile size
	return Math.round(((Math.random() * (max - 0) + 0) / tileSize)) * tileSize;
}
// Generate a random position on the grid
function random_xy() {
	return [random_number(gameSize_X), random_number(gameSize_Y)]
}

function new_game() {
	currentGame = true; // Game in progress
	var score = 0;
	
	var snake; // Define a snake
	var	shouldGrow = false;
	var	startXY = random_xy(); // Set Snake start position
	
	game.innerHTML = ""; // Clear game object of all elements
	scoreBoard.innerHTML = ""; // Clear score and set placeholder
	messages.innerHTML = "Snake so hungry."; // Clear messages and set placeholder

	var food;
	var	foodXY;
					
	// FUNCTIONS
	// Return all the Snake pieces as an object
	function get_snake() {
		snake = document.querySelectorAll('.snake-bit'); // Get all the snake bits
		snakeHead = snake[0] // Get just the snakes head
		headXY = [parseInt(snakeHead.style.left, 10), parseInt(snakeHead.style.top, 10)]; // Current head position
	}
	function unpack_snake_bits() {
		snakeBits = [];
		Array.prototype.forEach.call(snake, function(snakeBit) {
			snakeBits.push([parseInt(snakeBit.style.left, 10), parseInt(snakeBit.style.top, 10)]);		
		});
	}
	// Updates the xy of a snake bit
	function update_xy(item, newXY){
		item.style.left = newXY[0] + "px"; // Update x
		item.style.top = newXY[1] + "px"; // Update y
	}
	function update_snake_position() {
		bit = 0;
		Array.prototype.forEach.call(snake, function(snakeBit) {
			bitXY = snakeBits[bit]; // Get the bit XY for the particular index
			update_xy(snakeBit, bitXY); // Update snake bit position
			bit++; // Increment the bit number
		})
	}
	function spawn_food() {
		if (!food) {
			game.insertAdjacentHTML('afterbegin', foodTile);
			food = document.querySelector('.food');
			foodXY = random_xy();
			update_xy(food, foodXY);
		}

	}
	function update_score() {
		score++; // Increment the score
		scoreBoard.innerHTML = "" + score; // Update the score
	}
	function move(snake){
		get_snake(); // Get the new snake
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

		//Build the new snake
		unpack_snake_bits(); // Get all the snake pieces
		// Cut the tail off if the snake didn't grow	
		if (shouldGrow) {
			game.insertAdjacentHTML('beforeend', snakeTile); //
			snakeBits.unshift(headXY); // Add the head
			get_snake();
			update_snake_position();
			update_score();
			shouldGrow = false;
		}else{
			snakeBits.pop();
			snakeBits.unshift(headXY); // Add the head
			update_snake_position();
		}		

		// Check for Food collisions
		get_snake(); // Get new snake
		if (headXY[0] == foodXY[0] && headXY[1] == foodXY[1]) shouldGrow = true; // Grow if snake ate food


		console.log("Snake length: " + snake.length);

	}
	// END FUNCTIONS

	// Build the initial Snake
	var length = startLength; // Set length of the snake to building
	var bit = 0; // Set starting bit to 0
	do{
		game.insertAdjacentHTML('afterbegin', snakeTile); // Place a Snake bit in the window
		length--; // Move to the next bit
	}while(length > 0);
	// Set starting position of the initial snake
	get_snake(); // Get the snake
	Array.prototype.forEach.call(snake, function(snakeBit){
		bitXY = [startXY[0] - (tileSize * bit), startXY[1]] // Calc each bit position
		update_xy(snakeBit, bitXY); // Update the snake position
		bit++; // Increment the bit calculation
	});
	
	// Main Game Loop
	var timer = window.setInterval(function(){
		spawn_food();
		move(snake);
	}, gameSpeed);

	console.log("---- New Game ----");
	console.log("Game Width: " + gameSize_X + "px");
	console.log("Game Height: " + gameSize_Y + "px");
	console.log("Tile Size: " + tileSize + "x" + tileSize + "px");
	console.log("Starting Position: " + startXY[0] + "x " + startXY[1] + "y");
	console.log("---- End New Game ----");

}