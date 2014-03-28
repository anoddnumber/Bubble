/*
 * Represents a bubble.
 * 
 * ARGS:
 * speed - number of pixels the bubble will move per frame
 * hitsReq - number of hits needed to pop the bubble
 * x - x position of the bubble
 * y - y position of the bubble
 * image - the image for the bubble
 * points - number of points you get for hitting (not popping) the bubble
 * weapon - the weapon you get for popping the bubble
 * 
 */
function Bubble(speed, hitsReq, x, y, image, points, weapon) {
	
	var I = {};
	//properties based on arguments
	I.speed = speed;
	I.hitsRequired = hitsReq;
	I.x = x;
	I.y = y;
	I.image = image;
	I.points = points;
	I.weapon = weapon;
	
	//other properties
	I.imageShape = getImageShape();	
	I.xVelocity = 0;
	I.yVelocity = -I.speed;

	I.isAtTop = function() {
		return I.y <= 0;
	};
	
	I.inBounds = function() {
		return I.x >= 0 				&& 
			   I.x <= gameCanvas.width 	&&
			   I.y >= 0 				&& 
			   I.y <= gameCanvas.height;
	};

	I.update = function() {
		I.x += I.xVelocity;
		I.y += I.yVelocity;
	};

	I.draw = function() {
		drawImageInCenter(I.image, this.x, this.y);
	};

	I.isActive = function() {
		return I.hitsRequired > 0 && I.inBounds();
	};
	
	I.hit = function(numTimesHit) {
		score += I.points * numTimesHit * multiplier;
		I.hitsRequired -= numTimesHit;
		if ( ! I.isActive()) {
			I.pop();
			inventory.addWeapon(I.getWeapon());
		}
	};
	
	//does not actually remove the bubble from the screen
	I.pop = function() {
		Sound.play("balloon_pop");
		var img = TempImage(I.x, I.y, poppedImage, 5);
		//add the image to the front of the list to display the dead image first before the bullet
		tempImages.unshift(img);
	};
	
	//determines if a point is inside the bubble
	I.isPointInsideBubble = function(pointX, pointY) {
		if (I.imageShape == "rectangle") {
			return isInRectangle(I.x, I.y, I.image.width, I.image.height, pointX, pointY);
		} else {
			return isInCircle(I.x, I.y, I.image.width/2, pointX, pointY);
		}
	};
	
	//returns true if the center of the bubble is in the circle, else false
	I.isBubbleInCircle = function(centerX, centerY, radius) {
		return isInCircle(centerX, centerY, radius, I.x, I.y);
	};
	
	I.getWeapon = function() {
		return I.weapon;
	};

	return I;
}

function BasicBubble() {
	return Bubble(4, 1, getRandomXPosition(bubbleImage), gameCanvas.height * .92, bubbleImage, 1, null);
}

function MachineGunBubble() {
	var I = Bubble(8, 1, getRandomXPosition(bubbleImage), gameCanvas.height * .92, machineGunImage, 1, MachineGun());
	I.imageShape = "rectangle";
	return I; //ignore this warning, may the plugin's bug
}

function ShotGunBubble() {
	var I = Bubble(9, 1, getRandomXPosition(bubbleImage), gameCanvas.height * .92, shotGunImage, 1, ShotGun());
	I.imageShape = "rectangle";
	return I; //ignore this warning, may the plugin's bug
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
		
		var bubbleCopy = Bubble(bubble.speed * difficulty, bubble.hitsRequired, null, bubble.y, bubble.image, bubble.points, weaponCopy);
		bubbleCopy.imageShape = bubble.imageShape;
		
		var xStart = gameCanvas.width/2;
		
		if (bubble.image != null) {
			xStart = Math.random() * (gameCanvas.width - bubble.image.width) + bubble.image.width/2;
			// the image width may be 0 since it is not loaded yet,
			// so just put it somewhere in the middle for now
			if (bubbleCopy.image.width == 0) {
				xStart = Math.random() * gameCanvas.width/2 + gameCanvas.width/4;
			}
			bubbleCopy.x = xStart;
		}

		bubbles.push(bubbleCopy);
	}
}

/*
 * ARGS:
 * image - the image of what will be displayed
 * 
 * returns a random X position such that the image can be fully displayed (not chopped off)
 */
function getRandomXPosition(image) {
	return Math.random() * (gameCanvas.width - image.width) + image.width/2;
}