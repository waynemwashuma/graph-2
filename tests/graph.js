const graph = new Graph()
const node1 = graph.addNode("Here")
const node2 = graph.addNode("There")
const node3 = graph.addNode("Somewhere")


graph.addEdge(node1, node2, 1)
graph.addEdge(node1, node3, 1)
graph.addEdge(node2, node3, 2)

const neighbours = graph.getNeighbours(node1)
// console.log(graph)
// if(neighbours)console.log([...neighbours])