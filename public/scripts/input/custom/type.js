let directed, directedObj, undirectedObj;
let weighted, weightedObj, unweightedObj;

function updateToggle() {
	if (weighted) {
		weightedObj.classList.add("selected");
		unweightedObj.classList.remove("selected");
	} else {
		unweightedObj.classList.add("selected");
		weightedObj.classList.remove("selected");
	}

	if (directed) {
		directedObj.classList.add("selected");
		undirectedObj.classList.remove("selected");
	} else {
		undirectedObj.classList.add("selected");
		directedObj.classList.remove("selected");
	}
}

function setToggle(state, type) {
	if (type == "weighted") {
		weighted = state;
	} else if (type == "directed") {
		directed = state;
	}
}

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
