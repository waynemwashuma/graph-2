import { Graph } from "../../graph.js"
import { Vector2, rand } from "../../vector2.js"

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Graph<Vector2>} graph
 */
export function drawGraph(ctx,graph) {
  const edges = graph.getEdges()
  const nodes = graph.getNodes()
  ctx.strokeStyle = "lightgreen"
  
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i]
    const pos1 = graph.getNode(edge.from)?.weight
    const pos2 = graph.getNode(edge.to)?.weight
    
    if(pos1 && pos2){ 
      ctx.beginPath()
      ctx.moveTo(pos1.x,pos1.y)
      ctx.lineTo(pos2.x,pos2.y)
      ctx.stroke()
      ctx.closePath()
    }
  }
  ctx.fillStyle = "white"
  for (let i = 0; i < nodes.length; i++) {
    const position = nodes[i].weight
    ctx.beginPath()
    ctx.arc(position.x,position.y, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Graph<Vector2>} graph
 * @param {import("../../graph").NodeId[]} path
 */
export function drawPath(ctx,graph, path) {
  if (!path.length) {
    return
  }
  ctx.beginPath()
  ctx.strokeStyle = "red"
  const start = graph.getNode(path[0])?.weight

  if(!start){
    return
  }
  ctx.moveTo(start.x,start.y)
  for (let i = 1; i < path.length; i++) {
    const id = path[i]
    const node = graph.getNode(id)?.weight
    
    if (node) {
      ctx.lineTo(node.x,node.y)
    }
  }
  ctx.stroke()
  ctx.closePath()
}

/**
 * @param {Graph} graph
 * @param {number} width
 * @param {number} height
 * @param {Vector2} num
 * @param {Vector2} offset
 */
export function generateBoxedNodes(graph, width, height, num, offset = new Vector2()) {
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
        x + (y + 1) * num.x,
        undefined
      )
      graph.addEdge(
        x + y * num.x,
        x + y * num.x + 1,
        undefined
      )
    }
  }
  for (let x = (num.y - 1) * (num.x); x < num.y * num.x - 1; x++) {
    graph.addEdge(x, x + 1, undefined)
  }
  for (let y = num.y - 1; y < num.y * num.x - num.x; y += num.y) {
    graph.addEdge(
      y,
      y + num.y,
      undefined
    )
  }
}

/**
 * @param {Graph} graph
 * @param {number} width
 * @param {number} height
 * @param {Vector2} num
 * @param {Vector2} offset
 */
export function generateHexagonalNodes(graph, width, height, num, offset = new Vector2()) {
  const widthX = width / num.x
  const heightY = height / num.y
  num.x += 1
  num.y += 1
  
  for (let y = 0; y < num.y; y++) {
    for (let x = 0; x < num.x; x++) {
      if (y % 2 === 1 && x % 2 === 0) {
        continue
      }
      if (y % 2 === 0 && x % 2 === 1) {
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
 * @param {number} width
 * @param {number} height
 * @param {Vector2} num
 * @param {Vector2} offset
 */
export function generateDiagonalBoxedNodes(graph, width, height, num, offset = new Vector2()) {
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
        x + (y + 1) * num.x,
        undefined
      )
      graph.addEdge(
        x + y * num.x,
        x + y * num.x + 1,
        undefined
      )
    }
  }
  for (let x = (num.y - 1) * (num.x); x < num.y * num.x - 1; x++) {
    graph.addEdge(x, x + 1, undefined)
  }
  for (let y = num.y - 1; y < num.y * num.x - num.x; y += num.y) {
    graph.addEdge(
      y,
      y + num.y,
      undefined
    )
  }
  for (let x = 0; x < num.x - 1; x++) {
    for (let y = 0; y < num.y - 1; y++) {
      graph.addEdge(
        x + y * num.x,
        x + (y + 1) * num.x + 1,
        undefined
      )
    }
  }
}

/**
 * @param {Graph<Vector2, undefined>} graph
 * @param {number} number
 * @param {number} width
 * @param {number} height
 */
export function generateRandomNodes(graph, number, width, height) {
  for (let i = 0; i < number; i++) {
    const node = new Vector2(
      rand(0, width),
      rand(0, height)
    )
    graph.addNode(node)
  }
  
  const nodes = graph.getNodes()
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (
        i !== j &&
        rand() >= 0.95
      ) {
        graph.addEdge(i, j, undefined)
      }
    }
  }
}