/*
 * Statistics that keep track of stuff like hit percentages
 */
function Statistics() {
	var I = {};
	
	I.hit = function() {
		I.hits++;
	};
	
	I.miss = function() {
		I.misses++;
	};
	
	I.getHitPercentage = function() {
		if (I.hits + I.misses == 0) {
			return 0;
		}
		
		return I.hits/(I.hits + I.misses);
	};
	
	I.reset = function() {
		I.hits = 0;
		I.misses = 0;
	};
	
	return I;
}