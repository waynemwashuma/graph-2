import { GraphPath, GraphPathNode } from '../path.js';

/**
 * @template T
 * @param {Graph<T>} graph
 * @param {NodeId} start
 * @param {NodeId} end
 * @param {(start:T,end:T)=>number} costFunc
 * @returns {NodeId[]}
 */
export function aStar(graph, start, end, costFunc) {
  const target = graph.nodes[end]
  const visited = new Set()
  
  // make this a priority queue
  const unvisited = [start]
  const trackedpath = new GraphPath()
  trackedpath.set(start, new GraphPathNode())
  
  while (unvisited.length) {
    let index = 0
    let currentid = unvisited[index]
    let current = graph.nodes[currentid]
    
    // can be replaced using a priority queue as the `unvisited`
    for (let i = 1; i < unvisited.length; i++) {
      const id = unvisited[i]
      const contender = graph.nodes[id]
      const currentCost = trackedpath.get(currentid)
      const contenderCost = trackedpath.get(id)
      
      if (
        contenderCost.fCost() < currentCost.fCost() ||
        contenderCost.fCost() === currentCost.fCost() &&
        contender.hCost < current.hCost
      ) {
        index = i
        currentid = id
        current = contender
      }
    }
    
    visited.add(currentid)
    unvisited.splice(index, 1)
    
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
        neighborPathNode.hCost = costFunc(neighbour.weight, target.weight)
        neighborPathNode.parent = currentid
        
      } else if(!trackedpath.has(neighbourid)) {
        unvisited.push(neighbourid)
        trackedpath.set(neighbourid, new GraphPathNode(currentid, cost, costFunc(neighbour.weight, target.weight)))
      }
      
    }
  }
  //trackedpath.inner.forEach(console.log)
  
  return trackedpath.path(end)
}