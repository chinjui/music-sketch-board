import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

/* Change window size when resizing window */
export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

/* ========================================================================== */

/* ========================================================================== */


const n_grids_per_bar = 8;
const n_bars = 16;
const n_grids = n_grids_per_bar * n_bars; // number of grids in horizontal direction
const n_pitch = 48; // number of grids in vertical direction

function normal_dist(mean, std, loc) {
  return 1/Math.pow(Math.E, (Math.pow(loc-mean, 2))/(2*std*std));
}

export function redrawOneColumn(x, selectedYs, stds, colors, ctx, nPitch, gridSize){
  ctx.restore();
  ctx.clearRect(x * gridSize, 0, gridSize, gridSize * nPitch)

  for (let attr in selectedYs) {
    if (typeof selectedYs[attr][x] === 'undefined')
      continue;
    for (let i = 0; i < nPitch; i++) {
      ctx.restore();
      ctx.fillStyle=colors[attr];
      ctx.globalAlpha = normal_dist(selectedYs[attr][x], stds[attr], i) * 0.7;
      ctx.fillRect(x * gridSize, i * gridSize, gridSize, gridSize);
    }
  }
};

export function redrawAll(n_grids, selectedYs, stds, colors, ctx, nPitch, gridSize) {
  for (let i = 0; i < n_grids; i ++)
    redrawOneColumn(i, selectedYs, stds, colors, ctx, nPitch, gridSize);
}

export function useCanvas(){
    const canvasRef = useRef(null);
    // const canvasWidth = window.innerWidth - window.innerWidth % n_grids;
    // const canvasHeight = window.innerHeight;
    let [window_width, window_height] = useWindowSize();
    if (window_width < 1000)
      window_width = 1000;
    const canvasWidth = window_width - window_width % n_grids;
    const canvasHeight = Math.floor(canvasWidth / n_grids) * n_pitch;
    const gridSize = Math.floor(canvasWidth / n_grids);
    console.log("width, height, gridSize of drawCanvas:", canvasWidth, canvasHeight, gridSize);

    return [canvasRef, canvasWidth, canvasHeight, n_grids, n_pitch, gridSize];
}

export function Canvas(props) {
  console.log("re-rendering draw canvas!!!!!")
  return (
    <canvas
      className="App-canvas my-canvas"
      ref={props.forwardedRef}
      width={props.width}
      height={props.height}
    />
  )
}

// function areEqual(prevProps, nextProps) {
//   return (prevProps.width === nextProps.width && prevProps.height === nextProps.height);
// }
//
// export const MemoCanvas = React.memo(Canvas, areEqual);
