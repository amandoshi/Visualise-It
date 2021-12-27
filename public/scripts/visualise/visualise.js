let visualiser;
let startNodeSelect;
let targetNodeSelect;

/**
 * Setup and display toggles in HTML document ()
 */
function setupToggles() {
	nodeNamesToggleTag = document.getElementById("nodeNamesToggle");
	weightValuesToggleTag = document.getElementById("weightValuesToggle");
	downloadGraphButton = document.getElementById("downloadGraphButton");
	displayDistanceTableButton = document.getElementById(
		"displayDistanceTableButton"
	);

	nodeNamesToggleTag.onclick = () => {
		nodeNamesToggleTag.classList.toggle("active");
		visualiser.cyToggleNodeNames();
	};

	weightValuesToggleTag.onclick = () => {
		weightValuesToggleTag.classList.toggle("active");
		visualiser.cyToggleEdgeWeights();
	};

	displayDistanceTableButton.onclick = () => {
		visualiser.displayFullDistanceTable();
	};

	downloadGraphButton.onclick = downloadGraph;
}

/**
 * Setup and display traversal form toggles in HTML document
 */
function setupTraversalFormToggles() {
	// selecting type toggles
	const typeIds = [
		"bfsTraversalToggle",
		"dfsTraversalToggle",
		"dijkstraTraversalToggle",
	];

	for (const typeId of typeIds) {
		const typeTag = document.getElementById(typeId);
		typeTag.addEventListener("click", () => {
			// remove highlighting from previous traversal type button
			if (visualiser.traversalTypeId) {
				document
					.getElementById(visualiser.traversalTypeId)
					.classList.remove("active");
			}

			visualiser.traversalTypeId = typeId;
			visualiser.traversalType = typeTag.getAttribute("value");

			// add highlighting from current traversal type button
			typeTag.classList.add("active");
		});
	}

	// selecting speed toggles
	const speedIds = [
		"stepByStepToggle",
		"slowSpeedToggle",
		"mediumSpeedToggle",
		"fastSpeedToggle",
	];

	for (const speedId of speedIds) {
		const speedTag = document.getElementById(speedId);
		speedTag.addEventListener("click", () => {
			// remove highlighting from previous traversal speed button
			if (visualiser.traversalSpeedId) {
				document
					.getElementById(visualiser.traversalSpeedId)
					.classList.remove("active");
			}

			visualiser.traversalSpeedId = speedId;
			visualiser.traversalSpeed = speedTag.getAttribute("value");

			// add highlighting from current traversal speed button
			speedTag.classList.add("active");
		});
	}
}

/**
 * Setup the signle data structure with a name
 * @param {String} name - name of single data structure
 */
function setupSingleDataStructure(name) {
	document
		.getElementById("dataStructure")
		.getElementsByClassName("single")[0]
		.getElementsByTagName("p")[0].innerText = name;
}

/**
 * Display a single data strucutre in the HTML document
 * @param {String[]} array - list of items to display in single data strucutre
 */
function updateSingleDataStructure(array) {
	const maxDisplayLength = 8;
	let table = document
		.getElementById("dataStructure")
		.getElementsByClassName("single")[0]
		.getElementsByClassName("slot");

	for (let i = 0; i < Math.min(table.length); i++) {
		// get element from single data structure
		let text;
		if (i < array.length) {
			text = array[i].substring(0, maxDisplayLength - 1);
			if (array[i].length > maxDisplayLength - 1) {
				text += "…";
			}
		} else {
			text = "";
		}

		// display element
		table[i].innerText = text;
	}
}

/**
 * Display distance table in the HTML document
 * @param {Object[]} distanceTable - list of items to display in single data strucutre
 * @param {Number} distanceTable[].distance - distance from start node to current node
 * @param {String} distanceTable.previousNode - name of previous node
 * @param {String} distanceTable[].node - name of current node
 */
function updateDoubleDataStructure(distanceTable) {
	/**
	 * @const maxDisplayLength - maximum possible character length of item in cell
	 */
	const maxDisplayLength = 8;

	// HTML reference to distance tables and sub-elements
	const table = document
		.getElementById("dataStructure")
		.getElementsByClassName("distance_table")[0]
		.getElementsByClassName("row");
	const nodeNames = table[0].getElementsByClassName("cell");
	const distances = table[1].getElementsByClassName("cell");
	const previousNodes = table[2].getElementsByClassName("cell");

	for (let i = 1; i < nodeNames.length; i++) {
		if (i - 1 < distanceTable.length) {
			// display distance
			let distance = distanceTable[i - 1].distance;
			if (distance == Infinity) {
				distance = "∞";
			}

			distances[i].innerText = distance;

			// display name of current node
			let nodeName = distanceTable[i - 1].node;
			nodeName = nodeName.substring(0, maxDisplayLength - 1);
			if (distanceTable[i - 1].node.length > maxDisplayLength - 1) {
				nodeName += "…";
			}

			nodeNames[i].innerText = nodeName;

			// display name of previous node
			const previousNode = distanceTable[i - 1].previousNode;
			let previousNodeName = previousNode.substring(0, maxDisplayLength - 1);
			if (previousNode.length > maxDisplayLength - 1) {
				previousNodeName += "…";
			}
			previousNodes[i].innerText = previousNodeName;
		} else {
			// empty cells
			nodeNames[i].innerText = "";
			distances[i].innerText = "";
			previousNodes[i].innerText = "";
		}
	}
}

/**
 * Download current graph as CSV file
 * Download method: https://stackoverflow.com/questions/21177078/javascript-download-csv-as-file
 */
function downloadGraph() {
	const nodeNames = visualiser.nodeNames;
	const matrix = visualiser.matrix;

	// compile data
	let csvString = nodeNames.join(",") + "\r\n";
	for (let i = 0; i < matrix.length; i++) {
		csvString += matrix[i].join(",") + "\r\n";
	}

	// store data in webpage
	let aLink = document.createElement("a");
	aLink.download = "graphData.csv";
	aLink.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

	// download data
	let event = new MouseEvent("click");
	aLink.dispatchEvent(event);
}

/**
 * Utility code to setup page
 */
window.addEventListener("load", () => {
	// custom select tags
	startNodeSelect = new SelectTag(
		"startNodeSelectTag",
		nodeNames,
		"Select Start Node"
	);
	targetNodeSelect = new SelectTag(
		"targetNodeSelectTag",
		nodeNames,
		"Select Target Node"
	);

	// initialise graph
	let graph = new Graph(weighted);
	graph.nodeNames = nodeNames;
	graph.matrix = matrix;
	visualiser = new Visualiser("graphCanvas", graph);

	// setup traversal form
	setupTraversalFormToggles();
	setupToggles();
	document.getElementById("submitTraversalForm").onclick = () => {
		visualiser.submitTraversalForm();
	};
});
