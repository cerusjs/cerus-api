var folders = module.exports = function() {
	this._policies = "policies";
	this._api = "api";
}

folders.prototype.policies = function(policies) {
	if(typeof policies === "string") {
		this._policies = policies;
	}

	return this._policies;
}

folders.prototype.api = function(api) {
	if(typeof api === "string") {
		this._api = api;
	}

	return this._api;
}