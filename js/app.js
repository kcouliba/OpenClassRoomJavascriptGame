/*
** TODO
** replace prompt logic by ui data harvest (DONE)
*/

/*
** IIFE will return an object containing funtions needed to run the game properly
** without granting access to datas
*/
var app = (function() {

    // Game initialization
    
    // WeaponFactory
    var weaponFactory = {
        weapons: [
            Weapon.new(DEFAULT_WEAPON_NAME, DEFAULT_WEAPON_DAMAGE),
            Weapon.new("Pillow", 3),
            Weapon.new("Bare hand", 5),
            Weapon.new("Fork", 8),
            Weapon.new("Club", 12),
            Weapon.new("Hover", 14),
            Weapon.new("Shotgun", 30)
        ],

        /*
        ** get
        ** returns an array containing weapons
        ** @param count : int
        ** @return weaponPool : weaponArray
        */
        get: function(count) {
            var weaponPool = [];

            weaponPool.push(this.weapons[0]);
            for (var i = count; i > 1; i--) {
                var rand = Math.floor(Math.random() * 100 * (this.weapons.length - 1) / 100);

                weaponPool.push(this.weapons[rand]);
            }
            return (weaponPool);
        }
    };
    
    var GamePlayer = {
        id: 0,
        name: "",
        hp: "",
        weaponName: "",
        weaponDamage: "",
        
        init: function(name, hp, wName, wDamage) {
            this.name = name;
            this.hp = hp;
            this.weaponName = wName;
            this.weaponDamage = wDamage;
        }
    };
    
    // Game mandatory variables
    var game = Game.new();
    var player1, player2;
    var player1Data = Object.create(GamePlayer);
    var player2Data = Object.create(GamePlayer);
    
    player1Data.id = 0;
    player2Data.id = 1;
    
    function updatePlayerData(playerId, player) {
        var playerData = (playerId === 0) ? player1Data : player2Data;
        
        playerData.init(player.name, player.hp, player.weapon.name, player.weapon.damage);
    }

    return ({
        newGame: function(player1Name, player2Name) {
            if (game.running()) {
                game.stop();
            }
            var weapons = weaponFactory.get(MAX_WEAPON_COUNT);
            var players = [
                Player.new(player1Name || DEFAULT_PLAYER_NAME + "1")
                .equipWeapon(weapons[0]),
                Player.new(player2Name || DEFAULT_PLAYER_NAME + "2")
                .equipWeapon(weapons[0])
            ];
            
            game.init(Grid.new(SIZE), weapons, players);
            updatePlayerData(0, game.getPlayer(0));
            updatePlayerData(1, game.getPlayer(1));
            game.start();
            return ([player1Data, player2Data]);
        },

        /*
        ** TODO : create a check method game.isValidMove(player, stepX, stepY)
        ** That funtion will check if the player will encounter an obstacle
        ** weapon pick up will be done in function movePlayer()
        */
        playerMove: function(playerId, stepX, stepY) {
            if (!game.running()) {
                return (false);
            }
            if (!game.gamePhase === Game.GAMEPHASE.MOVE) {
                return (false);
            }
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            if ((stepX > MAX_PLAYER_MOVE) || (stepX < 0)
                || (stepY > MAX_PLAYER_MOVE) || (stepY < 0)) {
                return (false);
            }
            var player = (playerId === 0) ? player1 : player2;
            //            if (!game.isValidMove(player, stepX, stepY)) {
            //                return (false);
            //            }
            game.movePlayer(player, stepX, stepY);
            this.gamePhase = (game.playerCollision() == true) ? Game.GAMEPHASE.BATTLE : Game.GAMEPHASE.MOVE;
            updatePlayerData(playerId, player);
            return (true);
        },

        playerAttack: function(playerId) {
            if (!game.running()) {
                return (false);
            }
            if (!game.gamePhase === Game.GAMEPHASE.BATTLE) {
                return (false);
            }
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            var attacker = (playerId === 0) ? player1 : player2;
            var defender = (playerId === 0) ? player2 : player1;
            var success = attacker.attack(defender);

            updatePlayerData(0, player1);
            updatePlayerData(1, player2);
            return (success);
        },

        getGamePhase: function () {
            return (game.gamePhase);
        },

        isPlayerAlive: function(playerId) {
            if (!game.running()) {
                return (false);
            }
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            return (((playerId === 0) ? player1 : player2).isAlive());
        },
        
        getGrid: function() {
            return (game.grid);
        },
        
        getPlayerData: function(playerId) {
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            return ((playerId === 0) ? player1Data : player2Data)
        },

        getWinnerPhrase: function(playerId) {
            if (!game.running()) {
                return (false);
            }
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            var player = (playerId === 0) ? player1Data : player2Data;
            
            if (player.hp >= MAX_PLAYER_HP * .75 ) {
                return ("awkward !!! ".toUpperCase() + player.name
                        + " you totally mastered this fight !".toUpperCase()
                       );
            } else if (player.hp >= (MAX_PLAYER_HP * .5)) {
                return ("Congratulations " + player.name + " the victory is yours !");
            } else if (player.hp >= (MAX_PLAYER_HP * .25)) {
                return ("Hey " + player.name + " that was a tough fight but you've proven you are the best.");
            } else {
                return (player.name + " wins.");
            }
        }
    });
})();