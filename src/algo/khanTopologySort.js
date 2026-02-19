import { Graph } from "../graph.js";

/**
 * @template T
 * @template U
 * @param {Graph<T,U>} graph 
 * @returns {import("../graph").NodeId[] | undefined}
 */
export function kahnTopologySort(graph) {
  const nodeCount = graph.getNodeCount();
  const edges = graph.getEdges();
  const inDegree = new Array(nodeCount).fill(0);

  for (let e of edges) {
    inDegree[e.to]++;
  }

  const queue = [];
  for (let i = 0; i < nodeCount; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const sorted = [];
  let head = 0;

  while (head < queue.length) {
    /**@type {import("../graph").NodeId} */
    const nodeId = queue[head];
    sorted.push(nodeId);
    for (const neigh of graph.getNeighbours(nodeId)) {
      inDegree[neigh] -= 1
      if (inDegree[neigh] === 0) {
        queue.push(neigh);
      }
    }
    head += 1;
  }
  
  return sorted.length === nodeCount ? sorted : undefined;
}
