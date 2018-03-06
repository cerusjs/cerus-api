var json = require("./json");
var policies = require("./api/policies");

/**
 * This is the main api class. With this class you can add/manage api routes, manage policies and 
 * change the api folders/urls. The api is used to easily obtain data from the server while also 
 * respecting things like security by using policies. The response for the api works in a RESTful 
 * manner and can be managed using the assigned JSON class object.
 * @class api
 */
class api {
	constructor(cerus) {
		this._policies = new policies(cerus);
		this._folders = new folders();
		this._urls = new urls();
		this._cerus = cerus;
	}

	/**
	 * This function will return the folders class for this module. With this class you can change 
	 * the folders which are used to store the api classes and policy classes.
	 * @return {Class} The folders class.
	 * @function folders
	 */
	folders() {
		return this._folders;
	}

	/**
	 * This function will return the urls class for this module. This class is used to store the 
	 * url for the api.
	 * @return {Class} The urls class.
	 * @function urls
	 */
	urls() {
		return this._urls;
	}

	/**
	 * With the class this function returns you can manage the policies for the api. The policies 
	 * are used as middleware before the api function is called. These policies are used for things
	 * like security and to check if the client is logged in. You can easily add policies using the
	 * {@link api.policy} function.
	 * @return {Class} The policies class.
	 * @function policies
	 */
	policies() {
		return this._policies;
	}

	/**
	 * This function is used for a shortcut to add a new policy. You can specify the name with the 
	 * inserted parameter. This function will return a promise that will be called on the 'policy' 
	 * event when the policy is used. The api request will be stopped when the policy has emitted
	 * a response. The 'policy' event will e called with the request, json response and cerus as 
	 * parameters.
	 * @param {String} name The name of the new policy.
	 * @return {Promise} This function will return a promise.
	 * @function policy
	 */
	policy(name) {
		return this._policies.add(name);
	}

	/**
	 * With this function you can load an api or policy class. The api classes should contain the 
	 * functions used for routing api requests. The policy classes should contain the policies. To
	 * load the class it wil use the general require function. The folders that should contain the
	 * classes can be changed using the {@link api.folders} function.
	 * @param {String} name The name of the class to load.
	 * @param {String} type The type of class to load.
	 * @return {Class} This function will return the loaded class.
	 * @function load
	 */
	load(name, type = "api") {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		switch(type) {
			// If type is policy, load a policy class
			case "policy":
				return require(this._cerus.root() + this._folders._policies + "/" + name);

			// If type is api, load an api class
			case "api":
			default:
				return require(this._cerus.root() + this._folders._api + "/" + name);
		}
	}

	add(url, policies = []) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}

		var policies_ = policies;

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
					if(this._policies.has(policies_[i]) === false) {
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
