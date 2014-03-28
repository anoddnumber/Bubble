var gameCanvas, gameContext;
var statsPanel;

//properties
var lives = 0, score = 0;
var inGame = false;
var BDCVersion = false;
var difficulty = 1;
var multiplier = 1;

//mouse positions
var mouseX, mouseY;

//images, we don't put them in the draw function because will lag due to always loading a new image.
var scopeImage;
var backgroundImage;
var startButtonImage;
var poppedImage;
var bulletImage;

//different looking bubbles...
var bubbleImage, bubbleImage2;
var bubbleImage3;
var bubbleImage4;
var bubbleImage5;
var machineGunImage;
var shotGunImage;

//buttons
var startButton;

//list of bubbles on the screen
var bubbles = [];

//list of non-bubble images on the screen
var tempImages = [];

//list of texts that will be displayed on the game canvas
var tempTexts = [];

//Ids of setIntervals, used to clear them to prevent "memory leaks"
var bubbleMakerIds = [];
var enter_frameId;
var mouseDown = false;

//all ids in "idsToClear" will be used in clearInterval at the end of the game.
var idsToClear = [];

//useful containers
var inventory;
var stats;

/*
 * Contains Game Logic
 */
function newGame() {
	score = 0;
	lives = 10;
	inGame = true;
	gameCanvas.style.cursor = "none";

	createBubbles(BasicBubble(), 4);
	
	startBubbleMaker(BasicBubble(), 1.5);
	startBubbleMaker(BasicBubble(), 2);
	
	startBubbleMaker(MachineGunBubble(), 2);
	startBubbleMaker(ShotGunBubble(), 2);
	
//	startDifficultyIncreaser();
	
}

//end the game, show statistics and button to play again.
function endGame() {
	inGame = false;
	stopBubbleMakers();
	stopIntervals();
	inventory.reset();
	bubbles = [];
	tempImages = [];
	tempTexts = [];
	multiplier = 1;
}

/*
* When the browser is resized, the game is resized as well.
*/
function resizeGame() {
    var gameArea = document.getElementById('gameArea');
    var widthToHeight = 4 / 3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }
    
    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
    initButtons();
}

function clearGameCanvas() {
	gameCanvas.width = gameCanvas.width;
}

function enter_frame() {
	update();
	draw();
}

//updates the logic/positions of objects
function update() {
	updateBubbles();
	updateTempImages();
	updateTempTexts();
	updateInventory();
}

//draws the objects onto the canvas
function draw() {
	if ( ! inGame) {
    	showMenu();
    } else {
    	clearGameCanvas();
    	gameContext.drawImage(backgroundImage, 0, 0);
    	drawObjects(tempTexts);
    	drawObjects(bubbles);
    	attackWithMachineGun();
    }
	drawObjects(tempImages);
	drawImageInCenter(scopeImage, mouseX, mouseY);
	document.getElementById("scoreBox").innerHTML = "Score: " + score;
	document.getElementById("livesBox").innerHTML = "Lives: " + lives;
}