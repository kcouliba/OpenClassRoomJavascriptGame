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
*/

/*
** Here the DOM is ready and all game data should be set
** So there are mainly events in response with user interaction
*/

// IIFE encapsulation
(function(app) {
    var GameInterface = {
        playersDOM: null,
        dataPlayers: null,
        surface: null,

        /*
        ** DOMPlayer
        ** An object that stores player related DOM elements
        */
        DOMPlayer: {
            self: null,
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

            init: function(id) {
                this.self = document.getElementById(id);
                this.name = this.self.getElementsByClassName('playerName')[0];
                this.hp = this.self.getElementsByClassName('playerHP')[0];
                this.weaponName = this.self.getElementsByClassName('playerWeaponName')[0];
                this.weaponDamage = this.self.getElementsByClassName('playerWeaponDamage')[0];
                this.weaponImage = this.self.getElementsByClassName('playerWeaponImage')[0];
                this.moveControls = this.self.getElementsByClassName('playerMove')[0];
                this.direction = this.self.getElementsByClassName('playerMoveDirection');
                this.step = this.self.getElementsByClassName('playerMoveStep');
                this.moveActionReady = this.self.getElementsByClassName('playerActionReadyMove');
                this.attacks = this.self.getElementsByClassName('playerActionBattleAttack');
                this.defends = this.self.getElementsByClassName('playerActionBattleDefend');
                return (this);
            }
        },

        /*
        ** DataPlayer
        ** An object that stores player related data
        */
        DataPlayer: {
            id: -1,
            moveDirection: Game.Position.new(0, 0),
            moveStep: 0,
            isReady: null,
            stance: -1,

            init: function() {
                this.moveDirection = Game.Position.new(0, 0);
                this.moveStep = 0;
                this.isReady = false;
                return (this);
            },

            setId: function(id) {
                this.id = id;
            },

            setStance: function(stance) {
                if ((stance != Player.STANCE.ATTACK) 
                    && (stance != Player.STANCE.DEFENSE))
                    stance = Player.STANCE.ATTACK;
                this.stance = stance;
            },

            reset: function () {
                return (this.init());
            }
        },

        /*
        ** RenderingSurface
        ** Surface which graphics elements are displayed on
        */
        RenderingSurface: {
            COLOR: {
                RED: "rgb(255, 0, 0)",
                GREEN: "rgb(0, 255, 0)",
                BLUE: "rgb(0, 0, 255)",
                YELLOW: "rgb(255, 255, 0)",
                BLACK: "rgb(0, 0, 0)"
            },
            width: 0,
            height: 0,
            surface: null,
            canvas: null,
            ctx: null,
            width: 0,
            height: 0,

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
                            this.ctx.fillStyle = GameInterface.RenderingSurface.COLOR.GREEN;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        } else if (grid.grid[i + (j * grid.size)] === Grid.CELLSTATE.OBSTACLE) {
                            this.ctx.fillStyle = GameInterface.RenderingSurface.COLOR.RED;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        } else if (grid.grid[i + (j * grid.size)] === Grid.CELLSTATE.WEAPON) {
                            this.ctx.fillStyle = GameInterface.RenderingSurface.COLOR.BLUE;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        } else if (grid.grid[i + (j * grid.size)] === Grid.CELLSTATE.PLAYER1) {
                            this.ctx.fillStyle = GameInterface.RenderingSurface.COLOR.BLACK;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        } else if (grid.grid[i + (j * grid.size)] === Grid.CELLSTATE.PLAYER2) {
                            this.ctx.fillStyle = GameInterface.RenderingSurface.COLOR.YELLOW;
                            this.ctx.fillRect(i * step, j * step, step, step);
                        }
                        this.ctx.strokeStyle = "rgb(0, 0, 255)";
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
        },

        init: function() {
            this.playersDOM = [
                Object.create(GameInterface.DOMPlayer).init('player1'),
                Object.create(GameInterface.DOMPlayer).init('player2')
            ];
            this.dataPlayers = [
                Object.create(GameInterface.DataPlayer).init(),
                Object.create(GameInterface.DataPlayer).init()
            ];
            this.surface = Object.create(GameInterface.RenderingSurface).init();
            this.initEvents();
            //            return (this);
        },

        /*
        ** initDirectionEvent
        ** @param playerDOM : Object (player DOM data)
        ** @param dataPlayer : Object (player data representation)
        ** @param moveReadyButton : Object (ready button)
        ** @param id : int (player id)
        */
        initDirectionEvent: function(playerDOM, dataPlayer, moveReadyButton, id) {
            var self = this;
            var directionButtons = playerDOM.direction[0].getElementsByTagName('button');

            for (var i = 0; i < directionButtons.length; i++) {
                directionButtons[i].addEventListener('click', function(evt) {
                    if (evt.target.className.match(/up/i)) {
                        dataPlayer.moveDirection.set(0, -1);
                    } else if (evt.target.className.match(/right/i)) {
                        dataPlayer.moveDirection.set(1, 0);
                    } else if (evt.target.className.match(/down/i)) {
                        dataPlayer.moveDirection.set(0, 1);
                    } else if (evt.target.className.match(/left/i)) {
                        dataPlayer.moveDirection.set(-1, 0);
                    }
                    self.updateReadyButtonStatus(dataPlayer, moveReadyButton);
                });
            }
        },

        /*
        ** initStepEvent
        ** @param playerDOM : Object (player DOM data)
        ** @param dataPlayer : Object (player data representation)
        ** @param moveReadyButton : Object (ready button)
        ** @param id : int (player id)
        */
        initStepEvent: function(playerDOM, dataPlayer, moveReadyButton, id) {
            var self = this;
            var stepButtons = playerDOM.step[0].getElementsByTagName('button');

            for (var i = 0; i < stepButtons.length; i++) {
                stepButtons[i].addEventListener('click', function(evt) {
                    if (evt.target.className.match(/step1/i)) {
                        dataPlayer.moveStep = 1;
                    } else if (evt.target.className.match(/step2/i)) {
                        dataPlayer.moveStep = 2;
                    } else if (evt.target.className.match(/step3/i)) {
                        dataPlayer.moveStep = 3;
                    }
                    self.updateReadyButtonStatus(dataPlayer, moveReadyButton);
                });
            }
        },

        /*
        ** initMoveReadyEvent
        ** @param playerDOM : Object (player DOM data)
        ** @param dataPlayer : Object (player data representation)
        ** @param moveReadyButton : Object (ready button)
        ** @param id : int (player id)
        */
        initMoveReadyEvent: function(playerDOM, dataPlayer, moveReadyButton, id) {
            var self = this;

            moveReadyButton.addEventListener('click', function() {
                var move = Game.Position.clone(dataPlayer.moveDirection);

                dataPlayer.moveDirection.x *= dataPlayer.moveStep;
                dataPlayer.moveDirection.y *= dataPlayer.moveStep;
                // Check if both ready buttons have been activated
                // Then trigger the move action
                //                console.log(dataPlayer.moveDirection);
                //                console.log(dataPlayer.isReady);

                if (dataPlayer.moveDirection.x != dataPlayer.moveDirection.y) { // a direction and step has been set
                    if (1) { // move is ok
                        dataPlayer.isReady = true;
                        playerDOM.moveControls.className += " hidden";
                        this.setAttribute('disabled', "disabled");
                        this.textContent = "Player is ready";
                        self.triggerMoveAction();
                    } else {
                        // Notice the player he entered an illegal move
                    }
                }
            });
        },

        triggerMoveAction: function() {
            if (this.dataPlayers[0].isReady && this.dataPlayers[1].isReady) {
                console.log(this.dataPlayers[0]);
                console.log(this.dataPlayers[1]);
                console.log("Let's do a move");

                app.playerMove(0, this.dataPlayers[0].moveDirection.x, this.dataPlayers[0].moveDirection.y);
                app.playerMove(1, this.dataPlayers[1].moveDirection.x, this.dataPlayers[1].moveDirection.y);

                for (var i = 0; i < 2; i++) {
                    this.dataPlayers[i].reset();
                    this.playersDOM[i].moveControls.className = this.playersDOM[i].moveControls.className.replace(/ hidden/, "");
                    this.playersDOM[i].moveActionReady[0].textContent = "Ready";
                }
                this.update();
            }
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
        */
        initEvents: function() {
            var self = this;

            document.addEventListener('keypress', function(evt) {
                if (evt.which == 13) { // Enter key
                    app.newGame("", "");
                    self.update();
                }
            });


            for (var id = 0; id < this.playersDOM.length; id++) {
                // IIFE encapsulation
                (function (id) {
                    var playerDOM = self.playersDOM[id];
                    var dataPlayer = self.dataPlayers[id];
                    var directionButtons = playerDOM.direction[0].getElementsByTagName('button');
                    var stepButtons = playerDOM.step[0].getElementsByTagName('button');
                    var moveReadyButton = playerDOM.moveActionReady[0];
                    var attackButton = playerDOM.attacks[0];
                    var defendButton = playerDOM.defends[0];

                    dataPlayer.setId(id);
                    self.initDirectionEvent(playerDOM, dataPlayer, moveReadyButton, id);
                    self.initStepEvent(playerDOM, dataPlayer, moveReadyButton, id);
                    self.initMoveReadyEvent(playerDOM, dataPlayer, moveReadyButton, id);
                    self.initAttackDefenseEvent(dataPlayer, attackButton, defendButton)
                    self.updateReadyButtonStatus(dataPlayer, moveReadyButton);
                })(id);
            }
        },

        /*
        ** checkSwitchGamePhase
        ** Checking function
        */
        checkSwitchGamePhase: function() {
            if (app.getGamePhase() === Game.GAMEPHASE.BATTLE) {
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
            }
        },

        updateGrid: function() {
            this.surface.update();
        },

        updateReadyButtonStatus: function(dataPlayer, moveReadyButton) {
            if ((dataPlayer.moveDirection.x !== dataPlayer.moveDirection.y)
                && (dataPlayer.moveStep !== 0)) {
                moveReadyButton.removeAttribute('disabled');
                dataPlayer.isReady = true;
                return ;
            }
            moveReadyButton.setAttribute('disabled', "disabled");
        },

        updateStatuses: function() {
            var self = this;
            var player;

            for (var i = 0; i < this.playersDOM.length; i++) {
                (function(i) {
                    player = app.getPlayerData(i);
                    self.playersDOM[i].name.textContent = player.name;
                    self.playersDOM[i].hp.textContent = player.hp + " HP";
                    self.playersDOM[i].weaponName.textContent = player.weaponName;
                    self.playersDOM[i].weaponDamage.textContent = player.weaponDamage + " DMG";
                    self.playersDOM[i].weaponImage.src = ("../css/assets/images/" + player.weaponName.toLowerCase() + ".png").replace(/ /, "_");
                })(i);
            }
        },

        update: function() {
            this.checkSwitchGamePhase();
            this.updateStatuses();
            this.updateGrid();
            console.log(app.getGrid().grid);
        }
    };

    Object.create(GameInterface).init();
})(app);