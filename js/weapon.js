/*
** weapon.js
** Author coulibaly.d.kevin@gmail.com
** Date 24/10/2015
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

var createWeapon = (function() {
    return (function (name, damage) {
        var weapon = Object.create(Weapon);

        weapon.init(name, damage);
        return (weapon);
    });
})();