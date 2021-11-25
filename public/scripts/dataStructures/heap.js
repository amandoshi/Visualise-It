/**
 * Class to create a heap data structure (binary tree)
 * @extends Queue (implicity)
 */
class Heap {
	#elements;
	#compare;

	/**
	 * Construct heap data structure
	 * @param {Function} compare - function to compare items in heap
	 */
	constructor(compare) {
		this.#elements = new Array();
		this.#compare = compare;
	}

	/**
	 * Restructure tree from particular node (downwards)
	 * @param {Number} index - node to restructure tree from (downwards)
	 */
	#siftdown(index) {
		while (index * 2 + 1 < this.#elements.length) {
			// select child
			let childCompareIndex;
			const childOneIndex = index * 2 + 1;
			const childTwoIndex = index * 2 + 2;

			if (childTwoIndex < this.#elements.length) {
				childCompareIndex = this.#compare(
					this.#elements[childOneIndex],
					this.#elements[childTwoIndex]
				)
					? childOneIndex
					: childTwoIndex;
			} else {
				childCompareIndex = childOneIndex;
			}

			// compare current node with selected child node
			if (
				this.#compare(this.#elements[childCompareIndex], this.#elements[index])
			) {
				this.#swap(index, childCompareIndex);
				index = childCompareIndex;
			} else {
				break;
			}
		}
	}

	/**
	 * Restructure tree from particular node (upwards)
	 * @param {Number} index - node to restructure tree from (upwards)
	 */
	#siftup(index) {
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);

			// compare current node with parent node
			if (this.#compare(this.#elements[index], this.#elements[parentIndex])) {
				this.#swap(index, parentIndex);
				index = parentIndex;
			} else {
				break;
			}
		}
	}

	/**
	 * Swap to nodes in binary tree
	 * @param {Number} i - node to swap (1)
	 * @param {Number} j - node to swap (2)
	 */
	#swap(i, j) {
		const array = this.#elements;

		// destructuring assignment
		// for more information:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
		[array[i], array[j]] = [array[j], array[i]];
	}

	/**
	 * Add item to heap
	 * @param {any} item - item to add to heap
	 */
	addItem(item) {
		this.#elements.push(item);

		const itemIndex = this.#elements.length - 1;
		this.#siftup(itemIndex);
	}

	/**
	 * Get next item from heap
	 * @returns {any} - item from top of binary tree
	 */
	removeItem() {
		const root = this.#elements[0];
		const lastItem = this.#elements.pop(this.#elements.length - 1);

		if (!this.isEmpty()) {
			this.#elements[0] = lastItem;
			this.#siftdown(0);
		}

		return root;
	}

	/**
	 * Determine if heap is empty
	 * @returns {Boolean} - true if heap is empty, false if heap is not empty
	 */
	isEmpty() {
		return this.#elements.length == 0;
	}

	/**
	 * Get elements in binary heap
	 * @returns {any[]} - items stored in heap (binary tree)
	 */
	get elements() {
		return this.#elements;
	}
}
