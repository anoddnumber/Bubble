/*
 * Represents an image.
 * Need to specify x, y, image, numFramesToDisplay
 */
function TempImage(x, y, poppedImage, numFramesToDisplay) {
	var I = {};
	
	//properties based on arguments
	I.x = x;
	I.y = y;
	I.image = poppedImage;
	I.numFramesToDisplay = numFramesToDisplay;
	
	I.draw = function() {
		drawImageInCenter(I.image, this.x, this.y);
		I.numFramesToDisplay--;
	};
	
	I.isActive = function() {
		return I.numFramesToDisplay > 0;
	};
	
	return I;
}

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

function getImageShape() {
	if (BDCVersion) {
		return "rectangle";
	} else {
		return "circle";
	}
}

function updateTempImages() {
	//get rid of non active temporary images
	tempImages = filter(tempImages);
}

function drawImageInCenter(img, x, y) {
	gameContext.drawImage(img, x - img.width/2, y - img.height/2);
}

