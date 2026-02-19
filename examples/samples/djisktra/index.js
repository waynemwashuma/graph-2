const grid = new URL('./boxGrid.js', import.meta.url)
const hexagon = new URL('./hexagonGrid.js', import.meta.url)
const triangle = new URL('./triangleGrid.js', import.meta.url)

export default {
  'box grid': grid,
  'triangle grid': triangle,
  'hexagon grid': hexagon
}
