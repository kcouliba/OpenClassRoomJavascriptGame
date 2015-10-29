/*
** weapon.js
** Author coulibaly.d.kevin@gmail.com
** Date 29/10/2015
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
    ** @return this
    */
    init: function(name, damage) {
        this.name = name || DEFAULT_WEAPON_NAME;
        this.damage = Math.ceil(parseInt(damage)) || DEFAULT_DAMAGE;
        console.log("New weapon created : " + this.toString());
        return (this);
    },
    
    /*
    ** new
    ** @param name : string
    ** @param damage : int
    ** @return a new instance of Weapon
    */
    new: (function() {
        return (function (name, damage) {
            return (Object.create(Weapon).init(name, damage));
        });
    })(),

    /*
    ** toString
    ** Returns a string representation of the instance
    ** @return string
    */
    toString: function() {
        return ("name : " + this.name + " damage : " + this.damage);
    }
};