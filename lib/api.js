var json = require("./json");
var policies = require("./api/policies");

class api {
	constructor(cerus) {
		this._policies = new policies(cerus);
		this._folders = new folders();
		this._urls = new urls();
		this._cerus = cerus;
	}

	folders() {
		return this._folders;
	}

	urls() {
		return this._urls;
	}

	policies() {
		return this._policies;
	}

	load(name, type) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		var type_ = type || "api";

		switch(type_) {
			// If type is policy, load a policy class
			case "policy":
				return require(this._cerus.root() + this._folders._policies + "/" + name);

			// If type is api, load an api class
			case "api":
			default:
				return require(this._cerus.root() + this._folders._api + "/" + name);
		}
	}

	add(url, policies) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		var policies_ = policies || [];

		if(!(policies_ instanceof Array)) {
			policies_ = [policies_];
		}
		
		return this._cerus.promise(function(event) {
			// Route all possible methods with the specified url
			this._cerus.router().route("/" + this._urls._api + "/" + url)
			.then(function(req, res) {
				var json_ = new json(req, res);

				for(var i = 0; i < policies_.length; i++) {
					// Continue if the policy doesn't exist
					if(this._policies.has(policies_[i]) === undefined) {
						continue;
					}

					this._policies.get(policies_[i])("policy", req, json_, this._cerus);

					if(json_.emitted()) {
						return;
					}
				}

				event("request", req, json_, this._cerus);
			}.bind(this));
		}.bind(this));
	}

	remove(url) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		this._cerus.router().remove(this._urls._api + "/" + url);
	}
}

module.exports = api;

class folders {
	constructor() {
		this._policies = "policies";
		this._api = "api";
	}

	policies(policies) {
		if(typeof policies === "string") {
			this._policies = policies;
		}

		return this._policies;
	}

	api(api) {
		if(typeof api === "string") {
			this._api = api;
		}

		return this._api;
	}
}

class urls {
	constructor() {
		this._api = "api";
	}

	api(api) {
		if(typeof api === "string") {
			this._api = api;
		}

		return this._api;
	}
}
