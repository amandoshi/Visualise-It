/**
 * Class to create queue data structure
 */
class Queue {
	#elements;

	/**
	 * Construct queue data structure
	 */
	constructor() {
		this.#elements = new Array();
	}

	/**
	 * Add item to queue
	 * @param {any} item - item to be added at end of queue
	 */
	addItem(item) {
		this.#elements.push(item);
	}

	/**
	 * Determine if queue is empty
	 * @returns {Boolean} - true if queue is empty, false if queue is not empty
	 */
	isEmpty() {
		return this.#elements.length == 0;
	}

	/**
	 * Get the next item from queue
	 * @returns {any} - item at front of queue
	 */
	removeItem() {
		return !this.isEmpty() ? this.#elements.shift() : undefined;
	}

	/**
	 * Get elements in queue
	 * @returns {any[]} - items in queue
	 */
	get elements() {
		return this.#elements;
	}
}
