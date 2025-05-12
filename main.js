import { Vector2, rand } from './vector2.js';
import { Graph } from './graph.js';
import { aStar } from "./algo/index.js"
const canvas = document.createElement("canvas")
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

document.body.appendChild(canvas)

/**
 * @type {Graph<Vector2>}
 */
const graph = new Graph()

generateBoxedNodes(graph, innerWidth - 100, innerHeight - 100, new Vector2(15, 15), new Vector2(50, 50))

const path = aStar(graph, 0, 104, Vector2.distanceTo)

drawGraph(graph)
drawPath(graph, path)

/**
 * @param {Graph<Vector2>} graph
 */
function drawGraph(graph) {
  ctx.strokeStyle = "lightgreen"
  
  for (let i = 0; i < graph.edges.length; i++) {
    const edge = graph.edges[i]
    const pos1 = graph.nodes[edge.from].weight
    const pos2 = graph.nodes[edge.to].weight
    
    ctx.beginPath()
    ctx.moveTo(...pos1)
    ctx.lineTo(...pos2)
    ctx.stroke()
    ctx.closePath()
  }
  ctx.fillStyle = "white"
  for (let i = 0; i < graph.nodes.length; i++) {
    const position = graph.nodes[i].weight
    ctx.beginPath()
    ctx.arc(...position, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }
}

/**
 * @param {Graph<Vector2>} graph
 * @param {NodeId} path
 */
function drawPath(graph, path) {
  if (!path.length) {
    return
  }
  ctx.beginPath()
  ctx.strokeStyle = "red"
  const start = graph.getNode(path[0])
  ctx.moveTo(...start.weight)
  for (let i = 1; i < path.length; i++) {
    const id = path[i]
    const node = graph.getNode(id)
    
    ctx.lineTo(...node.weight)
  }
  ctx.stroke()
  ctx.closePath()
}

/**
 * @param {Graph} graph
 */
function generateBoxedNodes(graph, width, height, num, offset = new Vector2()) {
  const widthX = width / num.x
  const heightY = height / num.y
  
  num.x += 1
  num.y += 1
  
  for (let y = 0; y < num.y; y++) {
    for (let x = 0; x < num.x; x++) {
      graph.addNode(
        new Vector2(
          offset.x + widthX * x,
          offset.y + heightY * y
        )
      )
    }
  }
  for (let x = 0; x < num.x - 1; x++) {
    for (let y = 0; y < num.y - 1; y++) {
      graph.addEdge(
        x + y * num.x,
        x + (y + 1) * num.x
      )
      graph.addEdge(
        x + y * num.x,
        x + y * num.x + 1
      )
    }
  }
  for (let x = (num.y - 1) * (num.x); x < num.y * num.x - 1; x++) {
    graph.addEdge(x, x + 1)
  }
  for (let y = num.y - 1; y < num.y * num.x - num.x; y += num.y) {
    graph.addEdge(
      y,
      y + num.y
    )
  }
}

/**
 * @param {Graph} graph
 */
function generateHexagonalNodes(graph, width, height, num, offset = new Vector2()) {
  const widthX = width / num.x
  const heightY = height / num.y
  num.x += 1
  num.y += 1
  
  for (let y = 0; y < num.y; y++) {
    for (let x = 0; x < num.x; x++) {
      if (y % 2 === 1 & x % 2 === 0) {
        continue
      }
      if (y % 2 === 0 & x % 2 === 1) {
        continue
      }
      graph.addNode(
        new Vector2(
          offset.x + widthX * x + (y % 2) * widthX / 2,
          offset.y + heightY * y
        )
      )
    }
  }
  
  
  for (let x = 0; x < num.x - 1; x++) {
    for (let y = 0; y < num.y - 1; y++) {
      /*graph.addEdge(
        x + y * num.x,
        x + y * num.x + 1
      )*/
    }
  }
  
  for (let y = 0; y < num.x; y++) {
    for (let x = 0; x < num.y; x++) {
      
    }
  }
}

/**
 * @param {Graph} graph
 */
function generateDiagonalBoxedNodes(graph, width, height, num, offset = new Vector2()) {
  const widthX = width / num.x
  const heightY = height / num.y
  
  num.x += 1
  num.y += 1
  
  for (let y = 0; y < num.y; y++) {
    for (let x = 0; x < num.x; x++) {
      graph.addNode(
        new Vector2(
          offset.x + widthX * x,
          offset.y + heightY * y
        )
      )
    }
  }
  for (let x = 0; x < num.x - 1; x++) {
    for (let y = 0; y < num.y - 1; y++) {
      graph.addEdge(
        x + y * num.x,
        x + (y + 1) * num.x
      )
      graph.addEdge(
        x + y * num.x,
        x + y * num.x + 1
      )
    }
  }
  for (let x = (num.y - 1) * (num.x); x < num.y * num.x - 1; x++) {
    graph.addEdge(x, x + 1)
  }
  for (let y = num.y - 1; y < num.y * num.x - num.x; y += num.y) {
    graph.addEdge(
      y,
      y + num.y
    )
  }
  for (let x = 0; x < num.x - 1; x++) {
    for (let y = 0; y < num.y - 1; y++) {
      graph.addEdge(
        x + y * num.x,
        x + (y + 1) * num.x + 1
      )
    }
  }
}
/**
 * @param {Graph} graph
 */
function generateRandomNodes(graph, number, width, height) {
  for (let i = 0; i < number; i++) {
    const node = new Vector2(
      rand(0, width),
      rand(0, height)
    )
    graph.addNode(node)
  }
  
  for (let i = 0; i < graph.nodes.length; i++) {
    for (let j = 0; j < graph.nodes.length; j++) {
      if (
        i !== j &&
        rand() >= 0.95
      ) {
        graph.addEdge(i, j)
      }
    }
  }
}