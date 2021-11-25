let lineCount = 1;

/**
 * @const - maximum number of possible edges
 */
const maxEdges = Math.floor(maxNumberOfNodes / 2);

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
	const inputObject = document.getElementById("edgeList");

	// sync text areas' scroll
	lineObject.scrollTop = inputObject.scrollTop;
}

/**
 * Format check structure of edge list
 * Convert edge list to adjacency matrix
 * Post adjacency matrix for visualisation
 */
function submit() {
	const edges = document.getElementById("edgeList").value.split("\n");
	const { validFormat, errorTitle, errorText, edgeList } = formatCheck(edges);

	if (!validFormat) {
		return alertError({
			text: errorText,
			title: errorTitle,
		});
	}

	// compile data
	let graph = new Graph(weighted);
	graph.directed = directed;
	graph.edgeList = edgeList;

	const data = {
		weighted,
		matrix: JSON.stringify(graph.matrix),
		nodeNames: JSON.stringify(graph.nodeNames),
	};

	postToUrl(data, "/visualise");
}

/**
 * Format check edge list and identify errors
 * Reconstruct edge list
 * @param {String[]} edges - all edge connections of graph
 * @returns {Object} - edge list, validity of edge list, error message and title
 */
function formatCheck(edges) {
	// determine valid length of edge connection
	const validLength = weighted ? 3 : 2;

	// check for too many edges
	if (edges.length > maxEdges) {
		return {
			validFormat: false,
			errorTitle: "Too Many Edges",
			errorText: `Max number of edges: ${maxEdges}`,
			edgeList: [],
		};
	}

	let edgeList = Array();
	for (let i = 0; i < edges.length; i++) {
		let edgeData = edges[i].split(" ").filter((element) => element != "");

		// check for valid edge formatting
		if (
			edgeData.length != validLength ||
			edgeData[0] == edgeData[1] ||
			!isWord(edgeData[0]) ||
			!isWord(edgeData[1]) ||
			(weighted && (!isInteger(edgeData[2]) || edgeData[2] == 0))
		) {
			return {
				validFormat: false,
				errorTitle: "Invalid Format",
				errorText: `Edge ${i + 1} is incorrectly formatted`,
				edgeList: [],
			};
		} else if (
			edgeData[0].length > maxNodeNameLength ||
			edgeData[1].length > maxNodeNameLength
		) {
			let message = `Edge ${i + 1} is incorrectly formatted. `;
			message += `Node names cannot exceed ${maxNodeNameLength} characters.`;

			return {
				validFormat: false,
				errorTitle: "Invalid Format!",
				errorText: message,
				edgeList: [],
			};
		} else if (weighted && parseInt(edgeData[2]) > maxEdgeWeight) {
			let message = `Edge ${i + 1} is incorrectly formatted. `;
			message += `Maximum edge weight is ${maxEdgeWeight}.`;

			return {
				validFormat: false,
				errorTitle: "Invalid Format!",
				errorText: message,
				edgeList: [],
			};
		} else {
			// construct edge list
			edgeList.push(edgeData);
		}
	}

	return {
		validFormat: true,
		errorTitle: "",
		errorText: "",
		edgeList: edgeList,
	};
}

/**
 * Setup HTML page
 */
window.addEventListener("load", () => {
	const inputObject = document.getElementById("edgeList");

	if (inputObject.value.split("\n").length == 1) {
		fillLineCount();
	} else {
		updateLineCount(inputObject);
	}
});
