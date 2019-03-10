/**
 * @name constants
 * @author Kevin Coulibaly <coulibaly.d.kevin@gmail.com>
 * @description Initialization of constant values
 */

// Debug
const DEBUG = true
const COLOR = {
  RED: 'rgb(255, 0, 0)',
  GREEN: 'rgb(0, 255, 0)',
  BLUE: 'rgb(0, 0, 255)',
  YELLOW: 'rgb(255, 255, 0)',
  BLACK: 'rgb(0, 0, 0)',
}

// Player constants
const DEFAULT_PLAYER_NAME = 'Player'
const MAX_PLAYER_COUNT = 2
const MAX_PLAYER_HP = 100
const MAX_PLAYER_MOVE = 3 // How many cells can the player go through

// Weapon constants
const MAX_WEAPON_COUNT = 2
const DEFAULT_WEAPON_DAMAGE = 10

// Player constants

// Player ids
const PLAYER = {
  PLAYER1: 0,
  PLAYER2: 1,
}

// Grid constants
const GRID_SIZE = 10

// Grid cell state
const CELLSTATE = {
  PLAYER1: PLAYER.PLAYER1,
  PLAYER2: PLAYER.PLAYER2,
  FREE: 2,
  OBSTACLE: 3,
  WEAPON: 4,
}

// Game constants
// Game phase representation
const GAMEPHASE = {
  MOVE: 0,
  BATTLE: 1,
}

// Keyboard constants
const KEYBOARD_INPUT = {
  KEY_LEFT: 37,
  KEY_UP: 38,
  KEY_RIGHT: 39,
  KEY_DOWN: 40,
  KEY_RETURN: 13,
}
