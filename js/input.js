/*
** input.js
** Author coulibaly.d.kevin@gmail.com
** input functions
*/

const validInputs = [
  KEYBOARD_INPUT.KEY_LEFT,
  KEYBOARD_INPUT.KEY_UP,
  KEYBOARD_INPUT.KEY_RIGHT,
  KEYBOARD_INPUT.KEY_DOWN,
  KEYBOARD_INPUT.KEY_RETURN
];

function playerMoveInput(preComputeMove, validateMove) {
  const step = Position.new(0, 0);
  const controls = (event) => {
    if (validInputs.indexOf(event.which) === -1) {
      return true;
    }
    event.stopPropagation();
    event.preventDefault();
    switch (event.which) {
      case KEYBOARD_INPUT.KEY_LEFT:
        step.x -= ((step.x - 1) >= -MAX_PLAYER_MOVE) ? 1 : 0;
        step.y = 0;
        break;
      case KEYBOARD_INPUT.KEY_UP:
        step.x = 0;
        step.y -= ((step.y - 1) >= -MAX_PLAYER_MOVE) ? 1 : 0;
        break;
      case KEYBOARD_INPUT.KEY_RIGHT:
        step.x += ((step.x + 1) <= MAX_PLAYER_MOVE) ? 1 : 0;
        step.y = 0;
        break;
      case KEYBOARD_INPUT.KEY_DOWN:
        step.x = 0;
        step.y += ((step.y + 1) <= MAX_PLAYER_MOVE) ? 1 : 0;
        break;
      case 13:
        if (validateMove && typeof(validateMove) === "function") {
          validateMove();
        }
        step.x = 0;
        step.y = 0;
        break;
      default:
        break;
    }
    preComputeMove(step);
  };
  document.addEventListener("keydown", controls);
}
