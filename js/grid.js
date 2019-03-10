/**
 * @name grid.js
 * @author Kevin Coulibaly <coulibaly.d.kevin@gmail.com>
 */

/**
 * @name Grid
 * @description Grid class
 * @param {Number} size
 */
function Grid(size) {
  this.size = parseInt(size, 10)
  this.grid = generateGrid(size)

  if (DEBUG) {
    console.log('New grid created.')
    console.log(this)
  }

  /**
   * @name getCellState
   * @description Returns the cell state at coords
   * @param {Number} x
   * @param {Number} y
   * @return {CELLSTATE}
   */
  this.getCellState = function(x, y) {
    if (DEBUG) {
      console.log(
        'State at (' + x + ', ' + y + ') = ' + this.grid[x + y * this.size]
      )
    }
    return this.grid[x + y * this.size]
  }

  /**
   * @name toString
   * @description Returns a string representation of the instance
   * @return {String}
   */
  this.toString = function() {
    return 'Grid with dimension ' + this.size + ' x ' + this.size
  }

  return this
}

/**
 * @name generateGrid
 * @description Randomly generates a grid
 * @param {Number} size
 * @return {Array}
 */
function generateGrid(size) {
  const cellsCount = size * size
  const grid = []
  let obstacleCount = Math.floor(Math.random() * (size - 1)) // Count of obstacles on the grid -1 to ease the map generator

  for (let i = 0; i < cellsCount; i++) {
    if (Math.round(Math.random() * cellsCount) < 15 && obstacleCount-- > 0) {
      grid.push(CELLSTATE.OBSTACLE)
    } else {
      grid.push(CELLSTATE.FREE)
    }
  }
  if (DEBUG) {
    console.log('New grid randomly generated.')
  }
  return grid
}
