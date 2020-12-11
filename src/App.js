import './App.css';
import { Navbar, Alert } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import {useCanvas} from './useCanvas.js';

function App() {

  const [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight ] = useCanvas();

  const handleCanvasClick=(event)=>{
    // on each click get current mouse location
    const currentCoord = { x: event.clientX, y: event.clientY };
    // add the newest mouse location to an array in state
    setCoordinates([...coordinates, currentCoord]);
  };

  const handleClearCanvas=(event)=>{
    setCoordinates([]);
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" id="navbar">
        <Navbar.Brand href="#home">
          Music Sketch Board
        </Navbar.Brand>
      </Navbar>
      <div id="canvas-container" className="overflow-auto container">
        <canvas
          className="App-canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  );
}

export default App;
