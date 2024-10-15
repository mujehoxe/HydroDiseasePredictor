import React from 'react';
import './css/bootstrap.min.css';
import './css/style.css';
import logo from './imgtest/logo-tc-advisor 1.png';

function SignUp() {
  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <div className="container-fluid">
        <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <img src={logo} alt="Logo" style={{ height: '60px' }} />
                <h3>Sign Up</h3>
              </div>

              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="name" placeholder="Nom & Prénom" />
                <label htmlFor="name">Nom & Prénom</label>
              </div>
              
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="email" placeholder="Adresse mail" />
                <label htmlFor="email">Adresse mail</label>
              </div>
              
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="phone" placeholder="Numéro de téléphone" />
                <label htmlFor="phone">Numéro de téléphone</label>
              </div>
              
              <div className="form-floating mb-4">
                <input type="password" className="form-control" id="password" placeholder="Mot de passe" />
                <label htmlFor="password">Mot de passe</label>
              </div>
              
              <button type="submit" className="btn btn-primary py-3 w-100 mb-4">Créer un compte</button>
              <p className="text-center mb-0">Vous avez déjà un compte ? <a href="/signin">Se connecter</a></p>
            </div>
            <div className="d-flex justify-content-center">
              <a className="text-black fw-bold text-decoration-underline" style={{ fontSize: '16px', cursor: 'pointer' }}>العربية</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
