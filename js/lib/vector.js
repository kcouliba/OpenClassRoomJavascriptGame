/**
 * @name position.js
 * @author Kevin Coulibaly <coulibaly.d.kevin@gmail.com>
 * @todo check instances
 */

const Vector2d = (function() {
  /**
   * @name toString
   * @description Position instance as string
   * @return {String}
   */
  function toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }

  /**
   * @name Vector2
   * @description a 2 dimensional vector
   * @param {Number} x
   * @param {Number} y
   */
  function Vector2(x, y) {
    this.x = x
    this.y = y
    this.toString = toString
  }

  /**
   * @name create
   * @description Returns an instance of Position
   * @param {Number} x
   * @param {Number} y
   * @return {Object}
   */
  function create(x, y) {
    return new Vector2(x, y)
  }

  /**
   * @name add
   * @description Add vectors
   * @param {Object} vectA
   * @param {Object} vectB
   * @return {Object}
   */
  function add(vectA, vectB) {
    return create(vectA.x + vectB.x, vectA.y + vectB.y)
  }

  /**
   * @name sub
   * @description Sub vectors
   * @param {Object} vectA
   * @param {Object} vectB
   * @return {Object}
   */
  function sub(vectA, vectB) {
    return create(vectA.x - vectB.x, vectA.y - vectB.y)
  }

  /**
   * @name clone
   * @description Clones a Position instance
   * @param {Object} vect
   * @return {Object}
   */
  function clone(rhs) {
    if (rhs instanceof Vector2) {
      return create(rhs.x, rhs.y)
    }
    return null
  }

  /**
   * @name equals
   * @description Checks if position values are equals to another position
   * @param {Object} vectA
   * @param {Object} vectB
   * @return {Boolean}
   */
  function equals(vectA, vectB) {
    return (
      vectA instanceof Vector2 &&
      vectB instanceof Vector2 &&
      vectA.x === vectB.x &&
      vectA.y === vectB.y
    )
  }

  return {
    create,
    add,
    sub,
    clone,
    equals,
  }
})()
