import { GraphPath, GraphPathNode } from '../path.js';

/**
 * @template T
 * @param {Graph<T>} graph
 * @param {(start:T,end:T)=>number} costFunc
 * @param {NodeId} start
 * @param {NodeId} end
 * @returns {GraphPath}
 */
export function aStar(graph, costFunc, start, end) {
  const target = graph.getNode(end)
  const visited = new Set()
  
  // make this a priority queue
  const unvisited = [start]
  const path = new GraphPath()
  path.set(start, new GraphPathNode(undefined, 0, costFunc(graph.getNode(start).weight, target.weight)))
  
  while (unvisited.length) {
    unvisited.sort((a, b) => {
      const nodeA = graph.getNode(a)
      const nodeB = graph.getNode(b)
      const pathA = path.get(a)
      const pathB = path.get(b)
      const currentCost = pathA.fCost()
      const contenderCost = pathB.fCost()
      
      if (contenderCost < currentCost) {
        return 1
      } else {
        return -1
      }
      return 0
    })
    
    const currentid = unvisited.shift()
    const current = graph.getNode(currentid)
    visited.add(currentid)
    
    if (currentid == end) {
      break // we have found the path
    }
    
    for (let i = 0; i < current.edges.length; i++) {
      const edgeid = current.edges[i]
      const edge = graph.getEdge(edgeid)
      
      // assumes graph is undirected.
      const neighbourid = edge.getOutBound(currentid)
      
      if (visited.has(neighbourid)) {
        continue
      }
      
      const neighbour = graph.getNode(neighbourid)
      const neighborPathNode = path.get(neighbourid)
      const currentPathNode = path.get(currentid)
      const cost = currentPathNode.gCost + costFunc(current.weight, neighbour.weight)
      
      if (neighborPathNode) {
        if (cost < neighborPathNode.gCost) {
          neighborPathNode.gCost = cost
          neighborPathNode.parent = currentid
        }
      } else {
        unvisited.push(neighbourid)
        path.set(neighbourid, new GraphPathNode(currentid, cost, costFunc(neighbour.weight, target.weight)))
      }
    }
  }
  return path
}