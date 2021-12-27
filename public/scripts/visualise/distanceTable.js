/**
 * Setup HTML distance table using static data
 */
function setupDistanceTable() {
	let html = "";

	// open: header row  div
	html += `<div class="row first">`;

	// table headers
	html += "<p>node</p>";
	html += "<p>distance from start node</p>";
	html += "<p>previous node</p>";

	// close: header row div
	html += "</div>";

	for (let i = 0; i < nodeNames.length; i++) {
		// construct row classes
		let rowClass = "row";
		if (i == nodeNames.length - 1) {
			rowClass += " last";
		}

		// open: row div
		html += `<div class="${rowClass}">`;

		// compile content
		let distance = distanceTable[i].distance;
		if (distance == null) {
			distance = "∞";
		}

		let previousNode;
		if (distanceTable[i].previousNode != null) {
			previousNode = nodeNames[distanceTable[i].previousNode];
		} else {
			previousNode = "-";
		}

		// add content
		html += `<p>${nodeNames[i]}</p>`;
		html += `<p>${distance}</p>`;
		html += `<p>${previousNode}</p>`;

		// close: row div
		html += "</div>";
	}

	document.getElementById("distanceTable").innerHTML = html;
}
