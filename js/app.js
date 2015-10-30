/*
** Entry point
*/
/*
** TODO
** replace prompt logic by ui data harvest
*/
(function() {
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
    console.log(weaponFactory.get(4));
    var player1Name = "J";
    var player2Name = "D";
    var game = Game.new();
    var newGame;

    game.start();
    while (game.running()) {
        var player1,
            player2,
            playing,
            waiting,
            action;
        var input = []; // Look for a better way (form ?) ux_ui
        var turnCount = 0;
        var weapons = weaponFactory.get(MAX_WEAPON_COUNT);
        var players = [
            Player.new(player1Name || DEFAULT_PLAYER_NAME + "1")
            .equipWeapon(weapons[0]),
            Player.new(player2Name || DEFAULT_PLAYER_NAME + "2")
            .equipWeapon(weapons[0])
        ];

        game.init(Grid.new(SIZE), weapons, players);
        player1 = game.getPlayer(0);
        player2 = game.getPlayer(1);
        playing = player2;
        waiting = player1;

        /*
        ** Enter move mode until players encounters
        */
        do {
            playing = (playing === player1) ? player2 : player1;
            waiting = (playing === player1) ? player2 : player1;
            do {
                input = prompt(playing.name + ", enter move (x, y) : (current position "
                               + playing.getPosition() + ")");
            } while (!input);
            if (input.toLowerCase() === "quit") {
                return (false);
            }
            input = input.trim().split('-');
            game.movePlayer(playing, parseInt(input[0], 10), parseInt(input[1], 10));
        } while (!game.playerCollision());

        /*
        ** Enter fight mode until one player faints
        */
        turnCount = 0;
        console.log("FIIIIIIGHHHTTT !!!");
        do {
            turnCount++;
            console.log("Turn : " + turnCount);
            for (var i = 0; i < 2; i++) {
                playing = (playing === player1) ? player2 : player1;
                waiting = (playing === player1) ? player2 : player1;
                //            input = prompt(playing.name + " ( " + playing.hp + " hp)" + " , enter action (a : attack, d : defense) : ");
                input = 'a';
                if (!input) {
                    input = 'a';
                }
                input = input.trim().toLowerCase();
                playing.setStance((input === 'a') ? Player.STANCE.attack : Player.STANCE.defense);
            }
            for (var i = 0; i < 2; i++) {
                playing = (playing === player1) ? player2 : player1;
                waiting = (playing === player1) ? player2 : player1;
                if ((playing.stance === Player.STANCE.attack) && playing.isAlive()) {
                    playing.attack(waiting);
                }
                playing.setStance(Player.STANCE.attack);
            }
        } while (player1.isAlive() && player2.isAlive());

        /*
        ** Announce the winner
        */
        if (player1.isAlive()) {
            console.log(getWinningPhrase(player1));
            console.log("Better luck next time " + player2.name);
        } else {
            console.log(getWinningPhrase(player2));
            console.log("Better luck next time "  + player1.name);
        }
        if ((newGame = prompt("New game ? (Y / N)") || 'N').toUpperCase() === 'N') {
            game.stop();
        }
    }

    /*
    ** Tests
    */
    //    gameClassInitTests(game);
})();

/*
** gameClassInitTests
** Runs tests on Game class
*/
function gameClassInitTests(game) {
    var gameTests = Tests.new("game class init tests");

    gameTests.add("shouldHaveAtLeast4Weapons", true, function() {
        if (game.weapons.length < 4) {
            return (false);
        }
        return (true);
    })
        .add("shouldHaveExactly2Players", 2, function() {
        return (game.players.length);
    })
        .add("shouldGridHave2Players", 2, function() {
        var count = 0;
        var grid = game.grid.grid;

        for (var key in grid) {
            count += (parseInt(grid[key], 10) === Grid.CELLSTATE.player) ? 1 : 0;
        }
        return (count);
    })
        .runAll();
}

function getWinningPhrase(player) {
    if (player.hp >= MAX_PLAYER_HP * .75 ) {
        return ("awkward !!! ".toUpperCase() + player.name
                + " you totally mastered this fight !".toUpperCase()
               );
    } else if (player.hp >= MAX_PLAYER_HP * .5 ) {
        return ("Congratulations " + player.name + " the victory is yours !");
    } else if (player.hp >= MAX_PLAYER_HP * .25 ) {
        return ("Hey " + player.name + " that was a tough fight but you've proven you are the best.");
    } else {
        return (player.name + " wins.");
    }
}


/* Event Testing
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