import { Vector2, rand } from './vector2.js';
import {} from '../utils.js'
import { Graph } from './graph.js';
import { aStar,dijkstra } from "./algo/index.js"
const canvas = document.createElement("canvas")
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

document.body.appendChild(canvas)

/**
 * @type {Graph<Vector2>}
 */
const graph = new Graph(false)

generateDiagonalBoxedNodes(graph, innerWidth - 100, innerHeight - 100, new Vector2(15, 15), new Vector2(50, 50))
const start = 0
const end = 104
const path = aStar(graph,Vector2.distanceTo, start, end)

drawGraph(graph)
drawPath(graph, path.path(end))