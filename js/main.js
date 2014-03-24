var gameCanvas, gameContext;
var statsPanel;

//properties
var lives = 0;
var score = 0;
var inGame = false;
var BDCVersion = true;
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
var bubbleImage1;
var bubbleImage2;
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
 * Statistics that keep track of stuff like hit percentages
 */
function Statistics(I) {
	I.hit = function() {
		I.hits++;
	};
	
	I.miss = function() {
		I.misses++;
	};
	
	I.getHitPercentage = function() {
		if (I.hits + I.misses == 0) {
			return 0;
		}
		
		return I.hits/(I.hits + I.misses);
	};
	
	I.reset = function() {
		I.hits = 0;
		I.misses = 0;
	};
	
	return I;
}

function isSameWeapon(weapon1, weapon2) {
	return weapon1.getName() == weapon2.getName();
}

///*
// * Represents any weapon.
// * Need to specify name, infiniteUses, numUses, weaponDelay, weaponSound, cursorSource, attackImage, attackTime
// * popBubbles();
// */
//function Weapon(I) {
//	I.weaponDelayed = false;
//	
//	I.getName = function() {
//		return I.name;
//	};
//	
//	I.initWeaponCursor = function() {
//		scopeImage.src = I.cursorSource;
//	};
//	
//	I.getWeaponSound = function() {
//		return I.weaponSound;
//	};
//	
//	I.getNumUses = function() {
//		return I.numUses;
//	};
//	
//	I.addUses = function(additionalUses) {
//		I.numUses += additionalUses;
//	};
//	
//	I.hasInfiniteUses = function() {
//		return I.infiniteUses;
//	};
//	
//	I.isStillUsable = function() {
//		return I.hasInfiniteUses() || I.getNumUses() > 0;
//	};
//	
//	I.attack = function() {
//		if (I.weaponDelayed || ! I.isStillUsable()) {
//			return;
//		}
//		
//		Sound.play(I.getWeaponSound());
//		I.delayWeapon(I.weaponDelay);
//		I.displayAttack();
//		
//		if ( ! I.infiniteUses) {
//			I.numUses--;
//		}
//		//do the actual attack and kill bubbles
//		//this needs to be specified in "subclasses"
//		I.popBubbles(); 
//		return true;
//	};
//	
//	I.displayAttack = function() {
//		var img = TempImage({
//			x : mouseX,
//			y : mouseY,
//			image : I.attackImage,
//			numFramesToDisplay: I.attackTime,
//		});
//		tempImages.push(img);
//	};
//	
//	I.delayWeapon = function(numMilliseconds) {
//		if (numMilliseconds <= 0) {
//			return;
//		}
//		I.weaponDelayed = true;
//		//TODO might need to put function separately?
//		var weaponDelayId = setTimeout(function() {
//			I.weaponDelayed = false;
//			clearTimeout(weaponDelayId);
//		}, numMilliseconds);
//	};
//	
//	//getting copies in js is really annoying so will have to do a ghetto way.
//	I.getCopy = function() {
//		if (isSameWeapon(I, Pistol())) {
//			return Pistol();
//		}
//		
//		if (isSameWeapon(I, MachineGun())) {
//			return MachineGun();
//		}
//		
//		if (isSameWeapon(I, ShotGun())) {
//			return ShotGun();
//		}
//	};
//	
//	return I;
//}

///*
// * Represents any type of gun, "extends" Weapon
// */
//function Gun(I) {
//	var gun = Weapon(I);
//	gun.weaponDelayed = false;
//	
//	gun.
//}



/*
 * Represents an inventory...it holds weapons and items
 * Need to specify
 */
