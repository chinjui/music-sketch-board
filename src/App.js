import './App.css';
import { Navbar, Nav, Alert, Button} from 'react-bootstrap';
import React, { useState, useEffect, useMemo } from 'react';
import { useCanvas, Canvas } from './useCanvas.js';
import { useGridCanvas, GridCanvas } from './useGridCanvas.js';
import { selectedYs, canvasStatus, mouseWins, touchWins, mouseUpEventHandler } from './mouseEvent.js';
import { ControlBar } from './ControlBar.js'

function App() {
  // canvas
  const [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight,
          nGrids, nPitch, gridSize] = useCanvas();
  const [ gridCanvasRef ] = useGridCanvas();

  // canvas event handler
  const adjusted_attr = ['pitch', 'velocity', 'duration', 'tempo'];
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', mouseWins);
    canvas.addEventListener('touchstart', touchWins);

    // selectedYs: var to capture which grids are selected
    adjusted_attr.forEach((attr) => {selectedYs[attr] = new Array(nGrids)});

    // set canvas status
    [canvasStatus.nGrids, canvasStatus.nPitch] = [nGrids, nPitch];
    [canvasStatus.canvasWidth, canvasStatus.canvasHeight, canvasStatus.gridSize] =
        [canvasWidth, canvasHeight, gridSize];

    return () => {
      window.removeEventListener('mouseup', mouseUpEventHandler);
      window.removeEventListener('touchend', mouseUpEventHandler)
    };
  }, [canvasWidth, canvasHeight, gridSize]);
  const canvasJsx = useMemo(() => (
    <Canvas
      forwardedRef={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  ), [canvasWidth, canvasHeight]);
  const gridCanvasJsx = useMemo(() => (
    <GridCanvas
      forwardedRef={gridCanvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  ), [canvasWidth, canvasHeight]);


  /* ======================================================================== */
  // control bar related
  const [curAttr, setCurAttr] = useState('velocity');  // selected attribute pencil

  function handlePencilClick(attr) {
    setCurAttr(attr);
  }

  // change the global var `curAttr` in mouseEvent.js when curAttr state changes
  useEffect(() => {
    canvasStatus.curAttr = curAttr;
  }, [curAttr]);

  /* ======================================================================== */

  // const handleCanvasClick=(event)=>{
  //   // on each click get current mouse location
  //   const currentCoord = { x: event.clientX, y: event.clientY };
  //   // add the newest mouse location to an array in state
  //   setCoordinates([...coordinates, currentCoord]);
  // };
  //
  // const handleClearCanvas=(event)=>{
  //   setCoordinates([]);
  // };

  return (
    <div className="App">
      <Navbar id="navbar">
        <Navbar.Brand href="#home">
          Music Sketch Board
        </Navbar.Brand>
      </Navbar>
      <div id="canvas-container" className="overflow-auto container" style={{width:canvasWidth, height:canvasHeight+70+100}}>
        {canvasJsx}
        {gridCanvasJsx}
      </div>
      <ControlBar
        curAttr={curAttr}
        handlePencilClick={handlePencilClick}
      />
    </div>
  );
}

export default App;
