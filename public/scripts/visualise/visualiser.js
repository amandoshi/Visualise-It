/**
 * Class to display visualisation of a graph and traversal algorithms
 */
class Visualiser {
	// visualisation
	#canvasId;
	#cy;
	#displayEdgeWeights = false;
	#displayNodeNames = false;
	#graph;

	// traversal
	#apparentStep = -1;
	#currentStep = -1;
	#previousStates = new Array();
	#traversal = null;

	// traversal form
	#traversalSpeed;
	#traversalSpeeds = [null, 1000, 500, 100];
	#traversalType;
	#traversalTypes = [BFS, DFS, Dijkstra];

	/**
	 * Construct visualiser for graph and traversals
	 * @param {String} canvasId - HTML id of div for graph canvas
	 * @param {Graph} graph
	 */
	constructor(canvasId, graph) {
		// parameters
		this.#canvasId = canvasId;
		this.#graph = graph;

		// presets: public
		this.traversalSpeedId = null;
		this.traversalTypeId = null;

		this.#setupCanvas();
	}

	/**
	 * Setup and display directed edges in graph
	 */
	#cySetupDirectedEdges() {
		let edges = this.#graph.cyDirectedEdges;

		for (const edge of edges) {
			this.#cy.$(`#${edge}`).addClass("edgeDirected");
		}
	}

	/**
	 * Generate Cytoscape styling-class structure
	 * @param {String} color - hexadecimal color code
	 * @param {Boolean} isNode - true if target element is node, else false
	 * @param {Boolean} isEdge - true if target element is edge, else false
	 * @param {Number} transitionDuration - time taken for transitions (seconds)
	 * @returns {Object} - Cytoscape styling-class information
	 */
	#cyElementStyle(color, isNode, isEdge, transitionDuration) {
		let style = new Object();
		let elements = new Array();

		if (isNode) {
			style["background-color"] = color;
			elements.push("background-color");
		}
		if (isEdge) {
			style["line-color"] = color;
			style["target-arrow-color"] = color;

			elements.push("line-color", "target-arrow-color");
		}
		if (transitionDuration) {
			style["transition-duration"] = `${transitionDuration}s`;
			style["transition-property"] = elements.join(",");
		}

		return style;
	}

	/**
	 * Setup Cytoscape graph in graph canvas
	 */
	#setupCanvas() {
		const colors = {
			defaultEdge: "#dddddd",
			hover: "#e0610e",
			start: "#00a116",
			target: "#db0021",
			visitedNode: "#026299",
			visitedEdge: "#56a0db",
			finalPathNode: "#f2c00a",
			finalPathEdge: "#ffd333",
		};

		this.#cy = cytoscape({
			container: document.getElementById(this.#canvasId),
			autounselectify: true,

			style: cytoscape
				.stylesheet()

				// element styles
				.selector("node")
				.style({
					"border-width": 1,
					height: 10,
					width: 10,
				})
				.selector("edge")
				.style({
					"arrow-scale": 0.6,
					"line-color": colors.defaultEdge,
					"target-arrow-color": colors.defaultEdge,
					"target-arrow-shape": "triangle",
					width: 2,
				})

				// class styles
				.selector(".edgeDirected")
				.style({
					"curve-style": "bezier",
				})
				.selector(".finalPathNode")
				.style(this.#cyElementStyle(colors.finalPathNode, true, false, 0.2))
				.selector(".finalPathEdge")
				.style(this.#cyElementStyle(colors.finalPathEdge, false, true, 0.2))
				.selector(".hover")
				.style(this.#cyElementStyle(colors.hover, true, true, 0))
				.selector(".name")
				.style({
					content: "data(name)",
					"font-size": 10,
				})
				.selector(".start")
				.style(this.#cyElementStyle(colors.start, true, false, 0.2))
				.selector(".target")
				.style(this.#cyElementStyle(colors.target, true, false, 0.2))
				.selector(".weight")
				.style({
					content: "data(weight)",
					"font-size": 10,
				})
				.selector(".visitedNode")
				.style(this.#cyElementStyle(colors.visitedNode, true, false, 0.2))
				.selector(".visitedEdge")
				.style(this.#cyElementStyle(colors.visitedEdge, false, true, 0.2)),

			elements: {
				edges: this.#graph.cyEdges,
				nodes: this.#graph.cyNodes,
			},
		});

		// layout information of Cytoscape graph
		let layout = this.#cy.layout({
			animate: false,
			name: "fcose",
			randomize: true,
			padding: 50,
			ready: () => {
				this.#cySetupDirectedEdges();
				this.#setupHover();
			},
		});

		// display Cytoscape graph
		layout.run();
	}

	/**
	 * Setup hovering
	 * 1. Hover over
	 * 		Highlight element
	 * 		Display element data in information box
	 * 2. Hover leave
	 * 		Dehighlight element
	 * 		Clear element data in information box
	 */
	#setupHover() {
		this.#cy.on("mouseover", (event) => {
			// check if hovering over element
			if (event.target === this.#cy) {
				return;
			}

			// reference to element
			const cyElement = this.#cy.$(`#${event.target.id()}`);
			const elementData = event.target.data();

			// display element data
			if (elementData.type == "node") {
				cyElement.addClass("name");
			} else {
				cyElement.addClass("weight");
			}

			// remove alternate highlighting
			if (elementData.finalPath) {
				cyElement.removeClass("finalPathNode");
				cyElement.removeClass("finalPathEdge");
			} else if (elementData.visited) {
				cyElement.removeClass("visitedNode");
				cyElement.removeClass("visitedEdge");
			}

			// highlight element
			cyElement.addClass("hover");

			// display element data in information box

			// name (if node)
			const maxDisplayLength = 12;
			document.getElementById("elementTypeLabel").innerText = elementData.type;

			if (elementData.type == "node") {
				let nodeName = elementData.name.substring(0, maxDisplayLength - 1);
				if (elementData.name.length > maxDisplayLength - 1) {
					nodeName += "…";
				}

				document.getElementById("elementNameLabel").innerText = nodeName;
			}

			// weight (if edge)
			if (event.target.data().type == "edge") {
				document.getElementById("elementWeightLabel").innerText =
					elementData.weight;
			}

			// visited (boolean)
			document.getElementById("elementIsVisitedLabel").innerText =
				elementData.visited;

			// final path (boolean)
			document.getElementById("elementIsFinalPathLabel").innerText =
				elementData.finalPath;
		});

		this.#cy.on("mouseout", (event) => {
			// check if hovering over element
			if (event.target === this.#cy) {
				return;
			}

			// reference to element
			const cyElement = this.#cy.$(`#${event.target.id()}`);
			const elementData = event.target.data();

			// undisplay element data in information box
			if (event.target.data().type == "node" && !this.#displayNodeNames) {
				cyElement.removeClass("name");
			} else if (!this.#displayEdgeWeights) {
				cyElement.removeClass("weight");
			}

			// add alternate highlighting
			if (elementData.finalPath) {
				cyElement.addClass("finalPathNode");
				cyElement.addClass("finalPathEdge");
			} else if (elementData.visited) {
				if (this.#traversal && elementData.id != this.#traversal.targetNode) {
					cyElement.addClass("visitedNode");
					cyElement.addClass("visitedEdge");
				}
			}

			// remove highlighting
			cyElement.removeClass("hover");

			// clear information box
			document.getElementById("elementTypeLabel").innerText = "";
			document.getElementById("elementNameLabel").innerText = "";
			document.getElementById("elementWeightLabel").innerText = "";
			document.getElementById("elementIsVisitedLabel").innerText = "";
			document.getElementById("elementIsFinalPathLabel").innerText = "";
		});
	}

	/**
	 * Display/undisplay weight of edges in Cytoscape graph
	 */
	cyToggleEdgeWeights() {
		this.#displayEdgeWeights = !this.#displayEdgeWeights;

		if (this.#displayEdgeWeights) {
			this.#cy.edges().addClass("weight");
		} else {
			this.#cy.edges().removeClass("weight");
		}
	}

	/**
	 * Display/undisplay name of nodes in Cytoscape graph
	 */
	cyToggleNodeNames() {
		this.#displayNodeNames = !this.#displayNodeNames;

		if (this.#displayNodeNames) {
			this.#cy.nodes().addClass("name");
		} else {
			this.#cy.nodes().removeClass("name");
		}
	}

	/**
	 * Clear current traversal algorithm
	 * Reset graph - remove highlighting
	 * Reset datastructures
	 */
	resetTraversal() {
		this.#traversal = null;

		// step by step
		this.#previousStates = new Array();
		this.#apparentStep = -1;
		this.#currentStep = -1;

		// reset cytoscape graph
		for (const node of this.#cy.nodes()) {
			node.data().visited = false;
			node.data().finalPath = false;

			node.removeClass("target");
			node.removeClass("start");
			node.removeClass("visitedNode");
			node.removeClass("finalPathNode");
		}

		for (const edge of this.#cy.edges()) {
			edge.data().visited = false;
			edge.data().finalPath = false;

			edge.removeClass("visitedEdge");
			edge.removeClass("finalPathEdge");
		}

		// reset data structure displays
		updateSingleDataStructure([]);
		updateDoubleDataStructure([]);
	}

	/**
	 * Check validity of traversal form
	 * If valid, start traversal
	 * Otherwise, alert error to user
	 */
	submitTraversalForm() {
		// reject form if active traversal
		if (this.#traversal) {
			return;
		}

		// check for invalid tranversal form
		if (!this.#traversalType) {
			return alertError({
				text: "Choose a traversal type: BFS (breadth-first search), DFS (depth-first search), or Dijsktra",
				title: "No Traversal Type Selected!",
			});
		} else if (!this.#traversalSpeed) {
			return alertError({
				text: "Choose a traveral speed: Step-by-Step, Slow, Medium, or Fast",
				title: "No Traversal Speed Selected!",
			});
		} else if (
			!startNodeSelect.selectedOption ||
			!targetNodeSelect.selectedOption
		) {
			return alertError({
				text: "Choose a start and/or target node for the traversal",
				title: "No Start/Target Nodes Selected!",
			});
		} else if (
			startNodeSelect.selectedOption == targetNodeSelect.selectedOption
		) {
			return alertError({
				text: "Start node cannot be the same of the target node",
				title: "Invalid Start/Target Nodes",
			});
		} else if (this.#traversalType == 2 && !this.#graph.weighted) {
			return alertError({
				text: "Dijkstra's Shortest Path algorithm cannot be used on an unweighted graph",
				title: "Invalid Algorithm!",
			});
		}

		// setup single data structure
		let singleDataStructureName;
		switch (parseInt(this.#traversalType)) {
			case 0:
				singleDataStructureName = "Queue";
				break;
			case 1:
				singleDataStructureName = "Stack";
				break;
			case 2:
				singleDataStructureName = "PQueue";
				break;
		}
		setupSingleDataStructure(singleDataStructureName);

		// setup graph traversal
		if (this.#traversalSpeed == 0) {
			let traverseStepByStepSetup = async () => {
				await Swal.fire({
					confirmButtonColor: "#0088a9",
					confirmButtonText: "Traverse",
					icon: "info",
					text: "Use left (recur) and right (iterate) arrow keys to traverse graph",
					title: "Step-by-step traversal",
				});

				this.traverseStepByStep();
			};

			traverseStepByStepSetup();
		} else {
			this.traverse();
		}
	}

	/**
	 * Traverse Cytoscape graph at a set speed
	 */
	traverse() {
		// setup traversal
		this.#traversal = new this.#traversalTypes[this.#traversalType](
			this.#graph,
			parseInt(startNodeSelect.selectedOption),
			parseInt(targetNodeSelect.selectedOption)
		);

		// highlight start and target node
		this.#cy.$(`#${startNodeSelect.selectedOption}`).addClass("start");
		this.#cy.$(`#${targetNodeSelect.selectedOption}`).addClass("target");

		// visit start node
		this.#cy.$(`#${startNodeSelect.selectedOption}`).data().visited = true;
		this.#cy.$(`#${startNodeSelect.selectedOption}`).data().finalPath = true;

		const iterate = setInterval(() => {
			const result = this.#traversal.next();

			if (result.data) {
				// highlight Cytoscape elements
				this.#cy.$(`#${result.data.edge}`).addClass("visitedEdge");
				if (
					result.data.node != this.#traversal.targetNode &&
					result.data.node != this.#traversal.startNode
				) {
					this.#cy.$(`#${result.data.node}`).addClass("visitedNode");
				}

				// visit Cytoscape elements
				this.#cy.$(`#${result.data.edge}`).data().visited = true;
				this.#cy.$(`#${result.data.node}`).data().visited = true;
			}

			// update data structures
			if (this.#traversalType == 2) {
				updateDoubleDataStructure(
					this.#traversal.distanceTable.map((item, index) => {
						return {
							distance: item.distance,
							previousNode:
								item.previousNode != undefined
									? this.#graph.nodeNames[item.previousNode]
									: "",
							node: this.#graph.nodeNames[index],
						};
					})
				);
				updateSingleDataStructure(
					this.#traversal.unvisitedNodes.map(
						(index) => this.#graph.nodeNames[index]
					)
				);
			} else {
				updateSingleDataStructure(
					this.#traversal.unvisitedNodes.map(
						(index) => this.#graph.nodeNames[index]
					)
				);
			}

			// display final path
			if (!result.active && this.#traversal.targetFound) {
				const finalPath = this.#traversal.finalPath;

				for (let i = 1; i < finalPath.length; i++) {
					// highlight final path edge
					const edgeId = this.#graph.connection(finalPath[i - 1], finalPath[i]);
					this.#cy.$(`#${edgeId}`).removeClass("visitedEdge");
					this.#cy.$(`#${edgeId}`).addClass("finalPathEdge");

					// highlight final path node
					if (i != finalPath.length - 1) {
						this.#cy.$(`#${finalPath[i]}`).removeClass("visitedNode");
						this.#cy.$(`#${finalPath[i]}`).addClass("finalPathNode");
					}

					// add final path property
					this.#cy.$(`#${edgeId}`).data().finalPath = true;
					this.#cy.$(`#${finalPath[i]}`).data().finalPath = true;
				}
			}

			// end traversal
			if (!result.active) {
				clearInterval(iterate);
			}
		}, this.#traversalSpeeds[this.#traversalSpeed]);

		// stop traversal if exit traversal clicked
		document.getElementById("exitTraversalButton").onclick = () => {
			clearInterval(iterate);
			document.getElementById("exitTraversalButton").onclick = null;

			this.resetTraversal();
		};
	}

	/**
	 * Traverse graph step-by-step
	 * Arrow keys used to iterate/recur traversal
	 */
	traverseStepByStep() {
		// setup traversal
		this.#traversal = new this.#traversalTypes[this.#traversalType](
			this.#graph,
			parseInt(startNodeSelect.selectedOption),
			parseInt(targetNodeSelect.selectedOption)
		);

		// highlight start and target node
		this.#cy.$(`#${startNodeSelect.selectedOption}`).addClass("start");
		this.#cy.$(`#${targetNodeSelect.selectedOption}`).addClass("target");

		// visit start node
		this.#cy.$(`#${startNodeSelect.selectedOption}`).data().visited = true;
		this.#cy.$(`#${startNodeSelect.selectedOption}`).data().finalPath = true;

		let iterate = () => {
			let result;
			if (this.#apparentStep == this.#currentStep) {
				this.#apparentStep += 1;
				this.#currentStep += 1;

				// iterate traversal
				result = this.#traversal.next();

				// store copies of traversal data as states
				let state;
				if (this.#traversalType == 2) {
					// dijkstra
					state = {
						active: result.active,
						data: result.data,
						distanceTable: this.#traversal.distanceTable.map((item) => {
							return {
								distance: item.distance,
								previousNode: item.previousNode,
							};
						}),
						pQueue: this.#traversal.unvisitedNodes,
					};
				} else {
					// bfs or dfs
					state = {
						active: result.active,
						data: result.data,
						dataStructure: this.#traversal.unvisitedNodes.slice(),
					};
				}

				if (!result.active && this.#traversal.targetFound) {
					state.finalPath = this.#traversal.finalPath;
				}

				this.#previousStates.push(state);
			} else {
				this.#apparentStep += 1;

				// get pre-stored traversal state
				result = this.#previousStates[this.#apparentStep];
			}

			if (result.data) {
				// highlight elements
				this.#cy.$(`#${result.data.edge}`).addClass("visitedEdge");
				if (
					result.data.node != this.#traversal.targetNode &&
					result.data.node != this.#traversal.startNode
				) {
					this.#cy.$(`#${result.data.node}`).addClass("visitedNode");
				}

				// visit elements
				this.#cy.$(`#${result.data.edge}`).data().visited = true;
				this.#cy.$(`#${result.data.node}`).data().visited = true;
			}

			// update data structures
			if (this.#traversalType == 2) {
				updateDoubleDataStructure(
					this.#previousStates[this.#apparentStep].distanceTable.map(
						(item, index) => {
							return {
								distance: item.distance,
								previousNode:
									item.previousNode != undefined
										? this.#graph.nodeNames[item.previousNode]
										: "",
								node: this.#graph.nodeNames[index],
							};
						}
					)
				);
				updateSingleDataStructure(
					this.#previousStates[this.#apparentStep].pQueue.map(
						(index) => this.#graph.nodeNames[index]
					)
				);
			} else {
				updateSingleDataStructure(
					this.#previousStates[this.#apparentStep].dataStructure.map(
						(index) => this.#graph.nodeNames[index]
					)
				);
			}

			// display final path
			if (
				!this.#previousStates[this.#apparentStep].active &&
				this.#previousStates[this.#apparentStep].finalPath
			) {
				// get final traversal path
				const finalPath = this.#previousStates[this.#apparentStep].finalPath;

				for (let i = 1; i < finalPath.length; i++) {
					// highlight final path edge
					const edgeId = this.#graph.connection(finalPath[i - 1], finalPath[i]);
					this.#cy.$(`#${edgeId}`).removeClass("visitedEdge");
					this.#cy.$(`#${edgeId}`).addClass("finalPathEdge");

					// highlight final path node
					if (i != finalPath.length - 1) {
						this.#cy.$(`#${finalPath[i]}`).removeClass("visitedNode");
						this.#cy.$(`#${finalPath[i]}`).addClass("finalPathNode");
					}

					// add final path property
					this.#cy.$(`#${edgeId}`).data().finalPath = true;
					this.#cy.$(`#${finalPath[i]}`).data().finalPath = true;
				}
			}
		};

		let recur = () => {
			this.#apparentStep -= 1;

			let result = this.#previousStates[this.#apparentStep + 1];

			if (result.data) {
				// dehighlight elements
				this.#cy.$(`#${result.data.edge}`).removeClass("visitedEdge");
				if (result.data.node != targetNodeSelect.selectedOption) {
					this.#cy.$(`#${result.data.node}`).removeClass("visitedNode");
				}

				// unvisit elements
				this.#cy.$(`#${result.data.edge}`).data().visited = false;
				this.#cy.$(`#${result.data.node}`).data().visited = false;
			}

			// update data structures
			if (this.#traversalType != 2) {
				if (this.#apparentStep >= 0) {
					updateSingleDataStructure(
						this.#previousStates[this.#apparentStep].dataStructure.map(
							(index) => this.#graph.nodeNames[index]
						)
					);
				} else {
					updateSingleDataStructure([]);
				}
			} else {
				if (this.#apparentStep >= 0) {
					updateDoubleDataStructure(
						this.#previousStates[this.#apparentStep].distanceTable.map(
							(item, index) => {
								return {
									distance: item.distance,
									previousNode:
										item.previousNode != undefined
											? this.#graph.nodeNames[item.previousNode]
											: "",
									node: this.#graph.nodeNames[index],
								};
							}
						)
					);
					updateSingleDataStructure(
						this.#previousStates[this.#apparentStep].pQueue.map(
							(index) => this.#graph.nodeNames[index]
						)
					);
				}
			}

			// undisplay final path
			if (
				!this.#previousStates[this.#apparentStep + 1].active &&
				this.#previousStates[this.#apparentStep + 1].finalPath
			) {
				const finalPath =
					this.#previousStates[this.#apparentStep + 1].finalPath;

				for (let i = 1; i < finalPath.length; i++) {
					// dehighlight final path edge
					const edgeId = this.#graph.connection(finalPath[i - 1], finalPath[i]);
					this.#cy.$(`#${edgeId}`).addClass("visitedEdge");
					this.#cy.$(`#${edgeId}`).removeClass("finalPathEdge");

					// dehighlight final path node
					if (i != finalPath.length - 1) {
						this.#cy.$(`#${finalPath[i]}`).addClass("visitedNode");
						this.#cy.$(`#${finalPath[i]}`).removeClass("finalPathNode");
					}

					// remove final path property
					this.#cy.$(`#${edgeId}`).data().finalPath = false;
					this.#cy.$(`#${finalPath[i]}`).data().finalPath = false;
				}
			}
		};

		// link arrow keys to traversal
		let step = (event) => {
			if (event.keyCode == 39) {
				// forward - right arrow key
				if (
					this.#apparentStep < 0 ||
					this.#previousStates[this.#apparentStep].active
				) {
					iterate();
				}
			} else if (event.keyCode == 37) {
				// backward - left arrow key
				if (
					(this.#apparentStep >= 0 && this.#traversalType != 2) ||
					this.#apparentStep > 0
				) {
					recur();
				}
			}
		};

		document.addEventListener("keydown", step);

		// stop traversal if exit traversal button clicked
		document.getElementById("exitTraversalButton").onclick = () => {
			this.resetTraversal();
			document.removeEventListener("keydown", step);
			document.getElementById("exitTraversalButton").onclick = null;
		};

		// update distance table of dijkstra
		if (this.#traversalType == 2) {
			iterate();
		}
	}

	/**
	 * Determine if an edge in the graph is visited
	 * @param {String} connection - Cytoscape edge id
	 * @returns {Boolean} - true if edge is visited, else false
	 */
	checkVisited(connection) {
		return this.#cy.$(`#${connection}`).data().visited;
	}

	/**
	 * Get adjacency matrix of graph
	 * @returns {Number[][]} - adjacency matrix
	 */
	get matrix() {
		return this.#graph.matrix;
	}

	/**
	 * Get all names of nodes in graph
	 * @returns {String[]} - node names
	 */
	get nodeNames() {
		return this.#graph.nodeNames;
	}

	/**
	 * @param {number} value - set traversal speed (milliseconds)
	 */
	set traversalSpeed(value) {
		this.#traversalSpeed = value;
	}

	/**
	 * @param {number} value - set traversal type
	 */
	set traversalType(value) {
		this.#traversalType = value;
	}
}
