function initKeyboardEvents() {
	$(document).bind("keydown", "space", function() {
		inventory.changeWeapon();
	});
}