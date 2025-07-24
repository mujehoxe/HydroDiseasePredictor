import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { getAuthToken } from "../utils/auth";
import API_CONFIG from "../config/api";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

function FarmsList({ userId }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFarmClick = (farm) => {
    navigate("/Tableaudebord", {
      state: { name: farm.name, address: farm.address, farmId: farm.id },
    });
  };

  useEffect(() => {
    const token = getAuthToken();

    if (!token || !userId) {
      navigate('/signin');
      return;
    }

    // Fetch the user's farms from the API
    const fetchFarms = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/users/${userId}/farms`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFarms(data);
        } else {
          const errorData = await response.json();
          setError(
            errorData.message ||
              (language === "fr"
                ? "Échec de la récupération des fermes."
                : "فشل في استرداد المزارع.")
          );
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
        setError(language === "fr" ? "Une erreur s'est produite." : "حدث خطأ.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [navigate, language, userId]);

  const handleDelete = async (farmId) => {
    const confirmDelete = window.confirm(
      language === "fr"
        ? "Êtes-vous sûr de vouloir supprimer cette ferme ?\nCette action est irréversible."
        : "هل أنت متأكد أنك تريد حذف هذه المزرعة؟\nهذا الإجراء لا رجوع فيه."
    );

    if (!confirmDelete) return;

    const token = getAuthToken();
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/farms/${farmId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setFarms((prevFarms) => prevFarms.filter((farm) => farm.id !== farmId));
      } else {
        console.error("Failed to delete farm:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  const handleEdit = (farm) => {
    navigate("/Ajoutferme", { state: { farm, isEdit: true, userId: userId } });
  };

  const handleAjout = () => {
    navigate("/Ajoutferme", { state: { isEdit: false, userId: userId } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">
          {language === "fr" ? "Chargement..." : "جار التحميل..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {language === "fr" ? "Erreur" : "خطأ"}
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Farm Button */}
      <button
        onClick={handleAjout}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200 group"
      >
        <PlusIcon className="h-5 w-5 mr-2 group-hover:text-primary-600" />
        {language === "fr" ? "Ajouter une nouvelle ferme" : "إضافة مزرعة جديدة"}
      </button>

      {/* Farms List */}
      {farms.length > 0 ? (
        <div className="space-y-3">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* Farm Info */}
              <button
                onClick={() => handleFarmClick(farm)}
                className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {farm.name}
                    </h3>
                    {farm.address && (
                      <div className="flex items-center mt-1">
                        <MapPinIcon className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500 truncate">
                          {farm.address}
                        </p>
                      </div>
                    )}
                    {farm.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {farm.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(farm);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title={language === "fr" ? "Modifier" : "تعديل"}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(farm.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  title={language === "fr" ? "Supprimer" : "حذف"}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {language === "fr" ? "Aucune ferme trouvée" : "لم يتم العثور على أي مزرعة"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {language === "fr"
              ? "Commencez par ajouter votre première ferme."
              : "ابدأ بإضافة مزرعتك الأولى."}
          </p>
        </div>
      )}
    </div>
  );
}

FarmsList.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default FarmsList;
