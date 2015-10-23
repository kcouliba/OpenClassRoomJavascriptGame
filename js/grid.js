/*
** grid.js
** Author coulibaly.d.kevin@gmail.com
** Date 23/10/2015
** Grid definition
*/

/** Constants values **/
const SIZE = 10;
const MAX_OBSTACLE_COUNT = (SIZE * SIZE) * .1;
const FREE = 0; // Free place on the grid

/*
** Grid Class
*/
var Grid = {
    size: SIZE,
    obstacles: Math.floor(Math.random() * MAX_OBSTACLE_COUNT), // Count of obstacles on the grid
    grid: [],
    
    /*
    ** init
    ** Constructor
    */
    init: function() {
        this.grid = generateGrid(this.size, this.obstacles);
        if (DEBUG) {
            console.log("New grid created.");
        }
    },
    
    /*
    ** toString
    ** Returns a string representation of the instance
    ** @return String
    */
    toString: function() {
        var grid = "";
        
        for (var i = 0; i < this.size; i++) {
            var line = "";
            for (var j = 0; j < this.size; j++) {
                line += this.grid[i * this.size + j]
            }
            line.trim();
            grid += line + "\n";
        }
        return (grid);
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
        if ((Math.round(Math.random() * 100) < 15) && (obstacleCount-- > 0)) {
            grid.push(1);
        } else {
            grid.push(0);
        }
    }
    if (DEBUG) {
        console.log("New grid randomly generated.");
    }
    return (grid);
}