function Inventory() {
	var I = {};
	
	I.weapons = [Pistol()];
	I.weaponIndex = 0;
	
	I.reset = function() {
		I.weapons = [Pistol()];
		I.weaponIndex = 0;
	};
	
	I.addWeapon = function(weapon) {
		if (weapon == null) {
			return;
		}
		//if the user already has the weapon in his inventory,
		//add that uses to that weapon rather than give him a new weapon.
		for (var i = 0; i < I.weapons.length; i++) {
			if (isSameWeapon(weapon, I.weapons[i])) {
				I.weapons[i].addUses(weapon.getNumUses());
				return;
			}
		}
		
		I.weapons.push(weapon);
		
	};
	
	I.changeWeapon = function() {
		I.weaponIndex++;
		
		if (I.weaponIndex >= I.weapons.length) {
			I.weaponIndex = 0;
		}
		var newWeapon = I.weapons[I.weaponIndex];
		newWeapon.initWeaponCursor();
		return newWeapon;
	};
	
	
	I.getCurrentWeapon = function() {
		return I.weapons[I.weaponIndex];
	};
	
	I.removeCurrentWeapon = function() {
		return I.removeWeapon(I.weaponIndex);
	};
	
	I.removeWeapon = function(index) {
		if (index >= I.weapons.length) {
			return null;
		}
		
		var weaponRemoved = I.weapons[index];
		this.weapons.splice(index, 1);
		
		//no need to increment the weaponIndex because
		//of removing a weapon from this.weapons will 
		//move everything down 1
		if (I.weaponIndex >= I.weapons.length) {
			I.weaponIndex = 0;
		}
		
		if (I.weapons.length == 0) {
			return weaponRemoved;
		}

		var newWeapon = I.weapons[I.weaponIndex];
		newWeapon.initWeaponCursor();
		
		return weaponRemoved;
	};
	return I;
}


/*
 * Represents text that will be on the gameCanvas for a (usually short) period of time
 * Need to specify font, style, text, x, y, numFramesToDisplay
 */
function TempText(I) {
	I.draw = function() {
		gameContext.font = I.font;
		gameContext.fillStyle = I.style;
		gameContext.fillText(I.text, I.x, I.y);
		I.numFramesToDisplay--;
	};
	
	I.isActive = function() {
		return I.numFramesToDisplay > 0;
	};
	return I;
}

/*
 * Represents an image.
 * Need to specify x, y, image, numFramesToDisplay
 */
function TempImage(I) {
	I.draw = function() {
		drawImageInCenter(I.image, this.x, this.y);
		I.numFramesToDisplay--;
	};
	
	I.isActive = function() {
		return I.numFramesToDisplay > 0;
	};
	
	return I;
}



function isInCircle(centerX, centerY, radius, pointX, pointY) {
	return Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2) <= Math.pow(radius, 2);
}

function isInRectangle(centerX, centerY, width, height, pointX, pointY) {
	return 	centerX - width/2 <= pointX 	&&
			centerX + width/2 >= pointX 	&&
			centerY - height/2 <= pointY 	&&
			centerY + height/2 >= pointY;
}

//need to pass in x, y, image
function Button(I) {
	I.isInsideButton = function(pointX, pointY) {
		return  this.isActive()						&&
				isInRectangle(I.x, I.y, I.image.width, I.image.height, pointX, pointY);
	};
	
	I.isActive = function() {
		return ! inGame;
	};
	return I;
}

function initOnPageLoad() {
	gameCanvas = $("#gameCanvas")[0];
	gameContext = gameCanvas.getContext('2d');
	statsPanel = $("#statsPanel")[0];
	
	window.addEventListener('resize', resizeGame, false);
	window.addEventListener('orientationchange', resizeGame, false);
	
	//get rid of the cursor when the mouse is dragged on the canvas
	$("#gameCanvas").mousedown(function(event){
	    event.preventDefault();
	});
	initImages();
	initButtons();
	initKeyboardEvents();
	initMouseEvents();
	initInventory();
	resizeGame();//need to resize at the beginning..
	
	var FPS = 30;//frames per second
	enterFrameId = setInterval(function() {
		enter_frame();
	}, 1000 / FPS);
}
/*
function stopFrames() {
	clearInterval(enterFrameId);
}*/

