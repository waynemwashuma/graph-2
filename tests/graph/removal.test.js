
function testRemoveEdgeHead() {
  const g = new Graph(true)
  
  const a = g.addNode("A")
  const b = g.addNode("B")
  
  const e1 = g.addEdge(a, b, 1)
  const e2 = g.addEdge(a, b, 2)
  
  g.removeEdge(e1)
  
  // Remaining edge must still be reachable
  const neighbors = [...g.getNeighbours(a)]
  assert(neighbors.length === 1, "Neighbor count wrong")
  
  console.log("✅ testRemoveEdgeHead passed")
}

function testRemoveEdgeMiddle() {
  const g = new Graph(true)
  
  const a = g.addNode("A")
  const b = g.addNode("B")
  const c = g.addNode("C")
  
  const e1 = g.addEdge(a, b, 1)
  const e2 = g.addEdge(a, c, 2)
  const e3 = g.addEdge(b, c, 3)
  
  const originalEdgeCount = g.getEdgeCount()
  
  g.removeEdge(e2)
  
  // Edge count must shrink
  assert(g.getEdgeCount() === originalEdgeCount - 1)
  
  // No edge should reference invalid ids
  for (const edge of g.getEdges()) {
    assert(edge.from < g.getNodeCount(), "Invalid from")
    assert(edge.to < g.getNodeCount(), "Invalid to")
  }
  
  console.log("✅ testRemoveEdgeMiddle passed")
}

function testRemoveNodeWithEdges() {
  const g = new Graph(true)
  
  const a = g.addNode("A")
  const b = g.addNode("B")
  const c = g.addNode("C")
  const d = g.addNode("D")
  
  g.addEdge(a, b, 1)
  g.addEdge(b, c, 2)
  g.addEdge(c, d, 3)
  g.addEdge(a, d, 4)
  g.addEdge(d, b, 5)
  
  const originalNodeCount = g.getNodeCount()
  
  g.removeNode(b)
  
  // Node count reduced
  assert(g.getNodeCount() === originalNodeCount - 1)
  
  // No edge references removed node id
  for (const edge of g.getEdges()) {
    assert(edge.from < g.getNodeCount(), "Edge.from invalid")
    assert(edge.to < g.getNodeCount(), "Edge.to invalid")
  }
  
  console.log("✅ testRemoveNodeWithEdges passed")
}

function testRemoveLastNode() {
  const g = new Graph(true)

  const a = g.addNode("A")
  const b = g.addNode("B")

  g.addEdge(a, b, 1)

  g.removeNode(b)

  assert(g.getNodeCount() === 1)
  assert(g.getEdgeCount() === 0)

  console.log("✅ testRemoveLastNode passed")
}