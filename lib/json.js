var json = module.exports = function(req, res) {
	// Set the local variables
	this._emitted = false;
	this._json = {};
	this._code = 200;
	this._pretty = req.get("pretty") !== undefined;
	this._req = req;
	this._res = res;
	this._errors = new errors(this);
};

json.prototype.emitted = function() {
	return this._emitted;
};

json.prototype.json = function() {
	return this._json;
};

json.prototype.response = function() {
	return this._res;
};

json.prototype.status = json.prototype.code = function(code) {
	// Set code if it is a number
	if(typeof code === "number") {
		this._code = code;
	}

	// Return the code variable
	return this._code;
};

json.prototype.pretty = function(pretty) {
	// Set pretty if it is a boolean
	if(typeof pretty === "boolean") {
		this._pretty = pretty;
	}

	// Return the code variable
	return this._pretty;
};

json.prototype.text = function(code) {
	// A list with all the codes
	var text = {
		// Informational
		100: "Continue",
		101: "Switching Protocols",

		// Success
		200: "OK",
		201: "Created",
		202: "Accepted",
		203: "Non-Authoritative Information",
		204: "No Content",
		205: "Reset Content",
		206: "Partial Content",

		// Redirection
		300: "Multiple Choices",
		301: "Moved Permanently",
		302: "Found",
		303: "See Other",
		304: "Not Modified",
		305: "Use Proxy",
		307: "Temporary Redirect",
		308: "Permanent Redirect",

		// Client Error
		400: "Bad Request",
		401: "Unauthorized",
		402: "Payment Required",
		403: "Forbidden",
		404: "Not Found",
		405: "Method Not Allowed",
		406: "Not Acceptable",
		407: "Proxy Authentication Required",
		408: "Request Timeout",
		409: "Conflict",
		410: "Gone",
		411: "Length Required",
		412: "Precondition Failed",
		413: "Request Entity Too Large",
		414: "Request-URI Too Long",
		415: "Unsupported Media Type",
		416: "Requested Range Not Satisfiable",
		417: "Expectation Failed",
		426: "Upgrade Required",
		428: "Precondition Required",
		429: "Too Many Requests",
		451: "Unavailable For Legal Reasons",

		// Server Errors
		500: "Internal Server Error",
		501: "Not Implemented",
		502: "Bad Gateway",
		503: "Service Unavailable",
		504: "Gateway Timeout",
		505: "HTTP Version Not Supported",
		506: "Variant Also Negotiates (Experimental)",
		510: "Insufficient Storage (WebDAV)",
		511: "Loop Detected (WebDAV)",
		598: "Network read timeout error",
		599: "Network connect timeout error",
	};

	// If code is undefined, return the whole list
	if(code === undefined) {
		return text;
	}

	// Else return the specified value
	return text[code];
};

json.prototype.emit = function() {
	// Check if the response has already been emitted
	if(this._emitted) {
		return;
	}

	// Set that it has emitted
	this._emitted = true;

	// Set the code value
	json["code"] = this.code();

	// Set the response to json, set the status and send the stringified version
	this._res.type("json");
	this._res.status(this.code());
	this._res.send(stringify(this._json, this._pretty));
};

json.prototype.errors = function() {
	return this._errors;
};

var errors = function(json) {
	// Set the local variables
	this._json = json;
};

errors.prototype.badrequest = function(data) {
	this.error(400, this._json.status(400), data);
};

errors.prototype.unauthorized = function(data) {
	this.error(401, this._json.status(401), data);
};

errors.prototype.notallowed = function(data) {
	this.error(405, this._json.status(405), data);
};

errors.prototype.toomany = function(data) {
	this.error(429, this._json.status(429), data);
};

errors.prototype.internal = function(data) {
	this.error(500, this._json.status(500), data);
};

