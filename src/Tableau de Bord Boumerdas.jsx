import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { getWeather } from './js/weatherAPI'; // Import the weather service
import { useLanguage } from './LanguageContext';
import React, { useEffect, useState } from 'react';
import Sidebar from './components/SidebarOffcanvas';
import Maladie from './components/Maladie';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Tableaudebord() {
  const { language } = useLanguage();

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
      <div className="desktop-sidebar">
        <Sidebar/>
      </div>
      
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

                <Maladie 
                  name={language === 'fr' ? 'Pythium' : 'بيثيوم'} 
                  risk={50} 
                  info={language === 'fr' ? 'Information sur la maladie' : 'Information sur la maladie'} 
                  recommendation={language === 'fr' ? 'Recommandations pour cette maladie ici.' : 'Recommandations pour cette maladie ici.'} 
                />
                <hr />
                <Maladie 
                  name={language === 'fr' ? 'Botrytis' : 'بوتريتيس'} 
                  risk={80} 
                  info={language === 'fr' ? 'Information sur la maladie' : 'Information sur la maladie'} 
                  recommendation={language === 'fr' ? 'Recommandations pour cette maladie ici.' : 'Recommandations pour cette maladie ici.'}
                />
                <hr />
                <Maladie 
                  name={language === 'fr' ? 'Fusarium' : 'فيوزاريوم'} 
                  risk={60} 
                  info={language === 'fr' ? 'Information sur la maladie' : 'Information sur la maladie'} 
                  recommendation={language === 'fr' ? 'Recommandations pour cette maladie ici.' : 'Recommandations pour cette maladie ici.'}
                />
                <hr />
                <Maladie 
                  name={language === 'fr' ? 'Mildiou' : 'عفن فطرية'} 
                  risk={20} 
                  info={language === 'fr' ? 'Information sur la maladie' : 'Information sur la maladie'} 
                  recommendation={language === 'fr' ? 'Recommandations pour cette maladie ici.' : 'Recommandations pour cette maladie ici.'}
                />
                <hr />
                <Maladie 
                name={language === 'fr' ? 'Oïdium' : 'بياض الدقيقي'} 
                risk={10} 
                info={language === 'fr' ? 'Information sur la maladie' : 'Information sur la maladie'} 
                recommendation={language === 'fr' ? 'Recommandations pour cette maladie ici.' : 'Recommandations pour cette maladie ici.'}
              />

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
        <Offcanvas
          show={showOffcanvas}
          onHide={handleCloseOffcanvas}
          className="custom-offcanvas"
          
        >
          <Offcanvas.Header closeButton className="d-flex justify-content-end"/>
          <Offcanvas.Body>
            <Sidebar />
          </Offcanvas.Body>
        </Offcanvas>
        {/* Offcanvas End */}
      </div>  
      {/* Content End */}
    </div>
  );
};

export default Tableaudebord;