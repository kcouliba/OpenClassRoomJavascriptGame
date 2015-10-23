/*
** player.js
** Author coulibaly.d.kevin@gmail.com
** Date 23/10/2015
** Player definition
*/

/** Constant values */
const DEFAULT_PLAYER_NAME = "Player";
const MAX_HP = 100;
const MAX_MOVE = 3; // How many cells can the player go through
const ATTACK_STANCE = 0;
const DEFENSE_STANCE = 1;

/*
** Player Class
*/
var Player = {
    name: "",
    hp: MAX_HP,
    weapon: null,
    stance: ATTACK_STANCE,
    
    /*
    ** init
    ** Constructor
    ** @param name : string
    ** @param firstPlayer : boolean
    */
    init: function(name, firstPlayer) {
        this.name = name || DEFAULT_PLAYER_NAME + (firstPlayer) ? "P1" : "P2";
        this.hp = MAX_HP;
        if (DEBUG) {
            console.log("Created new player : \n\t" + this);
        }
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
                        + (this.stance === DEFENSE_STANCE) ? "defense" : "attack" + ".");
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
    },
    
    /*
    ** attackPlayer
    ** Attacks targeted player
    ** @param player : Player
    */
    attack: function(player) {
        if (DEBUG) {
            console.log("Player " + this.name + " attacks " 
                        + player.name + " with " + this.weapon + ".");
        }
        if (this.weapon != null) {
            player.takeDamage(this.weapon.damage);
        } else {
            player.takeDamage(0);
        }
    },
    
    /*
    ** takeDamage
    ** Decreases current hp by damage value
    ** @param damage : integer
    */
    takeDamage: function(damage) {
        this.hp -= (this.stance === DEFENSE_STANCE) 
            ? Math.ceil(damage / 2) : damage;
        if (DEBUG) {
            console.log("Player " + this.name + " takes " + damage
                        + " damage.\nCurrent hp : " + this.hp + ".");
        }
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
               + ", alive : " + this.isAlive());
    }
};

/** Tests **/



/** Tests End **/