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

// Grid initializing
grid.init();

// Weapon initializing
gloves.init("Gloves", Math.round(DEFAULT_DAMAGE));
baseballBat.init("Baseball Bat", Math.round(DEFAULT_DAMAGE * 1.5));
chain.init("Chain", Math.round(DEFAULT_DAMAGE * 1.8));
knife.init("Knife", Math.round(DEFAULT_DAMAGE * 2));

// Player initializing
p1.init(null, true);
p2.init(null, false);

// Equip weapon
p1.equipWeapon(baseballBat);
p2.equipWeapon(knife);

// Action selecting
p1.setStance(ATTACK_STANCE);
p2.setStance(ATTACK_STANCE);

// Action between players
p1.attack(p2);
p2.attack(p1);