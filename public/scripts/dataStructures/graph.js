/**
 * Class to create graph data structure
 */
class Graph {
	#directed;
	#weighted;
	#matrix;
	#nodeNames;

	/**
	 * Construct graph data structure
	 * @param {Boolean} weighted - true if weighted graph, false if unweighted graph
	 */
	constructor(weighted) {
		this.#weighted = weighted;
	}

	/**
	 * Get Cytoscape edge connection data
	 * @param {Number} i - start node
	 * @param {Number} j - target node
	 * @returns {Object} - Cytoscape data for an edge connection
	 */
	#cyEdgeData(i, j) {
		return {
			data: {
				finalPath: false,
				id: `${i}-${j}`,
				name: `${this.#nodeNames[i]}-${this.#nodeNames[j]}`,
				source: i.toString(),
				target: j.toString(),
				type: "edge",
				visited: false,
				weight: this.#matrix[i][j],
			},
		};
	}

	/**
	 * Setup an empty adjacency matrix
	 */
	#setupGraphMatrix() {
		this.#matrix = new Array(this.size);
		for (let i = 0; i < this.size; i++) {
			let row = new Array(this.size);
			row.fill(0);
			this.#matrix[i] = row;
		}
	}

	/**
	 * Get the Cytoscape edge id between two nodes
	 * @param {Number} i - start node
	 * @param {Number} j - target node
	 * @returns {String} - Cytoscape edge id
	 */
	connection(i, j) {
		let edge = [i, j];

		if (this.#matrix[i][j] == this.#matrix[j][i]) {
			// undirected edge
			edge = edge.sort((a, b) => a - b);
		}

		// return edge id
		return `${edge[0]}-${edge[1]}`;
	}

	/**
	 * Get neighbours of a node
	 * @param {Number} node - node value
	 * @returns {Object[]} - neighbour nodes and weight of edges (if graph is weighted)
	 */
	neighbours(node) {
		let neighbours = new Array();

		for (let i = 0; i < this.#matrix.length; i++) {
			if (this.#matrix[node][i]) {
				let neighbourData = { node: i };

				// weighted edge
				if (this.#weighted) {
					neighbourData.weight = this.#matrix[node][i];
				}

				neighbours.push(neighbourData);
			}
		}

		return neighbours;
	}

	/**
	 * Get all Cytoscape node data
	 * @returns {Object[]} - Cytoscape node data
	 */
	get cyNodes() {
		let nodes = new Array();

		// cytoscape node data
		for (let i = 0; i < this.#nodeNames.length; i++) {
			nodes.push({
				data: {
					finalPath: false,
					id: i,
					name: this.#nodeNames[i],
					type: "node",
					visited: false,
				},
			});
		}

		return nodes;
	}

	/**
	 * Get all Cytoscape edge data
	 * @returns {Object[]} - Cytoscape edge data
	 */
	get cyEdges() {
		let edges = new Array();

		// cytoscape edge data
		for (let i = 0; i < this.#nodeNames.length; i++) {
			for (let j = i + 1; j < this.#nodeNames.length; j++) {
				if (this.#matrix[i][j]) {
					const edge = this.#cyEdgeData(i, j);
					edges.push(edge);
				}

				if (this.#matrix[i][j] != this.#matrix[j][i] && this.#matrix[j][i]) {
					const alternateEdge = this.#cyEdgeData(j, i);
					edges.push(alternateEdge);
				}
			}
		}

		return edges;
	}

	/**
	 * Get all directed edge Cytoscape ids
	 * @returns {String[]} - Cytoscape ids
	 */
	get cyDirectedEdges() {
		let edgeIds = new Array();

		for (let i = 0; i < this.#nodeNames.length; i++) {
			for (let j = i + 1; j < this.#nodeNames.length; j++) {
				if (this.#matrix[i][j] != this.#matrix[j][i]) {
					edgeIds.push(`${i}-${j}`);
					edgeIds.push(`${j}-${i}`);
				}
			}
		}

		return edgeIds;
	}

	/**
	 * Get adjacency matrix for graph
	 * @returns {Number[][]} - adjacency matrix
	 */
	get matrix() {
		return this.#matrix;
	}

	/**
	 * Get all node names for graph nodes
	 * @returns {String[]} - node names
	 */
	get nodeNames() {
		return this.#nodeNames;
	}

	/**
	 * Get number of nodes in graph (the 1 dimensional size of adjacency matrix)
	 * @returns {Number} - number of nodes in graph
	 */
	get size() {
		return this.#nodeNames.length;
	}

	/**
	 * Determine if graph is weighted or unweighted
	 * @returns {Boolean} - true if weighted, false if unweighted
	 */
	get weighted() {
		return this.#weighted;
	}

	/**
	 * Set adjacency matrix of graph using adjacency list
	 * @param {Number[][]} edges - edges, if graph is unweighted
	 * @param {Array[][]} edges - edges and weight of edges, if graph is weighted
	 * @param {Number} edges[] - node in connection, if graph is unweighted
	 * @param {Number} edges[][0] - node in connection, if graph is weighted
	 * @param {Number} edges[][1] - weight in connection, if graph is weighted
	 */
	set adjacencyList(edges) {
		this.#setupGraphMatrix();
		for (let i = 0; i < edges.length; i++) {
			// edge strucutre (unweighted): [{node1}, {node 2}, ...]
			// edge strucutre (weighted): [[{node 1}, {weight 1}], [{node 2}, {weight 2}], ...]

			for (let j = 0; j < edges[i].length; j++) {
				if (weighted) {
					this.#matrix[i][edges[i][j][0]] = edges[i][j][1];

					if (!this.#directed) {
						this.#matrix[edges[i][j][0]][i] = edges[i][j][1];
					}
				} else {
					this.#matrix[i][edges[i][j]] = 1;

					if (!this.#directed) {
						this.#matrix[edges[i][j]][i] = 1;
					}
				}
			}
		}
	}

	/**
	 * Set adjacency matrix of graph using adjacency list
	 * @param {Array[][]} edges - edge connections of graph
	 * @param {Number} edges[][0] - start node
	 * @param {Number} edges[][1] - target node
	 * @param {Number} edges[][2] - weight of connection, if graph is weighted
	 */
	set edgeList(edges) {
		let nodeNames = new Set();

		// get unique node names
		for (let i = 0; i < edges.length; i++) {
			nodeNames.add(edges[i][0]);
			nodeNames.add(edges[i][1]);
		}
		this.#nodeNames = Array.from(nodeNames);

		// convert to adjacency matrix
		this.#setupGraphMatrix();
		for (let i = 0; i < edges.length; i++) {
			// edge data
			const edgeWeight = this.#weighted ? parseInt(edges[i][2]) : 1;
			const edgeFrom = this.#nodeNames.indexOf(edges[i][0]);
			const edgeTo = this.#nodeNames.indexOf(edges[i][1]);

			this.#matrix[edgeFrom][edgeTo] = edgeWeight;

			if (!this.#directed) {
				this.#matrix[edgeTo][edgeFrom] = edgeWeight;
			}
		}
	}

	/**
	 * Set boolean to indicate whether edges are directed or undirected in graph
	 * @param {Boolean} value - true if directed graph, false if undirected graph
	 */
	set directed(value) {
		this.#directed = value;
	}

	/**
	 * Set node names
	 * @param {String[]} value - array of node names
	 */
	set nodeNames(value) {
		this.#nodeNames = value;
	}

	/**
	 * Set adjacency matrix of graph
	 * @param {Number[][]} value - adjacency matrix for graph
	 */
	set matrix(value) {
		this.#matrix = value;
	}
}
