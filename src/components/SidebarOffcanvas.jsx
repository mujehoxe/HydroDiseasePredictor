import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from '../imgtest/logo-tc-advisor 2.png';
import plusicone from '../icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png'



function Sidebar() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the user's farms from the API
    const fetchFarms = async () => {
      const token = localStorage.getItem('authToken'); // Retrieve the auth token
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`https://vite-project-9cea.onrender.com/api/v1/users/1/farms`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the auth token here
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFarms(data);
        } else {
          console.error('Failed to fetch farms:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching farms:', error);
      }finally{
        setLoading(false);
      }
    };

    fetchFarms();
  }, [1]);

  const handleFarmClick = (farm) => {
    // Pass the farm's name and address as props to the dashboard
    navigate('/Tableaudebord', { state: { name: farm.name, address: farm.address } });
  };
  
  const handleAjout = () => {
    // Add your authentication logic here
    navigate('/Ajoutferme'); // Redirect to the VosFermes page
  };

  return (
    <>
      {/* Sidebar for large screens */}
      <div className="sidebar pe-4 pb-3 d-flex flex-column">
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
                style={{ textDecoration: 'none', outline: 'none', boxShadow: 'none', border: 'none', padding: '0.5rem' }} 
              >
                {language === 'fr' ? 'Vos fermes' : 'مزارعكم'}
              </Dropdown.Toggle>

                <Dropdown.Menu className="bg-transparent border-0">
                {farms.length > 0 ? (
                  farms.map((farm) => (
                  <Dropdown.Item 
                  key={farm.id} 
                  onClick={() => handleFarmClick(farm)} 
                  className="dropdown-item">{farm.name}</Dropdown.Item>
                ))
              ) : (
                <p>{language === 'fr' ? 'Aucune ferme trouvée.' : 'لم يتم العثور على أي مزرعة.'}</p>
              )}
                  <Dropdown.Item onClick={handleAjout} className="dropdown-item" >
                    <img
                      src={plusicone}
                      alt="Plus icon"
                      className="me-2"
                      style={{ width: '16px', height: '16px' }}
                    />
                    {language === 'fr' ? 'Ajouter une ferme' : 'أضف مزرعة'}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              
            </div>
        </nav>
        <div className="d-flex justify-content-center mt-auto mb-3">
      <a onClick={toggleLanguage} className="text-black fw-bold text-decoration-underline" style={{ fontSize: '16px', cursor: 'pointer' }}>{language === 'fr' ? 'العربية' : 'Français'}</a>
    </div>
      </div>
    </>
  );
}

export default Sidebar;
