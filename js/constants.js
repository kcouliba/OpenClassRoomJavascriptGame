/*
** For debugging
*/
const DEBUG = true;

/*
** Grid constants
*/
const SIZE = 10;

/*
** Player constants
*/
const DEFAULT_PLAYER_NAME = "Player";
const MAX_PLAYER_COUNT = 2;
const MAX_PLAYER_HP = 100;
const MAX_PLAYER_MOVE = 3; // How many cells can the player go through

/*
** Weapon constants
*/
const MAX_WEAPON_COUNT
const DEFAULT_WEAPON_NAME = "Gloves";
const DEFAULT_WEAPON_IMAGE = "gloves.png";
const DEFAULT_WEAPON_DAMAGE = 10;

/*
** For Player constant id
*/
const PLAYER = {
    PLAYER1: 0,
    PLAYER2: 1,
};

/*
** Grid cell state
*/
const CELLSTATE = {
    PLAYER1: PLAYER.PLAYER1,
    PLAYER2: PLAYER.PLAYER2,
    FREE: 2,
    OBSTACLE: 3,
    WEAPON:4
};

/*
** Game phase representation
*/
const GAMEPHASE = {
    MOVE: 0,
    BATTLE: 1
};

// Keyboard input
const KEYBOARD_INPUT = {
  KEY_LEFT: 37,
  KEY_UP: 38,
  KEY_RIGHT: 39,
  KEY_DOWN: 40,
  KEY_RETURN: 13
}

/* Mainly for debug */
const COLOR = {
    RED: "rgb(255, 0, 0)",
    GREEN: "rgb(0, 255, 0)",
    BLUE: "rgb(0, 0, 255)",
    YELLOW: "rgb(255, 255, 0)",
    BLACK: "rgb(0, 0, 0)"
};
