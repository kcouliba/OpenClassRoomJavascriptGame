/*
** player.js
** Author coulibaly.d.kevin@gmail.com
** Date 29/10/2015
** Player definition
*/

/*
** Player Class
*/
var Player = {
    name: "",
    hp: 0,
    weapon: null,
    stance: 0,
    STANCE: {
        attack: 0,
        defense: 1
    },

    /*
    ** init
    ** Constructor
    ** @param name : string
    ** @return this
    */
    init: function(name) {
        this.name = name;
        this.hp = 100;
        this.stance = Player.STANCE.attack;
        if (DEBUG) {
            console.log("New player created : \n\t" + this);
        }
        return (this);
    },

    /*
    ** new
    ** @param name : string (optional)
    ** @return a new instance of Player
    */
    new: (function() {
        return (function (name) {
            return (Object.create(Player).init(name));
        });
    })(),

    /*
    ** setStance
    ** Changes player's stance
    ** @param : int
    */
    setStance: function(stance) {
        this.stance = stance;
        if (DEBUG) {
            console.log("Player " + this.name + " switched stance to "
                        + ((this.stance === Player.STANCE.defense) ? "defense" : "attack") + ".");
        }
        return (this);
    },

    /*
    ** dropWeapon
    ** Drops current weapon (set to null)
    ** @return this
    */
    dropWeapon: function() {
        this.weapon = null;
        if (DEBUG) {
            console.log("Player " + this.name + " dropped his weapon.");
        }
        return (this);
    },

    /*
    ** equipWeapon
    ** Drops current weapon and equip new one
    ** @param weapon : Weapon
    ** @return this
    */
    equipWeapon: function(weapon) {
        this.dropWeapon();
        this.weapon = weapon;
        if (DEBUG) {
            console.log("Player " + this.name + " equiped " 
                        + this.weapon + ".");
        }
        return (this);
    },

    /*
    ** attackPlayer
    ** Attacks targeted player
    ** @param player : Player
    ** @return : boolean
    */
    attack: function(player) {
        if (DEBUG) {
            console.log(this.name + " attacks " + player.name 
                        + " with " + this.weapon.name + " dealing " + this.weapon.damage + ".");
        }
        if (!player.isAlive()) {
            return (false);
        }
        if (this.weapon != null) {
            player.takeDamage(this.weapon.damage);
        } else {
            player.takeDamage(0);
        }
        return (true);
    },

    /*
    ** takeDamage
    ** Decreases current hp by damage value
    ** @param damage : integer
    ** @return : boolean
    */
    takeDamage: function(damage) {
        if (!this.isAlive()) {
            return (false);
        }
        this.hp -= (this.stance === Player.STANCE.defense) 
            ? Math.ceil(damage / 2) : damage;
        this.hp = (this.hp < 0) ? 0 : this.hp;
        if (DEBUG) {
            console.log(this.name + " takes " + damage
                        + " damage.\nCurrent hp : " + this.hp + ".");
            if (this.hp <= 0) {
                console.log(this.name + " collapsed.");
            }
        }
        return (true);
    },

    /*
    ** isAlive
    ** Checks if player hp are not down
    ** @return boolean
    */
    isAlive: function() {
        return (this.hp > 0);
    },

    /*
    ** toString
    ** Returns a string representation of the instance
    ** @return string
    */
    toString: function() {
        return ("player name : " + this.name
                + ", hp : " + this.hp
                + ", equipped weapon : " + this.weapon
                + ", " + (this.isAlive() ? "alive" : "dead"));
    }
};