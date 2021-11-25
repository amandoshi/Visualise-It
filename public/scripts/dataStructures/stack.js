/**
 * Class to create a stack data structure
 * @extends Queue
 */
class Stack extends Queue {
	/**
	 * Add item to top of stack
	 * @param {any} item - item to be added to stack
	 */
	addItem(item) {
		this.elements.unshift(item);
	}
}
