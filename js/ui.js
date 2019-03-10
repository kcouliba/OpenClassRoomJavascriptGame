/*
** ui.js
** Author coulibaly.d.kevin@gmail.com
** UI class
*/

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

    /*
    ** init
    ** initializes rendering surface
    */
    init: function() {
        this.surface = document.getElementById('renderingSurface');
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.width = 480;
        this.height = 480;

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
        var grid = app.getGrid();
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
        this.highlightAvailableMoves(0)
        this.highlightAvailableMoves(1)
    },

    /*
    ** highlightAvailableMoves
    ** Draw available moves
    */
   highlightAvailableMoves: function(playerId) {
        var grid = app.getGrid();
        var step = this.width / grid.size;
        const availableMoves = app.getAvailableMoves(playerId)
        const ctx = this.ctx

        availableMoves.forEach(function(move) {
            ctx.fillStyle = COLOR.HIGHLIGHT_WHITE;
            ctx.fillRect(move.x * step, move.y * step, step, step);
        })
    },

    /*
    ** update
    ** refresh drawing surface (supposedly clears the surface then draw again)
    */
    update: function() {
        this.draw();
    }
};

/*
** PlayerUI
** An object that represents player related DOM elements
*/
const PlayerUI = {
    container: null,
    name: null,
    hp: null,
    weaponName: null,
    weaponDamage: null,
    weaponImage: null,
    moveControls: null,
    direction: null,
    step: null,
    moveActionReady: null,
    attacks: null,
    defends: null,

    new: function(id) {
        var self = Object.create(this);

        self.container = document.getElementById("player" + id);
        self.name = self.container.getElementsByClassName('playerName')[0];
        self.hp = self.container.getElementsByClassName('playerHP')[0];
        self.weaponName = self.container.getElementsByClassName('playerWeaponName')[0];
        self.weaponDamage = self.container.getElementsByClassName('playerWeaponDamage')[0];
        self.weaponImage = self.container.getElementsByClassName('playerWeaponImage')[0];
        self.moveControls = self.container.getElementsByClassName('playerMove')[0];
        self.direction = self.container.getElementsByClassName('playerMoveDirection');
        self.step = self.container.getElementsByClassName('playerMoveStep');
        self.moveActionReady = self.container.getElementsByClassName('playerActionReadyMove');
        self.attacks = self.container.getElementsByClassName('playerActionBattleAttack');
        self.defends = self.container.getElementsByClassName('playerActionBattleDefend');
        return (self);
    }
};

const UI = {
    /* static attributes */

    DISPLAY: {
        MOVE: 0,
        BATTLE: 1
    },

    /* attributes */
    renderingSurface: null,
    displayMode: null,
    players: [],

    /* methods */

    init: function() {
        var self = Object.create(this);

        self.renderingSurface = RenderingSurface.init();
        self.displayMode = UI.DISPLAY.MOVE;
        self.players = [
            PlayerUI.new(PLAYER.PLAYER1 + 1),
            PlayerUI.new(PLAYER.PLAYER2 + 1)
        ];
        return (self);
    },

    announceWinner: function(id) {
        alert(app.getWinnerPhrase(id));
    },

    /*
    ** showPlayer
    ** Shows selected player interface
    */
    showPlayer: function(playerId) {
        this.players[playerId].container.style.display = "";
        this.players[playerId].container.style.visibility = "";
    },

    /*
    ** hidePlayer
    ** Hides selected player interface
    */
    hidePlayer: function(playerId) {
        this.players[playerId].container.style.display = "none";
        this.players[playerId].container.style.visibility = "hidden";
    },

    /*
    ** togglePlayer
    ** Switches from currently displayed player interface to next player
    */
    togglePlayer: function() {
        if (this.players[PLAYER.PLAYER2].container.style.display == "none") {
            this.hidePlayer(PLAYER.PLAYER1);
            this.showPlayer(PLAYER.PLAYER2);
        } else {
            this.hidePlayer(PLAYER.PLAYER2);
            this.showPlayer(PLAYER.PLAYER1);
        }
    },

    update: function() {
        if (app.getGamePhase() === GAMEPHASE.BATTLE) {
            this.displayMode = UI.DISPLAY.BATTLE;
            this.updateBattleDisplay();
        } else {
            this.displayMode = UI.DISPLAY.MOVE;
        }
        //            if (!(app.isPlayerAlive(PLAYER.PLAYER1) && app.isPlayerAlive(PLAYER.PLAYER1))) {
        //                var winner =  (app.isPlayerAlive(PLAYER.PLAYER1)) ? PLAYER.PLAYER1 : PLAYER.PLAYER2;
        //                // Show win message
        //                alert(app.getWinnerPhrase(PLAYER.PLAYER2));
        //                // Deactivate every control
        //                // Ask for new game
        //            }
        this.renderingSurface.update();
        this.updatePlayersStatus();
    },

    updateBattleDisplay: function() {
        var actionBattleDisplay = document.getElementsByClassName('playerActionBattle');
        var moveInputDisplay = document.getElementsByClassName('playerMoveInputs');

        for (var i = 0; i < actionBattleDisplay.length; i++) {
            actionBattleDisplay[i].className = actionBattleDisplay[i].className.replace(/ hidden/, "");
        }
        for (var i = 0; i < moveInputDisplay.length; i++) {
            moveInputDisplay[i].className += " hidden";
        }
        this.showPlayer(PLAYER.PLAYER1);
        this.showPlayer(PLAYER.PLAYER2);
    },

    updatePlayersStatus: function() {
        var self = this;
        var player;

        for (var i = 0; i < this.players.length; i++) {
            (function(i) {
                player = app.getPlayerData(i);
                self.players[i].name.textContent = player.name;
                self.players[i].hp.textContent = player.hp + " HP";
                self.players[i].weaponName.textContent = player.weaponName;
                self.players[i].weaponDamage.textContent = player.weaponDamage + " DMG";
                self.players[i].weaponImage.src = ("./css/assets/images/" + player.weaponName.toLowerCase() + ".png").replace(/ /, "_");
            })(i);
        }
    }
};
