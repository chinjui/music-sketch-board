import './App.css';
import { Navbar, Nav, Alert, Button} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useCanvas } from './useCanvas.js';
import { useGridCanvas } from './useGridCanvas.js';
import { selectedYs, canvasStatus, mouseWins, touchWins, mouseUpEventHandler } from './mouseEvent.js';
import { ControlBar } from './ControlBar.js'

function App() {
  const [test, setTest] = useState(0);

  // canvas
  const [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight,
          nGrids, nPitch, gridSize] = useCanvas();
  const [ gridCanvasRef ] = useGridCanvas();

  // canvas event handler
  const adjusted_attr = ['pitch', 'velocity', 'duration', 'tempo'];
  const curAttr = 'pitch';
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

  useEffect(() => {
    canvasStatus.curAttr = curAttr;
  }, [curAttr]);

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
      <div id="canvas-container" className="overflow-auto container">
        <canvas
          className="App-canvas my-canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />
        <canvas
          className="grid-canvas my-canvas"
          ref={gridCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />
      </div>
      <ControlBar />
    </div>
  );
}

export default App;
