/**
 * @const {Number} - maximum possible character length of node name that can be displayed
 */
const maxCharacterDisplayLength = 10;

/**
 * @var {Graph}
 */
let graph;

/**
 * Setup and display adjacency list in HTML document
 */
function setupAdjacencyTable() {
	let html = "";

	for (let i = 0; i < nodeNames.length; i++) {
		// construct row classes
		let rowClass = "row";
		if (i == 0) {
			rowClass += " first";
		} else if (i == nodeNames.length - 1) {
			rowClass += " last";
		}

		// open: row div
		html += `<div class="${rowClass}">`;

		// label
		let nodeName = nodeNames[i].substring(0, maxCharacterDisplayLength - 1);
		if (nodeNames[i].length > maxCharacterDisplayLength - 1) {
			nodeName += "…";
		}
		html += `<p class="column 1">${nodeName}</p>`;

		// input
		html += `<input class="column 2" type="text" />`;

		// close: row div
		html += "</div>";
	}

	// submit button
	html += `<p class="link"><a href="JavaScript:submit();">Visualise</a></p>`;

	document.getElementById("adjacencyTable").innerHTML = html;
}

/**
 * Create adjacency list
 * Check if adjacecny list is in the valid format
 * Post adjacency matrix (from adjacency list) for visualisation
 */
function submit() {
	const adjacencyListData = document.getElementsByClassName("column 2");
	let adjacencyList = new Array(nodeNames.length);

	for (let i = 0; i < adjacencyList.length; i++) {
		const delimiter = weighted ? "," : " ";

		const rowData = adjacencyListData[i].value.split(delimiter);
		let row = new Array();

		for (let j = 0; j < rowData.length; j++) {
			let connection = rowData[j];

			if (weighted) {
				connection = connection.split(" ");

				// filter empty spaces (" ") and values ("") in connection
				connection = connection.filter((value) => {
					return Boolean(value);
				});

				// format check
				if (connection.length == 0) {
					continue;
				} else if (connection.length != 2) {
					return alertError({
						text: `Row ${i + 1} contains an invalid edge connection`,
						title: "Invalid Connection!",
					});
				} else if (
					!isWord(connection[0]) ||
					!isPositiveInteger(connection[1])
				) {
					let message = `Row ${i + 1} contains an invalid edge connection. `;
					message += "Nodes must be words. ";
					message += "Weights must be positive integers.";

					return alertError({
						text: message,
						title: "Invalid Connection Format!",
					});
				} else if (parseInt(connection[1]) > maxEdgeWeight) {
					let message = `Row ${i + 1} contains an invalid edge connection. `;
					message += `The maximum edge weight of ${maxEdgeWeight} has been exceeded.`;

					return alertError({
						text: message,
						title: "Invalid Connection Format!",
					});
				} else if (!nodeNames.includes(connection[0])) {
					let message = `Row ${i + 1} contains an invalid edge connection. `;
					message += "Node does not exist.";

					return alertError({
						text: message,
						title: "Invalid Connection Format!",
					});
				} else if (nodeNames.indexOf(connection[0]) == i) {
					let message = `Row ${i + 1} contains an invalid edge connection. `;
					message += "Nodes cannot have self-connections.";

					return alertError({
						text: message,
						title: "Invalid Connection Format!",
					});
				}

				// add valid connection to row
				row.push([nodeNames.indexOf(connection[0]), parseInt(connection[1])]);
			} else {
				// format check
				if (connection.length == 0) {
					continue;
				} else if (!isWord(connection)) {
					let message = `Row ${i + 1} contains an invalid edge connection. `;
					message += "Nodes must be words.";
				} else if (!nodeNames.includes(connection)) {
					let message = `Row ${i + 1} contains an invalid edge connection. `;
					message += "Node does not exist.";

					return alertError({
						text: message,
						title: "Invalid Connection Format!",
					});
				} else if (nodeNames.indexOf(connection) == i) {
					let message = `Row ${i + 1} contains an invalid edge connection. `;
					message += "Nodes cannot have self-connections.";

					return alertError({
						text: message,
						title: "Invalid Connection Format!",
					});
				}

				// add valid connection to row
				row.push(nodeNames.indexOf(connection));
			}
		}

		adjacencyList[i] = row;
	}

	// generate adjacency matrix
	graph = new Graph(weighted);
	graph.directed = directed;
	graph.nodeNames = nodeNames;
	graph.adjacencyList = adjacencyList;

	// compile data
	const data = {
		directed,
		weighted,
		nodeNames: JSON.stringify(nodeNames),
		matrix: JSON.stringify(graph.matrix),
	};

	postToUrl(data, "/visualise");
}

window.addEventListener("load", setupAdjacencyTable);
