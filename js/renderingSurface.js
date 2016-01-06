/*
** RenderingSurface
** Surface which graphics elements are displayed on
*/

const RenderingSurface = {
    surface: null,
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    grid: null,

    /*
    ** init
    ** initializes rendering surface
    ** @param grid : the grid to display
    */
    init: function(grid) {
        this.surface = document.getElementById('renderingSurface');
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.width = 480;
        this.height = 480;
        this.grid = grid

        return (this);
    },

    /*
    ** draw
    ** calls drawn layers in defined order so they do ovelap properly
    */
    draw: function() {
        this.drawGrid();
    },

    /*
    ** drawGrid
    ** Draws grid information on rendering surface
    */
    drawGrid: function() {
        var grid = this.grid;
        var step = this.width / grid.size;

        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";
        this.canvas.style.marginLeft = ((this.surface.clientWidth - this.width) / 2) + "px"; // Centering
        this.canvas.style.marginTop = ((this.surface.clientHeight - this.height) / 2) + "px"; // Centering
        for (var j = 0; j < grid.size; j++) {
            for (var i = 0; i < grid.size; i++) {
                if (grid.grid[i + (j * grid.size)] === CELLSTATE.FREE) {
                    this.ctx.fillStyle = COLOR.GREEN;
                    this.ctx.fillRect(i * step, j * step, step, step);
                } else if (grid.grid[i + (j * grid.size)] === CELLSTATE.OBSTACLE) {
                    this.ctx.fillStyle = COLOR.RED;
                    this.ctx.fillRect(i * step, j * step, step, step);
                } else if (grid.grid[i + (j * grid.size)] === CELLSTATE.WEAPON) {
                    this.ctx.fillStyle = COLOR.BLUE;
                    this.ctx.fillRect(i * step, j * step, step, step);
                } else if (grid.grid[i + (j * grid.size)] === CELLSTATE.PLAYER1) {
                    this.ctx.fillStyle = COLOR.BLACK;
                    this.ctx.fillRect(i * step, j * step, step, step);
                } else if (grid.grid[i + (j * grid.size)] === CELLSTATE.PLAYER2) {
                    this.ctx.fillStyle = COLOR.YELLOW;
                    this.ctx.fillRect(i * step, j * step, step, step);
                }
                this.ctx.strokeStyle = COLOR.BLUE;
                this.ctx.strokeRect(i * step, j * step, step, step);
            }
        }
        this.ctx.strokeWidth = "2px";
        this.ctx.strokeStyle = COLOR.RED;
        this.ctx.strokeRect(0 * step, 0 * step, step, step);
    },

    /*
    ** update
    ** refresh drawing surface (supposedly clears the surface then draw again)
    */
    update: function() {
        this.draw();
    }
};
