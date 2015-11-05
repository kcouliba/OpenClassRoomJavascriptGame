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

(function(app) {
    var UIPlayer = {
        that: null,
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
            this.that = document.getElementById(id);
            this.name = this.that.getElementsByClassName('playerName')[0];
            this.hp = this.that.getElementsByClassName('playerHP')[0];
            this.weaponName = this.that.getElementsByClassName('playerWeaponName')[0];
            this.weaponDamage = this.that.getElementsByClassName('playerWeaponDamage')[0];
            this.weaponImage = this.that.getElementsByClassName('playerWeaponImage')[0];
            this.direction = this.that.getElementsByClassName('playerMoveDirection');
            this.step = this.that.getElementsByClassName('playerMoveStep');
            this.moveActionReady = this.that.getElementsByClassName('playerActionReadyMove');
            this.attacks = this.that.getElementsByClassName('playerActionBattleAttack');
            this.defends = this.that.getElementsByClassName('playerActionBattleDefend');
            return (this);
        }
    };

    var DataPlayer = {
        moveDirection: Game.Position.new(0, 0),
        moveStep: 0,
        moveReady: false,

        init: function() {
            this.moveDirection = Game.Position.new(0, 0);
            this.moveStep = 0;
            this.moveReady = false;
            return (this);
        },
        
        reset: function () {
            return (this.init());
        }
    };

    var playersUI = [Object.create(UIPlayer).init('player1'), Object.create(UIPlayer).init('player2')];
    var dataPlayers = [Object.create(DataPlayer).init(), Object.create(DataPlayer).init()];

    for (var id = 0; id < playersUI.length; id++) {
        (function (id) {
            var playerUI = playersUI[id];
            var dataPlayer = dataPlayers[id];
            var directionButtons = playerUI.direction[0].getElementsByTagName('button');
            var stepButtons = playerUI.step[0].getElementsByTagName('button');
            var moveReadyButton = playerUI.moveActionReady[0];
            var attackButton = playerUI.attacks[0];
            var defendButton = playerUI.defends[0];

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
            attackButton.addEventListener('click', function() {
                this.setAttribute('disabled', "disabled");
                defendButton.setAttribute('disabled', "disabled");
            });
            updateReadyButtonStatus(dataPlayer, moveReadyButton);
        })(id);
    }

    // event to start a new game
    document.addEventListener('keypress', function(evt) {
        if (evt.which == 13) {
            var player1 = prompt("Nom du joueur 1") || "";
            var player2 = prompt("Nom du joueur 2") || "";

            player1 = player1.trim();
            player2 = player2.trim();
            app.newGame(player1, player2);
            updateStatusUI();
        }
    });
    
    
    // UI update functions
    
    /*
    ** updateReadyButtonStatus
    ** @param dataPlayer : DataPlayer
    ** enable or disable button ready
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
        
        for (var i = 0; i < playersUI.length; i++) {
            (function(i) {
                player = app.getPlayerData(i);
                playersUI[i].name.textContent = player.name;
                playersUI[i].hp.textContent = player.hp + " HP";
                playersUI[i].weaponName.textContent = player.weaponName;
                playersUI[i].weaponDamage.textContent = player.weaponDamage + " DMG";
                playersUI[i].weaponImage.src = ("../css/assets/images/" + player.weaponName.toLowerCase() + ".png").replace(/ /, "_");
            })(i);
        }
    }
})(app);