/*
 * Represents text that will be on the gameCanvas for a (usually short) period of time
 * Need to specify font, style, text, x, y, numFramesToDisplay
 */
function TempText(font, style, text, x, y) {
	I.font = font;
	I.style = style;
	I.text = text;
	I.x = x;
	I.y = y;
	
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


function updateTempTexts() {
	//get rid of non active texts
	tempTexts = filter(tempTexts);
}