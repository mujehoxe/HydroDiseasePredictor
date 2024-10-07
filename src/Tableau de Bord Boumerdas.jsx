import React from "react";
import './css/bootstrap.min.css';
import './css/style.css';
import logo from './imgtest/logo-tc-advisor.png'
import plusicone from './icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png'
import infoicone from './imgtest/help-question-1-circle-faq-frame-help-info-mark-more-query-ques.svg'
import Recommendationsicone from './imgtest/group-2572.png'
import '@fortawesome/fontawesome-free/css/all.min.css'; 


function Tableaudebord() {
  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      {/* Sidebar Start */}
      <div className="sidebar pe-4 pb-3">
        <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '10px' }}>
          <h3>
            <img src={logo} alt="Logo" style={{ height: '55px' }} />
          </h3>
        </div>
        <nav className="navbar bg-light navbar-light">
          <div className="navbar-nav w-100">
          <div className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle active" data-bs-toggle="dropdown">
                Vos fermes
              </a>
              <div className="dropdown-menu bg-transparent border-0">
                <a href="#" className="dropdown-item">Boumerdes 1</a>
                <a href="#" className="dropdown-item">Boumerdes 2</a>
                <a href="Ajouter-une-ferme.html" className="dropdown-item">
                  <img
                    src={plusicone}
                    alt="Plus icon"
                    className="me-2"
                    style={{ width: '16px', height: '16px' }}
                  />
                  Ajouter une ferme
                </a>
              </div>
            </div>


          </div>
        </nav>
      </div>
      {/* Sidebar End */}

      {/* Content Start */}
      <div className="content">
        {/* Navbar Start */}
        <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
          <a href="#" className="sidebar-toggler flex-shrink-0">
            <i className="fa fa-bars"></i>
          </a>
          <div
            style={{
              display: 'flex',
              color: 'black',
              fontSize: '25px',
              height: '64px',
              alignItems: 'center',
              paddingLeft: '20px',
            }}
          >
            Tableau de Bord Boumerdes 1
          </div>
        </nav>
        {/* Navbar End */}

        {/* Button Start */}
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            {/* Maladies */}
            <div className="col-sm-12 col-xl-6">
              <div className="bg-light rounded h-100 p-4">
                <h6 className="mb-4">Maladies :</h6>
                <div>
                  <div className="d-flex justify-content-between align-items-center ">
                    <div>
                      Pythium
                      <img
                        src={infoicone}
                        className="ms-2"
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#infoModal"
                        alt="Info"
                      />
                    </div>
                    <div>
                      Risques : 50%
                      <img
                        src={Recommendationsicone}
                        className="ms-2"
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#recommendModal"
                        alt="Recommendations"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center ">
                    <div>
                      Botrytis
                      <img
                        src={infoicone}
                        className="ms-2"
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#infoModal"
                        alt="Info"
                      />
                    </div>
                    <div>
                      Risques : 80%
                      <img
                        src={Recommendationsicone}
                        className="ms-2"
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#recommendModal"
                        alt="Recommendations"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center ">
                    <div>
                      Fusarium
                      <img
                        src={infoicone}
                        className="ms-2"
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#infoModal"
                        alt="Info"
                      />
                    </div>
                    <div>
                      Risques : 60%
                      <img
                        src={Recommendationsicone}
                        className="ms-2"
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#recommendModal"
                        alt="Recommendations"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center ">
                    <div>
                      Mildiou
                      <img
                        src={infoicone}
                        className="ms-2"
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#infoModal"
                        alt="Info"
                      />
                    </div>
                    <div>
                      Risques : 20%
                      <img
                        src={Recommendationsicone}
                        className="ms-2"
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#recommendModal"
                        alt="Recommendations"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      Oïdium
                      <img
                        src={infoicone}
                        className="ms-2"
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#infoModal"
                        alt="Info"
                      />
                    </div>
                    <div>
                      Risques : 10%
                      <img
                        src={Recommendationsicone}
                        className="ms-2"
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        data-bs-toggle="modal"
                        data-bs-target="#recommendModal"
                        alt="Recommendations"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meteo */}
            <div className="col-sm-12 col-xl-6">
              <div className="bg-light rounded h-100 p-4">
                <h6 className="mb-4">Meteo :</h6>
                <div>
                  <div className="d-flex">
                    <div className="flex-grow-1">Boumerdes</div>
                    <div>15:07</div>
                  </div>
                  <div className="d-flex flex-column text-center mt-5 mb-4">
                    <h6 className="display-4 mb-0 font-weight-bold" style={{ color: '#1C2331' }}>
                      13°C
                    </h6>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1" style={{ fontSize: '1rem' }}>
                      <div>
                        <i className="fas fa-wind fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> 40 km/h </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> 84% </span>
                      </div>
                      <div>
                        <i className="fas fa-sun fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> 0.2h </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Button End */}
      </div>
      {/* Content End */}

      {/* Modal Info Start */}
      <div
        className="modal fade"
        id="infoModal"
        tabIndex="-1"
        aria-labelledby="infoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="infoModalLabel">
                Information sur la maladie
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">Détails sur la maladie ici.</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Info End */}

      {/* Modal Recommendations Start */}
      <div
        className="modal fade"
        id="recommendModal"
        tabIndex="-1"
        aria-labelledby="recommendModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="recommendModalLabel">
                Recommandations
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">Recommandations pour cette maladie ici.</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Recommendations End */}
    </div>
  );
};

export default Tableaudebord;