function showMenu() {
	clearGameCanvas();
	gameContext.drawImage(backgroundImage, 0, 0);
	drawImageInCenter(startButtonImage, gameCanvas.width/2, gameCanvas.height/2);
}