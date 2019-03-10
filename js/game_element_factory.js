/**
 * @name game_element_factory.js
 * @author Kevin Coulibaly <coulibaly.d.kevin@gmail.com>
 */

/**
 * @name GameElementFactory
 * @description GameElementFactory
 */
// Element sub class
const GameElementFactory = (function() {
  function GameElement(position) {
    /**
     * @name setPosition
     * @description Set element's position
     * @param {Number} x
     * @param {Number} y
     * @return {GameElement}
     */
    function setPosition(x, y) {
      this.position.x = x
      this.position.y = y
      return this
    }

    /**
     * @name getPosition
     * @description Get element's position
     * @return {Vector2d}
     */
    function getPosition() {
      return this.position
    }

    this.position = position
    this.setPosition = setPosition
    this.getPosition = getPosition
    return this
  }

  return {
    /**
     * @name create
     * @description Creat new Element instance
     * @param {Object} element
     * @return {GameElement}
     */
    create: function(object) {
      return Object.assign(object, new GameElement(Vector2d.create(0, 0)))
    },
  }
})()
