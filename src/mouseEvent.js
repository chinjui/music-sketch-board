import { redrawOneColumn } from './useCanvas.js';
import * as Tone from 'tone';
import { SampleLibrary } from './Tonejs-Instruments.js';

// loading functions
const showLoader = () => document.getElementById('loader').classList.remove('loader--hide');
const hideLoader = () => document.getElementById('loader').classList.add('loader--hide');

//const synth = new Tone.AMSynth().toDestination();
SampleLibrary.setExt('.wav');
var synth = SampleLibrary.load({
  instruments: "piano",
  onload: () => {
    console.log("loaded!");
    hideLoader();
    document.body.style['pointer-events'] = "all"; // activate pointer events (default is set to inactive in index.css)

  }
  });
synth.toMaster();


export var paint;
export const canvasStatus = {means: {}};
export const means = canvasStatus.means;
canvasStatus.colors = {
  'pitch': "#E74C3C",
  'velocity': "#3498DB",
  'duration': "#27AE60",
  'tempo': "#F4D03F",
}

// /**
//  * Add information where the user clicked at.
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean} dragging
//  */
// function addClick(x, y, dragging) {
//     clickX.push(x);
//     clickY.push(y);
//     clickDrag.push(dragging);
// }

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

function pitchNumber2noteSymbol(pitch) {
  const symbol = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // 45 -> A2
  return symbol[(pitch + 48) % 12] + (Math.floor(pitch / 12) + 2);
}


function selectY(x, y, ctx) {
  const scaled_x = Math.floor(x / canvasStatus.gridSize);
  const scaled_y = Math.floor(y / canvasStatus.gridSize);
  const change = means[canvasStatus.curAttr][scaled_x] !== scaled_y;
  console.log(means[canvasStatus.curAttr][scaled_x], scaled_y)
  if (change) {
    // set and draw
    means[canvasStatus.curAttr][scaled_x] = scaled_y;
    redrawOneColumn(scaled_x, means, canvasStatus.stds, canvasStatus.colors, ctx, canvasStatus.nPitch, canvasStatus.gridSize);

    // play sound
    function toPitchSymbol(value) {
      if (typeof value === 'undefined') value = 11;
      return pitchNumber2noteSymbol(47-value);
    }
    function toVelocity(value) {
      return typeof value === 'undefined'? -5 : 4 - value / 1.5;
    }
    function toDuration(value) {
      return typeof value === 'undefined'? 8 : (47-value)/8;
    }
    if (canvasStatus.curAttr === 'pitch') {
      synth.volume.value = -3; // toVelocity(means['velocity'][scaled_x])
      synth.triggerAttackRelease(toPitchSymbol(means['pitch'][scaled_x]), "8n");
    }
    else if (canvasStatus.curAttr === 'velocity') {
      synth.volume.value = toVelocity(means['velocity'][scaled_x]);
      synth.triggerAttackRelease("C3", "8n");
      // synth.triggerAttackRelease(toPitchSymbol(means['pitch'][scaled_x]), "8n");
    }
    // else if (canvasStatus.curAttr === 'duration') {
    //   synth.volume.value = toVelocity(means['velocity'][scaled_x]);
    //   synth.triggerAttackRelease(toPitchSymbol(means['pitch'][scaled_x]), toDuration(means['duration'][scaled_x]));
    // }

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
        selectY(x, y, canvas.getContext("2d"));
    }
}

function touchstartEventHandler(e) {
    const canvas = e.currentTarget;
    var [x, y] = getCorrectMouseXY(e);
    paint = true;
    if (paint) {
        selectY(x, y, canvas.getContext("2d"));
    }
}

export function mouseUpEventHandler(e) {
    paint = false;
}

function mouseMoveEventHandler(e) {
    const canvas = e.currentTarget;
    var [x, y] = getCorrectMouseXY(e);
    if (paint) {
        selectY(x, y, canvas.getContext("2d"));
    }
}

function touchMoveEventHandler(e) {
    const canvas = e.currentTarget;
    var [x, y] = getCorrectMouseXY(e);
    if (paint) {
        selectY(x, y, canvas.getContext("2d"));
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
