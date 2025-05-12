/**
 * @template T
 */
export class Node {
  /**
   * @type {EdgeId[]}
   */
  edges = []
  
  /**
   * @type {T}
   */
  weight
  
  /**
   * @@param {T} weight
   */
  constructor(weight) {
    this.weight = weight
  }
}

export class Edge {
  constructor(from, to) {
    this.from = from
    this.to = to
  }
  getOutBound(nodeid) {
    if (this.from == nodeid) {
      return this.to
    } else {
      return this.from
    }
  }
}

/**
 * @template  T
 */
export class Graph {
  /**
   * use DenseList instead
   * @type {Node[]}
   */
  nodes = []
  
  /**
   * use DenseList instead
   * @type {Edge[]}
   */
  edges = []
  
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
   * @returns {EdgeId}
   */
  addEdge(from, to) {
    const id = this.edges.length
    const edge = new Edge(from, to)
    
    this.edges.push(edge)
    this.nodes[from].edges.push(id)
    this.nodes[to].edges.push(id)
    
    return id
  }
  
  /**
   * @param {NodeId} index
   */
  removeNode(index) {}
  
  /**
   * @param {EdgeId} index
   */
  removeEdge(index) {}
  
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
}

/**
 * @typedef {number} EdgeId
 */

/**
 * @typedef {number} NodeId
 */