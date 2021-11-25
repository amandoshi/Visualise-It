/**
 * Load pseudocode from text files
 */
function loadPseudocode() {
	const traversalAlgorithms = ["bfs", "dfs", "dijkstra"];

	for (const traversalAlgorithm of traversalAlgorithms) {
		fetch(`/pseudocode/${traversalAlgorithm}.txt`)
			.then((response) => response.text())
			.then((text) => {
				displayPseudocode(traversalAlgorithm, text);
			});
	}
}

/**
 * Display pseudocode inside HTML document
 * @param {String} type - type of path finding algorithm, one of [bfs, dfs, dijkstra]
 * @param {String} pseudocode - pseudocode to display
 */
function displayPseudocode(type, pseudocode) {
	let html = "";

	pseudocode = pseudocode.split("\r\n");
	for (let i = 0; i < pseudocode.length; i++) {
		// two character line number
		const lineNumber = `00${i + 1}`.slice(-2);

		// colored line number
		html += `<blue>${lineNumber} </blue>`;

		if (pseudocode[i].includes("//")) {
			// colored commented code
			html += `<green>${pseudocode[i]}</green><br>`;
		} else {
			html += `${pseudocode[i]}<br>`;
		}
	}

	document.getElementById(`${type}Pseudocode`).innerHTML = html;
}

window.addEventListener("load", loadPseudocode);
