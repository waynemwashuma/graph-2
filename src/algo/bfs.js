/**
 * Breadth-First Search
 *
 * @template T, U
 * @param {Graph<T, U>} graph
 * @param {NodeId} start
 * @param {(nodeId: NodeId) => void} visit
 */
export function bfs(graph, start, visit) {
  const nodeCount = graph.getNodeCount()
  const visited = new Array(nodeCount).fill(false)
  const queue = []

  visited[start] = true
  queue.push(start)

  while (queue.length > 0) {
    const nodeId = queue.shift()

    visit(nodeId)

    for (const neighbour of graph.getNeighbours(nodeId)) {
      if (!visited[neighbour]) {
        visited[neighbour] = true
        queue.push(neighbour)
      }
    }
  }
}