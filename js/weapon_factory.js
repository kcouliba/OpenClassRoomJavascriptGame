/**
 * @name WeaponFactory
 * @author Kevin Coulibaly <coulibaly.d.kevin@gmail.com>
 * @description Weapon factory
 */
const WeaponFactory = (function() {
  /**
   * Weapon Class
   */
  function Weapon(name, damage) {
    // properties
    this.name = name
    this.damage = damage

    // methods
    this.toString = function() {
      return 'name : ' + this.name + ' damage : ' + this.damage
    }
    return this
  }

  function create(name, damage) {
    return new Weapon(name, damage)
  }

  return {
    create,
    new: create,
  }
})()