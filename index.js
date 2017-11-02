module.exports = function() {
	var self = {};

	var package = require("./package.json");
	
	self.name = package["name"];
	self.version = package["version"];
	self.dependencies = [
		"cerus-router",
		"cerus-promise",
		"cerus-settings"
	];

	var api;

	self.init_ = function(cerus) {
		api = require("./lib/api")(cerus);
	}

	self.api = function() {
		return api;
	}

	return self;
}