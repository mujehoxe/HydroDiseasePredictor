import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './css/bootstrap.min.css';
import './css/style.css';
import logo from './imgtest/logo-tc-advisor 1.png';

function SignUp() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();

  // State variables for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const roles = [
    'admin', 'farmer',
  ];

  const [error, setError] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle form submission
  const handleSignUp = async () => {
    try {
      const response = await fetch('https://vite-project-9cea.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
        return;
      }

      // If successful, navigate to the desired page
      navigate('/');
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <div className="container-fluid">
        <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <img src={logo} alt="Logo" style={{ height: '60px' }} />
                <h3>{language === 'fr' ? "S'inscrire" : 'إنشاء حساب'}</h3>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={language === 'fr' ? 'Nom & Prénom' : 'الاسم و اللقب'}
                />
                <label htmlFor="name">{language === 'fr' ? 'Nom & Prénom' : 'الاسم و اللقب'}</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={language === 'fr' ? 'Adresse mail' : 'البريد الإلكتروني'}
                />
                <label htmlFor="email">{language === 'fr' ? 'Adresse mail' : 'البريد الإلكتروني'}</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={language === 'fr' ? 'Mot de passe' : 'كلمة السر'}
                />
                <label htmlFor="password">{language === 'fr' ? 'Mot de passe' : 'كلمة السر'}</label>
              </div>

              <div className="form-floating mb-4">
                <select
                className="form-control"
                id="role"
                value={formData.role}
                onChange={handleInputChange}
                >
                  <option value="">{language === 'fr' ? 'Role du nouvel utilisateur' : 'دور المستخدم الجديد'}</option>
                  {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
                </select>
                <label htmlFor="role">{language === 'fr' ? 'Role' : 'دور'}</label>
              </div>

              <button onClick={handleSignUp} className="btn btn-primary py-3 w-100 mb-4">
                {language === 'fr' ? "S'inscrire" : 'إنشاء حساب'}
              </button>
              <p className="text-center mb-0">
                {language === 'fr' ? 'Vous avez déjà un compte ?' : 'لديك حساب؟'}{' '}
                <a href="/">{language === 'fr' ? 'Se connecter' : 'تسجيل الدخول'}</a>
              </p>
            </div>
            <div className="d-flex justify-content-center">
              <a
                onClick={toggleLanguage}
                className="text-black fw-bold text-decoration-underline"
                style={{ fontSize: '16px', cursor: 'pointer' }}
              >
                {language === 'fr' ? 'العربية' : 'Français'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
