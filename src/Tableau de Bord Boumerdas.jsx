import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { getWeather } from './js/weatherAPI'; // Import the weather service
import { useLanguage } from './LanguageContext';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/SidebarOffcanvas';
import Offcanvas from 'react-bootstrap/Offcanvas';
import MaladiesList from './components/MaladiesList';

function Tableaudebord() {
    // Retrieve userId and authToken from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('authToken');
  
    if (!user || !user.id || !token) {
      // Redirect to login if userId or token is missing
      navigate('/');
      return;
    }
  
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
  const [isOutside, setIsOutside] = useState(false); // Toggle state

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

  const toggleEnvironment = () => {
    setIsOutside((prev) => !prev);
  };

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

        {/* Toggle Button Start */}
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            <div className="col-12 d-flex justify-content-center">
              <button className="btn btn-primary" onClick={toggleEnvironment}>
                {isOutside ? (language === 'fr' ? 'En plein champs' : 'في الهواء الطلق') : (language === 'fr' ? 'Environnement contrôlé' : 'بيئة خاضعة للرقابة')}
              </button>
            </div>
          </div>
        </div>
        {/* Toggle Button End */}

        {/* Button Start */}
        <div className="container-fluid pt-4 px-4">
          <div className="row g-4">
            {/* Maladies */}
            <div className="col-sm-12 col-xl-6">
              <div className="bg-light rounded h-100 p-4">
                <h6 className="mb-4" style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>{language === 'fr' ? 'Maladies' : 'الأمراض'}</h6>
                <div>
                  {(() => {
                    try {
                      return <MaladiesList 
                      language={language} temperature={temperature} humidity={humidity} dissolvedOxygen={dissolvedOxygen} isOutside={isOutside} 
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
                <h6 className="mb-4" style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>{language === 'fr' ? 'Meteo' : 'تقرير الطقس'}</h6>
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
                        <span className="ms-1"> {language === 'fr' ? 'Vent' : 'سرعة الرياح'} 0 km/h </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> {language === 'fr' ? 'Humidité ambiante' : 'الرطوبة الجوية'} : {humidity !== null ? `${humidity}%` : 'Loading...'} </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> {language === 'fr' ? 'Température de l\'eau' : 'درجة حرارة الماء'} : {humidity !== null ? `${temperature}°C` : 'Loading...'} </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> pH: {7} </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> {language === 'fr' ? 'EC' : 'التوصيلية الكهربائية'} : {1.5} </span>
                      </div>
                      <div>
                        <i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> {language === 'fr' ? 'Oxygène dissout' : 'الأوكسجين المذاب'} : {2} </span>
                      </div>
                      <div>
                        <i className="fas fa-sun fa-fw" style={{ color: '#868B94' }}></i>
                        <span className="ms-1"> {language === 'fr' ? 'Index UV' : 'مؤشر الأشعة فوق البنفسجية'} : </span>
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