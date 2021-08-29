function addStyle(styles) {
	// Create style document
	let css = document.createElement("style");

	if (css.styleSheet) {
		css.styleSheet.cssText = styles;
	} else {
		css.appendChild(document.createTextNode(styles));
	}

	// Append style to tag name
	document.getElementsByTagName("head")[0].appendChild(css);
}

function updateNavbarWidth() {
	const width = window.innerWidth;
	addStyle(`.navbar { width: ${width}px }`);
}

function setupNavbar() {
	updateNavbarWidth();
	window.addEventListener("resize", updateNavbarWidth);
}

window.addEventListener("load", setupNavbar);
