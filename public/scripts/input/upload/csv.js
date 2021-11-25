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
		if (!validFormat) {
			return alertError({
				text: "CSV file format is invalid",
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
 * @returns {Boolean} - true if csv file is in the correct format, false if csv file is not in the correct format
 */
function checkCsvFormat(csvData) {
	// graph information
	weighted = false;
	let matrixSize = csvData.length - 1;

	if (matrixSize > maxNumberOfNodes) {
		return false;
	}

	// check node names format
	if (csvData[0].length != matrixSize) {
		return false;
	}

	for (let i = 0; i < matrixSize; i++) {
		if (!isWord(csvData[0][i]) || csvData[0][i].length > maxNodeNameLength) {
			return false;
		}
	}

	// check matrix format
	for (let i = 1; i < csvData.length; i++) {
		// row length
		if (csvData[i].length != matrixSize) {
			return false;
		}

		// cell data
		for (let j = 0; j < matrixSize; j++) {
			if (!isInteger(csvData[i][j])) {
				return false;
			} else if (i - 1 == j && csvData[i][j] != 0) {
				return false;
			} else if (parseInt(csvData[i][j]) > maxEdgeWeight) {
				return false;
			}

			// update graph information
			if (!weighted && csvData[i][j] != 0 && csvData[i][j] != 1) {
				weighted = true;
			}
		}
	}

	return true;
}

window.addEventListener("load", () => {
	file = document.getElementById("file");
	file.addEventListener("change", updateFileName);
	updateFileName();
});
