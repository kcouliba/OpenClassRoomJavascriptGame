/*
** game.js
** Author coulibaly.d.kevin@gmail.com
** A game class
*/

var Game = {
    /* Game attributes */

    GAMEPHASE : {
        MOVE: 0,
        BATTLE: 1
    },
    run: false,
    grid: null,
    weapons: [],
    players: [],
    gamePhase: null,

    /* Game sub classes */

    // Position sub class
    Position: {
        /* Position attributes */

        x: 0,
        y: 0,

        /* Position methods */

        /*
        ** new
        ** Returns an instance of Position
        ** @param x : Number
        ** @param y : Number
        ** @return Position
        */
        new: function(x, y) {
            var self = Object.create(this);

            self.x = x;
            self.y = y;
            return (self);
        },

        /*
        ** set
        ** Defines x and y values
        ** @param x : Number
        ** @param y : Number
        */
        set: function(x, y) {
            this.x = x;
            this.y = y;
        },

        /*
        ** add
        ** Adds Position to the instance
        ** @param position : Position Object
        ** @return Position
        */
        add: function(position) {
            return (this.new(this.x + position.x, this.y + position.y));
        },

        /*
        ** sub
        ** Subs Position to the instance
        ** @param position : Position Object
        ** @return Position
        */
        sub: function(position) {
            return (this.new(this.x - position.x, this.y - position.y));
        },

        /*
        ** clone
        ** Clones a Position instance
        ** @param rhs : Position Object
        ** @return Position
        */
        clone: function(rhs) {
            if (this != rhs) {
                return (this.new(rhs.x, rhs.y));
            }
        },

        /*
        ** equals
        ** Checks if position values are equals to another position
        ** @param position : Position Object
        ** @return bool
        */
        equals: function(position) {
            return ((this.x === position.x) && (this.y === position.y));
        },

        /*
        ** toString
        ** Position instance as string
        ** @return string
        */
        toString: function () {
            return ("(" + this.x + ", " + this.y + ")");
        }
    },

    // Element sub class
    Element: {
        /* Element attributes */

        position: null,

        /* Element methods */

        /*
        ** new
        ** Creates new Element instance
        ** @param object : Object
        ** @return Element
        */
        new: function(object) {
            var self = Object.create(this);

            for (attr in object) {
                self[attr] = object[attr];
            }
            self.position = Game.Position.new(0, 0);
            return (self);
        },

        /*
        ** setPosition
        ** Sets element's position
        ** @param x : Number
        ** @param y : Number
        ** @return Element
        */
        setPosition: function (x, y) {
            this.position.x = x;
            this.position.y = y;
            return (this);
        },

        /*
        ** getPosition
        ** Gets element's position
        ** @return Position
        */
        getPosition: function () {
            return (this.position);
        }
    },

    /* Game methods */
    
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
        for (var i = 0; i < weapons.length; i++) { // Tranforms Weapon into Element object
            this.weapons.push(this.Element.new(weapons[i]));
        }
        for (var i = 0; i < players.length; i++) { // Tranforms Player into Element object
            this.players.push(this.Element.new(players[i]));
        }
        this.placeElements();
        this.gamePhase = Game.GAMEPHASE.MOVE;
        if (DEBUG) {
            console.log("Game initialized.");
        }
        return (this);
    },

    /*
    ** start
    ** Set the run attributes to true
    */
    start: function() {
        this.run = true;
        if (DEBUG) {
            console.log("Game started.");
        }
    },

    /*
    ** running
    ** Informs if the game is currently running
    ** @return bool
    */
    running: function() {
        return (this.run);
    },

    /*
    ** stop
    ** Set the run attribute to false
    */
    stop: function() {
        this.run = false;
        if (DEBUG) {
            console.log("Game stopped.");
        }
    },

    /*
    ** placeElements
    ** Places elements on grid
    */
    placeElements: function() {
        this.placePlayers();
        //        this.placeWeapons();
    },

    /*
    ** getWeaponAt
    ** Gets weapon at coordinates
    ** @param x : int
    ** @param y : int
    ** @return Weapon or null
    */
    getWeaponAt: function(x, y) {
        var at = this.Position.new(x, y);

        for (key in this.weapons) {
            if (this.weapons[key].position.equals(at)) {
                return (this.weapons[key]);
            }
        }
        return (null);
    },

    /*
    ** placePlayers
    ** Places players on grid
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
    },

    /*
    ** getPlayer
    ** Returns player corresponding to a given id
    ** @param id : int
    ** @return Player
    */
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
    ** @return Player
    */
    movePlayer: function(player, stepx, stepy) {
        var currentPos = this.Position.clone(player.getPosition());
        var move = this.Position.new(stepx, stepy);
        var nextPos = currentPos.add(move);
        var grid = this.grid;

        if (DEBUG) {
            console.log(player);
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

    /*
    ** playerCollision
    ** Checks if players collide each other
    ** @return bool
    */
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