/*
** weapon.js
** Author coulibaly.d.kevin@gmail.com
** Date 23/10/2015
** Weapon definition
*/

/** Constants values **/
const DEFAULT_WEAPON_NAME = "Gloves";
const DEFAULT_DAMAGE = 10;

/*
** Weapon Class
*/
var Weapon = {
    name: "",
    damage: 0,
    
    /*
    ** init
    ** Constructor
    ** @param name : string
    ** @param damage : Number
    */
    init: function(name, damage) {
        this.name = name || DEFAULT_WEAPON_NAME;
        this.damage = parseInt(damage) || DEFAULT_DAMAGE;
        console.log("New weapon created : " + this.toString());
    },
    
    /*
    ** toString
    ** Returns a string representation of the instance
    ** @return string
    */
    toString: function() {
        return ("name : " + this.name + " damage : " + this.damage);
    }
};

/** Tests **/

var gloves = Object.create(Weapon);
var baseballBat = Object.create(Weapon);
var knife = Object.create(Weapon);
var chain = Object.create(Weapon);

gloves.init("Gloves", Math.round(DEFAULT_DAMAGE));
baseballBat.init("Baseball Bat", Math.round(DEFAULT_DAMAGE * 1.5));
chain.init("Chain", Math.round(DEFAULT_DAMAGE * 1.8));
knife.init("Knife", Math.round(DEFAULT_DAMAGE * 2));

/** Tests End **/

/*
** Weapon Class
** Alternative Version
*/
/*
function Weapon(name, damage) {
    this.name = name || DEFAULT_WEAPON_NAME;
    this.damage = parseInt(damage) || DEFAULT_DAMAGE;
    
    console.log("New weapon created : " + this.toString());
    
    this.toString = function() {
        return ("name : " + this.name + " damage : " + this.damage);
    };
}
*/