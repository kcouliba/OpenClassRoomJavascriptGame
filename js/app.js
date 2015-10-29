(function() {
    /*
    ** Tests grid
    */
    /*
    var testGrids = [];

    testGrids.push([
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0
    ]);
    testGrids.push([
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0
    ]);
    testGrids.push([
        0,0,0,0,0,0,0,0,0,0,
        1,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0
    ]);
    testGrids.push([
        0,1,0,0,0,0,0,0,0,0,
        1,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,1,
        0,0,1,0,0,0,0,0,1,0
    ]);
    testGrids.push([
        3,3,3,0,0,0,0,0,0,0,
        3,3,3,0,0,0,0,0,0,0,
        3,3,3,0,0,0,0,0,0,0,
        3,3,3,0,0,0,0,0,0,0,
        3,3,3,0,0,0,0,0,0,0,
        0,0,1,0,0,0,0,0,0,0,
        0,0,1,0,0,0,3,3,3,3,
        0,0,1,0,0,0,3,3,3,3,
        0,0,1,0,0,0,3,3,3,3,
        0,0,1,0,0,0,3,3,3,3
    ]);
*/


    /*
    ** Entry point
    */
    var weapons = [
        Weapon.new(DEFAULT_WEAPON_NAME, DEFAULT_WEAPON_DAMAGE),
        Weapon.new("Bare hand", 5),
        Weapon.new("Club", 12),
        Weapon.new("Fork", 8)
    ];
    var players = [
        Player.new(DEFAULT_PLAYER_NAME + "1")
        .equipWeapon(weapons[1]),
        Player.new(DEFAULT_PLAYER_NAME + "2")
        .equipWeapon(weapons[1])
    ];

    var game = Game.new(Grid.new(SIZE), weapons, players);

    game.init();
    /*
    ** TODO
    ** game loop
    */
    //    ...
    var player1 = game.getPlayer(0);
    var player2 = game.getPlayer(1);
    var playing = player2;
    var waiting = player1;
    var input = [];
    var action = "";
    var winningPhrase = "Congratulations";
    var losingPhrase = "Too bad";

    console.log(player2 === playing);

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
    ** Enter fight mode until one player collapses
    */
    var turnCount = 0;
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
        console.log("Better luck next time : " + player2.name);
    } else {
        console.log(getWinningPhrase(player2));
        console.log("Better luck next time : " + player1.name);
    }

    /*
    ** Tests
    */
    //    gameClassInitTests(game);
    //    gameClassPlayerMoveTests(game);
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


/*
** gameClassPlayerMoveTests
** Runs tests on Game class
*/
function gameClassPlayerMoveTests(game) {

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


/*



var dTest = (function(token) {

    function Player(name) {
        this.id = 0;
    }

    var p = new Player();

    document.addEventListener("click", function(e) {
        for (var i = 0; i < 10; i++) {
            console.log(i);
        }
    });

    document.addEventListener("keyup", function(e) {
        p.id++;
        switch (e.which) {
            case 37:
                console.log("left : " + e.which);
                break;
            default:
                console.log("???");
                break;
        }
        console.log("pid : " + p.id);
    });

    return function(name, token) {
        if (token === 12345) {
            console.log(name);
            return;
        }
        console.log("No way");
    };
})(12345);


var safeEnv = true;
var $_imports = { };
var test = [];
var body = document.getElementsByTagName("body")[0];

function register(name, f) {
    console.log(f);
    var ft = f;
    $_imports[name] = 0;
    test.push(ft);
}

function require(name) {
    if (!safeEnv) {
        return (null);
    }
    return ($_imports[name]);
}

register("abc", function() { return 5; });
register("al", alert);

if (typeof myGame !== "undefined") {
    console.log("Can't launch, another namespace with \"myGame\" is defined.");
    safeEnv = false;
} else {
    window.myGame = {
        version: "0.0.1"
    };
}

if (typeof myGame !== "undefined") {
    console.log("Can't launch, another namespace with \"myGame\" is defined.");
    safeEnv = false;
} else {

    (function() {
        var env = {
            import: {}
        }

        var Map = (function() {
            function Map() {
                this.size = 10,

                this.showSize = function() {
                    return (this.size);
                }
            }

            return Map;
        })();

        env.import.Map = Map;

        (function($){
            var map = new $.import.Map();
            console.log(map.showSize());
        })(env);
    })();
}*/