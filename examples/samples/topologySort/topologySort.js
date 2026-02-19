import { Graph } from "../../../graph.js"
import { Vector2, mapToIndex2D } from "../../../vector2.js"
import { kahnTopologySort } from "../../../algo/index.js"


const nodeRadius = 10
class MyNode {
    /**
     * @param {string} name
     * @param {string} colour
     * @param {Vector2} pos
     */
    constructor(name, colour, pos) {
        this.pos = pos
        this.colour = colour
        this.name = name
    }
}
document.body.style.marginTop = "10%"
const graphDiv = document.createElement('div');
graphDiv.style.flex = '1';
graphDiv.style.border = '1px solid #ccc';
graphDiv.style.position = 'relative';
graphDiv.style.overflow = 'hidden';
document.body.appendChild(graphDiv);

const canvas = document.createElement("canvas");
canvas.style.flex = "1";
canvas.style.border = "1px solid #ccc";
document.body.appendChild(canvas);
graphDiv.appendChild(canvas)

const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const controls = document.createElement('div');
controls.style.padding = '5px';
controls.style.borderTop = '1px solid #ccc';
controls.style.display = 'flex';
controls.style.flexDirection = 'column';
document.body.appendChild(controls);

// Sorted display
const sortedDiv = document.createElement('div');
sortedDiv.style.fontWeight = 'bold';
controls.appendChild(sortedDiv);

// Instructions
const instrDiv = document.createElement('div');
instrDiv.innerText = "Click 'Add Node' to start.";
controls.appendChild(instrDiv);

// Buttons
const addNodeBtn = document.createElement('button');
addNodeBtn.innerText = 'Add Node';
controls.appendChild(addNodeBtn);
const addEdgeBtn = document.createElement('button');
addEdgeBtn.innerText = 'Add Edge';
controls.appendChild(addEdgeBtn);
const sortBtn = document.createElement('button');
sortBtn.innerText = 'Run Topological Sort';
controls.appendChild(sortBtn);

/**@type {Graph<MyNode>} */
const graph = new Graph(true);
/**@type {import("../../../graph.js").EdgeId | null} */
let edgeFrom = null;

function draw() {
    if (!ctx) {
        throw "No canvas 2d context!"
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNodes(ctx);
    drawEdges(ctx);
    requestAnimationFrame(draw)
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 */
function drawNodes(ctx) {
    const nodes = graph.getNodes()
    for (let id = 0; id < nodes.length; id++) {
        const node = graph.getNode(id)?.weight;
        if (!node) {
            continue
        }
        const { pos, colour, name } = node;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = colour;
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, pos.x, pos.y);
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 */
function drawEdges(ctx) {
    const edges = graph.getEdges()
    
    for (let e of edges) {
        const from = graph.getNode(e.from)?.weight.pos;
        const to = graph.getNode(e.to)?.weight.pos;

        if (!from || !to) {
            continue
        }
        const dir = new Vector2(to.x - from.x, to.y - from.y);
        const length = Math.hypot(dir.x, dir.y);
        const nx = dir.x / length;
        const ny = dir.y / length;

        const startX = from.x + nx * nodeRadius;
        const startY = from.y + ny * nodeRadius;
        const endX = to.x - nx * nodeRadius;
        const endY = to.y - ny * nodeRadius;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "white";
        ctx.stroke();

        const arrowSize = 10;
        const angle = Math.atan2(endY - startY, endX - startX);

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - arrowSize * Math.cos(angle - Math.PI / 6),
            endY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            endX - arrowSize * Math.cos(angle + Math.PI / 6),
            endY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
    }
}

/**
 * @type {import("../../../graph.js").NodeId | null}
 */
let draggingNode = null;
/**
 * @type {Vector2}
 */
let dragOffset = new Vector2();

canvas.addEventListener("pointerdown", (e) => {
    const mouse = getMousePos(e);
    const nodes = graph.getNodes()
    for (let id = 0; id < nodes.length; id++) {
        const node = nodes[id]
        const { pos } = node.weight;
        const dist = Math.hypot(mouse.x - pos.x, mouse.y - pos.y);

        if (dist <= nodeRadius) {
            if (edgeFrom === null) {
                edgeFrom = id;
            } else if (edgeFrom !== id) {

                graph.addEdge(edgeFrom, id, undefined);
                edgeFrom = null;
            }
            draggingNode = id;
            dragOffset = new Vector2(
                mouse.x - pos.x,
                mouse.y - pos.y
            );
        }
    }
});

canvas.addEventListener("pointermove", (e) => {
    if (draggingNode !== null) {
        const node = graph.getNode(draggingNode)?.weight
        const mouse = getMousePos(e);

        if (node) {
            node.pos.set(
                mouse.x - dragOffset.x,
                mouse.y - dragOffset.y
            );
        }
    }
});

canvas.addEventListener("pointerup", () => {
    draggingNode = null;
});

addNodeBtn.addEventListener('click', () => {
    const height = 5
    const width = 5
    const offset = new Vector2(
        canvas.width / width,
        canvas.height / height
    )
    const count = graph.getNodeCount()
    const position = mapToIndex2D(count, width - 1)
    
    graph.addNode(new MyNode(
        `N${count}`,
        "#0077FF",
        position.multiply(offset).add(offset)
    ));
    instrDiv.innerText = "Drag nodes to move. Use 'Add Edge' to connect nodes.";
});

addEdgeBtn.addEventListener('click', () => {
    instrDiv.innerText = 'Click two nodes to create an edge.'
});

sortBtn.addEventListener('click', () => {
    runTopologicalSort();
});

function runTopologicalSort() {
    console.log(graph)
    const results = kahnTopologySort(graph)

    if (!results) {
        alert("A cycle has been detected in the graph")
        return
    }

    sortedDiv.innerText = 'Sorted Array: [' + results.map(n => graph.getNode(n)?.weight.name).join(', ') + ']';
}

/**
 * @param {PointerEvent} evt
 */
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return new Vector2(
        evt.clientX - rect.left,
        evt.clientY - rect.top
    );
}

requestAnimationFrame(draw)