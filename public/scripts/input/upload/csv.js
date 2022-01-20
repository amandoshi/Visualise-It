let file;
let weighted;

/**
 * Update file name displayed in HTML document
 */
function updateFileName() {
	let fileName;

	// get file name
	try {
		fileName = file.files[0].name;
	} catch (error) {
		fileName = "Drag and drop files or click here";
	}

	// update file name
	document.getElementById("fileName").innerText = fileName;
}

/**
 * Process csv file, format check, and post graph matrix for visualisation
 * @returns {null} - unable to upload file
 */
function submit() {
	// check file uploaded
	let fileName;
	try {
		fileName = file.files[0].name;
	} catch (error) {
		return alertError({
			text: "A CSV file must be uploaded",
			title: "No file uploaded...",
		});
	}

	// check if file is a csv file
	if (!/.csv$/.test(fileName)) {
		return alertError({
			text: "A CSV file must be uploaded",
			title: "Invalid file format...",
		});
	}

	// read csv file
	const csvReader = new FileReader();
	csvReader.onload = () => {
		let csvData = csvReader.result.split("\r\n");

		// format csv data
		for (let i = csvData.length - 1; i > -1; i--) {
			if (csvData[i]) {
				// convert row string to array
				csvData[i] = csvData[i].split(",");
			} else {
				// remove empty rows
				csvData.splice(i, 1);
			}
		}

		// check file format
		const validFormat = checkCsvFormat(csvData);
		if (!validFormat.result) {
			return alertError({
				text: validFormat.message,
				title: "Format Error",
			});
		}

		// compile data
		const nodeNames = csvData.splice(0, 1)[0];
		const matrix = csvData.map((row) => {
			return row.map((cell) => parseInt(cell));
		});
		const data = {
			nodeNames: JSON.stringify(nodeNames),
			matrix: JSON.stringify(matrix),
			weighted,
		};

		postToUrl(data, "/visualise");
	};

	csvReader.readAsBinaryString(file.files[0]);
}

/**
 * Check if format of data from csv file is valid
 * @param {String[][]} csvData - node name (row 1), adjacency matrix (row 2-n)
 * @returns {Object.message} - string; error message if CSV format is invalid
 * @returns {Object.result} - boolean; true if csv file is in the correct format,
 * 									   false if csv file is not in the correct format
 */
function checkCsvFormat(csvData) {
	// graph information
	const minNumberOfNodes = 2;
	weighted = false;
	let matrixSize = csvData.length - 1;

	if (matrixSize > maxNumberOfNodes) {
		return {
			message: `Number of nodes exceeds maximum of ${maxNumberOfNodes} nodes`,
			result: false,
		};
	} else if (matrixSize < minNumberOfNodes) {
		return {
			message: `Number of nodes in file does not meet the required ${minNumberOfNodes} nodes for graph visualisation`,
			result: false,
		};
	}

	// check node names format
	const nodeNames = new Set(csvData[0]);
	if (nodeNames.size != matrixSize) {
		return {
			message: "Invalid number of unique node names.",
			result: false,
		};
	}

	for (let i = 0; i < matrixSize; i++) {
		if (!isWord(csvData[0][i]) || csvData[0][i].length > maxNodeNameLength) {
			let message = "Invalid node name format. ";
			message += "Node names must only contain alphanumeric characters and ";
			message += `must not exceed the maximum length of ${maxNodeNameLength} characters.`;

			return {
				message,
				result: false,
			};
		}
	}

	// check matrix format
	for (let i = 1; i < csvData.length; i++) {
		// row length
		if (csvData[i].length != matrixSize) {
			return {
				message: "Invalid adjacency matrix format.",
				result: false,
			};
		}

		// cell data
		for (let j = 0; j < matrixSize; j++) {
			if (!isInteger(csvData[i][j])) {
				return {
					message: "Edge weights must be positive integers.",
					result: false,
				};
			} else if (i - 1 == j && csvData[i][j] != 0) {
				return {
					message: "Graph must not contain self-pointing nodes.",
					result: false,
				};
			} else if (parseInt(csvData[i][j]) > maxEdgeWeight) {
				return {
					message: `Edge weights cannot exceed maximum value of ${maxEdgeWeight}.`,
					result: false,
				};
			}

			// update graph information
			if (!weighted && csvData[i][j] != 0 && csvData[i][j] != 1) {
				weighted = true;
			}
		}
	}

	return {
		message: "",
		result: true,
	};
}

window.addEventListener("load", () => {
	file = document.getElementById("file");
	file.addEventListener("change", updateFileName);
	updateFileName();
});
