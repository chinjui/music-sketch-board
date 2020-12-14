import { Navbar, Nav, Alert, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function ControlBar(props) {
  const curAttr = props.curAttr;

  const pencil_colors = ['red', 'blue', 'green', 'yellow'];
  const attr_pencil_items = ['pitch', 'velocity', 'duration', 'tempo'].map((attr, index) => {
    let select_class = curAttr === attr? "selected-pencil" : "";
    return (
      <Nav.Item className="controlbar-item center" key={attr}>
        <img className={`colored-pencil ${select_class}`}
             src={`colored-pencil-${pencil_colors[index]}.png`}
             onClick={()=>{props.handlePencilClick(attr);}}
        />
        <DropdownButton className="pencil-label" id="dropdown-basic-button" title={capitalize(attr)} drop="up" variant="secondary">
            <Form.Group controlId="formBasicRangeCustom" className="std-form">
              <Form.Label>Standard Deviation</Form.Label>
              <Form.Control type="range" custom />
            </Form.Group>
        </DropdownButton>
      </Nav.Item>
    )
  })

  return (
    <Navbar id="control-bar" className="center">
        {attr_pencil_items}
    </Navbar>
  );
}
