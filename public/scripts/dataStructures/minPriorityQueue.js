/**
 * Class to create minimum priority queue data structure
 * @extends Queue (implicitly)
 */
class MinPriorityQueue {
	#heap;

	/**
	 * Construct minimum priority queue using a heap
	 */
	constructor() {
		this.#heap = new Heap((a, b) => {
			return a.priority < b.priority;
		});
	}

	/**
	 * Add item to minimum priority queue
	 * @param {any} item - item to insert into minimum priority queue
	 * @param {Number} priority - priority of item, lower number means higher priority
	 */
	addItem(item, priority) {
		this.#heap.addItem({
			priority,
			value: item,
		});
	}

	/**
	 * Get next item from minimum priority queue
	 * @returns {any} - item at front of minimum priority queue
	 */
	removeItem() {
		return this.#heap.removeItem().value;
	}

	/**
	 * Determine if minimum priority queue is empty
	 * @returns {Boolean} - true if minimum priority queue is empty, false if minimum priority queue is not empty
	 */
	isEmpty() {
		return this.#heap.isEmpty();
	}

	/**
	 * Get all items in minimum prioirity queue
	 * @returns {any[]} - array of items in minimum priority queue
	 */
	get elements() {
		return this.#heap.elements.map((item) => item.value);
	}
}
