/**
 * Depth-First Search
 *
 * @template T,U
 * @param {Graph<T,U>} graph
 * @param {NodeId} start
 * @param {(nodeId: NodeId) => void} visit
 */
export function dfs(graph, start, visit) {
  const nodeCount = graph.getNodeCount()
  const visited = new Array(nodeCount).fill(false)
  const stack = []

  stack.push(start)

  while (stack.length > 0) {
    const nodeId = stack.pop()

    if (visited[nodeId]) continue

    visited[nodeId] = true
    visit(nodeId)

    for (const neighbour of graph.getNeighbours(nodeId)) {
      if (!visited[neighbour]) {
        stack.push(neighbour)
      }
    }
  }
}