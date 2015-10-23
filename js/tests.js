/*
** tests.js
** Author coulibaly.d.kevin@gmail.com
** Date 23/10/2015
** A test file for running scripts
** Caution : All other files must have been loaded before that one
*/

var tests = {
    /* TODO
    ** Some automated tests
    */
    
};

var grid = Object.create(Grid);

var gloves = Object.create(Weapon);
var baseballBat = Object.create(Weapon);
var knife = Object.create(Weapon);
var chain = Object.create(Weapon);

var p1 = Object.create(Player);
var p2 = Object.create(Player);


grid.init();

gloves.init("Gloves", Math.round(DEFAULT_DAMAGE));
baseballBat.init("Baseball Bat", Math.round(DEFAULT_DAMAGE * 1.5));
chain.init("Chain", Math.round(DEFAULT_DAMAGE * 1.8));
knife.init("Knife", Math.round(DEFAULT_DAMAGE * 2));

p1.init(null, true);
p2.init(null, false);