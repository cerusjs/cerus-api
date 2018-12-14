/**
 * This is the policies class. With this class you can create, get and generally manage your 
 * policies. A policy is a function that checks if the client is allowed to continue to the api
 * function that follows it. For more information about policies you can read the tutorial about it.
 * @class api.policies
 */
class policies {
	constructor(cerus) {
		this._policies = {};
		this._cerus = cerus;
	}

	/**
	 * This functions creates a new policy function. It will return a promise, which is called 
	 * using the "policy" when the policy is called. This event will be called with the following 
	 * parameters: the request class, the json class and cerus. The api route is stopped when a
	 * policy function has emitted.
	 * @example
	 * json.policies().add("emit") // or json.policy()
	 * .then(function(req, json) {
	 *   json.emit();
	 * });
	 * // -> this adds a new policy called "emit" which always emits when it's called
	 * @summary Creates a new policy function.
	 * @param {String} name The name of the new policy.
	 * @return {Promise} This function will return a promise.
	 * @function add
	 */
	add(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._cerus.promise(function(event) {
		return this._cerus.promise(event => {
			this._policies[name] = event;
		});
	}

	/**
	 * With this function you can check if the specified policy exists. If so this function will 
	 * return true and false when it doesn't exist.
	 * @summary Returns if the specified policy exists.
	 * @param {String} name The name of the policy you want to check.
	 * @return {Boolean} If the policy exists.
	 * @function has
	 */
	has(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._policies[name] !== undefined;
	}

	/**
	 * With this function you can return the specified policy. It will return the promise that
	 * was created for the policy. This can be used to later add more checks to a policy without 
	 * needing to save the policy as variable.
	 * @summary Returns the specified policy promise.
	 * @param {String} name The name of the policy you want to get.
	 * @return {Promise} The promise for the specified policy.
	 * @function get
	 */
	get(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._policies[name];
	}

	/**
	 * This function will remove the specified policy for you. To remove all the policies you 
	 * should use policies.clear(); When a policy is removed it can't be used in an api route
	 * anymore. This won't directly break your api routes though, since before being called the
	 * policy is checked if it exists.
	 * @summary Removes the specified policy.
	 * @param {String} name The name of the policy to remove.
	 * @function remove
	 */
	remove(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		delete this._policies[name];
	}

	/**
	 * With this function you can list all of the policy names.
	 * @summary Lists all of the policy names.
	 * @return {String[]} Returns the array of all the policy names.
	 * @function list
	 */
	list() {
		return Object.keys(this._policies);
	}

	/**
	 * With this function you can clear all of the policies. It doesn't remove them one by one, 
	 * since it resets the whole list. Which makes it faster to use that individually removing 
	 * them.
	 * @summary Clears all the policies.
	 * @function clear
	 */
	clear() {
		this._policies = {};
	}
}

module.exports = policies;