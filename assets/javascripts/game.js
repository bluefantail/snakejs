var game = document.querySelector('#game'); // Set the game object
var tile = document.querySelector('.snake-sample'); // Set a sample tile
var gameSpeed = 50; // Set the game movement speed in milliseconds
var direction = "right"; // Set the default direction
var currentGame = false;

function handle_keys(event) {
	if (currentGame == false) {
		new_game();
	}else{
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
	};
}

// Event Listeners
var newGameButton = document.querySelector('#new-game'); // Set the new game button
newGameButton.addEventListener('click', new_game);
window.addEventListener("keydown", handle_keys);

// Set the size of a tile
var tileSize = parseInt(getComputedStyle(tile).height, 10);
// Set the boundaries of the game window
var gameSize_X = parseInt(getComputedStyle(game).width, 10) - tileSize;
var gameSize_Y = parseInt(getComputedStyle(game).height, 10) - tileSize;

// Place items randomly in the game window
function random_position(max) {
	return Math.round((Math.random() * (max - 0) + 0));
}

function new_game() {
	currentGame = true;
	window.clearInterval(timer);
	game.innerHTML = ""; // Clear game object of all elements

	// Set Snake start position
	var	startXY = [random_position(gameSize_X), random_position(gameSize_Y)];
	
	// Create a Snake Tile
	var snakeTile = '<div class="snake"></div>';
	// Place Snake in the window
	game.insertAdjacentHTML('afterbegin', snakeTile);
	// Set Position of Snake Tile
	var snake = document.getElementsByClassName('snake')[0];
	snake.style.left = startXY[0] + "px";
	snake.style.top = startXY[1] + "px";

	var snakeXY = startXY;
	
	// Update the xy of a snake bit
	function update_xy(){
		snake.style.left = snakeXY[0] + "px"; // Update x
		snake.style.top = snakeXY[1] + "px"; // Update y
	}

	// Directions
	function move(snakeBit){
		switch (direction){
			case "right":
				snakeXY = [snakeBit[0] + tileSize, snakeBit[1]];
				break;
			case "left":
				snakeXY = [snakeBit[0] - tileSize, snakeBit[1]];
				break;
			case "down":
				snakeXY = [snakeBit[0], snakeBit[1] + tileSize];
				break;
			case "up":
				snakeXY = [snakeBit[0], snakeBit[1] - tileSize];
				break;
			default:
				snakeXY = [snakeBit[0] + tileSize, snakeBit[1]];
		}

		update_xy();
		console.log("New Position: " + snakeXY[0] + "x " + snakeXY[1] + "y");
	}	  
	
	var timer = window.setInterval(function(){
		move(snakeXY);
	}, gameSpeed);

	console.log("---- Debug Messages ----");
	console.log("Game Width: " + gameSize_X + "px");
	console.log("Game Height: " + gameSize_Y + "px");
	console.log("Tile Size: " + tileSize + "x" + tileSize + "px");
	console.log("Starting Position: " + startXY[0] + "x " + startXY[1] + "y");
}