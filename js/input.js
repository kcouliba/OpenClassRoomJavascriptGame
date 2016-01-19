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

function keyInput(action) {
  const step = {
    x: 0,
    y: 0
  };
  const controls = (event) => {
    if (validInputs.indexOf(event.which) === -1) {
      return true;
    }
    event.stopPropagation();
    event.preventDefault();
    console.log(`key : ${event.which}`);
    switch (event.which) {
      case KEYBOARD_INPUT.KEY_LEFT:
        step.x -= ((step.x - 1) >= -MAX_PLAYER_MOVE) ? 1 : 0;
        step.y = 0;
        console.log(`move left`);
        break;
      case KEYBOARD_INPUT.KEY_UP:
        step.x = 0;
        step.y -= ((step.y - 1) >= -MAX_PLAYER_MOVE) ? 1 : 0;
        console.log(`move up`);
        break;
      case KEYBOARD_INPUT.KEY_RIGHT:
        step.x += ((step.x + 1) <= MAX_PLAYER_MOVE) ? 1 : 0;
        step.y = 0;
        console.log(`move right`);
        break;
      case KEYBOARD_INPUT.KEY_DOWN:
        step.x = 0;
        step.y += ((step.y + 1) <= MAX_PLAYER_MOVE) ? 1 : 0;
        console.log(`move down`);
        break;
      case 13:
        console.log(`validate move : (${step.x}, ${step.y})`);
        if (action && typeof(action) === "function") {
          action(step);
        }
        step.x = 0;
        step.y = 0;
        break;
      default:
        break;
    }
  };
  document.addEventListener("keydown", controls);
}
