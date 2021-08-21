function setupMatrix() {
	// get matrix as object
	const tableObject = document.getElementById("table");

	// construct html
	let html = "";
	html += tableHeadHtml();
	html += tableBodyHtml();
	html += `<p class="link"><a href="#">Visualise</a></p>`;

	// setup matrix
	tableObject.innerHTML = html;
	setTableWidth();

	console.log(html);
}

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
		const text = nodeNames[i];

		// cell
		html += `<p class="${columnClass}" id="${id}">${text}</p>`;
	}

	// close row
	html += `</div>`;

	return html;
}

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
		const nodeNameText = nodeNames[i];
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
			} else if (directed && j < i) {
				columnClass += " copy";
			}

			// id
			const columnId = `${i + 1}-${j + 1}`;

			// oninput
			let oninput = "";
			if (directed && j > i) {
				oninput += `javascript:cascadeInput(this)`;
			}

			// self-pointing edges
			let readonly = "";
			if (i == j || (directed && j < i)) {
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

function cascadeInput(inputObject) {
	targetId = inputObject.id.split("-").reverse().join("-");
	document.getElementById(targetId).value = inputObject.value;
}
