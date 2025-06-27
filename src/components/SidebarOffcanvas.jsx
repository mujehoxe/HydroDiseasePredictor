import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "../config/api";
import logo from "../imgtest/logo-tc-advisor 2.png";
import { useLanguage } from "../LanguageContext";

function Sidebar() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Retrieve userId and authToken from sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("authToken");

  if (!user || !user.id || !token) {
    // Redirect to login if userId or token is missing
    navigate("/");
    return;
  }

  const userId = user.id;

  // Handle clicking "Vos Fermes" (Navigate to /vosfermes)
  const handleVosFermesClick = () => {
    navigate("/vosfermes");
  };

  useEffect(() => {
    // Fetch the user's farms from the API
    const fetchFarms = async () => {
      const token = sessionStorage.getItem("authToken"); // Retrieve the auth token
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/users/${userId}/farms`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Add the auth token here
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFarms(data);
        } else {
          console.error("Failed to fetch farms:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [1]);

  const handleEdit = (farm) => {
    // Navigate to the edit farm page with pre-filled data
    navigate("/Ajoutferme", { state: { isEdit: true, userId: userId } });
  };

  const handleDelete = async (farmId) => {
    const confirmDelete = window.confirm(
      language === "fr"
        ? "Êtes-vous sûr de vouloir supprimer cette ferme ?\nCette action est irréversible."
        : "هل أنت متأكد أنك تريد حذف هذه المزرعة؟\nهذا الإجراء لا رجوع فيه."
    );

    if (!confirmDelete) return;
    const token = sessionStorage.getItem("authToken"); // Retrieve the auth token

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/farms/${farmId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Remove the deleted farm from the state
        setFarms((prevFarms) => prevFarms.filter((farm) => farm.id !== farmId));
      } else {
        console.error("Failed to delete farm:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  const handleFarmClick = (farm) => {
    // Pass the farm's name and address as props to the dashboard
    navigate("/Tableaudebord", {
      state: { name: farm.name, address: farm.address },
    });
  };

  const handleAjout = () => {
    // Add your authentication logic here
    navigate("/Ajoutferme", { state: { isEdit: false, userId: userId } });
  };

  const handleUsersManagement = () => {
    navigate("/usersmanagment");
  };

  return (
    <>
      {/* Sidebar for large screens */}
      <div className="sidebar pe-4 pb-3 d-flex flex-column">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ marginTop: "15px" }}
        >
          <h3>
            <img src={logo} alt="Logo" style={{ height: "55px" }} />
          </h3>
        </div>
        <nav className="navbar bg-light navbar-light">
          <ul className="navbar-nav w-100">
            {user?.role === "admin" && (
              <li
                className="nav-item nav-link "
                onClick={handleUsersManagement}
              >
                {language === "fr"
                  ? "Gestion des utilisateurs"
                  : "إدارة المستخدمين"}
              </li>
            )}

            <li
              className="nav-item nav-link "
              variant="link"
              id="dropdown-basic"
              onClick={handleVosFermesClick}
            >
              {language === "fr" ? "Vos fermes" : "مزارعكم"}
            </li>
          </ul>
        </nav>
        <div className="d-flex justify-content-center mt-auto mb-3">
          <a
            onClick={toggleLanguage}
            className="text-black fw-bold text-decoration-underline"
            style={{ fontSize: "16px", cursor: "pointer" }}
          >
            {language === "fr" ? "العربية" : "Français"}
          </a>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
