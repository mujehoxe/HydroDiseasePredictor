import '@fortawesome/fontawesome-free/css/all.min.css'; 
import logo from './imgtest/logo-tc-advisor 2.png';
import plusicone from './icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png'
import infoicone from './imgtest/help-question-1-circle-faq-frame-help-info-mark-more-query-ques.svg'
import Recommendationsicone from './imgtest/group-2572.png'

import { getWeather } from './js/weatherAPI'; // Import the weather service
import { useLanguage } from './LanguageContext';
import React, { useEffect, useState } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Sidebar from './components/SidebarOffcanvas';
import Maladie from './components/Maladie';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Tableaudebord() {
  const { language } = useLanguage();

 // State to manage the modal visibility
 const [showInfo, setShowInfo] = useState(false);
 const handleCloseInfo = () => setShowInfo(false);
 const handleShowInfo = () => setShowInfo(true);

 // State to manage the recommendations modal visibility
 const [showRecommendations, setShowRecommendations] = useState(false);
 const handleCloseRecommendations = () => setShowRecommendations(false);
 const handleShowRecommendations = () => setShowRecommendations(true);

  // State to manage the Offcanvas visibility
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const [temperature, setTemperature] = useState(null); // State for temperature
  const [humidity, setHumidity] = useState(null); // State for humidity
  // Fetch the temperature when the component mounts
  useEffect(() => {
    getWeather('Boumerdes').then(data => {
      console.log(data); // Check the returned object structure in the console
      setTemperature(data.temperature); // Extract the temperature field
      setHumidity(data.humidity);
    });
  }, []);

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      {/* Sidebar Start */}
      <Sidebar/>
      {/* Sidebar End */}

      {/* Content Start */}
      <div className="content">
        {/* Navbar Start */}
        <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0 ">
          <a 
          href="#" 
          className="sidebar-toggler flex-shrink-0 d-lg-none" 
          onClick={handleShowOffcanvas}
          >
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
            {language === 'fr' ? 'Tableau de Bord' : 'لوحة مراقبة'} Boumerdes 1
          </div>
        </nav>
        {/* Navbar End */}

        {/* Button Start */}
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            {/* Maladies */}
            <div className="col-sm-12 col-xl-6">
              <div className="bg-light rounded h-100 p-4">
                <h6 className="mb-4">{language === 'fr' ? 'Maladies :' : 'الأمراض :'}</h6>
                <div>

                  <Maladie name="Pythium" risk={50} info="" />
                  <hr />
                  <Maladie name="Botrytis" risk={80} info="" />
                  <hr />
                  <Maladie name="Fusarium" risk={60} info="" />
                  <hr />
                  <Maladie name="Mildiou" risk={20} info="" />
                  <hr />
                  <Maladie name="Oïdium" risk={10} info="" />
                  <hr />

                </div>
              </div>
            </div>

            {/* Meteo */}
            <div className="col-sm-12 col-xl-6">
              <div className="bg-light rounded h-100 p-4">
                <h6 className="mb-4">{language === 'fr' ? 'Meteo :' : 'تقرير الطقس :'}</h6>
                <div>
                  <div className="d-flex">
                    <div className="flex-grow-1">Boumerdes</div>
                    <div>15:07</div>
                  </div>
                  <div className="d-flex flex-column text-center mt-5 mb-4">
                    <h6 className="display-4 mb-0 font-weight-bold" style={{ color: '#1C2331' }}>
                    {temperature !== null ? `${temperature}°C` : 'Loading...'}
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
                        <span className="ms-1">    Humidity: {humidity !== null ? `${humidity}%` : 'Loading...'} </span>
                      </div>
                      <div>
                        <i className="fas fa-sun fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> UV index: </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        {/* Button End */}
        {/* Offcanvas Start */}
          <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} >
            <Offcanvas.Header closeButton>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <Sidebar/>
            </Offcanvas.Body>
          </Offcanvas>
        {/* Offcanvas End */}
      </div>  
      {/* Content End */}
    </div>
  );
};

export default Tableaudebord;