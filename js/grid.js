/*
** grid.js
** Author coulibaly.d.kevin@gmail.com
** Date 23/10/2015
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
        free: 0,
        obstacle: 1,
        player: 2,
        weapon: 3
    },
    
    /*
    ** init
    ** Constructor
    ** @param size : int
    ** @return this : Grid
    */
    init: function(size) {
        this.size = parseInt(size, 10);
        this.obstacles = Math.floor(Math.random() * (this.size - 1)); // Count of obstacles on the grid -1 to ease the map generator
        this.grid = generateGrid(this.size, this.obstacles);
        if (DEBUG) {
            console.log("New grid created.");
        }
        return (this);
    },
    
    /* new
    ** Returns a new generated grid
    ** @param size : int
    ** @return grid : Grid
    */
    new: (function() {
        return (function (size) {
            return (Object.create(Grid).init(size));
        });
    })(),
    
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
        if ((Math.round(Math.random() * cellsCount) < 15) && (obstacleCount-- > 0)) {
            grid.push(Grid.CELLSTATE.obstacle);
        } else {
            grid.push(Grid.CELLSTATE.free);
        }
    }
    if (DEBUG) {
        console.log("New grid randomly generated.");
    }
    return (grid);
}