/*
** game.js
** Author coulibaly.d.kevin@gmail.com
** Date 29/10/2015
** A game class
*/

var Game = {
    run: false,
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
        
        add: function(position) {
            return (this.new(this.x + position.x, this.y + position.y));
        },
        
        sub: function(position) {
            return (this.new(this.x - position.x, this.y - position.y));
        },
        
        clone: function(rhs) {
            if (this != rhs) {
                return (this.new(rhs.x, rhs.y));
            }
        },

        equals: function(position) {
            return ((this.x === position.x) && (this.y === position.y));
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
    ** @param grid : Grid object
    ** @param weapons : Weapon Array
    ** @param players : Player Array
    ** @return this : Game instance
    */
    init: function(grid, weapons, players) {
        this.grid = grid;
        for (var i = 0; i < weapons.length; i++) {
            this.weapons.push(this.Element.new(weapons[i]));
        }
        for (var i = 0; i < players.length; i++) {
            this.players.push(this.Element.new(players[i]));
        }
        this.placeElements();
        if (DEBUG) {
            console.log("Game starts.");
        }
        return (this);
    },
    
    start: function() {
        this.run = true;
    },
    
    running: function() {
        return (this.run);
    },
    
    stop: function() {
        this.run = false;
    },

    /*
    ** new
    ** Returns a new Game instance
    ** @return this : Game instance
    */
    new: function() {
        if (DEBUG) {
            console.log("A new game has been created.");
        }
        return (Object.create(this));
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
    
    getWeaponAt: function(x, y) {
        var at = this.Position.new(x, y);
        
        for (key in this.weapons) {
            if (this.weapons[key].position.equals(at)) {
                return (this.weapons[key]);
            }
        }
    },

    /*
    ** placePlayers
    ** Places players on grid
    ** @return this : Game instance
    */
    placePlayers: function() {
        // Place player1
        for (var j = 0; j < Math.floor(this.grid.size / 2); j++) {
            var placed = false;

            for (var i = 0; i < Math.floor(this.grid.size / 2); i++) {
                if (this.grid.grid[i + (j * this.grid.size)] === Grid.CELLSTATE.free) {
                    this.grid.grid[i + (j * this.grid.size)] = Grid.CELLSTATE.player;
                    this.players[0].setPosition(i, j);
                    placed = true;
                    break ;
                }                
            }
            if (placed) {
                if (DEBUG) {
                    console.log(this.players[0] + ", placed at position " + this.players[0].getPosition());
                }
                break ;
            }
        }
        // Place player2
        for (var j = this.grid.size - 1; j > Math.floor(this.grid.size / 2); j--) {
            var placed = false;

            for (var i = this.grid.size - 1; i > Math.floor(this.grid.size / 2); i--) {
                if (this.grid.grid[i + (j * this.grid.size)] === Grid.CELLSTATE.free) {
                    this.grid.grid[i + (j * this.grid.size)] = Grid.CELLSTATE.player;
                    this.players[1].setPosition(i, j);
                    placed = true;
                    break ;
                }                
            }
            if (placed) {
                if (DEBUG) {
                    console.log(this.players[1] + ", placed at position " + this.players[1].getPosition());
                }
                break ;
            }
        }
        return (this);
    },
    
    getPlayer: function(id) {
        return (this.players[id]);
    },
    
    /*
    ** movePlayer
    ** Moves a player to a new position
    ** Returns player after move
    ** @param id : int
    ** @param stepx : int
    ** @param stepy : int
    ** @return player : Player
    */
    movePlayer: function(player, stepx, stepy) {
        var currentPos = this.Position.clone(player.getPosition());
        var move = this.Position.new(stepx, stepy);
        var nextPos = currentPos.add(move);
        var grid = this.grid;
        
        if (DEBUG) {
            console.log("Before computing");
            console.log("Grid state ==> ");
            console.log(grid);
            console.log("Player selected is at position : " + currentPos);
            console.log("Move input is : " + move);
            console.log("Player next position should be : " + nextPos);
        }
        
        if (stepx < 0) { // moving left
            if (DEBUG) {
                console.log("Player " + player.name + " is moving left");
            }
            for (var i = currentPos.x - 1; i >= nextPos.x; i--) {
                if (grid.stateAt(i, currentPos.y) === Grid.CELLSTATE.weapon) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(i, currentPos.y));
                } else if (grid.stateAt(i, currentPos.y) !== Grid.CELLSTATE.free) { // obstacle or player encountered
                    if (DEBUG) {
                        console.log("Player " + player.name + " encountered an obstacle at : " + this.Position.new(i, currentPos.y));
                    }
                    nextPos.x = i + 1;
                    break ;
                }
            }
        } else if (stepx > 0) { // moving right
            if (DEBUG) {
                console.log("Player " + player.name + " is moving right");
            }
            for (var i = currentPos.x + 1; i <= nextPos.x; i++) {
                if (grid.grid[i + (currentPos.y * grid.size)] === Grid.CELLSTATE.weapon) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(i, currentPos.y));
                } else if (grid.stateAt(i, currentPos.y) !== Grid.CELLSTATE.free) { // obstacle or player encountered
                    if (DEBUG) {
                        console.log("Player " + player.name + " encountered an obstacle at : " + this.Position.new(i, currentPos.y));
                    }
                    nextPos.x = i - 1;
                    break ;
                }
            }
        }
        if (stepy < 0) { // moving up
            if (DEBUG) {
                console.log("Player " + player.name + " is moving up");
            }
            for (var i = currentPos.y - 1; i >= nextPos.y; i--) {
                if (grid.stateAt(nextPos.x, i) === Grid.CELLSTATE.weapon) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(nextPos.x, i));
                } else if (grid.stateAt(nextPos.x, i) !== Grid.CELLSTATE.free) { // obstacle or player encountered
                    if (DEBUG) {
                        console.log("Player " + player.name + " encountered an obstacle at : " + this.Position.new(nextPos.x, i));
                    }
                    nextPos.y = i + 1;
                    break ;
                }
            }
        } else if (stepy > 0) { // moving down
            if (DEBUG) {
                console.log("Player " + player.name + " is moving down");
            }
            for (var i = currentPos.y + 1; i <= nextPos.y; i++) {
                if (grid.stateAt(nextPos.x, i) === Grid.CELLSTATE.weapon) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(nextPos.x, i));
                } else if (grid.stateAt(nextPos.x, i) !== Grid.CELLSTATE.free) { // obstacle or player encountered
                    if (DEBUG) {
                        console.log("Player " + player.name + " encountered an obstacle at : " + this.Position.new(nextPos.x, i));
                    }
                    nextPos.y = i - 1;
                    break ;
                }
            }
        }
        // player position update
        console.log("Previous selected player position is : " + currentPos);
        player.setPosition(nextPos.x, nextPos.y);
        // grid update
        grid.grid[currentPos.x + (currentPos.y * grid.size)] = Grid.CELLSTATE.free;
        grid.grid[nextPos.x + (nextPos.y * grid.size)] = Grid.CELLSTATE.player;
        if (DEBUG) {
            console.log("After computing selected player position is : " + player.getPosition());
            console.log("Previous selected player position is : " + currentPos);
        }
        return (player);
    },
    
    playerCollision: function() {
        var gap = this.players[0].getPosition().sub(this.players[1].getPosition());
        
        gap.x = Math.abs(gap.x);
        gap.y = Math.abs(gap.y);
        console.log("Players gap : " + gap);
        if ((gap.x <= 1) && (gap.y <= 1)) {
            return (true);
        }
        return (false);
    }
};