import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { getWeather } from './js/weatherAPI'; // Import the weather service
import { useLanguage } from './LanguageContext';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/SidebarOffcanvas';
import Offcanvas from 'react-bootstrap/Offcanvas';
import MaladiesList from './components/MaladiesList';

function Tableaudebord() {
  const { language } = useLanguage();
  const location = useLocation();
  const { name, address } = location.state || {}; // Get farm name and address from props

  // State to manage the Offcanvas visibility
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const [temperature, setTemperature] = useState(null); // State for temperature
  const [humidity, setHumidity] = useState(null); // State for humidity
  const [dissolvedOxygen, setDissolvedOxygen] = useState(null); 
  // Fetch the temperature when the component mounts
  useEffect(() => {
    if (address) {
      getWeather(address).then(data => {
        console.log(data); // Check the returned object structure in the console
        setTemperature(data.temperature); // Extract the temperature field
        setHumidity(data.humidity);
        setDissolvedOxygen(data.dissolvedOxygen);
      });
    }
  }, [address]);

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      {/* Sidebar Start */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>
      
      {/* Sidebar End */}

      {/* Content Start */}
      <div className="content">
        {/* Navbar Start */}
        <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
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
            {language === 'fr' ? 'Tableau de Bord' : 'لوحة مراقبة'} {name ? `${name} (${address})` : ''}
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
                  {(() => {
                    try {
                      return <MaladiesList 
                      language={language} temperature={temperature} humidity={humidity} dissolvedOxygen={dissolvedOxygen}
                      />;
                    } catch (error) {
                      console.error('Error rendering MaladiesList:', error);
                      return <p>{language === 'fr' ? 'Erreur lors du chargement des maladies.' : 'خطأ أثناء تحميل الأمراض.'}</p>;
                    }
                  })()}
                </div>
              </div>
            </div>


            {/* Meteo */}
            <div className="col-sm-12 col-xl-6">
              <div className="bg-light rounded h-100 p-4">
                <h6 className="mb-4">{language === 'fr' ? 'Meteo :' : 'تقرير الطقس :'}</h6>
                <div>
                  <div className="d-flex">
                    <div className="flex-grow-1">{address || 'Location not provided'}</div>
                  </div>
                  <div className="d-flex flex-column text-center mt-2 mb-2">
                    <h6 className="display-6 mb-0 font-weight-bold" style={{ color: '#1C2331' }}>
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
                        <span className="ms-1"> Humidity: {humidity !== null ? `${humidity}%` : 'Loading...'} </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> Weter temperature: {humidity !== null ? `${humidity}%` : 'Loading...'} </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> pH: {humidity !== null ? `${humidity}%` : 'Loading...'} </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> EC: {humidity !== null ? `${humidity}%` : 'Loading...'} </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> Dissolved oxygen: {2} </span>
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
        <Offcanvas
          show={showOffcanvas}
          onHide={handleCloseOffcanvas}
          className="custom-offcanvas"
        >
          <Offcanvas.Header closeButton className="d-flex justify-content-end" />
          <Offcanvas.Body>
            <Sidebar />
          </Offcanvas.Body>
        </Offcanvas>
        {/* Offcanvas End */}
      </div>  
      {/* Content End */}
    </div>
  );
}

export default Tableaudebord;