/*
 * Represents any weapon.
 * Need to specify name, infiniteUses, numUses, weaponDelay, weaponSound, cursorSource, attackImage, attackTime
 * popBubbles();
 */
function Weapon(I) {
	I.weaponDelayed = false;
	
	I.getName = function() {
		return I.name;
	};
	
	I.initWeaponCursor = function() {
		scopeImage.src = I.cursorSource;
	};
	
	I.getWeaponSound = function() {
		return I.weaponSound;
	};
	
	I.getNumUses = function() {
		return I.numUses;
	};
	
	I.addUses = function(additionalUses) {
		I.numUses += additionalUses;
	};
	
	I.hasInfiniteUses = function() {
		return I.infiniteUses;
	};
	
	I.isStillUsable = function() {
		return I.hasInfiniteUses() || I.getNumUses() > 0;
	};
	
	I.attack = function() {
		if (I.weaponDelayed || ! I.isStillUsable()) {
			return;
		}
		
		Sound.play(I.getWeaponSound());
		I.delayWeapon(I.weaponDelay);
		I.displayAttack();
		
		if ( ! I.infiniteUses) {
			I.numUses--;
		}
		//do the actual attack and kill bubbles
		//this needs to be specified in "subclasses"
		I.popBubbles(); 
		return true;
	};
	
	I.displayAttack = function() {
		var img = TempImage({
			x : mouseX,
			y : mouseY,
			image : I.attackImage,
			numFramesToDisplay: I.attackTime,
		});
		tempImages.push(img);
	};
	
	I.delayWeapon = function(numMilliseconds) {
		if (numMilliseconds <= 0) {
			return;
		}
		I.weaponDelayed = true;
		//TODO might need to put function separately?
		var weaponDelayId = setTimeout(function() {
			I.weaponDelayed = false;
			clearTimeout(weaponDelayId);
		}, numMilliseconds);
	};
	
	//getting copies in js is really annoying so will have to do a ghetto way.
	I.getCopy = function() {
		if (isSameWeapon(I, Pistol())) {
			return Pistol();
		}
		
		if (isSameWeapon(I, MachineGun())) {
			return MachineGun();
		}
		
		if (isSameWeapon(I, ShotGun())) {
			return ShotGun();
		}
	};
	
	return I;
}

function Pistol() {
	var I = Weapon({
		name :			"Pistol",
		infiniteUses :	true,
		numUses :		-1,
		weaponDelay :	100,
		weaponSound :	"gunShot",
		cursorSource :	"img/circle.gif",
		attackImage : 	bulletImage,
		attackTime : 	3
	});
	
	I.popBubbles = function() {
		bubbles.forEach(function(bubble) {
			if (bubble.isPointInsideBubble(mouseX, mouseY)) {
				bubble.hit(1);
			}
		});
	};
	
	return I;
}

function MachineGun() {
	var I = Weapon({
		name :			"Machine Gun",
		infiniteUses :	false,
		numUses :		30,
		weaponDelay :	100,
		weaponSound :	"gunShot",
		cursorSource :	"img/scope.gif",
		attackImage : 	bulletImage,
		attackTime : 	3
	});
	
	I.popBubbles = function() {
		bubbles.forEach(function(bubble) {
			if (bubble.isPointInsideBubble(mouseX, mouseY)) {
				bubble.hit(1);
			}
		});
	};
	return I;
}

function ShotGun() {
	var I = Weapon({
		name :			"Shot Gun",
		infiniteUses :	false,
		numUses :		10,
		weaponDelay :	500,
		weaponSound :	"gunShot",
		cursorSource :	"img/scope3.gif",
		attackImage : 	bulletImage,
		attackTime : 	3
	});
	
	I.shotGunRadius = 200;
	
	I.popBubbles = function() {
		bubbles.forEach(function(bubble) {
			if (bubble.isBubbleInCircle(mouseX, mouseY, I.shotGunRadius)) {
				bubble.hit(1);
			}
		});
	};
	return I;
}