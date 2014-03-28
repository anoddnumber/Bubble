/*
 * Represents any weapon.
 * Need to specify name, infiniteUses, numUses, weaponDelay, weaponSound, cursorSource, attackImage, attackTime
 * 
 * ARGS:
 * name - Name of the weapon
 * infiniteUses - true if infinite ammo
 * numUses - ammount of ammo, ignored if infiniteUses is true
 * delay - amount of delay the weapon has between uses
 * sound - the sound the weapon makes when used
 * cursorSource - the source of the cursor that will be displayed when the user is using this Weapon
 * atkImage - what is displayed when the weapon attacks
 * atkTime - how long the atkImage is displayed
 * 
 */
function Weapon(name, infiniteUses, numUses, delay, sound, cursorSource, atkImage, atkTime) {
	
	var I = {};
	
	//properties based on arguments
	I.name = name;
	I.infiniteUses = infiniteUses;
	I.numUses = numUses;
	I.weaponDelay = delay;
	I.weaponSound = sound;
	I.cursorSource = cursorSource;
	I.attackImage = atkImage;
	I.attackTime = atkTime;
	
	//additional properties
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
		var img = TempImage(mouseX, mouseY, I.attackImage, I.attackTime);
		tempImages.push(img);
	};
	
	I.delayWeapon = function(numMilliseconds) {
		if (numMilliseconds <= 0) {
			return;
		}
		I.weaponDelayed = true;
		//TODO might need to put function separately?
		var weaponDelayId = 0;
		weaponDelayId = setTimeout(function() {
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
	var I = Weapon("Pistol", true, -1, 100, "gunShot", "img/circle.gif", bulletImage, 3);
	
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
	var I = Weapon("Machine Gun", false, 30, 100, "gunShot", "img/scope.gif", bulletImage, 3);
	
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
	var I = Weapon("Shot Gun", false, 10, 500, "gunShot", "img/scope3.gif", bulletImage, 3);
	
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

function attackWithMachineGun() {
	var weapon = inventory.getCurrentWeapon();
	if (mouseDown && isSameWeapon(weapon, MachineGun())) {
		weapon.attack();
	}
}

function isSameWeapon(weapon1, weapon2) {
	if (weapon1 == null || weapon2 == null) {
		return false;
	}
	
	return weapon1.getName() == weapon2.getName();
}