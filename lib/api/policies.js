var cerus;

var policies = module.exports = function(cerus_) {
	// Set the local variables
	this._policies = {};

	// Set the cerus object
	cerus = cerus_;
};

policies.prototype.add = function(name) {
	// Check if the variables are correct
	if(typeof name !== "string") {
		throw new TypeError("argument name must be a string");
	}

	// Add the policy with the promise
	return cerus.promise(function(event) {
		this._policies[name] = event;
	});
};

policies.prototype.has = function(name) {
	// Check if the variables are correct
	if(typeof name !== "string") {
		throw new TypeError("argument name must be a string");
	}

	// Check if the specified policy exists
	return this._policies[name] !== undefined;
};

policies.prototype.get = function(name) {
	// Check if the variables are correct
	if(typeof name !== "string") {
		throw new TypeError("argument name must be a string");
	}

	// Return the specified policy
	return this._policies[name];
};

policies.prototype.remove = function(name) {
	// Check if the variables are correct
	if(typeof name !== "string") {
		throw new TypeError("argument name must be a string");
	}

	// Delete the specified policy
	delete this._policies[name];
};

policies.prototype.list = function() {
	// Return an array of all the policy names
	return Object.keys(policies);
};

policies.prototype.clear = function() {
	policies = {};
};