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
      Weapon.new(DEFAULT_WEAPON_NAME, DEFAULT_WEAPON_DAMAGE),
      Weapon.new("Pillow", 3),
      Weapon.new("Bare hand", 5),
      Weapon.new("Fork", 8),
      Weapon.new("Club", 12),
      Weapon.new("Hoover", 14),
      Weapon.new("Shotgun", 30)
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
  var renderingSurface = RenderingSurface;
  var player1, player2, activePlayer;
  var player1Data = Object.create(GamePlayer);
  var player2Data = Object.create(GamePlayer);

  player1Data.id = 0;
  player2Data.id = 1;
  activePlayer = null;
  idlePlayer = null;

  /* Functions */

  /*
  ** updatePlayerData
  ** Updates player data
  */
  function updatePlayerData(player) {
    var playerData = (player.id === 0) ? player1Data : player2Data;

    playerData.init(player.name, player.hp, player.weapon.name, player.weapon.damage);
  }

  /*
  ** switchPlayer
  ** Switches player roles / turn
  */
  function switchPlayer() {
    activePlayer = (activePlayer === player1) ? player2 : player1;
    idlePlayer = (activePlayer === player1) ? player2 : player1;
  }

  /*
  ** playerMove
  ** Make a player move
  ** @param playerId : int
  ** @param stepX : int
  ** @param stepY : int
  ** @return bool
  */
  function playerMove(stepX, stepY) {
    if (!game.running()) {
      return (false);
    }
    if (!game.gamePhase === GAMEPHASE.MOVE) {
      return (false);
    }
    if (activePlayer === null) {
      return (false);
    }
    if ((Math.abs(stepX) > MAX_PLAYER_MOVE)
    || (Math.abs(stepY) > MAX_PLAYER_MOVE)) {
      return (false);
    }
    game.movePlayer(activePlayer, stepX, stepY);
    updatePlayerData(activePlayer);
    switchPlayer();
    return (true);
  }

  /*
  ** playerAttack
  ** Make a player attack the other one
  ** @param playerId : int
  ** @return bool
  */
  function playerAttack() {
    if (!game.running()) {
      return (false);
    }
    if (!game.gamePhase === GAMEPHASE.BATTLE) {
      return (false);
    }
    if (activePlayer === null) {
      return (false);
    }
    var success = activePlayer.attack(idlePlayer);

    updatePlayerData(activePlayer);
    updatePlayerData(idlePlayer);
    switchPlayer();
    return (success);
  }

  /*
  ** playerSetStance
  ** Make a player move its stance mode
  ** @param playerId : int
  ** @param stance : int
  */
  function playerSetStance(stance) {
    if (!game.running()) {
      return (false);
    }
    if (!game.gamePhase === GAMEPHASE.BATTLE) {
      return (false);
    }
    if (activePlayer === null) {
      return (false);
    }
    game.getPlayer(activePlayer).setStance(stance);
    switchPlayer();
  }

  /*
  ** hasWinner
  ** Checks if a player has fainted
  ** @return object
  */
  function hasWinner() {
    if (!activePlayer.isAlive()) {
      return {
        winner: idlePlayer,
        loser: activePlayer
      }
    }
    if (!idlePlayer.isAlive()) {
      return {
        winner: activePlayer,
        loser: idlePlayer
      }
    }
    return null;
  }

  /* Inputs */

  function subscribeMoveInput() {
    keyInput((step) => {
      playerMove(step.x, step.y);
      renderingSurface.update();
    });
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
        Player.new(player1Data.id, player1Name || DEFAULT_PLAYER_NAME + "1")
        .equipWeapon(weapons[0]),
        Player.new(player2Data.id, player2Name || DEFAULT_PLAYER_NAME + "2")
        .equipWeapon(weapons[0])
      ];

      game.init(Grid.new(SIZE), weapons, players);
      player1 = game.getPlayer(player1Data.id); // Get player1 data
      player2 = game.getPlayer(player2Data.id); // Get player2 data
      activePlayer = player1; // Gives focus to player 1
      idlePlayer = player2; // Puts the player 2 into a idle state
      updatePlayerData(player1);
      updatePlayerData(player2);
      game.start();
      renderingSurface.init(game.grid);
      renderingSurface.update();
      subscribeMoveInput();
      return ([player1Data, player2Data]);
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
      return {
        player1: player1Data,
        player2: player2Data
      };
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
        return ("awkward !!! ".toUpperCase() + player.name + " you totally mastered this fight !".toUpperCase());
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
