/*
** game.js
** Author coulibaly.d.kevin@gmail.com
** A game class
*/

var Game = {
    /* Game attributes */

    run: false,
    grid: null,
    weapons: [],
    players: [],
    gamePhase: null,

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
        for (var i = 0; i < weapons.length; i++) { // Tranforms Weapon into GameElement object
            this.weapons.push(GameElement.new(weapons[i]));
        }
        for (var i = 0; i < players.length; i++) { // Tranforms Player into GameElement object
            this.players.push(GameElement.new(players[i]));
        }
        this.placeElements();
        this.gamePhase = GAMEPHASE.MOVE;
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
        var at = Position.new(x, y);

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
                if (this.grid.grid[i + (j * this.grid.size)] === CELLSTATE.FREE) {
                    this.grid.grid[i + (j * this.grid.size)] = CELLSTATE.PLAYER1;
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
                if (this.grid.grid[i + (j * this.grid.size)] === CELLSTATE.FREE) {
                    this.grid.grid[i + (j * this.grid.size)] = CELLSTATE.PLAYER2;
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
        var currentPos = Position.clone(player.getPosition());
        var move = Position.new(stepx, stepy);
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
                if (grid.stateAt(i, currentPos.y) === CELLSTATE.WEAPON) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(i, currentPos.y));
                } else if (grid.stateAt(i, currentPos.y) !== CELLSTATE.FREE) { // obstacle or player encountered
                    if (DEBUG) {
                        console.log("Player " + player.name + " encountered an obstacle at : " + Position.new(i, currentPos.y));
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
                if (grid.grid[i + (currentPos.y * grid.size)] === CELLSTATE.WEAPON) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(i, currentPos.y));
                } else if (grid.stateAt(i, currentPos.y) !== CELLSTATE.FREE) { // obstacle or player encountered
                    if (DEBUG) {
                        console.log("Player " + player.name + " encountered an obstacle at : " + Position.new(i, currentPos.y));
                    }
                    nextPos.x = i - 1;
                    break ;
                }
            }
        }
        player.setPosition(nextPos.x, currentPos.y);
        if (stepy < 0) { // moving up
            if (DEBUG) {
                console.log("Player " + player.name + " is moving up");
            }
            for (var i = currentPos.y - 1; i >= nextPos.y; i--) {
                if (grid.stateAt(nextPos.x, i) === CELLSTATE.WEAPON) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(nextPos.x, i));
                } else if (grid.stateAt(nextPos.x, i) !== CELLSTATE.FREE) { // obstacle or player encountered
                    if (DEBUG) {
                        console.log("Player " + player.name + " encountered an obstacle at : " + Position.new(nextPos.x, i));
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
                if (grid.stateAt(nextPos.x, i) === CELLSTATE.WEAPON) { // weapon encountered
                    player.equipWeapon(this.getWeaponAt(nextPos.x, i));
                } else if (grid.stateAt(nextPos.x, i) !== CELLSTATE.FREE) { // obstacle or player encountered
                    if (DEBUG) {
                        console.log("Player " + player.name + " encountered an obstacle at : " + Position.new(nextPos.x, i));
                    }
                    nextPos.y = i - 1;
                    break ;
                }
            }
        }
        // player position update
        player.setPosition(nextPos.x, nextPos.y);
        // grid update
        grid.grid[currentPos.x + (currentPos.y * grid.size)] = CELLSTATE.FREE;
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
            this.gamePhase = GAMEPHASE.BATTLE;
            return (true);
        }
        return (false);
    }
};
