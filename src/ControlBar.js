import { Navbar, Nav, Alert, Button} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

export function ControlBar() {
  return (
    <Navbar id="control-bar" className="center">
        <Nav.Item>
          <Nav.Link eventKey="link-1">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <img className="colored-pencil selected-pencil" src="colored-pencil-red.png"/>
          <div className="pencil-label">Pitch</div>
        </Nav.Item>
        <Nav.Item>
          <img className="colored-pencil" src="colored-pencil-blue.png"/>
          <div className="pencil-label">Velocity</div>
        </Nav.Item>
        <Nav.Item>
          <img className="colored-pencil" src="colored-pencil-green.png"/>
          <div className="pencil-label">Duration</div>
        </Nav.Item>
        <Nav.Item>
          <img className="colored-pencil" src="colored-pencil-yellow.png"/>
          <div className="pencil-label">Tempo</div>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="disabled" disabled>
            Disabled
          </Nav.Link>
        </Nav.Item>
    </Navbar>
  );
}
