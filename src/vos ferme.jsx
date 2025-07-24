import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { getUser, getAuthToken } from "./utils/auth";
import FarmsList from "./components/FarmsList";
import Sidebar from "./components/SidebarOffcanvas";
import API_CONFIG from "./config/api";
import "./css/bootstrap.min.css";
import "./css/style.css";
import diseaseRiskCalculators from "./js/diseaseRiskCalculator";
import { getRecommendation } from "./js/getRecommendation";
import { getWeather } from "./js/weatherAPI";

function VosFermes() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State to manage the Offcanvas visibility
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  // Retrieve userId and authToken from cookies
  const user = getUser();
  const token = getAuthToken();

  useEffect(() => {
    if (!user || !user.id || !token) {
      navigate("/");
    }
  }, [navigate, user, token]);

  const userId = user?.id;

  const generateFarmSummary = (farmId, weather) => {
    const { temperature, humidity, dissolvedOxygen, isOutside } = weather;
    const uniqueRecommendations = new Set();

    Object.keys(diseaseRiskCalculators).forEach((disease) => {
      const risk = diseaseRiskCalculators[disease](
        temperature,
        humidity,
        dissolvedOxygen,
        isOutside
      );
      const recommendations = getRecommendation(
        disease,
        risk,
        humidity,
        dissolvedOxygen,
        language
      );

      if (recommendations) {
        recommendations.forEach((rec) => uniqueRecommendations.add(rec));
      }
    });

    setSummaries((prevSummaries) => ({
      ...prevSummaries,
      [farmId]: Array.from(uniqueRecommendations),
    }));
  };

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}users/${userId}/farms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setFarms(data);
        data.forEach((farm) => {
          if (farm.address) {
            getWeather(farm.address)
              .then((weather) => {
                console.log(`Weather data for ${farm.name}:`, weather);
                setWeatherData((prevData) => ({
                  ...prevData,
                  [farm.id]: weather,
                }));
                generateFarmSummary(farm.id, weather);
              })
              .catch((error) =>
                console.error(`Error fetching weather for ${farm.name}:`, error)
              );
          }
        });
      })
      .catch((error) => console.error("Error fetching farms:", error));
  }, [user.id, token]);

  const handleUsersManagement = () => {
    navigate("/usersmanagment");
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
              display: "flex",
              color: "black",
              fontSize: "25px",
              height: "64px",
              alignItems: "center",
              paddingLeft: "20px",
            }}
          >
            {language === "fr" ? "Tableau de Bord" : "لوحة مراقبة"}
          </div>
        </nav>
        {/* Navbar End */}
        <div
          className="container-fluid pt-4 px-4 d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div
            className="row g-4 w-100 justify-content-center align-items-stretch"
            style={{ maxWidth: "1200px" }}
          >
            <div className="col-12 col-md-6 d-flex">
              <div className="bg-light rounded p-4 my-4 mx-3 w-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3>{language === "fr" ? "Vos Fermes" : "مزارعك"}</h3>
                </div>
                <FarmsList userId={userId} />
              </div>
            </div>

            <div className="col-12 col-md-6 d-flex">
              <div className="bg-light rounded p-4 my-4 mx-3 w-100">
                <h3>
                  {language === "fr"
                    ? "Résumé des recommendations"
                    : "ملخص التوصيات"}
                </h3>
                <div className="recommendations-content">
                  {farms.map((farm) => (
                    <div key={farm.id}>
                      <h6>
                        {farm.name} ({farm.address}) :
                      </h6>
                      {summaries[farm.id]?.length > 0 ? (
                        <ul style={{ listStyle: "none", padding: 0 }}>
                          {summaries[farm.id].map((rec, index) => (
                            <li key={index} style={{ marginBottom: "8px" }}>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>
                          {language === "fr"
                            ? "Pas de recommandations disponibles pour l'instant."
                            : "لا توجد توصيات متاحة حاليًا."}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Offcanvas
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
            className="custom-offcanvas"
          >
            <Offcanvas.Header
              closeButton
              className="d-flex justify-content-end"
            />
            <Offcanvas.Body>
              <Sidebar />
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>
    </div>
  );
}

export default VosFermes;
