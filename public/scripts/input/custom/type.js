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
 * Post graph properties and redirect to new page
 * @param {String} type
 */
function submit(type) {
	const data = { directed, type, weighted };
	postToUrl(data, "/input/custom");
}

/**
 * Setup HTML page when loaded
 * Setup toggles
 * Add click listeners to toggles
 */
window.onload = () => {
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
};
