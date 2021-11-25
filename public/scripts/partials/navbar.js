/**
 * Add styling as CSS to page
 * @param {String} styles - styles to add, structured as css
 */
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

/**
 * Update the pixel width of navbar to fit entire window
 */
function updateNavbarWidth() {
	const width = window.innerWidth;
	addStyle(`.navbar { width: ${width}px }`);
}

/**
 * Update navbar width dynamically when window width changes
 */
function setupNavbar() {
	updateNavbarWidth();
	window.addEventListener("resize", updateNavbarWidth);
}

window.addEventListener("load", setupNavbar);
