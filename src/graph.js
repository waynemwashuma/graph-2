/**
 * @template T
 */
export class Node {
  /**
   * @type {[EdgeId | undefined, EdgeId | undefined]}
   */
  next = [undefined, undefined]

  /**
   * @type {T}
   */
  weight

  /**
   * @param {T} weight
   */
  constructor(weight) {
    this.weight = weight
  }
}

/**
 * @template T
 */
export class Edge {
  /**
   * @type {NodeId}
   */
  from
  /**
   * @type {NodeId}
   */
  to
  /**
   * @type {[EdgeId | undefined, EdgeId | undefined]}
   */
  next = [undefined, undefined]

  /**
   * @type {T}
   */
  weight
  /**
   * @param {number} from
   * @param {number} to
   * @param {T} weight
   */
  constructor(from, to, weight) {
    this.from = from
    this.to = to
    this.weight = weight
  }
}

/**
 * @template [T = unknown]
 * @template [U = unknown]
 */
export class Graph {
  /**
   * @private
   * @type {Node<T>[]}
   */
  nodes = []

  /**
   * @private
   * @type {Edge<U>[]}
   */
  edges = []

  /***
   * @readonly
   * @type {boolean}
   */
  directed

  /**
   * @param {boolean} directed
   */
  constructor(directed) {
    this.directed = directed
  }

  /**
   * @param {T} weight
   * @returns {NodeId}
   */
  addNode(weight) {
    const node = new Node(weight)
    const id = this.nodes.length
    this.nodes.push(node)
    return id
  }

  /**
   * @param {NodeId} from
   * @param {NodeId} to
   * @param {U} weight
   * @returns {EdgeId}
   */
  addEdge(from, to, weight) {
    const id = this.edges.length
    const edge = new Edge(from, to, weight)

    this.edges.push(edge)
    const nodeA = this.nodes[from]
    const nodeB = this.nodes[to]

    edge.next[0] = nodeA.next[0]
    edge.next[1] = nodeB.next[1]
    nodeA.next[0] = id
    nodeB.next[1] = id

    return id
  }

  /**
   * @param {NodeId} id
   * @returns {Node<T> | undefined}
   */
  getNode(id) {
    return this.nodes[id]
  }

  /**
   * @param {EdgeId} id
   * @returns {Edge<U> | undefined}
   */
  getEdge(id) {
    return this.edges[id]
  }
  /**
   * @param {number} id
   */
  getNodeWeight(id) {
    const node = this.getNode(id)
    if (!node) return undefined
    return node.weight
  }
  /**
   * @param {number} id
   */
  getEdgeWeight(id) {
    const edge = this.getEdge(id)
    if (!edge) return undefined
    return edge.weight
  }
  /**
   * @param {NodeId} id
   */
  getNeighbours(id) {
    return new GraphNeighbourIterator(this, id)
  }
  /**
   * @param {any} id
   */
  getNodeEdges(id) {
    return new GraphNodeEdgesIterator(this, id)
  }
  getEdges() {
    return this.edges
  }
  getNodes() {
    return this.nodes
  }

  /**
   * @param {NodeId} id
   * @param {T} weight
   */
  setNodeWeight(id, weight) {
    const node = this.getNode(id);
    if (node) {
      node.weight = weight;
    }
  }

  /**
   * @param {EdgeId} id
   * @param {U} weight
   */
  setEdgeWeight(id, weight) {
    const edge = this.getEdge(id);
    if (edge) {
      edge.weight = weight;
    }
  }

  getNodeCount() {
    return this.nodes.length
  }

  getEdgeCount() {
    return this.edges.length
  }
}

/**
 * @template T
 * @template U
 */
export class GraphNodeEdgesIterator {
  /**
   * @private
   * @type {Graph<T,U>}
   */
  graph
  /**
   * @private
   */
  nodeid
  /**
   * @param {Graph} graph
   * @param {NodeId} nodeid
   */
  constructor(graph, nodeid) {
    this.graph = graph
    this.nodeid = nodeid
  }

  *[Symbol.iterator]() {
    let edgeId = this.graph.getNode(this.nodeid)?.next[0]
    while (edgeId !== undefined) {
      const edge = this.graph.getEdge(edgeId)

      if (!edge) {
        break
      }
      yield edge
      edgeId = edge.next[0]
    }
  }
}

/**
 * @template T
 * @template U
 */
export class GraphNeighbourIterator {
  edgeIter
  /**
   * @param {Graph<T, U>} graph
   * @param {NodeId} nodeid
   */
  constructor(graph, nodeid) {
    this.graph = graph
    this.nodeid = nodeid
    this.edgeIter = new GraphNodeEdgesIterator(graph, nodeid)
  }

  /**
   * @returns {IterableIterator<NodeId>}
   */
  *[Symbol.iterator]() {
    for (const edge of this.edgeIter) {
      yield edge.to
    }
  }
}

/**
 * @typedef {number} EdgeId
 */

/**
 * @typedef {number} NodeId
 */