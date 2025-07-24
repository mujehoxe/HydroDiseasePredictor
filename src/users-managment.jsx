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
      const response = await fetch(`${API_CONFIG.BASE_URL}/users`, {
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
        const errorData = await response.json();
        setError(errorData.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setError("An error occurred while adding the user");
    }
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowAddModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={addUser}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserGroupIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {language === "fr" ? "Ajouter un utilisateur" : "إضافة مستخدم"}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {language === "fr" ? "Nom" : "الاسم"}
                          </label>
                          <input
                            type="text"
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {language === "fr" ? "Email" : "البريد الإلكتروني"}
                          </label>
                          <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {language === "fr" ? "Mot de passe" : "كلمة المرور"}
                          </label>
                          <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {language === "fr" ? "Rôle" : "الدور"}
                          </label>
                          <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="farmer">{language === "fr" ? "Fermier" : "مزارع"}</option>
                            <option value="admin">{language === "fr" ? "Administrateur" : "مدير"}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {language === "fr" ? "Ajouter" : "إضافة"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    {language === "fr" ? "Annuler" : "إلغاء"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default UsersManagement;
