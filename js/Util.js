/*
 * Helper Functions
 */



function isInCircle(centerX, centerY, radius, pointX, pointY) {
	return Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2) <= Math.pow(radius, 2);
}

function isInRectangle(centerX, centerY, width, height, pointX, pointY) {
	return 	centerX - width/2 <= pointX 	&&
			centerX + width/2 >= pointX 	&&
			centerY - height/2 <= pointY 	&&
			centerY + height/2 >= pointY;
}

function stopIntervals() {
	for (var i = 0; i < idsToClear.length; i++) {
		clearInterval(idsToClear[i]);
	}
	idsToClear = [];
}

function filter(list) {
	list = list.filter(function(listObj) {
		return listObj.isActive();
	});
	return list;
}

function drawObjects(list) {
	list.forEach(function(listObj) {
		listObj.draw();
	});
}

/*
function stopFrames() {
	clearInterval(enterFrameId);
}*/