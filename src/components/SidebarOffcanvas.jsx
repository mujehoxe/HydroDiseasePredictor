import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from '../imgtest/logo-tc-advisor 2.png';
import plusicone from '../icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png'
import deleteIcon from '../icone/icons8-delete-24.png'; // <a target="_blank" href="https://icons8.com/icon/99933/delete">Delete</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import editIcon from '../icone/icons8-edit-50.png'; // <a target="_blank" href="https://icons8.com/icon/49/edit">Edit</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>

import Button from 'react-bootstrap/Button';


function Sidebar() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const handleFarmClick = (farm) => {
    navigate('/Tableaudebord', { state: { name: farm.name, address: farm.address } });
  };

  const handleAjout = () => {
    navigate('/Ajoutferme');
  };

  return (
    <div className="sidebar pe-4 pb-3 d-flex flex-column bg-light shadow">
    {/* Logo */}
    <div className="text-center py-3 border-bottom">
        <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: '50px' }} />
      </div>

    {/* Navigation Links */}
    <nav className="flex-grow-1">
      <ul className="nav flex-column">
        {/* Vos Fermes Section */}
        <li className="nav-item">
          <span className="nav-link text-primary fw-bold fs-5">
            {language === 'fr' ? 'Vos fermes' : 'مزارعكم'}
          </span>
          <ul className="list-unstyled ps-3 mt-2">
            {farms.length > 0 ? (
              farms.map((farm) => (
                <li key={farm.id} className="d-flex align-items-center mb-2">
                  <span
                    className="text-dark me-auto fw-semibold"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleFarmClick(farm)}
                  >
                    {farm.name}
                  </span>
                  <button
                    className="btn btn-sm btn-link p-0 text-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/Ajoutferme', { state: { farm, isEdit: true } });
                    }}
                  >
                    <img src={editIcon} alt="Edit" className="img-fluid" style={{ width: '16px' }} />
                  </button>
                  <button
                    className="btn btn-sm btn-link p-0 text-danger ms-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      const confirmDelete = window.confirm(
                        language === 'fr'
                          ? 'Êtes-vous sûr de vouloir supprimer cette ferme ?\nCette action est irréversible.'
                          : 'هل أنت متأكد أنك تريد حذف هذه المزرعة؟\nهذا الإجراء لا رجوع فيه.'
                      );
                      if (confirmDelete) {
                        setFarms((prev) => prev.filter((f) => f.id !== farm.id));
                      }
                    }}
                  >
                    <img src={deleteIcon} alt="Delete" className="img-fluid" style={{ width: '16px' }} />
                  </button>
                </li>
              ))
            ) : (
              <li className="text-muted">
                {language === 'fr' ? 'Aucune ferme trouvée.' : 'لم يتم العثور على أي مزرعة.'}
              </li>
            )}
            <li>
              <button
                className="btn btn-sm btn-primary mt-2 w-100 fw-bold"
                onClick={handleAjout}
              >
                <img
                  src={plusicone}
                  alt="Plus icon"
                  className="me-2"
                  style={{ width: '16px', height: '16px' }}
                />
                {language === 'fr' ? 'Ajouter une ferme' : 'أضف مزرعة'}
              </button>
            </li>
          </ul>
        </li>

        {/* User Management Section */}
        <li className="nav-item mt-4">
          <a
            className="nav-link text-primary fw-bold fs-5"
            href="#"
            onClick={() => navigate('/useersmanagment')}
          >
            {language === 'fr' ? 'Gestion des utilisateurs' : 'إدارة المستخدمين'}
          </a>
        </li>
      </ul>
    </nav>

    {/* Language Toggle */}
    <div className="text-center py-3 border-top">
      <button
        className="btn btn-link text-decoration-none text-dark fw-bold"
        onClick={toggleLanguage}
      >
        {language === 'fr' ? 'العربية' : 'Français'}
      </button>
    </div>
  </div>
  );
}

export default Sidebar;
