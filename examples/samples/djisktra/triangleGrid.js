import { Vector2 } from '../../../vector2.js';
import { drawAllPaths, drawGraph, generateTriangleNodes, } from '../utils.js'
import { Graph } from '../../../graph.js';
import { dijkstra } from "../../../algo/index.js"
const canvas = document.createElement("canvas")
const ctx = canvas.getContext('2d')

if(!ctx){
  throw "No canvas 2d context!"
}

canvas.width = innerWidth
canvas.height = innerHeight

document.body.appendChild(canvas)

/**
 * @type {Graph<Vector2>}
 */
const graph = new Graph(false)

generateTriangleNodes(graph, innerWidth - 100, innerHeight - 100, new Vector2(15, 15), new Vector2(50, 50))
const start = 0
const path = dijkstra(graph, Vector2.distanceTo, start)

drawGraph(ctx, graph)
drawAllPaths(ctx, graph, path)