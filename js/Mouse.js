function initMouseEvents() {
	gameCanvas.addEventListener("mousemove", move);
	gameCanvas.addEventListener("mousedown", down);
	gameCanvas.addEventListener("mouseup", up);
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