import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/style.css';
import logo from './imgtest/logo-tc-advisor 1.png';
import { useLanguage } from './LanguageContext';

function SignIn() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  // State for email, password, and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // Clear any previous error
    try {
      const response = await fetch('https://vite-project-9cea.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        // Save the token in localStorage
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user)); // Save user details

        // Redirect to the VosFermes page
        navigate('/vosfermes');
      } else {
        const errorData = await response.json();
        setError(errorData.message || (language === 'fr' ? 'Erreur de connexion' : 'خطأ في تسجيل الدخول'));
      }
    } catch (err) {
      setError(language === 'fr' ? 'Une erreur s’est produite' : 'حدث خطأ');
      console.error('Login error:', err);
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
                <h3>{language === 'fr' ? 'Connexion' : 'تسجيل الدخول'}</h3>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder={language === 'fr' ? 'Adresse mail' : 'البريد الإلكتروني'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">{language === 'fr' ? 'Adresse mail' : 'البريد الإلكتروني'}</label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder={language === 'fr' ? 'Mot de passe' : 'كلمة السر'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">{language === 'fr' ? 'Mot de passe' : 'كلمة السر'}</label>
              </div>

              <button onClick={handleLogin} className="btn btn-primary py-3 w-100 mb-4">
                {language === 'fr' ? 'Se connecter' : 'تسجيل الدخول'}
              </button>
              <p className="text-center mb-0">
                {language === 'fr' ? "Vous n'avez pas de compte ?" : ' ليس لديك حساب؟'}{' '}
                <a href="/signup">{language === 'fr' ? " S'inscrire" : 'إنشاء حساب '}</a>
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

export default SignIn;
