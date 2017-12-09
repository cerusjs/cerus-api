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