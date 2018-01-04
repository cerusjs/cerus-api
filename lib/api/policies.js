var cerus;

var policies = module.exports = function(cerus_) {
	this._policies = {};

	cerus = cerus_;
}

policies.prototype.add = function(name) {
	if(typeof name !== "string") {
		throw new TypeError("argument name must be a string");
	}

	return cerus.promise(function(event) {
		this._policies[name] = event;
	});
}

policies.prototype.has = function(name) {
	if(typeof name !== "string") {
		throw new TypeError("argument name must be a string");
	}

	return this._policies[name] !== undefined;
}

policies.prototype.get = function(name) {
	if(typeof name !== "string") {
		throw new TypeError("argument name must be a string");
	}

	return this._policies[name];
}

policies.prototype.remove = function(name) {
	if(typeof name !== "string") {
		throw new TypeError("argument name must be a string");
	}

	delete this._policies[name];
}

policies.prototype.list = function() {
	return Object.keys(policies);
}

policies.prototype.clear = function() {
	policies = {};
}