/**
 * @const {Number} - maximum possible character length of node name that can be displayed
 */
const maxCharacterDisplayLength = 12;

/**
 * Setup and display adjacency matrix in HTML document
 */
function setupMatrix() {
	// get matrix as object
	const tableObject = document.getElementById("table");

	// construct html
	let html = "";
	html += tableHeadHtml();
	html += tableBodyHtml();
	html += `<p class="link"><a href="JavaScript:submitMatrix()">Visualise</a></p>`;

	// setup matrix
	tableObject.innerHTML = html;
	setTableWidth();
}

/**
 * Construct HTML string for table head
 * @returns {String} - table head HTML string
 */
function tableHeadHtml() {
	// open row
	let html = `<div class="row first">`;

	// empty cell
	html += `<p class="column first" id="0-0"></p>`;

	// node names
	for (let i = 0; i < nodeNames.length; i++) {
		// column attributes
		let columnClass = "column";
		if (i == nodeNames.length - 1) {
			columnClass += " last";
		}

		const id = `0-${i + 1}`;

		let nodeName = nodeNames[i].substring(0, maxCharacterDisplayLength - 1);
		if (nodeNames[i].length > maxCharacterDisplayLength - 1) {
			nodeName += "…";
		}

		// cell
		html += `<p class="${columnClass}" id="${id}">${nodeName}</p>`;
	}

	// close row
	html += `</div>`;

	return html;
}

/**
 * Construct HTML string for table body
 * @returns {String} - table body HTML string
 */
function tableBodyHtml() {
	let html = "";

	for (let i = 0; i < nodeNames.length; i++) {
		// row class
		let rowClass = "row";
		if (i == nodeNames.length - 1) {
			rowClass += " last";
		}

		// open row
		html += `<div class="${rowClass}">`;

		// node name cell
		const nodeNameId = `${i + 1}-0`;

		let nodeNameText = nodeNames[i].substring(0, maxCharacterDisplayLength - 1);
		if (nodeNames[i].length > maxCharacterDisplayLength - 1) {
			nodeNameText += "…";
		}

		html += `<p class="column first" id="${nodeNameId}">${nodeNameText}</p>`;

		// input cells
		for (let j = 0; j < nodeNames.length; j++) {
			// class
			let columnClass = "column";
			if (j == nodeNames.length - 1) {
				columnClass += " last";
			}
			if (i == j) {
				columnClass += " disabled";
			} else if (!directed && j < i) {
				columnClass += " copy";
			}

			// id
			const columnId = `${i + 1}-${j + 1}`;

			// oninput
			let oninput = "";
			if (!directed && j > i) {
				oninput += `javascript:cascadeInput(this)`;
			}

			// self-pointing edges
			let readonly = "";
			if (i == j || (!directed && j < i)) {
				readonly += "readonly";
			}

			// open cell
			html += `<input `;

			// cell attributes
			html += `class="${columnClass}"`;
			html += `id="${columnId}"`;
			html += `oninput="${oninput}"`;
			html += `placeholder="0"`;
			html += `${readonly} `;
			html += `type="number"`;

			// close cell
			html += ">";
		}

		// close row
		html += `</div>`;
	}

	return html;
}

/**
 * Set the width of table
 * Table width is dependent on number of cells in adjacency matrix
 */
function setTableWidth() {
	// table properties
	const borderWidth = 1;
	const cellWidth = 140;
	const numberOfCells = nodeNames.length + 1;

	// table width
	const width = numberOfCells * (borderWidth + cellWidth) + borderWidth;

	// set table width
	addStyle(`.table { width:${width}px }`);
}

/**
 * Copy value from one cell to complementary cell in table (create undirected edge)
 * @param {Object} inputObject - reference to HTML cell in table
 */
function cascadeInput(inputObject) {
	targetId = inputObject.id.split("-").reverse().join("-");
	document.getElementById(targetId).value = inputObject.value;
}

/**
 * Format check adjacency matrix
 * Display error if invalid format
 * Post adjacency matrix for visualisation if valid format
 */
function submitMatrix() {
	// create matrix
	let matrix = new Array(nodeNames.length);
	for (let i = 0; i < nodeNames.length; i++) {
		let row = new Array(nodeNames.length);
		row.fill(0);
		matrix[i] = row;
	}

	for (let i = 0; i < nodeNames.length; i++) {
		for (let j = 0; j < nodeNames.length; j++) {
			let cellWeight = document.getElementById(`${i + 1}-${j + 1}`).value;

			// format check
			if (!cellWeight) {
				cellWeight = 0;
			} else if (!isPositiveInteger(cellWeight)) {
				let message = `Cell in row ${i + 1}, column ${j + 1} is invalid. `;
				message += "Cells must contain positive integers.";

				return alertError({
					text: message,
					title: "Invalid Cell Format!",
				});
			} else if (!weighted && cellWeight != 1) {
				let message = `Cell in row ${i + 1}, column ${j + 1} is invalid. `;
				message += "Unweighted graphs must have edge values of 0 or 1.";

				return alertError({
					text: message,
					title: "Invalid Cell Format!",
				});
			} else {
				cellWeight = parseInt(cellWeight);
			}

			matrix[i][j] = cellWeight;
		}
	}

	// compile data
	const data = {
		directed,
		weighted,
		nodeNames: JSON.stringify(nodeNames),
		matrix: JSON.stringify(matrix),
	};

	postToUrl(data, "/visualise");
}

window.addEventListener("load", setupMatrix);
