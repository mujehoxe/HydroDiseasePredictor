import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from '../imgtest/logo-tc-advisor 2.png';
import plusicone from '../icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png'


function Sidebar() {


  return (
    <>
      {/* Button for small screens to toggle sidebar */}


      {/* Offcanvas for small screens */}
      

      {/* Sidebar for large screens */}
      <div className="sidebar d-none d-lg-block">
      <div className="sidebar pe-4 pb-3">
        <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '10px' }}>
          <h3>
            <img src={logo} alt="Logo" style={{ height: '55px' }} />
          </h3>
        </div>
        <nav className="navbar bg-light navbar-light">
        <div className="navbar-nav w-100">
              <Dropdown className="nav-item nav-link ">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                className="w-100 d-flex justify-content-between align-items-center"
                style={{ textDecoration: 'none', outline: 'none', boxShadow: 'none', border: 'none', padding: '0.5rem' }} // Ensure padding for clickable area
              >
                Vos fermes
              </Dropdown.Toggle>

                <Dropdown.Menu className="bg-transparent border-0">
                  <Dropdown.Item href="#action1" className="dropdown-item">Boumerdes 1</Dropdown.Item>
                  <Dropdown.Item href="#action2" className="dropdown-item">Boumerdes 2</Dropdown.Item>
                  <Dropdown.Item href="Ajouter-une-ferme.html" className="dropdown-item">
                    <img
                      src={plusicone}
                      alt="Plus icon"
                      className="me-2"
                      style={{ width: '16px', height: '16px' }}
                    />
                    Ajouter une ferme
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              
            </div>
        </nav>
      </div>
      </div>
    </>
  );
}

export default Sidebar;
