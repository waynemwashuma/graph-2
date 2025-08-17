import { GraphPath, GraphPathNode } from '../path.js';
import { PriorityQueue } from '../priorityqueue.js';

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
  const unvisited = new PriorityQueue((a, b) => a[1] < b[1])
  const path = new GraphPath()
  
  unvisited.push([start, 0])
  path.set(start, new GraphPathNode(undefined, 0, costFunc(graph.getNode(start).weight, target.weight)))
  
  while (unvisited.size()) {
    const currentid = unvisited.pop()[0]
    const current = graph.getNode(currentid)
    visited.add(currentid)
    
    if (currentid == end) {
      break // we have found the path
    }
    for (const neighbourid of graph.getNeighbours(currentid)) {
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
        unvisited.push([neighbourid, cost])
        path.set(neighbourid, new GraphPathNode(currentid, cost, costFunc(neighbour.weight, target.weight)))
      }
    }
  }
  return path
}