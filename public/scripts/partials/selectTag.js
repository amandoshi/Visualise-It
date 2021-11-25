/**
 * Class to create and manage custom select tag
 */
class SelectTag {
	#element;
	#id;
	#optionsContainerTag;
	#options;
	#optionTags;
	#selectedOption;
	#selectedTag;
	#searchBoxTag;

	/**
	 * Create select tag
	 * @param {String} selectTagId - HTML id of div
	 * @param {String[]} optionsArray - possible select options
	 * @param {String} message - message to display when no option is selected
	 */
	constructor(selectTagId, optionsArray, message) {
		this.#id = selectTagId;
		this.#element = document.getElementById(selectTagId);
		this.#options = optionsArray;
		this.#selectedOption = null;

		// initialise select tag
		this.#setupHTML(message);

		// reference to select tag elements
		this.#optionTags = this.#element
			.getElementsByClassName("options")[0]
			.getElementsByTagName("p");
		this.#optionsContainerTag =
			this.#element.getElementsByClassName("options_container")[0];
		this.#selectedTag = this.#element.getElementsByClassName("selected")[0];
		this.#searchBoxTag =
			this.#element.getElementsByClassName("search_box_input")[0];

		// exit clicks
		window.addEventListener("click", (e) => {
			if (
				!this.#optionsContainerTag.contains(e.target) &&
				!this.#selectedTag.contains(e.target) &&
				!this.#searchBoxTag.contains(e.target) &&
				this.#optionsContainerTag.classList.contains("active")
			) {
				this.#optionsContainerTag.classList.toggle("active");
				this.#selectedTag.classList.toggle("active");

				// empty search box
				this.#searchBoxTag.value = "";

				for (const option of this.#optionTags) {
					// display all options
					option.style.display = "block";
				}
			}
		});

		this.#searchBoxTag.addEventListener("keyup", (e) => {
			this.#updateSearch(e.target.value);
		});

		SelectTag.addTag(this);
	}

	/**
	 * Store reference of select tags
	 * @param {SelectTag} tag - select tag object to store
	 */
	static addTag(tag) {
		if (!this.tags) {
			this.tags = new Array();
		}

		this.tags.push(tag);
	}

	/**
	 * Toggle (open/close) select tag
	 * @param {Object} selectedTag - reference to select tag HTML element
	 */
	static toggleSelect(selectedTag) {
		let selectTag;
		const id = selectedTag.getAttribute("selectTagId");
		for (const tag of this.tags) {
			if (id == tag.id) {
				selectTag = tag;
				break;
			}
		}

		selectTag.optionsContainerTag.classList.toggle("active");
		selectTag.selectedTag.classList.toggle("active");
		selectTag.searchBoxTag.focus();
	}

	/**
	 * Update current selected option
	 * @param {Object} optionTag - reference to option tag HTML element
	 */
	static updateSelected(optionTag) {
		let selectTag;
		const id = optionTag.getAttribute("selectTagId");
		for (const tag of this.tags) {
			if (id == tag.id) {
				selectTag = tag;
				break;
			}
		}

		const selectedOptionIndex = optionTag.getAttribute("value");
		const selectedOptionName = selectTag.options[selectedOptionIndex];

		// update selected option
		selectTag.selectedOption = selectedOptionIndex;

		// update selected tag
		selectTag.selectedTag.getElementsByTagName("p")[0].innerText =
			selectedOptionName;

		// close options
		selectTag.optionsContainerTag.classList.remove("active");
		selectTag.selectedTag.classList.remove("active");

		// empty search box
		selectTag.searchBoxTag.value = "";

		for (const option of selectTag.optionTags) {
			// display all options
			option.style.display = "block";

			// highlight selected option
			if (option.getAttribute("value") == selectedOptionIndex) {
				option.classList.add("highlight");
			} else {
				option.classList.remove("highlight");
			}
		}
	}

	/**
	 * Create select tag in HTML document and display
	 * @param {String} message - message to display when no option is selected
	 */
	#setupHTML(message) {
		let html = "";

		// div:selected open
		html += `<div class="selected" onclick="javascript: SelectTag.toggleSelect(this)" `;
		html += `selectTagId="${this.#id}">`;

		html += `<p>${message}</p>`;
		html += `<img src="/images/arrow.png">`;

		// div:selected close
		html += "</div>";

		// open div:options container
		html += `<div class="options_container">`;

		// div:search box
		html += `<div class="search_box"><input class="search_box_input" placeholder="Search..." type="text" ></div>`;

		// open div:options
		html += `<div class="options">`;

		// add options
		for (let i = 0; i < this.#options.length; i++) {
			html += `<p class="option" onclick="javascript: SelectTag.updateSelected(this)" `;
			html += `selectTagId="${this.#id}" value="${i}">${this.#options[i]}</p>`;
		}

		// close div:options
		html += `</div>`;

		// close div:options container
		html += `</div>`;

		this.#element.innerHTML = html;
	}

	/**
	 * Search and display options matching search term
	 * @param {String} searchTerm - option to search
	 */
	#updateSearch(searchTerm) {
		searchTerm = searchTerm.toLowerCase();

		// loop through options
		for (const option of this.#optionTags) {
			if (
				this.#options[option.getAttribute("value")].indexOf(searchTerm) != -1
			) {
				option.style.display = "block";
			} else {
				option.style.display = "none";
			}
		}
	}

	/**
	 * Get select tag HTML id
	 * @returns {String} - select tag HTML id
	 */
	get id() {
		return this.#id;
	}

	/**
	 * Get all options
	 * @returns {String[]} - array of select tag options
	 */
	get options() {
		return this.#options;
	}

	/**
	 * Get reference to all HTML option tags
	 * @returns {Object[]} - array of references to HTML option tags
	 */
	get optionTags() {
		return this.#optionTags;
	}

	/**
	 * Get reference to HTML options container
	 * @returns {Object} - reference to HTML options container
	 */
	get optionsContainerTag() {
		return this.#optionsContainerTag;
	}

	/**
	 * Get reference to HTML search box
	 * @returns {Object} - reference to HTML search box
	 */
	get searchBoxTag() {
		return this.#searchBoxTag;
	}

	/**
	 * Get selected option of select tag
	 * @returns {String} - selected option
	 */
	get selectedOption() {
		return this.#selectedOption;
	}

	/**
	 * Get reference to HTML selected tag
	 * @returns {Object} - reference to HTML selected tag
	 */
	get selectedTag() {
		return this.#selectedTag;
	}

	/**
	 * Set current, selected option
	 * @param {String} value - current, selected option
	 */
	set selectedOption(value) {
		this.#selectedOption = value;
	}
}
