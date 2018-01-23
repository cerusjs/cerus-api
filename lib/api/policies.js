class policies {
	constructor(cerus) {
		this._policies = {};
		this._cerus = cerus;
	}

	add(name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		return this._cerus.promise(function(event) {
			this._policies[name] = event;
		});
	}

	has(name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		return this._policies[name] !== undefined;
	}

	get(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._policies[name];
	}

	remove(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		delete this._policies[name];
	}

	list() {
		return Object.keys(this._policies);
	}

	clear() {
		this._policies = {};
	}
}

module.exports = policies;