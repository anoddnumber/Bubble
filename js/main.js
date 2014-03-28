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




