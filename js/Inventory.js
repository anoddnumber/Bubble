/*
 * Represents an inventory...it holds weapons and items
 * Need to specify
 */
function Inventory() {
	var I = {};
	
	I.weapons = [Pistol()];
	I.weaponIndex = 0;
	
	I.reset = function() {
		I.weapons = [Pistol()];
		I.weaponIndex = 0;
	};
	
	I.addWeapon = function(weapon) {
		if (weapon == null) {
			return;
		}
		//if the user already has the weapon in his inventory,
		//add that uses to that weapon rather than give him a new weapon.
		for (var i = 0; i < I.weapons.length; i++) {
			if (isSameWeapon(weapon, I.weapons[i])) {
				I.weapons[i].addUses(weapon.getNumUses());
				return;
			}
		}
		
		I.weapons.push(weapon);
		
	};
	
	I.changeWeapon = function() {
		I.weaponIndex++;
		
		if (I.weaponIndex >= I.weapons.length) {
			I.weaponIndex = 0;
		}
		var newWeapon = I.weapons[I.weaponIndex];
		newWeapon.initWeaponCursor();
		return newWeapon;
	};
	
	
	I.getCurrentWeapon = function() {
		return I.weapons[I.weaponIndex];
	};
	
	I.removeCurrentWeapon = function() {
		return I.removeWeapon(I.weaponIndex);
	};
	
	I.removeWeapon = function(index) {
		if (index >= I.weapons.length) {
			return null;
		}
		
		var weaponRemoved = I.weapons[index];
		this.weapons.splice(index, 1);
		
		//no need to increment the weaponIndex because
		//of removing a weapon from this.weapons will 
		//move everything down 1
		if (I.weaponIndex >= I.weapons.length) {
			I.weaponIndex = 0;
		}
		
		if (I.weapons.length == 0) {
			return weaponRemoved;
		}

		var newWeapon = I.weapons[I.weaponIndex];
		newWeapon.initWeaponCursor();
		
		return weaponRemoved;
	};
	return I;
}

function updateInventory() {
	if ( ! inventory.getCurrentWeapon().isStillUsable()) {
		inventory.removeCurrentWeapon();
	}
}

function initInventory() {
	inventory = Inventory();
}