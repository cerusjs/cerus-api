var headers = {
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
	226: "IM Used",

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
	431: "Request Header Fields Too Large",
	451: "Unavailable For Legal Reasons",

	// Server Errors
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
	505: "HTTP Version Not Supported",
	506: "Variant Also Negotiates (Experimental)",
	510: "Not Extended",
	511: "Network Authentication Required",
	598: "Network read timeout error",
	599: "Network connect timeout error"
};

class json {
	constructor(req, res) {
		this._emitted = false;
		this._json = {};
		this._code = 200;
		this._pretty = false;
		this._req = req;
		this._res = res;
		this._errors = new errors(this);
	}

	emitted() {
		return this._emitted;
	}

	json() {
		return this._json;
	}

	response() {
		return this._res;
	}

	status(code) {
		if(typeof code === "number") {
			this._code = code;
		}

		return this._code;
	}

	code(code) {
		return this.status(code);
	}

	pretty(pretty) {
		if(typeof pretty === "boolean") {
			this._pretty = pretty;
		}

		return this._pretty;
	}

	header(code) {
		if(code === undefined) {
			return headers;
		}

		return headers[code];
	}

	emit() {
		if(this._emitted) {
			return;
		}

		this._emitted = true;

		// Set the response to json, set the status and send the stringified version
		this._res.type("json");
		this._res.status(this.code());
		this._res.send(stringify(this._json, this._pretty));
	}

	errors() {
		return this._errors;
	}
}

module.exports = json;

class errors {
	constructor(json) {
		this._json = json;
	}

	badrequest(data) {
		this.error(400, this._json.text(400), data);
	}

	unauthorized(data) {
		this.error(401, this._json.text(401), data);
	}

	notallowed(data) {
		this.error(405, this._json.text(405), data);
	}

	toomany(data) {
		this.error(429, this._json.text(429), data);
	}

	internal(data) {
		this.error(500, this._json.text(500), data);
	}

	notimplemented(data) {
		this.error(501, this._json.text(501), data);
	}

	error(code, message, data) {
		if(typeof code !== "number") {
			throw new TypeError("the argument code must be a number");
		}

		this._json.code(code);

		if(message !== undefined) {
			this._json.json["message"] = message;
		}

		if(data !== undefined) {
			this._json.json["data"] = data;
		}

		this._json.emit();
	}
}

var stringify = function(json, pretty) {
	// Return the stringified version, pretty if needed
	return pretty ? JSON.stringify(json, null, "\t") : JSON.stringify(json);
};