function initImages() {
	bubbleImage = new Image();
	bubbleImage2 = new Image();
	bubbleImage3 = new Image();
	bubbleImage4 = new Image();
	bubbleImage5 = new Image();
	
	poppedImage = new Image();
	
	if (BDCVersion) {
		poppedImage.src = "img/dead.jpg";
		
		bubbleImage.src = "img/ecstatic.jpg";
		bubbleImage2.src = "img/superHappy.png";
		bubbleImage3.src = "img/mad.png";
		bubbleImage4.src = "img/pissed.png";
		bubbleImage5.src = "img/eric.png";
	} else {
		poppedImage.src = "img/popped.png";
		
		bubbleImage.src = "img/blue_bubble2.gif";
		bubbleImage2.src = "img/blue_bubble2.gif";
		bubbleImage3.src = "img/blue_bubble2.gif";
		bubbleImage4.src = "img/blue_bubble2.gif";
		bubbleImage5.src = "img/blue_bubble2.gif";
	}
	
	scopeImage = new Image();
//	scopeImage.src = "img/chainsaw.gif";
//	scopeImage.src = "img/scope.gif";
	scopeImage.src = "img/circle.gif";
	
	backgroundImage = new Image();
	backgroundImage.src = "img/volcano.jpg";
	
	startButtonImage = new Image();
	startButtonImage.src = "img/start_button.png";
	
	bulletImage = new Image();
	bulletImage.src = "img/bullet.png";
	
	machineGunImage = new Image();
	machineGunImage.src = "img/machinegun.png";
	
	shotGunImage = new Image();
	shotGunImage.src = "img/shotgun.png";
}

function initButtons() {
	startButton = Button({
		x : gameCanvas.width/2,
		y : gameCanvas.height/2,
		image: startButtonImage
	});
	
}

function initKeyboardEvents() {
	$(document).bind("keydown", "space", function() {
		inventory.changeWeapon();
	});
}

function initMouseEvents() {
	gameCanvas.addEventListener("mousemove", move);
	gameCanvas.addEventListener("mousedown", down);
	gameCanvas.addEventListener("mouseup", up);
}

function initInventory() {
	inventory = Inventory();
}

function newGame() {
	score = 0;
	lives = 10;
	inGame = true;
	gameCanvas.style.cursor = "none";
	createBubbles(BasicBubble(), 4);
	
	startBubbleMaker(BasicBubble(), 1.5);

	startBubbleMaker(Bubble({
		speed : 5,
		hitsRequired : 1,
		y : gameCanvas.height * .92,
		image : bubbleImage2,
		imageShape : getImageShape(),
		points: 2
	}), 2);
	
	startBubbleMaker(Bubble({
		speed : 6,
		hitsRequired : 1,
		y : gameCanvas.height * .92,
		image : bubbleImage3,
		imageShape : getImageShape(),
		points: 3
	}), 3);
	
	startBubbleMaker(Bubble({
		speed : 7,
		hitsRequired : 1,
		y : gameCanvas.height * .92,
		image : bubbleImage4,
		imageShape : getImageShape(),
		points: 5
	}), 4);
	
	startBubbleMaker(Bubble({
		speed : 10,
		hitsRequired : 1,
		y : gameCanvas.height * .92,
		image : bubbleImage5,
		imageShape : getImageShape(),
		points: 10
	}), 5);
	
	startBubbleMaker(MachineGunBubble(), 2);
	startBubbleMaker(ShotGunBubble(), 2);
	
	startDifficultyIncreaser();
}

function increaseMultiplier() {
	multiplier += 1;
}

function increaseDifficulty() {
	difficulty += 0.15;
	lives++;
	increaseMultiplier();
	
	var gradient = gameContext.createLinearGradient(0, 0, gameCanvas.width, 0);
	gradient.addColorStop("0","magenta");
	gradient.addColorStop("0.5","blue");
	gradient.addColorStop("1.0","red");
	
	var text = TempText({
		font : "50px Georgia",
		style : gradient,
		text : "Increasing Difficulty! +1 Life",
		x : gameCanvas.width/3,
		y : gameCanvas.height/5,
		numFramesToDisplay: 20
	});
	tempTexts.push(text);
}

function startDifficultyIncreaser() {
	var numSec = 8;
	var id = setInterval(function() {
		increaseDifficulty();
	}, numSec * 1000);
	
	idsToClear.push(id);
}

