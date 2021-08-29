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
	const inputObject = document.getElementById("nodeNames");

	// sync text areas' scroll
	lineObject.scrollTop = inputObject.scrollTop;
}

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
	}

	// send data
	const data = { names: JSON.stringify(Array.from(uniqueNames)) };
	postToUrl(data, postUrl);
}

function alertError(message) {
	return Swal.fire({
		confirmButtonColor: "#0088a9",
		icon: "error",
		text: message.text,
		title: message.title,
	});
}

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

window.addEventListener("load", fillLineCount);
