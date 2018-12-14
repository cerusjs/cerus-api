const headers = {
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

/**
 * This is the json class. This class is one of the parameters that is supplied with the api 
 * request event. With it you can easily manage a JSON response. It'll help you with returning 
 * errors, pretty printing, etc.
 * @class json
 * @nofunction
 */
module.exports = class json {
	constructor(req, res) {
		this._emitted = false;
		this._json = {};
		this._code = 200;
		this._pretty = false;
		this._req = req;
		this._res = res;
		this._errors = new errors(this);
	}

	/**
	 * With this function you can check if the response has been emitted. Emitted is set to true 
	 * when the emit function has been used. It is different from response.finished() since it can 
	 * take some time to finish a response, which might result in an error when the response is 
	 * re-emitted in that time.
	 * @summary Returns if the response has been emitted.
	 * @return {Boolean} If the response has been emitted.
	 * @function emitted
	 */
	emitted() {
		return this._emitted;
	}

	/**
	 * This function will return the JSON object you can add items to. This object will be
	 * stringified and send to the client on emit. There is no need to manually update the object
	 * by changing the this._json variable since the object will be updated automatically.
	 *  @example
	 * json.json()["example"] = "value";
	 * // -> this will set the "example" key to "value"
	 * @summary Returns the JSON object that will be send.
	 * @return {Object} The JSON object that will be send.
	 * @function json
	 */
	json() {
		return this._json;
	}

	/**
	 * This function will return the response for this request. This response is the same as the 
	 * response created by the router.
	 * @summary Returns the response class created by the router.
	 * @return {Class} The response class created by the router.
	 * @function response
	 */
	response() {
		return this._res;
	}

	/**
	 * This function is the getter/setter for the status code that will be send to the client. This
	 * function has to be used when since the router's response status code will be overwritten 
	 * when the json object is emitted.
	 * @alias code
	 * @summary The getter/setter for the status code.
	 * @param {Number} (code) The new status code.
	 * @return {Number} Returns the status code.
	 * @function status
	 */
	status(code) {
		if(typeof code !== "number") return this._code;
		
		return this._code = code;
	}

	code(code) {
		return this.status(code);
	}

	/**
	 * This function is the getter/setter for the pretty printing mode. If the pretty printing mode
	 * is on the response will be send using the following stringify method 
	 * JSON.stringify(json, null, "\t"). This means that tabs are used for spacing.
	 * @summary The getter/setter for the pretty printing mode.
	 * @param {Boolean} pretty If the pretty printing mode should be on.
	 * @return {Boolean} If the pretty printing mode is on.
	 * @function pretty
	 */
	pretty(pretty) {
		if(typeof pretty === "boolean") return this._pretty;

		return this._pretty = pretty;
	}

	/**
	 * This function will help you with the header string. If you insert a status code as parameter
	 * it'll return the header string that matches that code or when you don't insert anything 
	 * it'll return an object of all the header strings.
	 * @example
	 * json.header(204);
	 * // -> this will return "No Content"
	 * @summary Returns the header that matches the status code or all of the headers.
	 * @param {Number} (code) The status code you want the header for.
	 * @return {String|Object} The header that matches the status code or all of the headers.
	 * @function header
	 */
	header(code) {
		if(typeof code === "number") {
			return headers[code];
		}

		return headers;
	}

	/**
	 * With this function you can emit the json response. When it is emitted once this function 
	 * will be blocked so you can't emit it anymore. This function will set the content-type to
	 * "json" for you and will set the status code you've set. It will then send the json object.
	 * This will be in pretty printing mode, depending on if you've set it to true.
	 * @example
	 * json.code(500);
	 * json.json()["error"] = "There was an error";
	 * json.emit();
	 * // -> this will emit the object "{error: "There was an error"}"
	 * @summary Emits the json object to the client.
	 * @function emit
	 */
	emit() {
		if(this._emitted) return;

		this._emitted = true;
		this._res.type("json");
		this._res.status(this.code()); // Do I want this?
		this._res.send(stringify(this._json, this._pretty));
	}

	/**
	 * This function will return the {@link json.errors} class. With this class you can easily send errors to 
	 * the client. You can also create your own errors if the pre-created ones don't suffice.
	 * @summary Returns the json.errors class.
	 * @return {Class} The json.errors class.
	 * @function errors
	 */
	errors() {
		return this._errors;
	}
}

module.exports = json;

/**
 * This is the errors class. With this class you can easily send errors to the client and you can 
 * also send your own error if the pre-created ones are not enough.
 * @class json.errors
 * @nofunction
 */
class errors {
	constructor(json) {
		this._json = json;
	}

	/**
	 * This function will send a "Bad Request" error to the client. This error has 400 as status 
	 * code and "Bad Request" as message. You can also add data that will be placed under the 
	 * "data" key.
	 * @example
	 * json.errors().badrequest({"error": "value"});
	 * // -> this will send the object {code: 400, message: "Bad Request", data {"error": "value"}}
	 * @summary Send a "Bad Request" error to the client.
	 * @param {String} (data) The data that you want to add to the error. It can be a string or 
	 * every other type of variable.
	 * @function badrequest
	 */
	badrequest(data) {
		this.error(400, this._json.header(400), data);
	}

	/**
	 * This function will send a "Unauthorized" error to the client. This error has 401 as status 
	 * code and "Unauthorized" as message. You can also add data that will be placed under the 
	 * "data" key.
	 * @example
	 * json.errors().unauthorized({"error": "value"});
	 * // -> this will send the object {code: 401, message: "Unauthorized", data {"error": "value"}}
	 * @summary Send a "Unauthorized" error to the client.
	 * @param {String} (data) The data that you want to add to the error. It can be a string or 
	 * every other type of variable.
	 * @function unauthorized
	 */
	unauthorized(data) {
		this.error(401, this._json.header(401), data);
	}

	/**
	 * This function will send a "Method Not Allowed" error to the client. This error has 405 as 
	 * status  code and "Method Not Allowed" as message. You can also add data that will be placed 
	 * under the "data" key.
	 * @example
	 * json.errors().notallowed({"error": "value"});
	 * // -> this will send the object {code: 405, message: "Method Not Allowed", data {"error": "value"}}
	 * @summary Send a "Method Not Allowed" error to the client.
	 * @param {String} (data) The data that you want to add to the error. It can be a string or 
	 * every other type of variable.
	 * @function notallowed
	 */
	notallowed(data) {
		this.error(405, this._json.header(405), data);
	}

	/**
	 * This function will send a "Too Many Requests" error to the client. This error has 429 as 
	 * status  code and "Too Many Requests" as message. You can also add data that will be placed 
	 * under the "data" key.
	 * @example
	 * json.errors().toomany({"error": "value"});
	 * // -> this will send the object {code: 429, message: "Too Many Requests", data: {"error": "value"}}
	 * @summary Send a "Too Many Requests" error to the client.
	 * @param {String} (data) The data that you want to add to the error. It can be a string or 
	 * every other type of variable.
	 * @function toomany
	 */
	toomany(data) {
		this.error(429, this._json.header(429), data);
	}

	/**
	 * This function will send a "Internal Server Error" error to the client. This error has 500 as 
	 * status code and "Internal Server Error" as message. You can also add data that will be 
	 * placed under the "data" key.
	 * @example
	 * json.errors().internal({"error": "value"});
	 * // -> this will send the object {code: 500, message: "Internal Server Error", data: {"error": "value"}}
	 * @summary Send a "TInternal Server Error" error to the client.
	 * @param {String} (data) The data that you want to add to the error. It can be a string or 
	 * every other type of variable.
	 * @function internal
	 */
	internal(data) {
		this.error(500, this._json.header(500), data);
	}

	/**
	 * This function will send a "Not Implemented" error to the client. This error has 501 as
	 * status  code and "Not Implemented" as message. You can also add data that will be placed 
	 * under the "data" key.
	 * @example
	 * json.errors().notimplemented({"error": "value"});
	 * // -> this will send the object {code: 501, message: "Not Implemented", data: {"error": "value"}}
	 * @summary Send a "Not Implemented" error to the client.
	 * @param {String} (data) The data that you want to add to the error. It can be a string or 
	 * every other type of variable.
	 * @function notimplemented
	 */
	notimplemented(data) {
		this.error(501, this._json.header(501), data);
	}

	/**
	 * With this function you can easily send your own error to the client. The first parameter is 
	 * the error code you want to use. This parameter isn't option, so don't forget to add it. The 
	 * second parameter is the message. It is advised to use json.header(CODE) for this, where code
	 * is the status code you're sending. You can also send any remaining data you want to add 
	 * using the data parameter.
	 * @example
	 * json.errors().error(400, json.header(400), {"error": "value"});
	 * // -> this will send the object {code: 400, message: "Bad Request", data: {"error": "value"}}
	 * @summary Send a custom error to the client.
	 * @param {Number} code The status code you want to send.
	 * @param {String} (message) The error message you want to use. It's advised to use 
	 * json.header(CODE);
	 * @param {String} (data) Any data you want to add to the error. It can be a string or every 
	 * type of variable.
	 * @function error
	 */
	error(code, message, data) {
		if(typeof code !== "number") {
			throw new TypeError("the argument code must be a number");
		}

		this._json.code(code);
		this._json.json()["code"] = code;

		if(typeof message === "string") {
			this._json.json()["message"] = message;
		}

		if(data !== undefined) {
			this._json.json()["data"] = data;
		}

		this._json.emit();
	}
}

var stringify = function(json, pretty) {
	return pretty ? JSON.stringify(json, null, "\t") : JSON.stringify(json);
};
