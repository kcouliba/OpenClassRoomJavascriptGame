/*
** player.js
** Author coulibaly.d.kevin@gmail.com
** Player Class
*/

/*
** Player Class
*/
var Player = {
    /* Player attributes */
    
    id: -1,
    name: "",
    hp: 0,
    weapon: null,
    stance: 0,
    STANCE: {
        ATTACK: 0,
        DEFENSE: 1
    },

    /* Player methods */
    
    /*
    ** init
    ** Constructor
    ** @param name : string
    ** @return Player
    */
    init: function(id, name) {
        this.id = id;
        this.name = name;
        this.hp = 100;
        this.stance = Player.STANCE.ATTACK;
        if (DEBUG) {
            console.log("New player created : \n\t" + this);
        }
        return (this);
    },

    /*
    ** new
    ** Creates new Player instance
    ** @param id : int
    ** @param name : string (optional)
    ** @return Player
    */
    new: function (id, name) {
        return (Object.create(Player).init(id, name));
    },

    /*
    ** setStance
    ** Changes player's stance
    ** @param : int
    */
    setStance: function(stance) {
        this.stance = stance;
        if (DEBUG) {
            console.log("Player " + this.name + " switched stance to "
                        + ((this.stance === Player.STANCE.DEFENSE) ? "defense" : "attack") + ".");
        }
    },

    /*
    ** dropWeapon
    ** Drops current weapon (set to null)
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
    ** @return bool
    */
    attack: function(player) {
        if (DEBUG) {
            console.log(this.name + " attacks " + player.name 
                        + " with " + this.weapon.name + " dealing " + this.weapon.damage + ".");
        }
        if (!player.isAlive() || !this.isAlive()) {
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
    ** @param damage : int
    ** @return bool
    */
    takeDamage: function(damage) {
        if (!this.isAlive()) {
            return (false);
        }
        this.hp -= (this.stance === Player.STANCE.DEFENSE) 
            ? Math.ceil(damage / 2) : damage;
        this.hp = (this.hp < 0) ? 0 : this.hp;
        if (DEBUG) {
            console.log(this.name + " takes " + damage
                        + " damage.\nCurrent hp : " + this.hp + ".");
            if (this.hp <= 0) {
                console.log(this.name + " fainted.");
            }
        }
        return (true);
    },

    /*
    ** isAlive
    ** Checks if player hp are above 0
    ** @return bool
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