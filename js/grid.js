/*
** grid.js
** Author coulibaly.d.kevin@gmail.com
** Date 29/10/2015
** Grid definition
*/

/*
** Grid Class
*/
var Grid = {
    size: 0,
    obstacles: 0,
    grid: [],
    CELLSTATE: {
        PLAYER1: 0,
        PLAYER2: 1,
        FREE: 2,
        OBSTACLE: 3,
        WEAPON:4
    },
    
    /*
    ** stateAt
    ** Returns the cell state at coords
    ** @param x : int
    ** @param y : int
    ** @return CELLSTATE : int
    */
    stateAt: function(x, y) {
        if (DEBUG) {
            console.log("State at (" + x + ", " + y + ") = " + this.grid[x + (y * this.size)]);
        }
        return (this.grid[x + (y * this.size)]);
    },
    
    /* new
    ** Returns a new generated grid
    ** @param size : int
    ** @return grid : Grid
    */
    new: function (size) {
        var self = Object.create(this);
        
        self.size = parseInt(size, 10);
        self.obstacles = Math.floor(Math.random() * (self.size - 1)); // Count of obstacles on the grid -1 to ease the map generator
        self.grid = generateGrid(self.size, self.obstacles);
        if (DEBUG) {
            console.log("New grid created.");
            console.log(self);
            console.log(self.toString());
        }
        return (self);
    },
    
    /*
    ** toString
    ** Returns a string representation of the instance
    ** @return String
    */
    toString: function() {
        return ("Grid with dimension " + this.size + " x " + this.size);
    }
};

/*
** generateGrid
** Randomly generates a grid
** @param size : Number
** @param obstacleCount : Number
** @return Array
*/
function generateGrid(size, obstacleCount) {
    var cellsCount = size * size;
    var row = 0;
    var grid = [];
    
    for (var i = 0; i < cellsCount; i++) {
        row += (i % 10 == 0) ? 1 : 0;
        if ((Math.round(Math.random() * cellsCount) < 15) && (obstacleCount-- > 0)) {
            grid.push(Grid.CELLSTATE.OBSTACLE);
        } else {
            grid.push(Grid.CELLSTATE.FREE);
        }
    }
    if (DEBUG) {
        console.log("New grid randomly generated.");
    }
    return (grid);
}