/*
** gamePlayer.js
** Author coulibaly.d.kevin@gmail.com
** Represents a game player
*/

var GamePlayer = {
    id: -1,
    name: "",
    hp: "",
    weaponName: "",
    weaponDamage: "",

    init: function(name, hp, wName, wDamage) {
        this.name = name;
        this.hp = hp;
        this.weaponName = wName;
        this.weaponDamage = wDamage;
    }
};
