/**
 * Class to create and keep track of Dijkstra's Shortest Path algorithm
 * @extends BFS (implicitly)
 */
class Dijkstra {
	#distanceTable;
	#graph;
	#startNode;
	#targetNode;
	#unvisitedNodes;
	#visitedNodes;
	#targetFound;
	#traversal;

	/**
	 * Construct Dijkstra algorithm
	 * @param {Graph} graph - graph data structure to traverse
	 * @param {Number} startNode - start node to traverse from
	 * @param {Number} targetNode - target node of traversal
	 */
	constructor(graph, startNode, targetNode) {
		// parameters
		this.#graph = graph;
		this.#startNode = startNode;
		this.#targetNode = targetNode;

		// presets
		this.#targetFound = false;

		// initialise data structures
		this.#distanceTable = new Array(this.#graph.size);
		this.#unvisitedNodes = new MinPriorityQueue();
		this.#visitedNodes = new Array(this.#graph.size);

		// setup data structures
		this.#distanceTable[startNode] = { distance: 0, previousNode: startNode };
		for (let i = 0; i < this.#distanceTable.length; i++) {
			if (i != startNode) {
				this.#distanceTable[i] = { distance: Infinity, previousNode: null };
			}
		}

		this.#unvisitedNodes.addItem(startNode, 0);

		this.#visitedNodes.fill(false);
		this.#visitedNodes[startNode] = true;

		// setup traversal
		this.#traversal = this.#run();
	}

	/**
	 * Generator function running Dijkstra's algorithhm
	 * Generator pauses when minimum prioirity queue is updated, unvisited node is found, or new connection found between visited nodes
	 * @returns {null} - end generator function when traversal complete
	 */
	*#run() {
		yield;

		while (!this.#unvisitedNodes.isEmpty()) {
			const currentNode = this.#unvisitedNodes.removeItem();
			const neighbourNodes = this.#graph.neighbours(currentNode);

			// pause method to display updated minimum priority queue
			yield;

			for (let i = 0; i < neighbourNodes.length; i++) {
				const neighbourNode = neighbourNodes[i].node;
				const neighbourWeight = neighbourNodes[i].weight;
				let data = null;
				let yieldData = false;

				if (!this.#visitedNodes[neighbourNode]) {
					// visit node if unvisited
					this.#unvisitedNodes.addItem(neighbourNode, neighbourWeight);
					this.#visitedNodes[neighbourNode] = true;

					// compile data
					yieldData = true;
					data = {
						node: neighbourNode,
						edge: this.#graph.connection(currentNode, neighbourNode),
					};
				} else if (
					!visualiser.checkVisited(
						this.#graph.connection(currentNode, neighbourNode)
					)
				) {
					// new connection found between visited nodes

					// compile data
					yieldData = true;
					data = {
						node: neighbourNode,
						edge: this.#graph.connection(currentNode, neighbourNode),
					};
				}

				// check if target node found
				if (!this.#targetFound && neighbourNode == this.#targetNode) {
					this.#targetFound = true;
				}

				// shortest path
				let alterantePathDistance =
					this.#distanceTable[currentNode].distance + neighbourWeight;

				if (
					alterantePathDistance < this.#distanceTable[neighbourNode].distance
				) {
					// store new path
					this.#distanceTable[neighbourNode].distance = alterantePathDistance;
					this.#distanceTable[neighbourNode].previousNode = currentNode;

					yieldData = true;
				}

				if (yieldData) {
					yield data;
				}
			}
		}
		return;
	}

	/**
	 * Iterate Dijkstra's algorithm and return updates
	 * @returns {Object} - indicates if traversal is running ({Boolean} active); updates to traversal ({Object} data)
	 */
	next() {
		const state = this.#traversal.next();

		const active = !state.done;
		const data = state.value ? state.value : null;

		return { active, data };
	}

	/**
	 * Get distance table
	 * @returns {Object[]} - each item in array contains distance to node (from mstart node) and previous node
	 */
	get distanceTable() {
		return this.#distanceTable;
	}

	/**
	 * Get final path from start node to target node, if the target node is visited
	 * Path is generated by back tracking from target node to start node
	 * @returns {Number[]} - final path of nodes (chronological order)
	 */
	get finalPath() {
		if (!this.#targetFound) {
			return [];
		}

		let path = new Array();
		path.push(this.#targetNode);

		let nextNode = this.#targetNode;

		// generate final path
		while (nextNode != this.#startNode) {
			nextNode = this.#distanceTable[nextNode].previousNode;
			path.unshift(nextNode);
		}

		return path;
	}

	/**
	 * Get start node of traversal
	 * @returns {Number} - start node
	 */
	get startNode() {
		return this.#startNode;
	}

	/**
	 * Determine if target node is found
	 * @returns {Boolean} - true if target node is found, false if target node is not found
	 */
	get targetFound() {
		return this.#targetFound;
	}

	/**
	 * Get target node of traversal
	 * @returns {Number} - target node
	 */
	get targetNode() {
		return this.#targetNode;
	}

	/**
	 * Get all unvisited nodes currently in minimum priority queue
	 * @returns {Number[]} - unvisited nodes in minimum priority queue
	 */
	get unvisitedNodes() {
		return this.#unvisitedNodes.elements;
	}
}
