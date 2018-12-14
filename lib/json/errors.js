/**
 * This is the errors class. With this class you can easily send errors to the client and you can 
 * also send your own error if the pre-created ones are not enough.
 * @class json.errors
 * @nofunction
 */
module.exports = class errors {
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
	 * second parameter is the message. It is advised to use {@link json.header} for this, where 
	 * code is the status code you're sending. You can also send any remaining data you want to add 
	 * using the data parameter.
	 * @example
	 * json.errors().error(400, json.header(400), {"error": "value"});
	 * // -> this will send the object {code: 400, message: "Bad Request", data: {"error": "value"}}
	 * @summary Send a custom error to the client.
	 * @param {Number} code The status code you want to send.
	 * @param {String} (message) The error message you want to use. It's advised to use 
	 * {@link json.header} as message, which it is by default.
	 * @param {String} (data) Any data you want to add to the error. It can be a string or every 
	 * type of variable.
	 * @function error
	 */
	error(code, message, data) {
		this._json.code(code);
		this._json.json()["code"] = code;

		if(message !== undefined) this._json.json()["message"] = message;
		if(data !== undefined) this._json.json()["data"] = data;

		this._json.emit();
	}
}