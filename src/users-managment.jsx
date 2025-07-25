import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, getAuthToken } from "./utils/auth";
import Layout from "./components/Layout";
import API_CONFIG from "./config/api";
import { useLanguage } from "./LanguageContext";
import {
  UserGroupIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

function UsersManagement() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer"
  });

  const token = getAuthToken();
  const user = getUser();

  useEffect(() => {
    if (!user || !user.id || !token || user.role !== "admin") {
      navigate("/signin");
    }
  }, [navigate, user, token]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = Array.isArray(users) ? users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch users");
        setError("Failed to fetch users");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("An error occurred while fetching users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm(language === "fr" ? "Êtes-vous sûr de vouloir supprimer cet utilisateur ?" : "هل أنت متأكد من حذف هذا المستخدم؟")) {
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess(language === "fr" ? "Utilisateur supprimé avec succès" : "تم حذف المستخدم بنجاح");
        fetchUsers();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("An error occurred while deleting the user");
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError(language === "fr" ? "Tous les champs sont obligatoires" : "جميع الحقول مطلوبة");
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setSuccess(language === "fr" ? "Utilisateur ajouté avec succès" : "تم إضافة المستخدم بنجاح");
        setShowAddModal(false);
        setNewUser({ name: "", email: "", password: "", role: "farmer" });
        fetchUsers();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        // Handle error response
        let errorMessage = "Failed to add user";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, use status text
          if (response.status === 404) {
            errorMessage = language === "fr" 
              ? "Erreur: Le serveur backend n'est pas disponible. Veuillez démarrer le serveur backend sur le port 8080."
              : "Error: Backend server is not available. Please start the backend server on port 8080.";
          } else {
            errorMessage = response.statusText || errorMessage;
          }
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      let errorMessage = "An error occurred while adding the user";
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = language === "fr"
          ? "Erreur de connexion: Le serveur backend n'est pas accessible. Veuillez vérifier que le serveur backend fonctionne sur le port 8080."
          : "Connection error: Backend server is not accessible. Please ensure the backend server is running on port 8080.";
      }
      setError(errorMessage);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setNewUser({ name: "", email: "", password: "", role: "farmer" });
    setError(null);
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <Layout
      title={language === "fr" ? "Gestion des utilisateurs" : "إدارة المستخدمين"}
    >
      {/* Content area */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Add Button and Search */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "fr" ? "Utilisateurs" : "المستخدمون"}
                  </h2>
                  <p className="text-gray-600">
                    {language === "fr" 
                      ? "Gérez les comptes utilisateurs du système" 
                      : "إدارة حسابات المستخدمين في النظام"
                    }
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {language === "fr" ? "Ajouter un utilisateur" : "إضافة مستخدم"}
            </button>
          </div>

          {/* Success and Error Messages */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={language === "fr" ? "Rechercher des utilisateurs..." : "البحث عن المستخدمين..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {language === "fr" ? "Liste des utilisateurs" : "قائمة المستخدمين"}
              </h3>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500">
                  {language === "fr" ? "Chargement..." : "جاري التحميل..."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    {searchTerm ? (
                      language === "fr" ? "Aucun utilisateur trouvé" : "لم يتم العثور على مستخدمين"
                    ) : (
                      language === "fr" ? "Aucun utilisateur disponible" : "لا توجد مستخدمون متاحون"
                    )}
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === "fr" ? "Nom" : "الاسم"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === "fr" ? "Email" : "البريد الإلكتروني"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === "fr" ? "Rôle" : "الدور"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === "fr" ? "Actions" : "الإجراءات"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((userItem) => (
                        <tr key={userItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {userItem.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {userItem.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userItem.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {userItem.role === 'admin' 
                                ? (language === "fr" ? "Administrateur" : "مدير")
                                : (language === "fr" ? "Fermier" : "مزارع")
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => deleteUser(userItem.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                title={language === "fr" ? "Supprimer" : "حذف"}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal - FIXED VERSION */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-blue-500 bg-opacity-10"
          onClick={(e) => {
            // Close modal only if clicking the backdrop
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div 
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={addUser} className="p-6">
              {/* Header */}
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {language === "fr" ? "Ajouter un utilisateur" : "إضافة مستخدم"}
                  </h3>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "fr" ? "Nom" : "الاسم"}
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "fr" ? "Email" : "البريد الإلكتروني"}
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "fr" ? "Mot de passe" : "كلمة المرور"}
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "fr" ? "Rôle" : "الدور"}
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="farmer">{language === "fr" ? "Fermier" : "مزارع"}</option>
                    <option value="admin">{language === "fr" ? "Administrateur" : "مدير"}</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {language === "fr" ? "Annuler" : "إلغاء"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {language === "fr" ? "Ajouter" : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default UsersManagement;