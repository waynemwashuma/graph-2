export function kahnTopologySort(graph) {
  const nodeCount = graph.getNodeCount();
  const inDegree = new Array(nodeCount).fill(0);

  for (let e of graph.edges) {
    inDegree[e.to]++;
  }

  const queue = [];
  for (let i = 0; i < nodeCount; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const sorted = [];
  let head = 0;

  while (head < queue.length) {
    const nodeId = queue[head];
    head += 1;
    sorted.push(nodeId);
    for (let neigh of graph.getNeighbours(nodeId)) {
      if (--inDegree[neigh] === 0) {
        queue.push(neigh);
      }
    }
  }
  
  return sorted.length === nodeCount ? sorted : undefined;
}
