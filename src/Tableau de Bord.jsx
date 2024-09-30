import React from 'react';
import './css/bootstrap.min.css';
import './css/style.css';
import './js/main.js'
import logo from './imgtest/logo-tc-advisor.png';
import plusIcone from '/icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png'
import helpIcon from './imgtest/help-question-1-circle-faq-frame-help-info-mark-more-query-ques.svg';
import groupIcon from './imgtest/group-2572.png';

function Dashboard() {
  return (
    <div>
      {/* Sidebar */}
      <div className="sidebar pe-4 pb-3">
        <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '10px' }}>
          <img src={logo} alt="Logo" style={{ height: '55px' }} />
        </div>
        <nav className="navbar bg-light navbar-light">
          <div className="navbar-nav w-100">
            <div className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle active" dataBsToggle="dropdown">Vos fermes</a>
              <div className="dropdown-menu bg-transparent border-0">
                <a href="Tableau-de-Bord-Boumerdas.html" className="dropdown-item active">Boumerdes 1</a>
                <a href="" className="dropdown-item">Boumerdes 2</a>
                <a href="Ajouter-une-ferme.html" className="dropdown-item">
                  <img src={plusIcone} alt="Plus icon" className="me-2" style={{ width: '16px', height: '16px' }} />
                  Ajouter une ferme
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Content */}
      <div className="content">
        {/* Navbar */}
        <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
          <a href="#" className="sidebar-toggler flex-shrink-0">
            <i className="fa fa-bars"></i>
          </a>
          <div style={{ display: 'flex', color: 'black', fontSize: '25px', height: '64px', alignItems: 'center', paddingLeft: '20px' }}>
            Tableau de Bord Boumerdes 1
          </div>
        </nav>

        {/* Main Content */}
        <div className="container-fluid pt-4 px-4">
          <div className='row g-4'>
            <div className='col-sm-12 col-xl-6'>
              <div className='bg-light rounded h-100 p-4'>
                <h6 className='mb-4'>Maladies :</h6>
                <div>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>Pythium <img src={helpIcon} className='ms-2' style={{width: '20px', height: '20px', cursor: 'pointer'}} dataBsToggle="modal" dataBsTarget="#infoModal" /></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modals */}
      <div className="modal fade" id="infoModal" tabIndex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="infoModalLabel">Information sur la maladie</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">Détails sur la maladie ici.</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;








<h6 className='mb-4'>Meteo :</h6>
<div>
  <div className='d-flex'>
    <div className='flex-grow-1'>Boumerdes</div>
    <div></div>
  </div>
</div>