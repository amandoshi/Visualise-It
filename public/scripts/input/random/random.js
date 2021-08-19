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

function setupSlider() {
	// get slider as object
	const slider = document.getElementById("slider");

	// update slider on input
	slider.oninput = () => {
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
}

window.onload = () => {
	setupToggle();
	setupSlider();
};
