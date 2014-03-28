//need to pass in x, y, image
function Button(x, y, image) {
	var I = {};
	
	//properties based on arguments
	I.x = x;
	I.y = y;
	I.image = image;
	
	I.isInsideButton = function(pointX, pointY) {
		return  this.isActive()						&&
				isInRectangle(I.x, I.y, I.image.width, I.image.height, pointX, pointY);
	};
	
	I.isActive = function() {
		return ! inGame;
	};
	return I;
}


function initButtons() {
	startButton = Button(gameCanvas.width/2, gameCanvas.height/2, startButtonImage);
}