errors.prototype.error = function(code, message, data) {
	// Check if the arguments are correct
	if(typeof code !== "number") {
		throw new TypeError("the argument code must be a number");
	}

	// Set the response code
	this._json.code(code);

	// Set the message if it isn't undefined
	if(message !== undefined) {
		this._json.json["message"] = message;
	}

	// Set the data if it isn't undefubed
	if(data !== undefined) {
		this._json.json["data"] = data;
	}

	// Emit the json response
	this._json.emit();
};

var stringify = function(json, pretty) {
	// Return the stringified version, pretty if needed
	return pretty ? JSON.stringify(json, null, "\t") : JSON.stringify(json);
};

/*
module.exports = function(res, req) {
	var self = {};

	var emitted = false;
	var json = {};
	var code = 200;
	var pretty = req.get("pretty") != null;

	self.emitted = function() {
		return emitted;
	}

	self.json = function() {
		return json;
	}

	self.response = function() {
		return res;
	}

	self.status = self.code = function(code_) {
		if(code_ != null) {
			code = code_;
		}

		return code;
	}

	self.pretty = function(pretty_) {
		if(pretty_ != null) {
			pretty = pretty_;
		}

		return pretty;
	}

	self.text = function(code) {
		var text = {
			// Informational
			100: "Continue",
			101: "Switching Protocols",

			// Success
			200: "OK",
			201: "Created",
			202: "Accepted",
			203: "Non-Authoritative Information",
			204: "No Content",
			205: "Reset Content",
			206: "Partial Content",

			// Redirection
			300: "Multiple Choices",
			301: "Moved Permanently",
			302: "Found",
			303: "See Other",
			304: "Not Modified",
			305: "Use Proxy",
			307: "Temporary Redirect",
			308: "Permanent Redirect",

			// Client Error
			400: "Bad Request",
			401: "Unauthorized",
			402: "Payment Required",
			403: "Forbidden",
			404: "Not Found",
			405: "Method Not Allowed",
			406: "Not Acceptable",
			407: "Proxy Authentication Required",
			408: "Request Timeout",
			409: "Conflict",
			410: "Gone",
			411: "Length Required",
			412: "Precondition Failed",
			413: "Request Entity Too Large",
			414: "Request-URI Too Long",
			415: "Unsupported Media Type",
			416: "Requested Range Not Satisfiable",
			417: "Expectation Failed",
			426: "Upgrade Required",
			428: "Precondition Required",
			429: "Too Many Requests",
			451: "Unavailable For Legal Reasons",

			// Server Errors
			500: "Internal Server Error",
			501: "Not Implemented",
			502: "Bad Gateway",
			503: "Service Unavailable",
			504: "Gateway Timeout",
			505: "HTTP Version Not Supported",
			506: "Variant Also Negotiates (Experimental)",
			510: "Insufficient Storage (WebDAV)",
			511: "Loop Detected (WebDAV)",
			598: "Network read timeout error",
			599: "Network connect timeout error",
		};

		if(code == null) {
			return text;
		}
		else {
			return text[code];
		}
	}

	self.emit = function() {
		if(emitted) {
			return;
		}

		var str = "";
		emitted = true;
		json["code"] = self.code();

		res.type("json");
		res.status(self.code())

		if(pretty) {
			str = JSON.stringify(json, null, '\t');
		} else {
			str = JSON.stringify(json);
		}

		res.send(str);
	}

	self.errors = function() {
		var self_ = {};

		self_.badrequest = function(data) {
			self_.error(400, self.status(400), data);
		}

		self_.unauthorized = function(data) {
			self_.error(401, self.status(401), data);
		}
		
		self_.notallowed = function(data) {
			self_.error(405, self.status(405), data);
		}
		
		self_.toomany = function(data) {
			self_.error(429, self.status(429), data);
		}
		
		self_.internal = function(data) {
			self_.error(500, self.status(500), data);
		}
		
		self_.error = function(code, message, data) {
			if(typeof code !== "number") {
				throw new TypeError("argument code must be a number");
			}

			self.code(code);

			if(message != null) {
				json['message'] = message;
			}

			if(data != null) {
				json['data'] = data;
			}

			self.emit();
		}

		return self_;
	}

	return self;
}
*/