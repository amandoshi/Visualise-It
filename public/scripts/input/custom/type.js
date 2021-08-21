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

function submit(type) {
	const data = { directed, type, weighted };
	postToUrl(data, "/input/custom");
}

window.onload = () => {
	setupNavbar();

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
