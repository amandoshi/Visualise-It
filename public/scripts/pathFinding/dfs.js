/**
 * Class to create and keep track of Depth-first Search (DFS) algorithm
 * @extends BFS
 * Class to create and keep track of Breadth-first Search (DFS) algorithm
 */
class DFS extends BFS {
	
	/**
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