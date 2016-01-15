var game = document.querySelector('#game'); // Set the game object
var tile = document.querySelector('.snake'); // Set a sample tile


// Set the size of a tile
var tileSize = parseInt(getComputedStyle(tile).height, 10);
// Set the boundaries of the game window
var gameSize_X = parseInt(getComputedStyle(game).width, 10) - tileSize;
var gameSize_Y = parseInt(getComputedStyle(game).height, 10) - tileSize;

// Place items randomly in the game window
function random_position(max) {
	return Math.round((Math.random() * (max - 0) + 0));
}

// Set Snake start position
var	startXY = [random_position(gameSize_X), random_position(gameSize_Y)];

// Place Snake in the window
var snakeTile = '<div class="snake" style="left: ' + startXY[0] + 'px; top: ' + startXY[1] + 'px;"></div>'; // A snake tile
game.insertAdjacentHTML('afterbegin', snakeTile);




console.log("---- Debug Messages ----");
console.log("Game Width: " + gameSize_X + "px");
console.log("Game Height: " + gameSize_Y + "px");
console.log("Tile Size: " + tileSize + "x" + tileSize + "px");
console.log("Starting Position: " + startXY[0] + "x " + startXY[1] + "y");
console.log("Snake Object: " + snakeTile);