import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Th, Thead, Tr } from "react-super-responsive-table";
import { getUser, getAuthToken } from "./utils/auth";
import AddUserModal from "./components/AddUserModal";
import Sidebar from "./components/SidebarOffcanvas";
import UserRow from "./components/UserRow";
import API_CONFIG from "./config/api";
import "./css/bootstrap.min.css";
import "./css/style.css";
import "./css/SuperResponsiveTableStyle.css";
import { useLanguage } from "./LanguageContext";

function UsersManagement() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const token = getAuthToken();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve userId and authToken from cookies
  const user = getUser();

  if (!user || !user.id || !token || !user.role) {
    // Redirect to login if userId or token is missing
    navigate("/");
    return;
  } else if (user.role !== "admin") {
    navigate("/");
  }

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      language === "fr"
        ? "Êtes-vous sûr de vouloir supprimer cet utilisateur ?\nCette action est irréversible."
        : "هل أنت متأكد أنك تريد حذف هذا المستخدم؟\nهذا الإجراء لا رجوع فيه."
    );

    if (!confirmDelete) return;
    try {
      // Update UI optimistically
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      const response = await fetch(`${API_CONFIG.BASE_URL}users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If deletion fails, revert the UI change
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete user");
        // Refetch users to restore state
        fetchUsers();
      }
    } catch (error) {
      setError("Error deleting user");
      // Refetch users to restore state
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
        setError(null); // Clear any existing errors
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch users");
      }
    } catch (error) {
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowAddUserModal(true);
  };

  const handleUserAddedOrUpdated = () => {
    fetchUsers();
    setShowAddUserModal(false);
    setUserToEdit(null);
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate, language]);

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      <div className="content">
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
            {language === "fr"
              ? "Gestion des utilisateurs"
              : "إدارة المستخدمين"}
          </div>
        </nav>

        <div
          className="container-fluid pt-4 px-4 d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div
            className="row g-4 w-100 justify-content-center align-items-stretch"
            style={{ maxWidth: "1200px" }}
          >
            <div className="col-12">
              <div className="bg-light rounded h-100 p-4">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <Button
                    variant="primary"
                    onClick={() => setShowAddUserModal(true)}
                  >
                    {language === "fr"
                      ? "Ajouter un nouvel utilisateur"
                      : "إضافة مستخدم جديد"}
                  </Button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>
                          {language === "fr" ? "Nom complet" : "الاسم الكامل"}
                        </Th>
                        <Th>
                          {language === "fr"
                            ? "Adresse email"
                            : "البريد الإلكتروني"}
                        </Th>
                        <Th>{language === "fr" ? "Fermes" : "المزارع"}</Th>
                        <Th>{language === "fr" ? "Rôle" : "الدور"}</Th>
                        <Th>{language === "fr" ? "Actions" : "الإجراءات"}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user) => (
                        <UserRow
                          key={user.id}
                          user={user}
                          id={user.id}
                          name={user.name}
                          email={user.email}
                          farms={user.farms}
                          password={user.password}
                          role={user.role}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                        />
                      ))}
                    </Tbody>
                  </Table>
                )}
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
      {showAddUserModal && (
        <AddUserModal
          show={showAddUserModal}
          handleClose={() => {
            setShowAddUserModal(false);
            fetchUsers(); // Refresh the list after closing
          }}
          onUserAddedOrUpdated={handleUserAddedOrUpdated}
          fetchUsers={fetchUsers}
        />
      )}
    </div>
  );
}

export default UsersManagement;
