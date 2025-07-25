import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import API_CONFIG from "../config/api";
import "../css/bootstrap.min.css";
import "../css/style.css";
import "../css/SuperResponsiveTableStyle.css";
import { useLanguage } from "../LanguageContext";

function AddUserModal({ show, handleClose, userToEdit, fetchUsers }) {
  const isEdit = !!userToEdit;
  const token = sessionStorage.getItem("authToken");
  const { language } = useLanguage();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (isEdit && userToEdit) {
      setUser({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        password: "", // Keep password empty for security reasons
        role: userToEdit.role || "",
      });
    } else {
      setUser({ name: "", email: "", password: "", role: "" });
    }
  }, [userToEdit]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUser((prevData) => ({
      ...prevData,
      [id]: id === "name" ? value.trimStart() : value.trim(),
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // FORM VALIDATION ONLY IF isEdit === false
    if (!isEdit) {
      const { name, email, password, role } = user;

      if (!name || !email || !password || !role) {
        setError(
          language === "fr"
            ? "Tous les champs sont obligatoires."
            : "جميع الحقول مطلوبة."
        );
        return;
      }

      if (!isValidEmail(email)) {
        setError(
          language === "fr"
            ? "Veuillez entrer une adresse e-mail valide."
            : "يرجى إدخال بريد إلكتروني صالح."
        );
        return;
      }
    }

    try {
      setLoading(true);
      const url = isEdit
        ? `${API_CONFIG.BASE_URL}users/${userToEdit.id}`
        : "${API_CONFIG.BASE_URL}auth/register";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        fetchUsers(); // Refresh users after adding/editing
        handleClose(); // Close the modal
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Operation failed");
        return;
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        language === "fr"
          ? "Erreur de connexion au serveur."
          : "خطأ في الاتصال بالخادم."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit
            ? language === "fr"
              ? "Modifier un utilisateur"
              : "تعديل مستخدم"
            : language === "fr"
            ? "Ajouter un utilisateur"
            : "إضافة مستخدم"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>
              {language === "fr" ? "Nom complet" : "الاسم الكامل"}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={
                language === "fr"
                  ? "Entrez le nom complet"
                  : "أدخل الاسم الكامل"
              }
              value={user.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>
              {language === "fr" ? "Adresse email" : "البريد الإلكتروني"}
            </Form.Label>
            <Form.Control
              type="email"
              placeholder={
                language === "fr"
                  ? "Entrez l'adresse email"
                  : "أدخل البريد الإلكتروني"
              }
              value={user.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>
              {language === "fr" ? "Mot de passe" : "كلمة المرور"}
            </Form.Label>
            <Form.Control
              type="password"
              placeholder={
                language === "fr"
                  ? "Entrez le mot de passe"
                  : "أدخل كلمة المرور"
              }
              value={user.password}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>
              {language === "fr" ? "Sélectionner le rôle" : "حدد الدور"}
            </Form.Label>
            <Form.Select
              aria-label="select role"
              onChange={handleInputChange}
              value={user.role}
            >
              <option value="" disabled>
                {language === "fr" ? "Admin/Utilisateur" : "مستخدم/مسؤول"}
              </option>
              <option value="user">
                {language === "fr" ? "Utilisateur" : "مستخدم"}
              </option>
              <option value="admin">
                {language === "fr" ? "Admin" : "مسؤول"}
              </option>
            </Form.Select>
          </Form.Group>
        </Form>
        {error && <p className="text-danger">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {language === "fr" ? "Annuler" : "إلغاء"}
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={loading}>
          {isEdit
            ? language === "fr"
              ? "Modifier"
              : "تعديل"
            : language === "fr"
            ? "Ajouter"
            : "إضافة"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddUserModal;
