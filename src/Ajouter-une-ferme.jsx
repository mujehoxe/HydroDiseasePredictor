import React from 'react';
import './css/bootstrap.min.css';
import './css/style.css';

function Ajoutferme() {
  return (
    <div className="container-fluid">
      <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="col-sm-12 col-xl-6">
          <div className="bg-light rounded h-100 p-4">
            <h6 className="mb-4">Ajouter Une ferme</h6>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmName" placeholder="Nom de la ferme" />
              <label htmlFor="farmName">Nom</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmAddress" placeholder="Adresse de la ferme" />
              <label htmlFor="farmAddress">Adresse de la ferme</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmInfo1" placeholder="Informations sur la ferme" />
              <label htmlFor="farmInfo1">Information sur la ferme</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmInfo2" placeholder="Informations supplémentaires" />
              <label htmlFor="farmInfo2">Information supplémentaire sur la ferme</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmInfo3" placeholder="Autres informations" />
              <label htmlFor="farmInfo3">Autres informations sur la ferme</label>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary">Ajouter la ferme</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ajoutferme;
