function loseLife() {
	lives++;//test purposes
	if (lives <= 0) {
		endGame();
	}
}