/**
 * @name player.js
 * @author Kevin Coulibaly <coulibaly.d.kevin@gmail.com>
 */

/**
 * @name PlayerFactory
 * @description PlayerFactory
 */
const PlayerFactory = (function() {
  let uid = -1

  /**
   * @name setStance
   * @description Change player's stance
   * @param {ATTACK_STANCE | DEFENSE_STANCE} stance
   */
  function setStance(stance) {
    this.stance = stance
    if (DEBUG) {
      console.log(
        'Player ' +
          this.name +
          ' switched stance to ' +
          (this.stance === DEFENSE_STANCE ? 'defense' : 'attack') +
          '.'
      )
    }
    return this
  }

  /**
   * @name dropWeapon
   * @description Drop current weapon (set weapon to null)
   */
  function dropWeapon() {
    this.weapon = null
    if (DEBUG) {
      console.log('Player ' + this.name + ' dropped his weapon.')
    }
    return this
  }

  /**
   * @name equipWeapon
   * @description Drop current weapon if equipped and equip new one
   * @param {Weapon} weapon
   */
  function equipWeapon(weapon) {
    this.dropWeapon()
    this.weapon = weapon
    if (DEBUG) {
      console.log('Player ' + this.name + ' equiped ' + this.weapon + '.')
    }
    return this
  }

  /**
   * @name attackPlayer
   * @description Attack targeted player
   * @param {Player} player
   * @return {Boolean} true if attack lands
   */
  function attack(player) {
    if (DEBUG) {
      console.log(
        this.name +
          ' attacks ' +
          player.name +
          ' with ' +
          this.weapon.name +
          ' dealing ' +
          this.weapon.damage +
          '.'
      )
    }
    if (!player.isAlive() || !this.isAlive()) {
      return false
    }
    if (this.weapon != null) {
      player.takeDamage(this.weapon.damage)
    } else {
      player.takeDamage(0)
    }
    return true
  }

  /**
   * @name takeDamage
   * @description Decrease current hp by damage value
   * @param {Number} damage
   * @return {Boolean} true if damage taken
   */
  function takeDamage(damage) {
    if (!this.isAlive()) {
      return false
    }
    this.hp -= this.stance === DEFENSE_STANCE ? Math.ceil(damage / 2) : damage
    this.hp = this.hp < 0 ? 0 : this.hp
    if (DEBUG) {
      console.log(
        this.name +
          ' takes ' +
          damage +
          ' damage.\nCurrent hp : ' +
          this.hp +
          '.'
      )
      if (this.hp <= 0) {
        console.log(this.name + ' fainted.')
      }
    }
    return true
  }

  /**
   * @name isAlive
   * @description Check if player hp are above 0
   * @return {Boolean}
   */
  function isAlive() {
    return this.hp > 0
  }

  /**
   * @name toString
   * @description Return a string representation of the instance
   * @return {String}
   */
  function toString() {
    return (
      'player id : ' +
      this.id +
      ', player name : ' +
      this.name +
      ', hp : ' +
      this.hp +
      ', equipped weapon : ' +
      this.weapon +
      ', ' +
      (this.isAlive() ? 'alive' : 'dead')
    )
  }

  function Player(id, name) {
    // properties
    this.id = id
    this.name = name
    this.hp = 100
    this.stance = ATTACK_STANCE
    this.weapon = null

    // methods
    this.setStance = setStance
    this.dropWeapon = dropWeapon
    this.equipWeapon = equipWeapon
    this.attack = attack
    this.takeDamage = takeDamage
    this.isAlive = isAlive
    this.toString = toString

    if (DEBUG) {
      console.log('New player created : \n\t' + this)
    }
    return this
  }

  return {
    create: function(name) {
      return new Player(++uid % 2, name)
    },
  }
})()
