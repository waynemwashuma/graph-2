import { GraphPath, GraphPathNode } from '../path.js';

/**
 * @template T
 * @param {Graph<T>} graph
 * @param {NodeId} start
 * @param {NodeId} end
 * @param {(start:T,end:T)=>number} costFunc
 * @returns {GraphPath}
 */
export function aStar(graph, start, end, costFunc) {
  const target = graph.nodes[end]
  const visited = new Set()
  
  // make this a priority queue
  const unvisited = [start]
  const trackedpath = new GraphPath()
  trackedpath.set(start, new GraphPathNode())
  
  while (unvisited.length) {
    unvisited.sort((a, b) => {
      const nodeA = graph.getNode(a)
      const nodeB = graph.getNode(b)
      const pathA = trackedpath.get(a)
      const pathB = trackedpath.get(b)
      const currentCost = pathA.fCost()
      const contenderCost = pathB.fCost()
      
      if (
        contenderCost < currentCost ||
        contenderCost === currentCost &&
        pathB.hCost < pathA.hCost
      ) {
        return 1
      } else {
        return -1
      }
      return 0
    })
    
    const currentid = unvisited.shift()
    const current = graph.nodes[currentid]
    visited.add(currentid)
    
    if (currentid == end) {
      break // we have found the path
    }
    
    for (let i = 0; i < current.edges.length; i++) {
      const edgeid = current.edges[i]
      const edge = graph.edges[edgeid]
      
      // assumes graph is undirected.
      const neighbourid = edge.getOutBound(currentid)
      
      if (visited.has(neighbourid)) {
        continue
      }
      
      const neighbour = graph.nodes[neighbourid]
      const neighborPathNode = trackedpath.get(neighbourid)
      const currentPathNode = trackedpath.get(currentid)
      const cost = currentPathNode.gCost + costFunc(current.weight, neighbour.weight)
      
      if (neighborPathNode && cost < neighborPathNode.gCost) {
        neighborPathNode.gCost = cost
        neighborPathNode.parent = currentid
        
      } else if (!trackedpath.has(neighbourid)) {
        unvisited.push(neighbourid)
        trackedpath.set(neighbourid, new GraphPathNode(currentid, cost, costFunc(neighbour.weight, target.weight)))
      }
      
    }
  }
  return trackedpath
}