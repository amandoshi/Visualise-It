/**
 * Class to create and keep track of Breadth-first Search (DFS) algorithm
 */
class DFS {
	#graph;
	#previousNodes;
	#startNode;
	#targetFound;
	#targetNode;
	#traversal;
	#unvisitedNodes;
	#visitedNodes;

	/**
	 * Construct Breadth-first Sarch algorithm
	 * @param {Graph} graph - graph data structure to traverse
	 * @param {Number} startNode - start node to traverse from
	 * @param {Number} targetNode - target node of traversal
	 */
	constructor(graph, startNode, targetNode) {
		// paramaters
		this.#graph = graph;
		this.#startNode = startNode;
		this.#targetNode = targetNode;

		// presets
		this.#targetFound = false;

		// data structures
		this.#previousNodes = new Object();
		this.#previousNodes[startNode] = startNode;

		this.#unvisitedNodes = new Stack();
		this.#unvisitedNodes.addItem(startNode);

		this.#visitedNodes = new Array(graph.size);
		this.#visitedNodes.fill(false);
		this.#visitedNodes[startNode] = true;

		// start traversal
		this.#traversal = this.#run();

		// first iteration does not progress DFS algorithm
		this.#traversal.next();
	}

	/**
	 * Generator function running DFS, pauses when Queue is updated or unvisited node is found
	 * @returns {null} - end generator function when traversal complete
	 */
	*#run() {
		if (!this.#unvisitedNodes.isEmpty() && !this.#targetFound) {
			const currentNode = this.#unvisitedNodes.removeItem();
			const neighbourNodes = this.#graph.neighbours(currentNode);
			
			// pause method to display updated queue
			yield;

			for (let i = 0; i < neighbourNodes.length; i++) {
				if (this.#targetFound) {
					break;
				}

				const neighbourNode = neighbourNodes[i].node;
				if (!this.#visitedNodes[neighbourNode]) {
					this.#previousNodes[neighbourNode] = currentNode;
					this.#unvisitedNodes.addItem(neighbourNode);
					this.#visitedNodes[neighbourNode] = true;

					const data = {
						node: neighbourNode,
						edge: this.#graph.connection(currentNode, neighbourNode),
					};

					yield data;

					// traversal complete
					if (neighbourNode == this.#targetNode) {
						this.#targetFound = true;
					}

					yield* this.#run()
				}
			}
		}
	}

	/**
	 * Iterate DFS traversal and return updates
	 * @returns {Object} - indicates if traversal is running ({Boolean} active); updates to traversal ({Object} data)
	 */
	next() {
		const state = this.#traversal.next();
		const active = state.done ? false : true;
		const data = state.value ? state.value : null;

		return { active, data };
	}

	/**
	 * Get final path from start node to target node, if the target node is visited
	 * @returns {Number[]} - final path of nodes (chronological order)
	 */
	get finalPath() {
		if (!this.#targetFound) {
			return [];
		}

		// setup final path
		let path = new Array();
		path.push(this.#targetNode);

		// generate remaining path
		let nextNode = this.#targetNode;
		while (nextNode != this.#startNode) {
			nextNode = this.#previousNodes[nextNode];
			path.unshift(nextNode);
		}

		return path;
	}

	/**
	 * Determine if target node is found
	 * @returns {Boolean} - true if target node is found, false if target node is not found
	 */
	get targetFound() {
		return this.#targetFound;
	}

	/**
	 * Get all unvisited nodes currently in queue
	 * @returns {Number[]} - unvisited nodes
	 */
	get unvisitedNodes() {
		return this.#unvisitedNodes.elements;
	}

	/**
	 * Get start node for DFS
	 * @returns {Number} - start node
	 */
	get startNode() {
		return this.#startNode;
	}

	/**
	 * Get target node for DFS
	 * @returns {Number} - target node
	 */
	get targetNode() {
		return this.#targetNode;
	}

	/**
	 * Set unvisited nodes of traversal
	 * @param {any} - unvisited nodes
	 */
	set unvisitedNodes(value) {
		this.#unvisitedNodes = value;
	}
}
