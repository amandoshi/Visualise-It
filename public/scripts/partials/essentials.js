/**
 * Display error message
 * @param {Object} message - contains data about error
 * @param {String} message.text - error message
 * @param {String} message.title - error title
 */
function alertError(message) {
	Swal.fire({
		confirmButtonColor: "#0088a9",
		icon: "error",
		text: message.text,
		title: message.title,
	});
}

/**
 * Determine if a value is an integer
 * @param {string} value - value to be tested as integer
 * @returns {Boolean} - true if integer, false if not integer
 */
function isInteger(value) {
	return /^\d+$/.test(value);
}

/**
 * Determine if a value is a positive integer
 * @param {string} value - value to be tested as positive integer
 * @returns {Boolean} - true if positive integer, false if not positive integer
 */
function isPositiveInteger(value) {
	return /^[1-9]\d*$/.test(value);
}

/**
 * Determine if value is a word (contains only alphanumeric characters)
 * @param {string} value - value to be tested as word
 * @returns {Boolean} - true if word, false if not word
 */
function isWord(value) {
	return /^\w+$/.test(value);
}

/**
 * Post iterable data to a specified url
 * @param {Object} data - data to be sent
 * @param {String} url - location to post data
 */
function postToUrl(data, url) {
	// create form element
	let form = document.createElement("form");
	form.method = "post";
	form.action = url;

	// add data to form
	for (const key in data) {
		// create input element
		let input = document.createElement("input");
		input.type = "hidden";
		input.name = key;
		input.value = data[key];

		// add input to form
		form.appendChild(input);
	}

	// send data
	document.body.appendChild(form);
	form.submit();
}
