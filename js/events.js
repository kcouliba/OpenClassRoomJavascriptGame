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
  "use strict";

  var ui = UI.init();

  var GameInterface = {
    /* attributes */

    currentPlayer: null,
    gamePhase: null,

    /* methods */

    init: function() {
      var self = Object.create(this);

      self.currentPlayer = PLAYER.PLAYER1;
      // initialize start game event
      self.initNewGameEvent();
      // initialize controls
      self.initEvents();
      // update ui
      ui.showPlayer(PLAYER.PLAYER1);
      ui.hidePlayer(PLAYER.PLAYER2);
      return (self);
    },

    /*
    ** initNewGameEvent
    ** Event that triggers a new game
    */
    initNewGameEvent: function() {
      var self = this;

      const btn = document.querySelector(".btn-new-game");

      btn.addEventListener("click", () => {
        app.newGame("", "");
        self.gamePhase = app.getGamePhase();
        // update the ui
        ui.update();
        btn.setAttribute("disabled", "disabled");
        console.log(btn);
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

        if (app.gamePhase === GAMEPHASE.MOVE) {
          for (var i = 0; i < inputs.length; i++) {
            /* get the direction */
            if (inputs[i].name == "playerDirection" && inputs[i].checked) {
              var split = inputs[i].value.split(',');

              direction = Position.new(parseInt(split[0], 10), parseInt(split[1], 10));
              console.log(direction);
            }
            /* get the steps */
            if (inputs[i].name == "playerStep" && inputs[i].checked) {
              step = parseInt(inputs[i].value, 10);
              console.log(step);
            }
          }
          if ((direction != null) && (step != 0)) {
            move = Position.new(direction.x * step, direction.y * step);
            app.playerMove(self.currentPlayer, move.x, move.y);
            self.currentPlayer = (self.currentPlayer === PLAYER.PLAYER1) ?
            PLAYER.PLAYER2 : PLAYER.PLAYER1;
            // Change player turn
            ui.togglePlayer();
            // Update the ui
            ui.update();
          }
        } else if (app.getGamePhase() === GAMEPHASE.BATTLE) {
          var actionPlayer1 = ATTACK_STANCE;
          var actionPlayer2 = ATTACK_STANCE;

          app.playerSetStance(PLAYER.PLAYER1, ATTACK_STANCE);
          app.playerSetStance(PLAYER.PLAYER2, ATTACK_STANCE);
          for (var i = 0; i < inputs.length; i++) {
            /* get player 1 action */
            if (inputs[i].name == "actionPlayer1" && inputs[i].checked) {
              if (inputs[i].value == DEFENSE_STANCE) {
                app.playerSetStance(PLAYER.PLAYER1, DEFENSE_STANCE);
                actionPlayer1 = DEFENSE_STANCE;
              }
            }
            /* get player 2 action */
            if (inputs[i].name == "actionPlayer2" && inputs[i].checked) {
              if (inputs[i].value == DEFENSE_STANCE) {
                app.playerSetStance(PLAYER.PLAYER2, DEFENSE_STANCE);
                actionPlayer2 = DEFENSE_STANCE;
              }
            }
          }
          if (actionPlayer1 === ATTACK_STANCE) {
            app.playerAttack(PLAYER.PLAYER1);
            // update the ui
            ui.update();
            if (!app.isPlayerAlive(PLAYER.PLAYER2)) {
              // announce player 1 is victorious
              ui.announceWinner(PLAYER.PLAYER1);
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
          if (actionPlayer2 === ATTACK_STANCE) {
            app.playerAttack(PLAYER.PLAYER2);
            // update the ui
            ui.update();
            if (!app.isPlayerAlive(PLAYER.PLAYER1)) {
              // announce player 2 is victorious
              ui.announceWinner(PLAYER.PLAYER2);
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
        dataPlayer.setStance(ATTACK_STANCE);
        this.setAttribute('disabled', "disabled");
        //                        defendButton.removeAttribute('disabled');
        defendButton.setAttribute('disabled', "disabled");
      });
      // Defense event
      defendButton.addEventListener('click', function() {
        dataPlayer.setStance(DEFENSE_STANCE);
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

      const step = {
        x: 0,
        y: 0
      };
      const validInputs = [
        KEYBOARD_INPUT.KEY_LEFT,
        KEYBOARD_INPUT.KEY_UP,
        KEYBOARD_INPUT.KEY_RIGHT,
        KEYBOARD_INPUT.KEY_DOWN,
        KEYBOARD_INPUT.KEY_RETURN
      ];
      const controls = (event) => {
        if (validInputs.indexOf(event.which) === -1) {
          return true;
        }
        event.stopPropagation();
        event.preventDefault();
        console.log(`key : ${event.which}`);
        switch (event.which) {
          case KEYBOARD_INPUT.KEY_LEFT:
            step.x -= ((step.x - 1) >= -MAX_PLAYER_MOVE) ? 1 : 0;
            step.y = 0;
            console.log(`move left`);
            break;
          case KEYBOARD_INPUT.KEY_UP:
            step.x = 0;
            step.y -= ((step.y - 1) >= -MAX_PLAYER_MOVE) ? 1 : 0;
            console.log(`move up`);
            break;
          case KEYBOARD_INPUT.KEY_RIGHT:
            step.x += ((step.x + 1) <= MAX_PLAYER_MOVE) ? 1 : 0;
            step.y = 0;
            console.log(`move right`);
            break;
          case KEYBOARD_INPUT.KEY_DOWN:
            step.x = 0;
            step.y += ((step.y + 1) <= MAX_PLAYER_MOVE) ? 1 : 0;
            console.log(`move down`);
            break;
          case 13:
            console.log(`validate move : (${step.x}, ${step.y})`);
            step.x = 0;
            step.y = 0;
            break;
          default:
            break;
        }
      };
      document.addEventListener("keydown", controls);
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
  gameInterface.initNewGameEvent();
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
