/*
 * Represents a bubble.
 * Need to specify x, y, hitsRequired, speed, image, points, weapon (optional)
 */
function Bubble(I) {
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
		var img = TempImage({
			x : I.x,
			y : I.y,
			image : poppedImage,
			numFramesToDisplay: 5
		});
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
	return Bubble({
		speed : 4,
		hitsRequired : 1,
		y : gameCanvas.height * .92,
		image : bubbleImage,
		imageShape : getImageShape(),
		points : 1
	});
}

function MachineGunBubble() {
	var b = Bubble({
		speed : 8,
		hitsRequired : 1,
		y : gameCanvas.height * .92,
		image : machineGunImage,
		imageShape : "rectangle", //TODO: might need to change later
		points : 1,
		weapon : MachineGun()
	});
	return b;
}

function ShotGunBubble() {
	return Bubble({
		speed : 9,
		hitsRequired : 1,
		y : gameCanvas.height * .92,
		image : shotGunImage,
		imageShape : "rectangle", //TODO: might need to change later
		points : 1,
		weapon : ShotGun()
	});
}