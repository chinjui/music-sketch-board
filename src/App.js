import './App.css';
import { Navbar } from 'react-bootstrap';
import React, { useState, useEffect, useMemo } from 'react';
import { useCanvas, Canvas, redrawAll } from './useCanvas.js';
import { useGridCanvas, GridCanvas } from './useGridCanvas.js';
import { canvasStatus, mouseWins, touchWins, mouseUpEventHandler } from './mouseEvent.js';
import { ControlBar } from './ControlBar.js'

function App() {
  // control bar related
  const [curAttr, setCurAttr] = useState('velocity');  // selected attribute pencil
  const [stds, setStds] = useState({
    'pitch': 3,
    'velocity': 3,
    'duration': 3,
    'tempo': 3
  });

  // canvas
  const [ canvasRef, canvasWidth, canvasHeight, nGrids, nPitch, gridSize] = useCanvas(stds, canvasStatus);
  const [ gridCanvasRef ] = useGridCanvas();

  // canvas event handler
  const adjusted_attr = ['pitch', 'velocity', 'duration', 'tempo'];
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', mouseWins);
    canvas.addEventListener('touchstart', touchWins);

    // canvasStatus.means: var to capture which grids are selected
    adjusted_attr.forEach((attr) => {canvasStatus.means[attr] = new Array(nGrids)});

    // set canvas status
    [canvasStatus.nGrids, canvasStatus.nPitch] = [nGrids, nPitch];
    [canvasStatus.canvasWidth, canvasStatus.canvasHeight, canvasStatus.gridSize] =
        [canvasWidth, canvasHeight, gridSize];

    return () => {
      window.removeEventListener('mouseup', mouseUpEventHandler);
      window.removeEventListener('touchend', mouseUpEventHandler)
    };
  }, [canvasWidth, canvasHeight, gridSize]);

  useEffect(()=>{
      const canvasObj = canvasRef.current;
      const ctx = canvasObj.getContext('2d');
      // clear the canvas area before rendering the coordinates held in state
      ctx.clearRect( 0,0, canvasWidth, canvasHeight );

      redrawAll(nGrids, canvasStatus.means, stds, canvasStatus.colors, ctx, nPitch, gridSize);
  }, [stds]);


  /* ======================================================================== */
  // control bar related
  function handlePencilClick(attr) {
    setCurAttr(attr);
  }

  // change the global var `curAttr` in mouseEvent.js when curAttr state changes
  useEffect(() => {
    canvasStatus.curAttr = curAttr;
    canvasStatus.stds = stds;
  }, [curAttr, stds]);

  /* ======================================================================== */

  /* ======================================================================== */
  // canvas JSX
  // const canvasJsx = useMemo(() => (
  //   <Canvas
  //     forwardedRef={canvasRef}
  //     width={canvasWidth}
  //     height={canvasHeight}
  //   />
  // ), [canvasRef, canvasWidth, canvasHeight, stds.pitch]);
  // const gridCanvasJsx = useMemo(() => (
  //   <GridCanvas
  //     forwardedRef={gridCanvasRef}
  //     width={canvasWidth}
  //     height={canvasHeight}
  //   />
  // ), [gridCanvasRef, canvasWidth, canvasHeight]);
  /* ======================================================================== */


  return (
    <div className="App">
      <Navbar id="navbar">
        <Navbar.Brand href="#home">
          Music Sketch Board
        </Navbar.Brand>
      </Navbar>
      <div id="canvas-container" className="overflow-auto container" style={{width:canvasWidth, height:canvasHeight+70+100}}>
        <Canvas
          forwardedRef={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          stds={stds}
        />
        <GridCanvas
          forwardedRef={gridCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />
      </div>
      <ControlBar
        curAttr={curAttr}
        handlePencilClick={handlePencilClick}
        stds={stds}
        setStds={setStds}
      />
    </div>
  );
}

export default App;
