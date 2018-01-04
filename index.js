module.exports = function() {
	var package = require("./package.json");
	var plugin = {};
	var api;
	
	plugin.name = package["name"];
	plugin.version = package["version"];
	plugin.dependencies = [
		"cerus-router",
		"cerus-promise",
		"cerus-settings"
	];

	plugin.init_ = function(cerus) {
		api = new (require("./lib/api"))(cerus);
	}

	plugin.api = function() {
		return api;
	}

	return plugin;
}