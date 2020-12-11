import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

function useWindowSize() {
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

const n_grids_per_bar = 8;
const n_bars = 16;
const n_grids = n_grids_per_bar * n_bars;
const n_pitch = 48;

export function draw(ctx, canvasWidth, canvasHeight, gridSize){
  // console.log("attempting to draw")
  // ctx.fillStyle = 'red';
  // ctx.shadowColor = 'blue';
  // ctx.shadowBlur = 15;
  // ctx.save();
  ctx.scale(1, 1);
  // ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
  // ctx.fill(SVG_PATH);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.beginPath();
  for (let i = 0; i < canvasWidth; i += gridSize) {
    ctx.lineWidth = (1.0+((i/gridSize%n_grids_per_bar)===0)*5)*0.1;
    if ((i/gridSize%n_grids_per_bar)===0)
      ctx.strokeStyle = '#F5927E';
    else
      ctx.strokeStyle = '#717171';
    ctx.beginPath();
    ctx.save();
    ctx.moveTo(i + 0.5, 0);
    ctx.lineTo(i + 0.5, canvasHeight);
    ctx.stroke();
  }
  for (let i = 0; i < canvasHeight; i += gridSize) {
    ctx.lineWidth = (1.0)*0.1;
    ctx.strokeStyle = '#717171';
    ctx.beginPath();
    ctx.moveTo(0, i + 0.5);
    ctx.lineTo(canvasWidth, i + 0.5);
    ctx.stroke();
  }
  // .restore(): Canvas 2D API restores the most recently saved canvas state
  ctx.restore();
};

export function useCanvas(){
    const canvasRef = useRef(null);
    const [coordinates, setCoordinates] = useState([]);
    // const canvasWidth = window.innerWidth - window.innerWidth % n_grids;
    // const canvasHeight = window.innerHeight;
    let [window_width, window_height] = useWindowSize();
    if (window_width < 1400)
      window_width = 1400;
    const canvasWidth = window_width - window_width % n_grids;
    const canvasHeight = Math.floor(canvasWidth / n_grids) * n_pitch;
    console.log("width, height:", canvasWidth, canvasHeight);
    const gridSize = Math.floor(canvasWidth / n_grids);

    useEffect(()=>{
        const canvasObj = canvasRef.current;
        const ctx = canvasObj.getContext('2d');
        // clear the canvas area before rendering the coordinates held in state
        ctx.clearRect( 0,0, canvasWidth, canvasHeight );

        // draw all coordinates held in state
        // coordinates.forEach((coordinate)=>{draw(ctx, coordinate)});
        draw(ctx, canvasWidth, canvasHeight, gridSize);
    });

    return [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight ];
}
