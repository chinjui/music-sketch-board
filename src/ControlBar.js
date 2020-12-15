import { Navbar, Nav, DropdownButton, Form, Button } from 'react-bootstrap';
import React from 'react';
// import { CSSTransition } from 'react-transition-group';

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function ControlBar(props) {
  const curAttr = props.curAttr;

  function handleStdChange(e, attr) {
    props.setStds({...props.stds, [attr]: e.target.value})
  }

  const pencil_colors = ['red', 'blue', 'green', 'yellow'];
  const attr_pencil_items = ['pitch', 'velocity', 'duration', 'tempo'].map((attr, index) => {
    let select_class = curAttr === attr? "selected-pencil" : "";
    return (
      <Nav.Item className="controlbar-item center" key={attr}>
        <img className={`colored-pencil ${select_class}`}
             src={`colored-pencil-${pencil_colors[index]}.png`}
             onClick={()=>{props.handlePencilClick(attr);}}
             alt={attr}
        />
        <DropdownButton className="pencil-label" id="dropdown-basic-button" title={capitalize(attr)} drop="up" variant="secondary">
          <Form>
            <Form.Group controlId="formBasicRangeCustom" className="std-form">
              <Form.Label>Variability</Form.Label>
              <Form.Control
                type="range"
                min="0.5"
                max="9"
                step="0.1"
                defaultValue={props.stds[attr]}
                onChange={(e) => handleStdChange(e, attr)}
              />
            </Form.Group>
          </Form>
          <Button className="clearAttrButton btn-danger btn" onClick={() => props.handleClearAttr(attr)}>Clear Painting</Button>
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
