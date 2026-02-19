import { Graph } from "../graph.js"
import { GraphPath, GraphPathNode } from "../path.js"

/**
 * @template T
 * @template U
 * @param {Graph<T,U>} graph
 * @param {(a: T, b: T) => number} costFunc
 * @param {import("../graph").NodeId} start
 * @param {import("../graph").NodeId} end
 */
export function dijkstra(graph, costFunc, start, end) {
  const visited = new Set()
  const unvisited = [start]
  const path = new GraphPath()

  while (unvisited.length) {
    unvisited.sort((a, b) =>
      (path.get(a)?.gCost ?? Infinity) -
      (path.get(b)?.gCost ?? Infinity)
    )

    const currentid = unvisited.shift()
    if (currentid === undefined) break

    if (end !== undefined && currentid === end) {
      break
    }

    visited.add(currentid)
    const current = graph.getNode(currentid)
    const currentPathNode = path.getOrSet(currentid)

    if (!current) {

    }
    for (const neighbourid of graph.getNeighbours(currentid)) {
      if (visited.has(neighbourid)) continue

      const neighbour = graph.getNode(neighbourid)
      const cost =
        currentPathNode.gCost + (
          (current && neighbour) ?
            costFunc(current.weight, neighbour.weight) :
            0
        )

      const neighborPathNode = path.get(neighbourid)

      if (neighborPathNode) {
        if (cost < neighborPathNode.gCost) {
          neighborPathNode.gCost = cost
          neighborPathNode.parent = currentid
        }
      } else {
        unvisited.push(neighbourid)
        path.set(neighbourid, new GraphPathNode(currentid, cost))
      }
    }
  }

  return path
}
