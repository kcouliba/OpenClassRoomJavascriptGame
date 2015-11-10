/*
** weapon.js
** Author coulibaly.d.kevin@gmail.com
** Weapon definition
*/

/*
** Weapon Class
*/
var Weapon = {
    /* Weapon attributes */
    
    name: "",
    damage: 0,

    /* Weapon methods */
    
    /*
    ** init
    ** Constructor
    ** @param name : string
    ** @param damage : Number
    ** @return Weapon
    */
    init: function(name, damage) {
        this.name = name;
        this.damage = Math.ceil(parseInt(damage));
        console.log("New weapon created : " + this.toString());
        return (this);
    },
    
    /*
    ** new
    ** Creates a new Weapon instance
    ** @param name : string
    ** @param damage : int
    ** @return Weapon
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