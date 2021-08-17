let lineCount = 1;

function updateLineCount(object) {
	// get current line count
	const currentLineCount = countLines(object.value);

	// check if line count changed
	if (currentLineCount != lineCount) {
		lineCount = currentLineCount;
		fillLineCount();
	}
}

function countLines(text) {
	if (text == "") {
		return 1;
	} else {
		return text.split("\n").length;
	}
}

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

function syncScroll() {
	// textarea objects
	const lineObject = document.getElementById("lineNumber");
	const inputObject = document.getElementById("edgeList");

	// sync text areas' scroll
	lineObject.scrollTop = inputObject.scrollTop;
}
