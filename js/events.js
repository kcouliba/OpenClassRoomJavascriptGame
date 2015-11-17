/* Event Testing
var ev = new Event('customEvt');
var ev = new CustomEvent('customEvt', { 'detail': { dumb: "dumb" } });

var body = document.getElementsByTagName('body')[0];

body.addEventListener('customEvt', function(e) {
    console.log(e);
    console.log(e.detail.dumb);
    alert("custom event triggered");
});
document.getElementsByTagName('div')[0].addEventListener('click', function() {
    body.dispatchEvent(ev);
});

document.dispatchEvent(ev);
*/

/*
** TODO : trigger a custom event to notify if the action successed or failed
** for each function that may call an error :
**      -validateMove
**   Review the code an determine better variables name
** Think about a better code organization and separation between events and UI
*/

/*
** Here the DOM is ready and all game data should be set
** So there are mainly events in response with user interaction
*/

// IIFE encapsulation
(function(app) {
    var UI = {
        /* static attributes */
        PLAYER: {
            PLAYER1: 0,
            PLAYER2: 1,
        },
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

            self.renderingSurface = UI.RenderingSurface.init();
            self.displayMode = UI.DISPLAY.MOVE;
            self.players = [
                UI.PlayerUI.new(UI.PLAYER.PLAYER1 + 1),
                UI.PlayerUI.new(UI.PLAYER.PLAYER2 + 1)
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
            if (this.players[UI.PLAYER.PLAYER2].container.style.display == "none") {
                this.hidePlayer(UI.PLAYER.PLAYER1);
                this.showPlayer(UI.PLAYER.PLAYER2);
            } else {
                this.hidePlayer(UI.PLAYER.PLAYER2);
                this.showPlayer(UI.PLAYER.PLAYER1);
            }
        },

        update: function() {
            if (app.getGamePhase() === Game.GAMEPHASE.BATTLE) {
                this.displayMode = UI.DISPLAY.BATTLE;
                this.updateBattleDisplay();
            }
            //            if (!(app.isPlayerAlive(UI.PLAYER.PLAYER1) && app.isPlayerAlive(GameInterface.PLAYER.PLAYER1))) {
            //                var winner =  (app.isPlayerAlive(UI.PLAYER.PLAYER1)) ? UI.PLAYER.PLAYER1 : UI.PLAYER.PLAYER2;
            //                // Show win message
            //                alert(app.getWinnerPhrase(UI.PLAYER.PLAYER2));
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
            this.showPlayer(UI.PLAYER.PLAYER1);
            this.showPlayer(UI.PLAYER.PLAYER2);
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
                    self.players[i].weaponImage.src = ("../css/assets/images/" + player.weaponName.toLowerCase() + ".png").replace(/ /, "_");
                })(i);
            }
        },

        /* sub classes */

        /*
        ** PlayerUI
        ** An object that represents player related DOM elements
        */
        PlayerUI: {
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
        },

        /*
        ** RenderingSurface
        ** Surface which graphics elements are displayed on
        */
        RenderingSurface: {
            /* Mainly for debug */
            COLOR: {
                RED: "rgb(255, 0, 0)",
                GREEN: "rgb(0, 255, 0)",
                BLUE: "rgb(0, 0, 255)",
                YELLOW: "rgb(255, 255, 0)",
                BLACK: "rgb(0, 0, 0)"
            },
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

                this.canvas.setAttribute('width', this.width);
                this.canvas.setAttribute('height', this.height);
                this.canvas.style.width = this.width + "px";
                this.canvas.style.height = this.height + "px";
                this.canvas.style.marginLeft = ((this.surface.clientWidth - this.width) / 2) + "px"; // Centering
                this.canvas.style.marginTop = ((this.surface.clientHeight - this.height) / 2) + "px"; // Centering
                for (var j = 0; j < grid.size; j++) {
                    for (var i = 0; i < grid.size; i++) {
                        if (grid.grid[i + (j * grid.size)] === Grid.CELLSTATE.FREE) {
                            this.ctx.fillStyle = UI.RenderingSurface.COLOR.GREEN;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        } else if (grid.grid[i + (j * grid.size)] === Grid.CELLSTATE.OBSTACLE) {
                            this.ctx.fillStyle = UI.RenderingSurface.COLOR.RED;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        } else if (grid.grid[i + (j * grid.size)] === Grid.CELLSTATE.WEAPON) {
                            this.ctx.fillStyle = UI.RenderingSurface.COLOR.BLUE;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        } else if (grid.grid[i + (j * grid.size)] === Grid.CELLSTATE.PLAYER1) {
                            this.ctx.fillStyle = UI.RenderingSurface.COLOR.BLACK;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        } else if (grid.grid[i + (j * grid.size)] === Grid.CELLSTATE.PLAYER2) {
                            this.ctx.fillStyle = UI.RenderingSurface.COLOR.YELLOW;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        }
                        this.ctx.strokeStyle = UI.RenderingSurface.COLOR.BLUE;
                        this.ctx.strokeRect(i * step, j * step, step, step);
                    }
                }
            },

            /*
            ** update
            ** refresh drawing surface (supposedly clears the surface then draw again)
            */
            update: function() {
                this.draw();
            }
        }
    };

    var ui = UI.init();
    //    ui.showPlayer(UI.PLAYER.PLAYER1);
    //    ui.hidePlayer(UI.PLAYER.PLAYER2);





    var GameInterface = {
        /* static attributes */
        PLAYER: {
            PLAYER1: 0,
            PLAYER2: 1,
        },

        /* attributes */

        currentPlayer: null,
        gamePhase: null,

        /* methods */

        init: function() {
            var self = Object.create(this);

            self.currentPlayer = GameInterface.PLAYER.PLAYER1;
            // initialize start game event
            self.initNewGameEvent();
            // initialize controls
            self.initEvents();
            // update ui
            ui.showPlayer(UI.PLAYER.PLAYER1);
            ui.hidePlayer(UI.PLAYER.PLAYER2);
            return (self);
        },

        /*
        ** initNewGameEvent
        ** Event that triggers a new game
        */
        initNewGameEvent: function() {
            var self = this;

            document.addEventListener('keypress', function(evt) {
                if (evt.which == 13) { // Enter key
                    app.newGame("", "");
                    self.gamePhase = app.getGamePhase();
                    // update the ui
                    ui.update();
                }
            });
        },

        /*
        ** initActionReadyEvent
        ** @param id : int (player id)
        */
        initActionReadyEvent: function() {
            var self = this;
            var inputs;
            var direction = null;
            var move;
            var step = 0;

            document.getElementsByClassName('playerActionReady')[0].addEventListener('click', function() {
                inputs = document.getElementsByTagName('input');

                if (app.gamePhase === Game.GAMEPHASE.MOVE) {
                    for (var i = 0; i < inputs.length; i++) {
                        /* get the direction */
                        if (inputs[i].name == "playerDirection" && inputs[i].checked) {
                            var split = inputs[i].value.split(',');

                            direction = Game.Position.new(parseInt(split[0], 10), parseInt(split[1], 10));
                            console.log(direction);
                        }
                        /* get the steps */
                        if (inputs[i].name == "playerStep" && inputs[i].checked) {
                            step = parseInt(inputs[i].value, 10);
                            console.log(step);
                        }
                    }
                    if ((direction != null) && (step != 0)) {
                        move = Game.Position.new(direction.x * step, direction.y * step);
                        app.playerMove(self.currentPlayer, move.x, move.y);
                        self.currentPlayer = (self.currentPlayer === GameInterface.PLAYER.PLAYER1) ? 
                            GameInterface.PLAYER.PLAYER2 : GameInterface.PLAYER.PLAYER1;
                        // Change player turn
                        ui.togglePlayer();
                        // Update the ui
                        ui.update();
                    }
                } else if (app.getGamePhase() === Game.GAMEPHASE.BATTLE) {
                    var actionPlayer1 = Player.STANCE.ATTACK;
                    var actionPlayer2 = Player.STANCE.ATTACK;

                    app.playerSetStance(GameInterface.PLAYER.PLAYER1, Player.STANCE.ATTACK);
                    app.playerSetStance(GameInterface.PLAYER.PLAYER2, Player.STANCE.ATTACK);
                    for (var i = 0; i < inputs.length; i++) {
                        /* get player 1 action */
                        if (inputs[i].name == "actionPlayer1" && inputs[i].checked) {
                            if (inputs[i].value == Player.STANCE.DEFENSE) {
                                app.playerSetStance(GameInterface.PLAYER.PLAYER1, Player.STANCE.DEFENSE);
                                actionPlayer1 = Player.STANCE.DEFENSE;
                            }
                        }
                        /* get player 2 action */
                        if (inputs[i].name == "actionPlayer2" && inputs[i].checked) {
                            if (inputs[i].value == Player.STANCE.DEFENSE) {
                                app.playerSetStance(GameInterface.PLAYER.PLAYER2, Player.STANCE.DEFENSE);
                                actionPlayer2 = Player.STANCE.DEFENSE;
                            }
                        }
                    }
                    if (actionPlayer1 === Player.STANCE.ATTACK) {
                        app.playerAttack(GameInterface.PLAYER.PLAYER1);
                        // update the ui
                        ui.update();
                        if (!app.isPlayerAlive(GameInterface.PLAYER.PLAYER2)) {
                            // announce player 1 is victorious
                            ui.announceWinner(GameInterface.PLAYER.PLAYER1);
                            // stop current game and ask for new game
                            if (prompt("Start a new game ? (Y / N)") === "Y") {
                                app.newGame("", "");
                                self.gamePhase = app.getGamePhase();
                            }
                            // Update the ui
                            ui.update();
                            return ;
                        }
                    }
                    if (actionPlayer2 === Player.STANCE.ATTACK) {
                        app.playerAttack(GameInterface.PLAYER.PLAYER2);
                        // update the ui
                        ui.update();
                        if (!app.isPlayerAlive(GameInterface.PLAYER.PLAYER1)) {
                            // announce player 2 is victorious
                            ui.announceWinner(GameInterface.PLAYER.PLAYER2);
                            // stop current game and ask for new game
                            if (prompt("Start a new game ? (Y / N)") === "Y") {
                                app.newGame("", "");
                                self.gamePhase = app.getGamePhase();
                            }
                            // Update the ui
                            ui.update();
                            return ;
                        }
                    }
                    // Update the ui
                    ui.update();
                }
            });
        },

        /*
        ** initAttackDefenseEvent
        ** @param dataPlayer : Object (player data representation)
        ** @param attackButton : Object (attack button)
        ** @param defendButton : Object (defend button)
        */
        initAttackDefenseEvent: function(dataPlayer, attackButton, defendButton) {
            var self = this;

            attackButton.addEventListener('click', function() {
                dataPlayer.setStance(Player.STANCE.ATTACK);
                this.setAttribute('disabled', "disabled");
                //                        defendButton.removeAttribute('disabled');
                defendButton.setAttribute('disabled', "disabled");
            });
            // Defense event
            defendButton.addEventListener('click', function() {
                dataPlayer.setStance(Player.STANCE.DEFENSE);
                this.setAttribute('disabled', "disabled");
                //                        attackButton.setAttribute('disabled', "disabled");
                attackButton.removeAttribute('disabled');
            });
        },

        /*
        ** initEvents
        ** Event control initialization for both players
        ** @param id : int
        */
        initEvents: function(id) {
            this.initActionReadyEvent(id);
        },

        /*
        ** switchGamePhase
        ** Watches if the gamePhase Changed
        */
        switchGamePhase: function() {
            if (app.getGamePhase() !== this.gamePhase) {
                var moveButtonsDiv = [
                    document.getElementById('player1').getElementsByClassName('playerActionMove')[0],
                    document.getElementById('player2').getElementsByClassName('playerActionMove')[0]
                ];
                var battleButtonsDiv = [
                    document.getElementById('player1').getElementsByClassName('playerActionBattle')[0],
                    document.getElementById('player2').getElementsByClassName('playerActionBattle')[0]
                ];
                var moveControls = [
                    document.getElementById('player1').getElementsByClassName('playerMove')[0],
                    document.getElementById('player2').getElementsByClassName('playerMove')[0],
                ];

                for (var i = 0; i < moveControls.length; i++) {
                    moveControls[i].className += " hidden";
                }
                for (var i = 0; i < battleButtonsDiv.length; i++) {
                    battleButtonsDiv[i].className = moveButtonsDiv[i].className.replace(/hidden/, "");
                }
                this.gamePhase = app.getGamePhase();
            }
        },

        update: function() {
            var gamePhase = this.gamePhase;

            this.switchGamePhase();
            this.switchPlayer();
            // Remove current player control display
            this.currentPlayer.DOM.self.className += " disabled";
            //            this.currentPlayer.DOM.self.style.display = "none";
            // Activate opponent player control display
            this.waitingPlayer.DOM.self.style.display = "";
            this.updateStatuses();
            this.updateGrid();
            console.log(app.getGrid().grid);
        }
    };
    var gameInterface = GameInterface.init();
})(app);


/*

Game Event Logic
  Move control sequence :
    - Choose a direction
    - Choose a number of step
    - Validate
    - Give the hand to next player

*/


/*
UI
  Two main different game controls
    - move control
    - battle control
  Needs :
    - game grid
    - currently playing player
    - game state (move / battle)

UI methods

update:
  clears and redraw elements
showCurrentPlayerControl:
  shows controls for the current player

*/



/*

** Bug with left and right oob player moves **

*/