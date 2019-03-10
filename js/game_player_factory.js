/**
 * @name game_player.js
 * @author Kevin Coulibaly <coulibaly.d.kevin@gmail.com>
 */

const GamePlayerFactory = (function() {
  function GamePlayer(id, name, hp, weaponName, weaponDamage) {
    this.id = id
    this.name = name
    this.hp = hp
    this.weaponName = weaponName
    this.weaponDamage = weaponDamage

    return this
  }

  return {
    create: function(id, name, hp, wName, wDamage) {
      return new GamePlayer(id, name, hp, wName, wDamage)
    },
  }
})()
