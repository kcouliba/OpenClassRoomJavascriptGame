// IIFE encapsulation
(function(app) {
  "use strict";

  function gameStart(evt) {
    var btn = evt.target;

    app.newGame("", "");
    btn.setAttribute("disabled", "disabled");
    btn.removeEventListener("click", gameStart);
  }

  var GameInterface = {
    /* methods */

    init: function() {
      var self = Object.create(this);

      self.initNewGameEvent();
      return (self);
    },

    /*
    ** initNewGameEvent
    ** Event that triggers a new game
    */
    initNewGameEvent: function() {
      var self = this;

      const btn = document.querySelector(".btn-new-game");

      btn.addEventListener("click", gameStart);
    },
  };

  GameInterface.init();
})(app);
