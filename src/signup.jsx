import React from 'react';
import './css/bootstrap.min.css';
import './css/style.css';
import logo from './imgtest/logo-tc-advisor - Copie.png';

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
                <label htmlFor="name">Nom & Prénom</label>
                <input className="form-control" type="text" id="name" placeholder="jhondoe" />
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="email">Adresse mail</label>
                <input className="form-control" type="email" id="email" placeholder="name@example.com" />
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="phone">Numéro de téléphone</label>
                <input className="form-control" type="text" id="phone" placeholder="Phone number" />
              </div>
              <div className="form-floating mb-4">
                <label htmlFor="password">Mot de passe</label>
                <input className="form-control" type="password" id="password" placeholder="Password" />
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
