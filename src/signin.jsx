import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { isAuthenticated } from "./utils/auth";
import API_CONFIG from "./config/api";
import "./css/bootstrap.min.css";
import "./css/style.css";
import logo from "./imgtest/logo-tc-advisor 1.png";
import { useLanguage } from "./LanguageContext";

function SignIn() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  // State for email, password, and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/vosfermes"); // Redirect to dashboard/farms page
    }
  }, [navigate]);

  const handleLogin = async () => {
    setError(""); // Clear any previous error
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Save the token in cookies (expires in 7 days)
        Cookies.set("authToken", data.token, { expires: 7, secure: false, sameSite: 'lax' });
        Cookies.set("user", JSON.stringify(data.user), { expires: 7, secure: false, sameSite: 'lax' });

        // Redirect to the VosFermes page
        navigate("/vosfermes");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            (language === "fr" ? "Erreur de connexion" : "خطأ في تسجيل الدخول")
        );
      }
    } catch (err) {
      setError(language === "fr" ? "Une erreur s'est produite" : "حدث خطأ");
      console.error("Login error:", err);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
      console.log("Enter key pressed");
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
                <h3>{language === "fr" ? "Connexion" : "تسجيل الدخول"}</h3>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder={
                    language === "fr" ? "Adresse mail" : "البريد الإلكتروني"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  onKeyDown={handleKeyDown}
                />
                <label htmlFor="email">
                  {language === "fr" ? "Adresse mail" : "البريد الإلكتروني"}
                </label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder={language === "fr" ? "Mot de passe" : "كلمة السر"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trimStart())}
                  onKeyDown={handleKeyDown}
                />
                <label htmlFor="password">
                  {language === "fr" ? "Mot de passe" : "كلمة السر"}
                </label>
              </div>

              <button
                onClick={handleLogin}
                className="btn btn-primary py-3 w-100 mb-4"
              >
                {language === "fr" ? "Se connecter" : "تسجيل الدخول"}
              </button>
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

export default SignIn;
