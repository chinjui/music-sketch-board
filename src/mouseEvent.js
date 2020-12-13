export const clickX = [];
export const clickY = [];
export const clickDrag = [];
export var paint;
export const selectedYs = {};
export const canvasStatus = {};
canvasStatus.color = {
  'pitch': "#E74C3C",
  'velocity': "#9B59B6",
  'duration': "#48C9B0",
  'tempo': "#F4D03F",
}
/**
 * Add information where the user clicked at.
 * @param {number} x
 * @param {number} y
 * @return {boolean} dragging
 */
function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

/**
 * Redraw the complete canvas.
 */
// function redraw() {
//     // Clears the canvas
//     context.clearRect(0, 0, context.canvas.width, context.canvas.height);
//
//     for (var i = 0; i < clickX.length; i += 1) {
//         if (!clickDrag[i] && i == 0) {
//             context.beginPath();
//             context.moveTo(clickX[i], clickY[i]);
//             context.stroke();
//         } else if (!clickDrag[i] && i > 0) {
//             context.closePath();
//
//             context.beginPath();
//             context.moveTo(clickX[i], clickY[i]);
//             context.stroke();
//         } else {
//             context.lineTo(clickX[i], clickY[i]);
//             context.stroke();
//         }
//     }
// }

/**
 * Draw the newly added point.
 * @return {void}
 */
// function drawNew() {
//     var i = clickX.length - 1
//     if (!clickDrag[i]) {
//         if (clickX.length == 0) {
//             context.beginPath();
//             context.moveTo(clickX[i], clickY[i]);
//             context.stroke();
//         } else {
//             context.closePath();
//
//             context.beginPath();
//             context.moveTo(clickX[i], clickY[i]);
//             context.stroke();
//         }
//     } else {
//         context.lineTo(clickX[i], clickY[i]);
//         context.stroke();
//     }
// }

function normal_dist(mean, std, loc) {
  return 1/Math.pow(Math.E, (Math.pow(loc-mean, 2))/(2*std*std));
}

function selectY(x, y, ctx) {
  const scaled_x = Math.floor(x / canvasStatus.gridSize);
  const scaled_y = Math.floor(y / canvasStatus.gridSize);
  const change = selectedYs[canvasStatus.curAttr][scaled_x] !== scaled_y;
  if (change) {
    selectedYs[canvasStatus.curAttr][scaled_x] = scaled_y;
    let std = 1;
    ctx.clearRect(scaled_x * canvasStatus.gridSize, 0, canvasStatus.gridSize, canvasStatus.canvasHeight)

    for (let i = 0; i < canvasStatus.nPitch; i++) {
      ctx.restore();
      ctx.globalAlpha = normal_dist(scaled_y, std, i);
      ctx.fillRect(scaled_x * canvasStatus.gridSize, i * canvasStatus.gridSize, canvasStatus.gridSize, canvasStatus.gridSize);
    }
  }
  return change
}

function getCorrectMouseXY(e) {
  const canvas = e.currentTarget;
  const bounding_rect = canvas.getBoundingClientRect();
  var x = e.clientX - bounding_rect.left;
  var y = e.clientY - bounding_rect.top;
  x *= canvas.width / bounding_rect.width;
  y *= canvas.height / bounding_rect.height;

  return [x, y];
}

function mouseDownEventHandler(e) {
    const canvas = e.currentTarget;
    paint = true;
    var [x, y] = getCorrectMouseXY(e);
    if (paint) {
        addClick(x, y, false);
        // drawNew();
        selectY(x, y, canvas.getContext("2d"));
    }
}

function touchstartEventHandler(e) {
    const canvas = e.currentTarget;
    var [x, y] = getCorrectMouseXY(e);
    paint = true;
    if (paint) {
        addClick(x, y, false);
        // addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, false);
        // drawNew();
    }
}

export function mouseUpEventHandler(e) {
    // context.closePath();
    paint = false;
}

function mouseMoveEventHandler(e) {
    const canvas = e.currentTarget;
    var [x, y] = getCorrectMouseXY(e);
    if (paint) {
        addClick(x, y, true);
        selectY(x, y, canvas.getContext("2d"));
        // drawNew();
    }
}

function touchMoveEventHandler(e) {
    const canvas = e.currentTarget;
    var [x, y] = getCorrectMouseXY(e);
    if (paint) {
        // addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, true);
        // drawNew();
        addClick(x, y, true);
    }
}

function setUpHandler(isMouseandNotTouch, detectEvent) {
    const canvas = detectEvent.currentTarget;
    removeRaceHandlers(canvas);
    if (isMouseandNotTouch) {
        canvas.addEventListener('mouseup', mouseUpEventHandler);
        canvas.addEventListener('mousemove', (e) => mouseMoveEventHandler(e));
        canvas.addEventListener('mousedown', (e) => mouseDownEventHandler(e));
        window.addEventListener('mouseup', mouseUpEventHandler);
        mouseDownEventHandler(detectEvent);
    } else {
        canvas.addEventListener('touchstart', (e) => touchstartEventHandler(e));
        canvas.addEventListener('touchmove', (e) => touchMoveEventHandler(e));
        canvas.addEventListener('touchend', mouseUpEventHandler);
        window.addEventListener('touchend', mouseUpEventHandler);
        touchstartEventHandler(detectEvent);
    }
}

export function mouseWins(e) {
    setUpHandler(true, e);  // this == canvas
}

export function touchWins(e) {
    setUpHandler(false, e); // this == canvas
}

function removeRaceHandlers(canvas) {
    canvas.removeEventListener('mousedown', mouseWins);
    canvas.removeEventListener('touchstart', touchWins);
}

// canvas.addEventListener('mousedown', mouseWins);
// canvas.addEventListener('touchstart', touchWins);
