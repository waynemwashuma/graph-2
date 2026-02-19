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
   * @type {import("./graph").NodeId | undefined}
   */
  parent
  
  /**
   * @param {import("./graph").NodeId | undefined} parent
   */
  constructor(parent = undefined, gCost = 0, hCost = 0) {
    this.parent = parent
    this.gCost = gCost
    this.hCost = hCost
  }
  
  /**
   * @returns {number}
   */
  fCost() {
    return this.gCost + this.hCost
  }
}

export class GraphPath {
  /**
   * @type {Map<import("./graph").NodeId,GraphPathNode>}
   */
  inner = new Map()
  
  /**
   * @param {import("./graph").NodeId} id
   * @param {GraphPathNode} value
   * @returns {GraphPathNode}
   */
  set(id, value) {
    this.inner.set(id, value)
    return value
  }
  
  /**
   * @param {import("./graph").NodeId} id
   * @returns {GraphPathNode | undefined}
   */
  get(id) {
    return this.inner.get(id)
  }

  /**
   * @param {import("./graph").NodeId} key
   */
  getOrSet(key){
    const node = this.get(key)

    if (node) {
      return node
    }

    return this.set(key, new GraphPathNode())
  }
  
  /**
   * @param {import("./graph").NodeId} id
   * @returns {void}
   */
  delete(id) {
    this.inner.delete(id)
  }
  
  /**
   * @param {import("./graph").NodeId} id
   * @returns {boolean}
   */
  has(id){
    return this.inner.has(id)
  }
  
  /**
   * @return {import("./graph").NodeId[]}
   * @param {import("./graph").NodeId} id
   */
  path(id){
    let currentid = id
    let current = this.get(currentid)
    const path = []
    
    while (current) {
      path.push(currentid)
      
      if (current.parent !== undefined) {
        currentid = current.parent
        current = this.get(currentid)
      } else{
        break
      }
    }
    
    return path.reverse()
  }
}