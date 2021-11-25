let directed, directedObj, undirectedObj;
let weighted, weightedObj, unweightedObj;

/**
 * Update weighted and directed toggles, shown in HTML document, to current state
 */
function updateToggle() {
	if (directed) {
		directedObj.classList.add("selected");
		undirectedObj.classList.remove("selected");
	} else {
		undirectedObj.classList.add("selected");
		directedObj.classList.remove("selected");
	}

	if (weighted) {
		weightedObj.classList.add("selected");
		unweightedObj.classList.remove("selected");
	} else {
		unweightedObj.classList.add("selected");
		weightedObj.classList.remove("selected");
	}
}

/**
 * Set a graph property, one of [directed, weighted]
 * @param {Boolean} state - true if graph directed/weighted,
 * 							false if graph undirected/unweighted
 * @param {String} type - graph parameter to set, one of [directed, weighted]
 */
function setToggle(state, type) {
	if (type == "weighted") {
		weighted = state;
	} else if (type == "directed") {
		directed = state;
	}
}

/**
 * Setup and display toggles in HTML document
 */
function setupToggle() {
	// default values
	directed = false;
	weighted = false;

	// get toggles as objects
	weightedObj = document.getElementById("weighted");
	unweightedObj = document.getElementById("unweighted");
	directedObj = document.getElementById("directed");
	undirectedObj = document.getElementById("undirected");

	// set toggle's onclick attributes
	weightedObj.addEventListener("click", () => {
		setToggle(true, "weighted");
		updateToggle();
	});
	unweightedObj.addEventListener("click", () => {
		setToggle(false, "weighted");
		updateToggle();
	});
	directedObj.addEventListener("click", () => {
		setToggle(true, "directed");
		updateToggle();
	});
	undirectedObj.addEventListener("click", () => {
		setToggle(false, "directed");
		updateToggle();
	});

	updateToggle();
}

/**
 * Setup slider in HTML document
 * Slider displays number of nodes in random graph
 */
function setupSlider() {
	// get slider as object
	const slider = document.getElementById("slider");

	const updateSlider = () => {
		// get node count as object
		const val = document.getElementById("sliderValue");

		// get slider value
		const num = parseInt(slider.value).toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		});

		// update node count
		val.innerText = `${num} Nodes`;
	};

	slider.oninput = updateSlider;
	updateSlider();
}

/**
 * Generate random adjacency matrix of size specified by NumberOfNodes variable
 * @param {Number} numberOfNodes - number of nodes in random graph
 * @returns {Number[][]} - adjacency matrix
 */
function randomGraphMatrix(numberOfNodes) {
	let matrix = new Array(numberOfNodes);

	for (let i = 0; i < numberOfNodes; i++) {
		// generate row
		let matrixRow = new Array(numberOfNodes);
		matrixRow.fill(0);

		// add row
		matrix[i] = matrixRow;
	}

	// random connection for first node
	for (let i = 0; i < numberOfNodes; i++) {
		// connect node to previous nodes
		if (i != 0) {
			const connectedNode = randomInteger(0, i - 1);

			let weight;
			if (weighted) {
				weight = Math.ceil(Math.random() * numberOfNodes);
			} else {
				weight = 1;
			}

			if (!directed || Math.random() < 0.3) {
				matrix[connectedNode][i] = weight;
			}

			matrix[i][connectedNode] = weight;
		}

		// link node to new node
		const connectedNode = randomInteger(0, numberOfNodes - 1);

		if (connectedNode != i) {
			let weight;
			if (weighted) {
				weight = Math.ceil(Math.random() * numberOfNodes);
			} else {
				weight = 1;
			}

			// create undirected (two-way) edge if graph is undirected
			// 30% chance of undirected edge if graph is directed
			if (!directed || Math.random() < 0.3) {
				matrix[connectedNode][i] = weight;
			}

			matrix[i][connectedNode] = weight;
		}
	}

	return matrix;
}

/**
 * Generate random integer in a given range
 * @param {Number} min - lower bound of random integer
 * @param {Number} max - upper bound of random integer
 * @returns {Number} - random intger
 */
function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Post random adjacency matrix for visualisation
 */
function submitForm() {
	const graphSize = parseInt(document.getElementById("slider").value);
	const matrix = randomGraphMatrix(graphSize);

	let nodeNames = new Array(graphSize);
	for (let i = 0; i < graphSize; i++) {
		nodeNames[i] = (i + 1).toString();
	}

	// send data
	const data = {
		weighted,
		nodeNames: JSON.stringify(nodeNames),
		matrix: JSON.stringify(matrix),
	};

	postToUrl(data, "/visualise");
}

window.onload = () => {
	setupToggle();
	setupSlider();
};
