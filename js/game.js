/*
** game.js
** Author coulibaly.d.kevin@gmail.com
** Date 29/10/2015
** A game class
*/

var Game = {
    grid: null,
    weapons: [],
    players: [],

    // Sub class Position
    Position: {
        x: 0,
        y: 0,

        new: function(x, y) {
            var self = Object.create(this);

            self.x = x;
            self.y = y;
            return (self);
        },

        toString: function () {
            return ("(" + this.x + ", " + this.y + ")");
        }
    },

    // Sub class of a game element with element position
    Element: {
        position: null,

        setPosition: function (x, y) {
            this.position.x = x;
            this.position.y = y;
            return (this);
        },

        getPosition: function () {
            return (this.position);
        },

        new: function(object) {
            var self = Object.create(this);

            for (attr in object) {
                self[attr] = object[attr];
            }
            self.position = Game.Position.new(0, 0);
            return (self);
        }
    },

    /*
    ** init
    ** Initializes a game
    */
    init: function() {
        this.placeElements();
        return (this);
    },

    /*
    ** new
    ** Returns a new Game instance
    ** @param grid : Grid object
    ** @param weapons : Weapon Array
    ** @param players : Player Array
    ** @return this : Game instance
    */
    new: function(grid, weapons, players) {
        var self = Object.create(this);
        
        self.grid = grid;
        for (var i = 0; i < weapons.length; i++) {
            self.weapons.push(this.Element.new(weapons[i]));
        }
        for (var i = 0; i < players.length; i++) {
            self.players.push(this.Element.new(players[i]));
        }
        if (DEBUG) {
            console.log("A new game has been created.");
        }
        return (self);
    },
    
    /*
    ** placeElements
    ** Places elements on grid
    ** @return this : Game instance
    */
    placeElements: function() {
        this.placePlayers();
//        this.placeWeapons();
        return (this);
    },

    /*
    ** placePlayers
    ** Places players on grid
    ** @return this : Game instance
    */
    placePlayers: function() {
        // Place player1
        for (var i = 0; i < Math.floor(this.grid.size / 2); i++) {
            var placed = false;

            for (var j = 0; j < Math.floor(this.grid.size / 2); j++) {
                if (this.grid.grid[i + (j * this.grid.size)] === Grid.CELLSTATE.free) {
                    this.grid.grid[i + (j * this.grid.size)] = Grid.CELLSTATE.player;
                    this.players[0].setPosition(i, j);
                    placed = true;
                    break ;
                }                
            }
            if (placed) {
                if (DEBUG) {
//                    console.log(this.players[0]);
                    console.log(this.players[0] + ", placed at position " + this.players[0].getPosition());
                }
                break ;
            }
        }
        // Place player2
        for (var i = this.grid.size - 1; i > Math.floor(this.grid.size / 2); i--) {
            var placed = false;

            for (var j = this.grid.size - 1; j > Math.floor(this.grid.size / 2); j--) {
                if (this.grid.grid[i + (j * this.grid.size)] === Grid.CELLSTATE.free) {
                    this.grid.grid[i + (j * this.grid.size)] = Grid.CELLSTATE.player;
                    this.players[1].setPosition(i, j);
                    placed = true;
                    break ;
                }                
            }
            if (placed) {
                if (DEBUG) {
                    console.log(this.players[1]);
                    console.log(this.players[1] + ", placed at position " + this.players[1].getPosition());
                }
                break ;
            }
        }
        return (this);
    }
};