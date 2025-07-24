import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "../config/api";
import { getUser, getAuthToken, logout } from "../utils/auth";
import { 
  HomeIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import logo from "../imgtest/logo-tc-advisor 2.png";
import { useLanguage } from "../LanguageContext";

function Sidebar({ onClose }) {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Retrieve userId and authToken from cookies
  const user = getUser();
  const token = getAuthToken();

  if (!user || !user.id || !token) {
    // Redirect to login if userId or token is missing
    navigate("/signin");
    return;
  }

  const userId = user.id;

  // Handle logout
  const handleLogout = () => {
    logout(); // Clear all auth cookies
    navigate("/signin"); // Redirect to login page
  };

  // Handle clicking "Vos Fermes" (Navigate to /vosfermes)
  const handleVosFermesClick = () => {
    navigate("/vosfermes");
  };

  useEffect(() => {
    // Fetch the user's farms from the API
    const fetchFarms = async () => {
      const authToken = getAuthToken(); // Retrieve the auth token from cookies
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/users/${userId}/farms`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`, // Add the auth token here
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
  }, [userId]);

  const handleEdit = (farm) => {
    // Navigate to the edit farm page with pre-filled data
    navigate("/Ajoutferme", { state: { isEdit: true, userId: userId, farm } });
  };

  const handleDelete = async (farmId) => {
    const confirmDelete = window.confirm(
      language === "fr"
        ? "Êtes-vous sûr de vouloir supprimer cette ferme ?\nCette action est irréversible."
        : "هل أنت متأكد أنك تريد حذف هذه المزرعة؟\nهذا الإجراء لا رجوع فيه."
    );

    if (!confirmDelete) return;
    const authToken = getAuthToken(); // Retrieve the auth token from cookies

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/farms/${farmId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
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
      state: { name: farm.name, address: farm.address, farmId: farm.id },
    });
  };

  const handleAjout = () => {
    navigate("/Ajoutferme", { state: { isEdit: false, userId: userId } });
  };

  const handleUsersManagement = () => {
    navigate("/usersmanagment");
  };

  return (
    <div className="flex h-full w-full flex-col bg-white border-r border-gray-200 shadow-lg">
      {/* Logo */}
      <div className="flex h-16 flex-shrink-0 items-center justify-between px-4">
        <img
          className="h-12 w-auto"
          src={logo}
          alt="TecAdvisor Logo"
        />
        {/* Close button for mobile/tablet */}
        {onClose && (
          <button
            onClick={onClose}
            className="xl:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Admin Users Management */}
        {user?.role === "admin" && (
          <button
            onClick={handleUsersManagement}
            className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary-700 hover:bg-primary-50 transition-colors duration-200"
          >
            <UserGroupIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-500" />
            {language === "fr" ? "Gestion des utilisateurs" : "إدارة المستخدمين"}
          </button>
        )}

        {/* Farms */}
        <button
          onClick={handleVosFermesClick}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary-700 hover:bg-primary-50 transition-colors duration-200"
        >
          <BuildingOfficeIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-500" />
          {language === "fr" ? "Vos fermes" : "مزارعكم"}
        </button>

        {/* Add Farm */}
        <button
          onClick={handleAjout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-secondary-700 hover:bg-secondary-50 transition-colors duration-200"
        >
          <PlusIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-secondary-500" />
          {language === "fr" ? "Ajouter une ferme" : "إضافة مزرعة"}
        </button>

        {/* Farms List */}
        {farms.length > 0 && (
          <div className="pt-4">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {language === "fr" ? "Mes fermes" : "مزارعي"}
            </h3>
            <div className="mt-2 space-y-1">
              {farms.slice(0, 5).map((farm) => (
                <div key={farm.id} className="group relative">
                  <button
                    onClick={() => handleFarmClick(farm)}
                    className="group flex w-full items-center justify-between px-2 py-2 text-sm text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors duration-200"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <HomeIcon className="mr-2 h-4 w-4 text-gray-400 group-hover:text-primary-500 flex-shrink-0" />
                      <span className="truncate">{farm.name}</span>
                    </div>
                  </button>
                  
                  {/* Farm Action Buttons */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(farm);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      title={language === "fr" ? "Modifier" : "تعديل"}
                    >
                      <PencilIcon className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(farm.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title={language === "fr" ? "Supprimer" : "حذف"}
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              
              {farms.length > 5 && (
                <button
                  onClick={handleVosFermesClick}
                  className="w-full text-xs text-gray-500 hover:text-primary-600 py-1 transition-colors duration-200"
                >
                  {language === "fr" ? `Voir toutes (${farms.length})` : `عرض الكل (${farms.length})`}
                </button>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="px-2 py-4 text-sm text-gray-500">
            {language === "fr" ? "Chargement..." : "جار التحميل..."}
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary-700 hover:bg-primary-50 transition-colors duration-200"
        >
          <GlobeAltIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-500" />
          {language === "fr" ? "العربية" : "Français"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-red-700 hover:text-red-900 hover:bg-red-50 transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-700" />
          {language === "fr" ? "Se déconnecter" : "تسجيل الخروج"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
