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
		this._cerus = cerus;
		this._policies = new policies(cerus);
		this._folders = new folders();
		this._urls = new urls();
	}

	/**
	 * This function will return the folders class for this module. With this class you can change 
	 * the folders which are used to store the api classes and policy classes.
	 * @summary Returns the folders class.
	 * @return {Class} The api.folders class.
	 * @function folders
	 */
	folders() {
		return this._folders;
	}

	/**
	 * This function will return the urls class for this module. This class is used to store the 
	 * url for the api.
	 * @summary Returns the urls class.
	 * @return {Class} The api.urls class.
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
	 * @summary Returns the policies class.
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
	 * @summary Creates a new policy.
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
	 * load the class it will use the general require function. The folders that should contain the
	 * classes can be changed using the {@link api.folders} function.
	 * @summary Loads an api or policy file.
	 * @param {String} name The name of the class to load.
	 * @param {String} type The type of class to load.
	 * @return {Class} This function will return the loaded class.
	 * @function load
	 */
	load(name, type = "api") {
		const _name = name.replace(/\\/g,"/");

		switch(type) {
			case "policy":
				return require(`${this._cerus.root()}${this._folders._policies}/${_name}`);

			case "api":
			default:
				return require(`${this._cerus.root()}${this._folders._api}/${_name}`);
		}
	}

	/**
	 * This function is used to create a new api route. An api is a way to easily obtain data from 
	 * you server that you need from your client. Apis can also be used to trigger actions on the 
	 * server. This can be things like logging users in. For more information about api you can 
	 * read the tutorial about it. You can set the url of the api with the url parameter. You can 
	 * also add policies to your api route. Policies are functions that check if the client is 
	 * allowed to continue on to the api function. You can manage policies using policies using the
	 * policy class and there also is a tutorial about policies.
	 * @example
	 * cerus.api().add("test")
	 * .then(function(req, res) {
	 *   res.emit();
	 * });
	 * // -> routes the api route to "/api/test"
	 * @emits request When the api route has been requested. With the request class as first 
	 * parameter, the json class as second parameter and the cerus object as last parameter.
	 * @summary Creates a new api route.
	 * @param {String} url The url the new api will route to.
	 * @param {Array} policies The policies for this api route.
	 * @return {Promise} This function will return a promise.
	 * @function add
	 */
	add(url, policies = []) {

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

	/**
	 * With this function you can remove an api route. It basically directly removes it from the 
	 * router. 
	 * @example
	 * cerus.api().remove("/");
	 * // -> this removes the "/" api route
	 * @summary Removes the specified api route.
	 * @param {String} url The url of the api route to remove.
	 * @function remove
	 */
	remove(url) {

		this._cerus.router().remove(this._urls._api + "/" + url);
	}
}

module.exports = api;

/**
 * This is the folders class. With this class you can change the folders that should be used to 
 * store your policy and api classes.
 * @class api.folders
 */
class folders {
	constructor() {
		this._policies = "policies";
		this._api = "api";
	}

	/**
	 * This function is the getter and setter for the policies folder. This is the folder where the
	 * policy classes should be put in. By default this path is "policies". This path is also fixed
	 * (\\\\ is changed to /) before being used to support all the platforms.
	 * @summary The getter/setter for the policy folder.
	 * @param {String} (path) The new path for the policies folder.
	 * @return {String} The path for the policies folder.
	 * @function policies
	 */
	policies(path) {
		if(typeof path !== "string") return this._policies;
		
		return this._policies = path.replace(/\\/g,"/");
	}

	/**
	 * This function is the getter and setter for the api folder. This is the folder where the api 
	 * classes should be put in. This path is also fixed (\\\\ is changed to /) before being used 
	 * to support all the platforms.
	 * @summary The getter/setter for the api folder.
	 * @param {String} (path) The new path for the api folder.
	 * @return {String} The path for the api folder.
	 * @function api
	 */
	api(path) {
		if(typeof path !== "string") return this._api;

		return this._api = path.replace(/\\/g,"/");
	}
}

/**
 * This is the urls class. With this class you can change the url that is used as prefix for all 
 * the api routes.
 * @class api.urls
 * @id api.urls
 */
class urls {
	constructor() {
		this._api = "api";
	}

	/**
	 * This is the getter and setter for the api url. This url is used when a new api route is 
	 * created. 
	 * @summary The getter/setter for the api url.
	 * @param {String} (url) The new url for the api routes.
	 * @return {[type]} The urls for the api routes.
	 * @function api
	 */
	api(url) {
		if(typeof url !== "string") return this._api;
			
		return this._api = url;
	}
}
