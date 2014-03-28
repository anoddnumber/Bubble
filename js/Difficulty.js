function increaseDifficulty() {
	difficulty += 0.15;
	lives++;
	increaseMultiplier();
	
	var gradient = gameContext.createLinearGradient(0, 0, gameCanvas.width, 0);
	gradient.addColorStop("0","magenta");
	gradient.addColorStop("0.5","blue");
	gradient.addColorStop("1.0","red");
	
	var text = TempText("50px Georgia", gradient, "Increasing Difficulty! +1 Life", gameCanvas.width/3, gameCanvas.height/5, 20);
	tempTexts.push(text);
}

function startDifficultyIncreaser() {
	var numSec = 8;
	var id = setInterval(function() {
		increaseDifficulty();
	}, numSec * 1000);
	
	idsToClear.push(id);
}