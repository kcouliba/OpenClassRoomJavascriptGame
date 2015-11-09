/*
** game.js
** Author coulibaly.d.kevin@gmail.com
** Date 29/10/2015
** A game class
*/

var Game = {
    GAMEPHASE : {
        MOVE: 0,
        BATTLE: 1
    },
    run: false,
    grid: null,
    weapons: [],
    players: [],
    gamePhase: null,

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

        set: function(x, y) {
            this.x = x;
            this.y = y;
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
        this.weapons = [];
        this.players = [];
        this.grid = grid;
        for (var i = 0; i < weapons.length; i++) {
            this.weapons.push(this.Element.new(weapons[i]));
        }
        for (var i = 0; i < players.length; i++) {
            this.players.push(this.Element.new(players[i]));
        }
        this.placeElements();
        this.gamePhase = Game.GAMEPHASE.MOVE;
        if (DEBUG) {
            console.log("Game initialized.");
        }
        return (this);
    },

    start: function() {
        this.run = true;
        if (DEBUG) {
            console.log("Game started.");
        }
    },

    running: function() {
        return (this.run);
    },

    stop: function() {
        this.run = false;
        if (DEBUG) {
            console.log("Game stopped.");
        }
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
                if (this.grid.grid[i + (j * this.grid.size)] === Grid.CELLSTATE.FREE) {
                    this.grid.grid[i + (j * this.grid.size)] = Grid.CELLSTATE.PLAYER1;
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
                if (this.grid.grid[i + (j * this.grid.size)] === Grid.CELLSTATE.FREE) {
                    this.grid.grid[i + (j * this.grid.size)] = Grid.CELLSTATE.PLAYER2;
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
        console.log(player);
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
                if (grid.stateAt(i, currentPos.y) === Grid.CELLSTATE.WEAPON) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(i, currentPos.y));
                } else if (grid.stateAt(i, currentPos.y) !== Grid.CELLSTATE.FREE) { // obstacle or player encountered
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
                if (grid.grid[i + (currentPos.y * grid.size)] === Grid.CELLSTATE.WEAPON) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(i, currentPos.y));
                } else if (grid.stateAt(i, currentPos.y) !== Grid.CELLSTATE.FREE) { // obstacle or player encountered
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
                if (grid.stateAt(nextPos.x, i) === Grid.CELLSTATE.WEAPON) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(nextPos.x, i));
                } else if (grid.stateAt(nextPos.x, i) !== Grid.CELLSTATE.FREE) { // obstacle or player encountered
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
                if (grid.stateAt(nextPos.x, i) === Grid.CELLSTATE.WEAPON) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(nextPos.x, i));
                } else if (grid.stateAt(nextPos.x, i) !== Grid.CELLSTATE.FREE) { // obstacle or player encountered
                    if (DEBUG) {
                        console.log("Player " + player.name + " encountered an obstacle at : " + this.Position.new(nextPos.x, i));
                    }
                    nextPos.y = i - 1;
                    break ;
                }
            }
        }
        // player position update
        player.setPosition(nextPos.x, nextPos.y);
        // grid update
        grid.grid[currentPos.x + (currentPos.y * grid.size)] = Grid.CELLSTATE.FREE;
        grid.grid[nextPos.x + (nextPos.y * grid.size)] = player.id;
        if (DEBUG) {
            console.log("After computing selected player position is : " + player.getPosition());
            console.log("Previous selected player position was : " + currentPos);
        }
    },

    playerCollision: function() {
        var gap = this.players[0].getPosition().sub(this.players[1].getPosition());

        gap.x = Math.abs(gap.x);
        gap.y = Math.abs(gap.y);
        if (DEBUG) {
            console.log("Players gap : " + gap);
        }
        if (((gap.x === 0) && (gap.y <= 1))
            || ((gap.x <= 1) && (gap.y === 0))) {
            this.gamePhase = Game.GAMEPHASE.BATTLE;
            return (true);
        }
        return (false);
    }
};