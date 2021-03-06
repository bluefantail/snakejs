// Config //
var startLength = 6; // Starting snake length
var gameSpeed = 60; // Set the game movement speed in milliseconds
// END Config //

var currentGame;
var direction;
var tick;

var snakeTile = '<div class="snake-bit"></div>'; // Define a Snake Tile
var	foodTile = '<div class="food invisible"></div>'; // Define a Food Tile
var eyes = '<div><div></div><div></div></div>';

var gameGrid = document.querySelector('#game'); // Set the game object
var scoreBoard = document.querySelector('#score-board');
var messageBoard = document.querySelector('#message-board');
	messageBoard.innerHTML = "<i>Press any key to start.</i>"; // Set initial message
var tile = document.querySelector('.snake-sample'); // Set a sample tile

// Set the size of a tile
var tileSize = parseInt(getComputedStyle(tile).height, 10);
// Set the boundaries of the game window
var gameSize_X = parseInt(getComputedStyle(gameGrid).width, 10) - tileSize;
var gameSize_Y = parseInt(getComputedStyle(gameGrid).height, 10) - tileSize;

// Event Listeners
var newGameButton = document.querySelector('#new-game'); // Set the new game button
newGameButton.addEventListener('click', new_game);
window.addEventListener("keydown", handle_keys);

function new_game(){
	window.clearInterval(tick);
	game();
}

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
		game();
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

function game() {
	currentGame = true; // Game in progress
	var score = 0;
	var collision;

	var snake; // Define a snake
	var	shouldGrow = false;
	var	startXY = random_xy(); // Set Snake start position
	
	gameGrid.innerHTML = ""; // Clear game object of all elements
	scoreBoard.innerHTML = ""; // Clear score and set placeholder
	messageBoard.innerHTML = 'Snake so <b class="red">hungry<b>.'; // No score message 
	direction = "right"; // Set the initial direction

	var food;
	var	foodXY;
					
	// FUNCTIONS
	// Return all the Snake pieces as an object
	function get_snake() {
		snake = document.querySelectorAll('.snake-bit'); // Get all the snake bits
		snakeHead = snake[0]; // Get just the snakes head
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
		item.setAttribute('id', ''); // Reset each bit to an ordinary one
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
			gameGrid.insertAdjacentHTML('afterbegin', foodTile);
			food = document.querySelector('.food');
			foodXY = random_xy();
			update_xy(food, foodXY);
			food.setAttribute('class', 'food'); // For some reason this isn't animating the food properly
		}

	}
	function check_collision() {
		Array.prototype.forEach.call(snakeBits, function(snakeBit) {
			if (snakeBit[0] == headXY[0] && snakeBit[1] == headXY[1]) collision = true;
		});
	}
	function update_score() {
		score++; // Increment the score
		scoreBoard.innerHTML = "" + score; // Update the score
	}
	function update_messages() {
		// Use shouldGrow to determine if the score is changing
		if (shouldGrow == true) {
			// Display messages as score changes
			switch (score){
				case 0:
					break;
				case 1:
					messageBoard.innerHTML = "Yum";
					break;
				case 2:
					messageBoard.innerHTML = "Yum yum";
					break;	
				case 3:
					messageBoard.innerHTML = "Yum yum yum";
					break;	
				case 4:
					messageBoard.innerHTML = "<i> Greuohglebloughough ... </i> This just isn't doing it.";
					break;	
			}
		}
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

		unpack_snake_bits(); // Get all the snake pieces



		// Check for collisions
		// Food
		if (headXY[0] == foodXY[0] && headXY[1] == foodXY[1]) shouldGrow = true; // Grow if snake ate food
		// Snake
		check_collision();
		
		
		// If there was a food collision, do some stuff, otherwise just update the snake position
		if (shouldGrow) {
			food.remove(0); //remove the food
			food = false;

			//Build the new snake
			gameGrid.insertAdjacentHTML('beforeend', snakeTile);
			snakeBits.unshift(headXY); // Add the head
			get_snake();
			update_snake_position();
			
			// Update scores and messages
			update_score();
			update_messages(); // Will only fire message updates where shouldGrow is true
			
			shouldGrow = false; // Stop snake growing
		}else{
			snakeBits.pop(); // Remove Tail
			snakeBits.unshift(headXY); // Add the head
			update_snake_position(); // Update the snake position
		}

		// Add eyes to snake head
		get_snake();
		while (snake[0].firstChild) {
			snake[0].removeChild(snake[0].firstChild);
		}
		snake[0].setAttribute('id', 'head'); // Set snakes head tile
		snake[0].insertAdjacentHTML('afterbegin', '<div id="snake-head-' + direction + '">' + eyes + '</div>'); 	
	}
	// END FUNCTIONS

	// Build the initial Snake
	var length = startLength; // Set length of the snake to building
	var bit = 0; // Set starting bit to 0
	do{
		gameGrid.insertAdjacentHTML('afterbegin', snakeTile); // Place a Snake bit in the window
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
	tick = window.setInterval(function(){

		update_messages();
		spawn_food();
		move(snake);

		if (collision){
			messageBoard.innerHTML = "<b class='green'>You can't eat that!!!</b>";

			Array.prototype.forEach.call(snake, function(snakeBit) {
				snakeBit.style.opacity = "0";				
				snakeBit.setAttribute('class', 'snake-bit animate');		
			});

			window.clearInterval(tick);
		} 
	
	}, gameSpeed);

	console.log("---- New Game ----");
	console.log("Game Width: " + gameSize_X + "px");
	console.log("Game Height: " + gameSize_Y + "px");
	console.log("Tile Size: " + tileSize + "x" + tileSize + "px");
	console.log("Starting Position: " + startXY[0] + "x " + startXY[1] + "y");
	console.log("---- End New Game ----");
}