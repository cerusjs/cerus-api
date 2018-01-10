var cerus;
var json = require("./json");
var policies = require("./api/policies");

var api = module.exports = function(cerus_) {
	// Set the local variables
	this._policies = new policies();
	this._folders = new folders();
	this._urls = new urls();

	// Set the cerus object
	cerus = cerus_;
}

api.prototype.folders = function() {
	return this._folders;
}

var folders = module.exports = function() {
	// Set the local variables
	this._policies = "policies";
	this._api = "api";
}

folders.prototype.policies = function(policies) {
	// If policies is a string, update the value
	if(typeof policies === "string") {
		this._policies = policies;
	}

	// Return the policies variable
	return this._policies;
}

folders.prototype.api = function(api) {
	// If api is a string, update the value
	if(typeof api === "string") {
		this._api = api;
	}

	// Return the api variable
	return this._api;
}

api.prototype.urls = function() {
	return this._urls;
}

var urls = function() {
	// Set the local variables
	this._api = "api";
}

urls.prototype.api = function(api) {
	// If api is a string, update the value
	if(typeof api === "string") {
		this._api = api;
	}

	// Return the api variable
	return this._api;
}

api.prototype.load = function(name, type) {
	// Check if the variables are correct
	if(typeof name !== "string") {
		throw new TypeError("argument name must be a string");
	}

	// Set the type to "api" if it is undefined
	type = type || "api";

	switch(type) {
		// If type is policy, load a policy class
		case "policy":
			return require(cerus.root() + this._folders._policies + "/" + name);

		// If type is api, load an api class
		case "api":
		default:
			return require(cerus.root() + this._folders._api + "/" + name);
	}
}

api.prototype.add = function(url, policies) {
	// Check if the arguments are correct
	if(typeof url !== "string") {
		throw new TypeError("argument url must be a string");
	}

	// Create a new promise
	return cerus.promise(function(event) {
			// Set the policies to an empty array if it is undefined
			policies = policies || [];

			// Set the policies to an array if it isn't already
			if(typeof policies !== "array") {
				policies = [policies];
			}

			// Route all possible methods with the specified url
			cerus.router().route("/" + this._urls._api + "/" + url)
			.then(function(req, res) {
				var json_ = new json(res, req);

				// Go through all the policies
				for(var i = 0; i < policies.length; i++) {
					// If it isn't one, continue
					if(this._policies._policies[policies[i]] === undefined) {
						continue;
					}

					// Execute the policy
					this._policies._policies[policies[i]]("policy", req, json_, cerus);

					// Return if the policy emitted the response
					if(json_.emitted()) {
						return;
					}
				}

				// Call a request event containing the needed arguments
				event("request", req, json_, cerus);
			}.bind(this));
	}.bind(this));
}

api.prototype.remove = function(url) {
	// Check if the variables are correct
	if(typeof url !== "string") {
		throw new TypeError("argument url must be a string");
	}

	// Remove the url from the router
	cerus.router().remove(this._urls._api + "/" + url);
}

api.prototype.policies = function() {
	return this._policies;
}

/*
module.exports = function(cerus) {
	var self = {};

	var json = require("./json");
	var policies = {};

	self.load = function(name, type) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		type = type || "api";

		switch(type) {
			case "policy":
				return require(
					cerus.settings().root() + 
					cerus.settings().directories().policies() + "/" + 
					name
				);
			case "api":
			default:
				return require(
					cerus.settings().root() + 
					cerus.settings().directories().api() + "/" + 
					name
				);
		}
	}

	self.add = function(url, policies_) {
		return cerus.promise(function(event) {
			if(typeof url !== "string") {
				throw new TypeError("argument url must be a string");
			}

			policies_ = policies_ || [];

			if(typeof policies_ == "string") {
				policies_ = [policies_];
			}

			cerus.router().route("/" + cerus.settings().urls().api() + "/" + url)
			.then(function(req, res) {
				var json_ = json(res, req);

				for(var i = 0; i < policies_.length; i++) {
					if(policies[policies_[i]] == null) {
						continue;
					}

					policies[policies_[i]]("policy", req, json_, cerus);

					if(json_.emitted()) {
						return;
					}
				}

				event("request", req, json_, cerus);
			});
		});
	}

	self.remove = function(url) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		cerus.router().remove(cerus.settings().urls().api() + url);
	}

	self.policy = function() {
		var self_ = {};

		self_.add = function(name) {
			if(typeof name !== "string") {
				throw new TypeError("argument name must be a string");
			}

			return cerus.promise(function(event) {
				policies[name] = event;
			});
		}

		self_.has = function(name) {
			if(typeof name !== "string") {
				throw new TypeError("argument name must be a string");
			}

			return policies[name] !== undefined;
		}

		self_.get = function(name) {
			if(typeof name !== "string") {
				throw new TypeError("argument name must be a string");
			}

			return policies[name];
		}

		self_.remove = function(name) {
			if(typeof name !== "string") {
				throw new TypeError("argument name must be a string");
			}

			delete policies[name];
		}

		self_.list = function() {
			return policies;
		}

		self_.clear = function() {
			policies = {};
		}

		return self_;
	}

	return self;
}
*/