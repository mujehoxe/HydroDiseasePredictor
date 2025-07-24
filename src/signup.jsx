import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "./config/api";
import { useLanguage } from "./LanguageContext";
import { isAuthenticated } from "./utils/auth";
import "./css/bootstrap.min.css";
import "./css/style.css";
import logo from "./imgtest/logo-tc-advisor 1.png";

function SignUp() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/vosfermes"); // Redirect to dashboard/farms page
    }
  }, [navigate]);

  // State variables for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const roles = ["admin", "farmer"];

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "name" ? value.trimStart() : value.trim(),
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    const { name, email, password, role } = formData;

    if (!name || !email || !password || !role) {
      setError(
        language === "fr"
          ? "Tous les champs sont obligatoires."
          : "جميع المعلومات مطلوبة."
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

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
        return;
      }

      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <div className="container-fluid">
        <div
          className="row h-100 align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <img src={logo} alt="Logo" style={{ height: "60px" }} />
                <h3>{language === "fr" ? "S'inscrire" : "إنشاء حساب"}</h3>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={
                    language === "fr" ? "Nom & Prénom" : "الاسم و اللقب"
                  }
                  required
                />
                <label htmlFor="name">
                  {language === "fr" ? "Nom & Prénom" : "الاسم و اللقب"}
                </label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={
                    language === "fr" ? "Adresse mail" : "البريد الإلكتروني"
                  }
                  required
                />
                <label htmlFor="email">
                  {language === "fr" ? "Adresse mail" : "البريد الإلكتروني"}
                </label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={language === "fr" ? "Mot de passe" : "كلمة السر"}
                  required
                />
                <label htmlFor="password">
                  {language === "fr" ? "Mot de passe" : "كلمة السر"}
                </label>
              </div>
              <div className="form-floating mb-4">
                <select
                  className="form-control"
                  id="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    {language === "fr"
                      ? "Role du nouvel utilisateur"
                      : "دور المستخدم الجديد"}
                  </option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <label htmlFor="role">
                  {language === "fr" ? "Role" : "دور"}
                </label>
              </div>
              <button
                onClick={handleSignUp}
                className="btn btn-primary py-3 w-100 mb-4"
              >
                {language === "fr" ? "S'inscrire" : "إنشاء حساب"}
              </button>
              <p className="text-center mb-0">
                {language === "fr"
                  ? "Vous avez déjà un compte ?"
                  : "لديك حساب؟"}{" "}
                <a href="/">
                  {language === "fr" ? "Se connecter" : "تسجيل الدخول"}
                </a>
              </p>
            </div>
            <div className="d-flex justify-content-center">
              <a
                onClick={toggleLanguage}
                className="text-black fw-bold text-decoration-underline"
                style={{ fontSize: "16px", cursor: "pointer" }}
              >
                {language === "fr" ? "العربية" : "Français"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