function stopIntervals() {
	for (var i = 0; i < idsToClear.length; i++) {
		clearInterval(idsToClear[i]);
	}
	idsToClear = [];
}

/*
 * Make bubbles constantly
 */
function startBubbleMaker(bubble, numSec) {
	var bubbleMakerId = setInterval(function() {
		createBubble(bubble);
	}, numSec * 1000);
	
	bubbleMakerIds.push(bubbleMakerId);
}

function stopBubbleMakers() {
	for (var i = 0; i < bubbleMakerIds.length; i++) {
		clearInterval(bubbleMakerIds[i]);
	}
	bubbleMakerIds = [];
}

function getImageShape() {
	if (BDCVersion) {
		return "rectangle";
	} else {
		return "circle";
	}
}

function createBubble(bubble) {
	createBubbles(bubble, 1);
}

function createBubbles(bubble, num) {
	for (var i = 0; i < num; i++) {
		var weapon = bubble.weapon;
		var weaponCopy = null;
		if (weapon != null) {
			weaponCopy = weapon.getCopy();
		}
		
		var bubbleCopy = Bubble({
			speed : bubble.speed * difficulty,
			hitsRequired : bubble.hitsRequired,
			y : bubble.y,
			image : bubble.image,
			imageShape : bubble.imageShape,
			points : bubble.points,
			weapon : weaponCopy
		});
		var xStart = Math.random() * (gameCanvas.width - bubble.image.width) + bubble.image.width/2;
		
		// the image width may be 0 since it is not loaded yet,
		// so just put it somewhere in the middle for now
		if (bubbleCopy.image.width == 0) {
			xStart = Math.random() * gameCanvas.width/2 + gameCanvas.width/4;
		}
		bubbleCopy.x = xStart;
		bubbles.push(bubbleCopy);
	}
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

//mouse events
function move(mouseEvent) {
	var parentOffset = $(this).parent().offset();
	mouseX = mouseEvent.pageX - parentOffset.left;
	mouseY = mouseEvent.pageY - parentOffset.top;
}

function up(mouseEvent) {
	mouseDown = false;
}

function down(mouseEvent) {
	mouseDown = true;
	var weapon = inventory.getCurrentWeapon();
	if (isSameWeapon(weapon, Pistol()) || isSameWeapon(weapon, ShotGun() )){
		weapon.attack();
	}
	
	if (startButton.isInsideButton(mouseX, mouseY)) {
		newGame();
	}
}
//end mouse events

function loseLife() {
	lives++;//test purposes
	if (lives <= 0) {
		endGame();
	}
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

function showMenu() {
	clearGameCanvas();
	gameContext.drawImage(backgroundImage, 0, 0);
	drawImageInCenter(startButtonImage, gameCanvas.width/2, gameCanvas.height/2);
}

function drawImageInCenter(img, x, y) {
	gameContext.drawImage(img, x - img.width/2, y - img.height/2);
}

function clearGameCanvas() {
	gameCanvas.width = gameCanvas.width;
}

function enter_frame() {
	update();
	draw();
}

function filter(list) {
	list = list.filter(function(listObj) {
		return listObj.isActive();
	});
	return list;
}

function updateBubbles() {
	//update each bubble
	bubbles.forEach(function(bubble) {
		bubble.update();
		if (bubble.isAtTop()) {
			loseLife();
			bubble.pop();
		}
	});
	
	//get rid of non active bubbles
	bubbles = filter(bubbles);
}

function updateTempImages() {
	//get rid of non active temporary images
	tempImages = filter(tempImages);
}

function updateTempTexts() {
	//get rid of non active texts
	tempTexts = filter(tempTexts);
}

function updateInventory() {
	if ( ! inventory.getCurrentWeapon().isStillUsable()) {
		inventory.removeCurrentWeapon();
	}
}

function drawObjects(list) {
	list.forEach(function(listObj) {
		listObj.draw();
	});
}

function attackWithMachineGun() {
	var weapon = inventory.getCurrentWeapon();
	if (mouseDown && isSameWeapon(weapon, MachineGun())) {
		weapon.attack();
	}
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

