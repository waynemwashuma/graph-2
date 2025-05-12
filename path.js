export class GraphPathNode {
  /**
   * @type {number}
   */
  gCost
  
  /**
   * @type {number}
   */
  hCost
  
  /**
   * @type {NodeId | undefined}
   */
  parent
  
  constructor(parent, gCost = 0, hCost = 0) {
    this.parent = parent
    this.gCost = gCost
    this.hCost = hCost
  }
  
  fCost() {
    return this.gCost + this.hCost
  }
}

export class GraphPath {
  /**
   * @type {Map<NodeId,GraphPathNode>}
   */
  inner = new Map()
  
  /**
   * @param {NodeId} id
   * @param {GraphPathNode} value
   * @returns {void}
   */
  set(id, value) {
    this.inner.set(id, value)
  }
  
  /**
   * @param {NodeId} id
   * @returns {GraphPathNode ! undefined}
   */
  get(id) {
    return this.inner.get(id)
  }
  
  /**
   * @param {NodeId} id
   * @returns {void}
   */
  delete(id) {
    this.inner.delete(id)
  }
  
  /**
   * @param {NodeId} id
   * @returns {boolean}
   */
  has(id){
    return this.inner.has(id)
  }
  
  /**
   * @return {NodeId[]}
   */
  path(id){
    let currentid = id
    let current = this.get(currentid)
    const path = []
    
    while (current) {
      path.push(currentid)
      
      currentid = current.parent
      current = this.get(currentid)
    }
    
    return path.reverse()
  }
}