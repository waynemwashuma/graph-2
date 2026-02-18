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
  constructor(from, to, weight) {
    this.from = from
    this.to = to
    this.next = [undefined, undefined]
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
   * @returns {Node | undefined}
   */
  getNode(id) {
    return this.nodes[id]
  }
  
  /**
   * @param {EdgeId} id
   * @returns {Edge | undefined}
   */
  getEdge(id) {
    return this.edges[id]
  }
  getNodeWeight(id) {
    const node = this.getNode(id)
    if (!node) return undefined
    return node.weight
  }
  getEdgeWeight(id) {
    const edge = this.getEdge(id)
    if (!edge) return undefined
    return edge.weight
  }
  getNeighbours(id) {
    return new GraphNeighbourIterator(this, id)
  }
  getNodeEdges(id) {
    return new GraphNodeEdgesIterator(this, id)
  }
  getEdges() {
    return this.edges
  }
  getNodes() {
    return this.nodes
  }
  
  setNodeWeight(id,weight){
    
  }
  setEdgeWeight(){}
  
  getNodeCount() {
    return this.nodes.length
  }
  
  getEdgeCount() {
    return this.edges.length
  }
}

export class GraphNodeEdgesIterator {
  /**
   * @private
   */
  graph
  /**
   * @private
   */
  nodeid
  constructor(graph, nodeid) {
    this.graph = graph
    this.nodeid = nodeid
  }
  
  *[Symbol.iterator]() {
    const node = this.graph.getNode(this.nodeid)
    if (node) {
      let edge = this.graph.getEdge(node.next[0])
      while (edge) {
        yield edge
        edge = graph.getEdge(edge.next[0])
      }
    }
  }
}

export class GraphNeighbourIterator {
  /**
   * @private
   */
  graph
  /**
   * @private
   */
  nodeid
  constructor(graph, nodeid) {
    this.graph = graph
    this.nodeid = nodeid
  }
  
  *[Symbol.iterator]() {
    const node = this.graph.getNode(this.nodeid)
    if (node) {
      let edge = this.graph.getEdge(node.next[0])
      while (edge) {
        yield edge.to
        edge = this.graph.getEdge(edge.next[0])
      }
    }
  }
}

export class GraphMap {
  nodes = new Map()
  edges = new Map()
  nodeCounter = 0
  edgeCounter = 0
  directed
  
  addNode(weight) {
    const id = this.nodeCounter
    
    this.nodes.set(new Node(weight))
    this.nodeCounter += 1
    
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
    
    this.edgeCounter += 1
    this.edges.set(id, edge)
    this.nodes.get(from).edges.push(id)
    this.nodes.get(to).edges.push(id)
    
    return id
  }
}

/**
 * @typedef {number} EdgeId
 */

/**
 * @typedef {number} NodeId
 */