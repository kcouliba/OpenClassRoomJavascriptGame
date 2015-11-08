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
    /*
    ** DOMPlayer
    ** An object that stores player related DOM elements
    */
    var DOMPlayer = {
        self: null,
        name: null,
        hp: null,
        weaponName: null,
        weaponDamage: null,
        weaponImage: null,
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
            this.direction = this.self.getElementsByClassName('playerMoveDirection');
            this.step = this.self.getElementsByClassName('playerMoveStep');
            this.moveActionReady = this.self.getElementsByClassName('playerActionReadyMove');
            this.attacks = this.self.getElementsByClassName('playerActionBattleAttack');
            this.defends = this.self.getElementsByClassName('playerActionBattleDefend');
            return (this);
        }
    };

    /*
    ** DataPlayer
    ** An object that stores player related data
    */
    var DataPlayer = {
        moveDirection: Game.Position.new(0, 0),
        moveStep: 0,
        moveReady: false,
        stance: -1,

        init: function() {
            this.moveDirection = Game.Position.new(0, 0);
            this.moveStep = 0;
            this.moveReady = false;
            return (this);
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
    };

    /*
    ** playersDOM and dataPlayers instanciation
    */
    var playersDOM = [Object.create(DOMPlayer).init('player1'), Object.create(DOMPlayer).init('player2')];
    var dataPlayers = [Object.create(DataPlayer).init(), Object.create(DataPlayer).init()];

    /*
    ** Event control initialization for both players
    */
    for (var id = 0; id < playersDOM.length; id++) {
        // IIFE encapsulation
        (function (id) {
            var playerDOM = playersDOM[id];
            var dataPlayer = dataPlayers[id];
            var directionButtons = playerDOM.direction[0].getElementsByTagName('button');
            var stepButtons = playerDOM.step[0].getElementsByTagName('button');
            var moveReadyButton = playerDOM.moveActionReady[0];
            var attackButton = playerDOM.attacks[0];
            var defendButton = playerDOM.defends[0];

            // Direction event
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
                    updateReadyButtonStatus(dataPlayer, moveReadyButton);
                });
            }
            
            // Step event
            for (var i = 0; i < stepButtons.length; i++) {
                stepButtons[i].addEventListener('click', function(evt) {
                    if (evt.target.className.match(/step1/i)) {
                        dataPlayer.moveStep = 1;
                    } else if (evt.target.className.match(/step2/i)) {
                        dataPlayer.moveStep = 2;
                    } else if (evt.target.className.match(/step3/i)) {
                        dataPlayer.moveStep = 3;
                    }
                    updateReadyButtonStatus(dataPlayer, moveReadyButton);
                });
            }
            
            // Move ready event
            moveReadyButton.addEventListener('click', function() {
                var move = Game.Position.clone(dataPlayer.moveDirection);

                dataPlayer.moveDirection.x *= dataPlayer.moveStep;
                dataPlayer.moveDirection.y *= dataPlayer.moveStep;
                // Check if both ready buttons have been activated
                // Then trigger the moving 
                console.log(dataPlayer.moveDirection);
                console.log(dataPlayer.moveReady);

                // This block should be triggered after confirmation that the move is not illegal
                // and both players are ready (custom event ?)
                dataPlayer.reset();
                //                updateStatusUI();
                updateReadyButtonStatus(dataPlayer, moveReadyButton);
                // End of block
            });
            
            // Attack event
            attackButton.addEventListener('click', function() {
                dataPlayer.setStance(Player.STANCE.ATTACK);
                this.setAttribute('disabled', "disabled");
                defendButton.setAttribute('disabled', "disabled");
            });
            
            // Defense event
            defendButton.addEventListener('click', function() {
                dataPlayer.setStance(Player.STANCE.DEFENSE);
                this.setAttribute('disabled', "disabled");
                attackButton.setAttribute('disabled', "disabled");
            });
            
            updateReadyButtonStatus(dataPlayer, moveReadyButton);
        })(id);
    }

    // Event to start a new game
    document.addEventListener('keypress', function(evt) {
        if (evt.which == 13) {
//            var player1 = prompt("Nom du joueur 1").trim() || "";
//            var player2 = prompt("Nom du joueur 2").trim() || "";
            var player1 = "";
            var player2 = "";

            app.newGame(player1, player2);
            updateStatusUI();
            checkSwitchGamePhase();
        }
    });
    
    // UI update functions

    
    /*
    ** checkSwitchGamePhase
    ** Checking function
    */
    function checkSwitchGamePhase() {
        if (app.getGamePhase() === Game.GAMEPHASE.BATTLE) {
            var moveButtonsDiv = [
                document.getElementById('player1').getElementsByClassName('playerActionMove')[0],
                document.getElementById('player2').getElementsByClassName('playerActionMove')[0]
            ];
            var battleButtonsDiv = [
                document.getElementById('player1').getElementsByClassName('playerActionBattle')[0],
                document.getElementById('player2').getElementsByClassName('playerActionBattle')[0]
            ];

//            moveButtonsDiv.push(document.getElementById('player1').getElementsByClassName('playerActionMove')[0]);
//            moveButtonsDiv.push(document.getElementById('player2').getElementsByClassName('playerActionMove')[0]);
//            battleButtonsDiv.push(document.getElementById('player1').getElementsByClassName('playerActionBattle')[0]);
//            battleButtonsDiv.push(document.getElementById('player2').getElementsByClassName('playerActionBattle')[0]);
            for (var i = 0; i < moveButtonsDiv.length; i++) {
                moveButtonsDiv[i].className += " hidden";
            }
            for (var i = 0; i < battleButtonsDiv.length; i++) {
                battleButtonsDiv[i].className = moveButtonsDiv[i].className.replace(/hidden/, "");
            }
        }
    }

    /*
    ** updateReadyButtonStatus
    ** @param dataPlayer : DataPlayer
    ** Enables or disables button ready
    */
    function updateReadyButtonStatus(dataPlayer, moveReadyButton) {
        if ((dataPlayer.moveDirection.x !== dataPlayer.moveDirection.y)
            && (dataPlayer.moveStep !== 0)) {
            moveReadyButton.removeAttribute('disabled');
            dataPlayer.moveReady = true;
            return ;
        }
        moveReadyButton.setAttribute('disabled', "disabled");
    }

    /*
    ** updateStatusUI
    ** Updates player statuses UI
    */
    function updateStatusUI() {
        var player;

        for (var i = 0; i < playersDOM.length; i++) {
            (function(i) {
                player = app.getPlayerData(i);
                playersDOM[i].name.textContent = player.name;
                playersDOM[i].hp.textContent = player.hp + " HP";
                playersDOM[i].weaponName.textContent = player.weaponName;
                playersDOM[i].weaponDamage.textContent = player.weaponDamage + " DMG";
                playersDOM[i].weaponImage.src = ("../css/assets/images/" + player.weaponName.toLowerCase() + ".png").replace(/ /, "_");
            })(i);
        }
    }
})(app);