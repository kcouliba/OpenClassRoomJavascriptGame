include("constants");
include("grid");
include("weapon");
include("player");
include("scripts");
include("tests");

function include(jsfile) {
    var script = document.createElement("script");
    
    script.setAttribute("src", "../js/" + jsfile + ".js");
    script.setAttribute("type", "text/javascript");
    document.getElementsByTagName("body")[0].appendChild(script);
}

/*
** Entry point
*/
(function() {
    
})();


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