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

	// declare data structures
	let visitedNodes = new Array();
	let unvisitedNodes = new Array();

	// initilaise data structure
	visitedNodes.push(0);
	for (let i = 1; i < numberOfNodes; i++) {
		unvisitedNodes.push(i);
	}

	for (let i = 0; i < numberOfNodes; i++) {
		// select random unvisited node
		let selectedNode = 0;
		if (i != 0) {
			const randomUnvisitedIndex = randomInteger(0, unvisitedNodes.length - 1);
			selectedNode = unvisitedNodes.splice(randomUnvisitedIndex, 1)[0];

			// edge connection with random visited node
			const randomVisitedIndex = randomInteger(0, visitedNodes.length - 1);

			// generate edge weight
			let edgeWeight = 1;
			if (weighted) {
				edgeWeight = Math.ceil(Math.random() * numberOfNodes);
			}

			matrix[selectedNode][visitedNodes[randomVisitedIndex]] = edgeWeight;
			if (!directed || Math.random() < 0.3) {
				matrix[visitedNodes[randomVisitedIndex]][selectedNode] = edgeWeight;
			}

			// visit selected node
			visitedNodes.push(selectedNode);
		}

		const randomIndex = randomInteger(0, numberOfNodes - 1);

		// self-pointing node
		if (randomIndex == selectedNode) {
			continue;
		}

		// generate edge weight
		let edgeWeight = 1;
		if (weighted) {
			edgeWeight = Math.ceil(Math.random() * numberOfNodes);
		}

		matrix[selectedNode][randomIndex] = edgeWeight;
		if (!directed || Math.random() < 0.3) {
			matrix[randomIndex][selectedNode] = edgeWeight;
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
