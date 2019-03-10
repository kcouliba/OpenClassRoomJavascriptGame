/*
** TODO : create a check method game.isValidMove(player, stepX, stepY)
** That funtion will check if the player will encounter an obstacle
** weapon pick up will be done in function movePlayer()
*/

const app = (function() {
    /* Game initialization */

    // WeaponFactory
    var weaponFactory = {
        weapons: [
            WeaponFactory.create("Gloves", DEFAULT_WEAPON_DAMAGE),
            WeaponFactory.create("Pillow", 3),
            WeaponFactory.create("Bare hand", 5),
            WeaponFactory.create("Fork", 8),
            WeaponFactory.create("Club", 12),
            WeaponFactory.create("Hoover", 14),
            WeaponFactory.create("Shotgun", 30)
        ],

        /*
        ** get
        ** Returns an array containing weapons
        ** @param count : int
        ** @return Array
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

    // Game mandatory variables
    var game = Game.new();
    var player1, player2;
    var player1Data, player2Data;

    function initPlayersData(player1, player2) {
        player1Data = GamePlayerFactory.create(
            player1.id,
            player1.name,
            player1.hp,
            player1.weapon.name,
            player1.weapon.damage
        )
        player2Data = GamePlayerFactory.create(
            player2.id,
            player2.name,
            player2.hp,
            player2.weapon.name,
            player2.weapon.damage
        )
    }

    function updatePlayerData(player) {
        var playerData = (player.id === 0) ? player1Data : player2Data;

        if (!playerData) {
            return
        }
        playerData.hp = player.hp
        playerData.weaponName = player.weapon.name
        playerData.weaponDamage = player.weapon.damage
    }

    return ({
        /*
        ** newGame
        ** Sets a new game and returns players in an array
        ** @param player1Name : string
        ** @param player2Name : string
        ** @return Array
        */
        newGame: function(player1Name, player2Name) {
            if (game.running()) { // If a game is running we stop it
                game.stop();
            }
            var weapons = weaponFactory.get(MAX_WEAPON_COUNT);
            var players = [
                PlayerFactory.create(player1Name || DEFAULT_PLAYER_NAME + "1").equipWeapon(weapons[0]),
                PlayerFactory.create(player2Name || DEFAULT_PLAYER_NAME + "2").equipWeapon(weapons[0]),
            ];

            game.init(new Grid(GRID_SIZE), weapons, players);
            player1 = game.getPlayer(0); // Get player1 data
            player2 = game.getPlayer(1); // Get player2 data
            initPlayersData(player1, player2);
            game.start();
            return ([player1Data, player2Data]);
        },

        /*
        ** playerMove
        ** Make a player move
        ** @param playerId : int
        ** @param stepX : int
        ** @param stepY : int
        ** @return bool
        */
        playerMove: function(playerId, stepX, stepY) {
            if (!game.running()) {
                return (false);
            }
            if (!game.gamePhase === GAMEPHASE.MOVE) {
                return (false);
            }
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            if ((Math.abs(stepX) > MAX_PLAYER_MOVE)
                || (Math.abs(stepY) > MAX_PLAYER_MOVE)) {
                return (false);
            }
            var player = (playerId === 0) ? player1 : player2;
            /*if (!game.isValidMove(player, stepX, stepY)) {
                return (false);
            }*/
            game.movePlayer(player, stepX, stepY);
            updatePlayerData(player);
            return (true);
        },

        /*
        ** playerAttack
        ** Make a player attack the other one
        ** @param playerId : int
        ** @return bool
        */
        playerAttack: function(playerId) {
            if (!game.running()) {
                return (false);
            }
            if (!game.gamePhase === GAMEPHASE.BATTLE) {
                return (false);
            }
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            var attacker = (playerId === 0) ? player1 : player2;
            var defender = (playerId === 0) ? player2 : player1;
            var success = attacker.attack(defender);

            updatePlayerData(player1);
            updatePlayerData(player2);
            return (success);
        },

        /*
        ** playerSetStance
        ** Make a player move its stance mode
        ** @param playerId : int
        ** @param stance : int
        */
        playerSetStance: function(playerId, stance) {
            if (!game.running()) {
                return (false);
            }
            if (!game.gamePhase === GAMEPHASE.BATTLE) {
                return (false);
            }
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            game.getPlayer(playerId).setStance(stance);
        },

        /*
        ** getGamePhase
        ** Gets the game current phase
        ** @return GAMEPHASE
        */
        getGamePhase: function () {
            this.gamePhase = (game.playerCollision() == true) ? GAMEPHASE.BATTLE : GAMEPHASE.MOVE;
            return (game.gamePhase);
        },

        /*
        ** isPlayerAlive
        ** Checks if a player is alive
        ** @param playerId : int
        ** @return bool
        */
        isPlayerAlive: function(playerId) {
            if (!game.running()) {
                return (false);
            }
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            return (((playerId === 0) ? player1 : player2).isAlive());
        },

        /*
        ** getGrid
        ** Fetches current grid state
        ** @return Grid
        */
        getGrid: function() {
            return (game.grid);
        },

        /*
        ** Retrieves a player's data
        ** @param playerId : int
        ** @return PlayerData
        */
        getPlayerData: function(playerId) {
            if ((playerId < 0) || (playerId > 1)) {
                return (false);
            }
            return ((playerId === 0) ? player1Data : player2Data)
        },

        /*
        ** getWinnerPhrase
        ** Returns a winning phrase depending on winner's status
        ** @param playerId : int
        ** @return string or null
        */
        getWinnerPhrase: function(playerId) {
            if (!game.running()) {
                return (null);
            }
            if ((playerId < 0) || (playerId > 1)) {
                return (null);
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
