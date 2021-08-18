let file;

function updateFileName() {
	let fileName;

	// get file name
	try {
		fileName = this.files[0].name;
	} catch (error) {
		fileName = "Drag and drop files or click here";
	}

	// update file name
	document.getElementById("fileName").innerText = fileName;
}

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

	// check csv file
	if (!/.csv$/.test(fileName)) {
		return alertError({
			text: "A CSV file must be uploaded",
			title: "Invalid file format...",
		});
	}
}

function alertError(message) {
	return Swal.fire({
		confirmButtonColor: "#0088a9",
		icon: "error",
		text: message.text,
		title: message.title,
	});
}

window.onload = () => {
	file = document.getElementById("file");
	file.addEventListener("change", updateFileName);
};
