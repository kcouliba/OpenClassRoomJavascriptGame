/*
** scripts.js
** Author coulibaly.d.kevin@gmail.com
** A script class for running scripts
** Caution : All other files must have been loaded before that one
*/

var Scripts = {
    scripts: { },
    
    /*
    ** add
    ** Adds a test to test pool
    ** @param name : string
    ** @param f : function
    */
    add: function(name, f) {
        this.scripts[name] = f;
        console.log("Added script : " + name + ".");
    },
    
    /*
    ** run
    ** Runs a script from script pool
    ** @param name : string
    */
    run: function(name) {
        var f = this.scripts[name];
        
        if (f) {
            console.log("Running script : " + name + ".");
            console.log("****************************************");
            var result = f();
            console.log("****************************************");
            console.log("");
            return (result);
        }
        return (null);
    },
    
    /*
    ** runAll
    ** Runs all scripts from script pool
    */
    runAll: function() {
        for (script in this.scripts) {
            this.run(script);
        }
    }
};

//var p1 = Player.new();
//var p2 = Player.new();

//scripts.add("p1AttacksP2WithoutWeapon", function() {    
//    return (p1.attack(p2));
//});
//
//scripts.add("p1AttacksP2WithGloves", function() {    
//    p1.equipWeapon(Weapon.new("Gloves"));
//    return (p1.attack(p2));
//});

//scripts.run("p1AttacksP2WithoutWeapon");
//scripts.run("p1AttacksP2WithGloves");
//scripts.run("p1AttacksP2WithGloves");