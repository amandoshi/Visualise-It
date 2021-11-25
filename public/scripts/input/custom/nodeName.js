let lineCount = 1;

/**
 * Update line count of text area
 * @param {Object} object - reference to HTML text area
 */
function updateLineCount(object) {
	// get current line count
	const currentLineCount = countLines(object.value);

	// check if line count changed
	if (currentLineCount != lineCount) {
		lineCount = currentLineCount;
		fillLineCount();
	}
}

/**
 * Count number of lines in a text
 * @param {String} text
 * @returns {Number} - number of lines in text
 */
function countLines(text) {
	if (text == "") {
		return 1;
	} else {
		return text.split("\n").length;
	}
}

/**
 * Display line count in HTML document
 */
function fillLineCount() {
	// get read-only textarea
	const lineObject = document.getElementById("lineNumber");

	// generate line numbers
	let lineString = "";
	for (let i = 1; i < lineCount + 1; i++) {
		lineString += `${i}\n`;
	}

	// add line numbers to read-only textarea
	lineObject.value = lineString;
}

/**
 * Synchronise the scrolls of input textarea and line count textarea
 */
function syncScroll() {
	// textarea objects
	const lineObject = document.getElementById("lineNumber");
	const inputObject = document.getElementById("nodeNames");

	// sync text areas' scroll
	lineObject.scrollTop = inputObject.scrollTop;
}

/**
 * Format check node names
 * Post node names and redirect to new page to input the graph
 */
function submit() {
	// node name names
	const names = document.getElementById("nodeNames").value.split("\n");

	// check for valid node name
	let uniqueNames = new Set();
	for (const name of names) {
		const nameSplit = name.split(" ").filter((val) => val != "");

		if (nameSplit.length > 1) {
			// reject a phrase
			return alertError({
				text: "Node name cannot be multiple words",
				title: "Invalid node name...",
			});
		} else if (
			nameSplit.length == 1 &&
			nameSplit[0].length > maxNodeNameLength
		) {
			return alertError({
				text: `Maximum node name length is ${maxNodeNameLength} characters.`,
				title: "Invalid Node Name!",
			});
		} else if (!isWord(nameSplit[0])) {
			return alertError({
				text: `Node names must be alphanumeric.`,
				title: "Invalid Node Name!",
			});
		} else if (nameSplit.length == 1) {
			uniqueNames.add(nameSplit[0]);
		}
	}

	if (uniqueNames.size < 2) {
		// reject less than 2 node names
		return alertError({
			text: "At least 2 node names must be entered",
			title: "An error occured...",
		});
	} else if (uniqueNames.size > maxNumberOfNodes) {
		return alertError({
			text: `A maximum of ${maxNumberOfNodes} node names are allowed.`,
			title: "Too Many Node Names!",
		});
	}

	// send data
	const data = { names: JSON.stringify(Array.from(uniqueNames)) };
	postToUrl(data, postUrl);
}

window.addEventListener("load", () => {
	fillLineCount();
	updateLineCount(document.getElementById("nodeNames"));
});
