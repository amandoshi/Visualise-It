/**
 * Class to create and keep track of Depth-first Search (DFS) algorithm
 * @extends BFS
 */
class DFS extends BFS {
	/**
	 * Construct Breadth-first Sarch algorithm
	 * Change unvisited nodes data structure from Queue to Stack
	 * @param {Graph} graph - graph data structure to traverse
	 * @param {Number} startNode - start node to traverse from
	 * @param {Number} targetNode - target node of traversal
	 */
	constructor(graph, startNode, targetNode) {
		super(graph, startNode, targetNode);

		this.unvisitedNodes = new Stack();
	}
}
